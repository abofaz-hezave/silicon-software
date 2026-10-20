import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDataClient } from '@repo/data';
import type { DataClient } from '@repo/data';
import { z } from 'zod';

import { createHandler } from './submissions';

const TABLE_NAME = 'test-submissions';

const createdBodySchema = z.object({
  id: z.uuid(),
  status: z.literal('new'),
  createdAt: z.iso.datetime(),
});

const validationErrorBodySchema = z.object({
  message: z.string(),
  errors: z.array(z.object({ field: z.string(), message: z.string() })),
});

const validInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines Ltd',
  budget: '$10k – $25k',
  message: 'Secret project message about the difference engine.',
};

function apiEvent(body: string | undefined, options: { isBase64Encoded?: boolean } = {}) {
  return {
    version: '2.0',
    routeKey: 'POST /submissions',
    requestContext: { requestId: 'req-123' },
    body,
    isBase64Encoded: options.isBase64Encoded ?? false,
  };
}

function createTestDataClient(): DataClient {
  return createDataClient({ tableName: TABLE_NAME, region: 'us-east-1' });
}

function setup() {
  const data = createTestDataClient();
  const send = vi.spyOn(data.client, 'send').mockResolvedValue(undefined);
  const handler = createHandler({ dataClient: () => data });
  return { handler, send };
}

function captureConsole(): string[] {
  const lines: string[] = [];
  const capture = (...args: unknown[]) => {
    lines.push(args.map(String).join(' '));
  };
  vi.spyOn(console, 'info').mockImplementation(capture);
  vi.spyOn(console, 'warn').mockImplementation(capture);
  vi.spyOn(console, 'error').mockImplementation(capture);
  vi.spyOn(console, 'log').mockImplementation(capture);
  return lines;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('submissions handler', () => {
  it('persists a valid submission and returns 201 with the stored id only', async () => {
    captureConsole();
    const { handler, send } = setup();

    const response = await handler(apiEvent(JSON.stringify(validInput)));

    expect(response.statusCode).toBe(201);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]?.[0]).toMatchObject({ input: { TableName: TABLE_NAME } });
    const body = createdBodySchema.parse(JSON.parse(response.body));
    expect(body.status).toBe('new');
    expect(response.body).not.toContain(validInput.email);
  });

  it('returns 201 only after the write resolves', async () => {
    captureConsole();
    const data = createTestDataClient();
    let completeWrite = (): void => undefined;
    const write = new Promise<void>((resolve) => {
      completeWrite = () => {
        resolve();
      };
    });
    const send = vi.spyOn(data.client, 'send').mockImplementation(() => write as never);
    const handler = createHandler({ dataClient: () => data });

    const pending = handler(apiEvent(JSON.stringify(validInput)));
    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(1);
    });
    let settled = false;
    void pending.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    completeWrite();
    expect((await pending).statusCode).toBe(201);
  });

  it('returns a non-sensitive 500 and no 201 when the write fails', async () => {
    captureConsole();
    const { handler, send } = setup();
    send.mockRejectedValueOnce(new Error('ProvisionedThroughputExceeded for Ada Lovelace'));

    const response = await handler(apiEvent(JSON.stringify(validInput)));

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal error' });
    expect(response.body).not.toContain('Ada');
  });

  it('rejects a missing body with 400 without touching storage', async () => {
    captureConsole();
    const { handler, send } = setup();

    const response = await handler(apiEvent(undefined));

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Request body is required.' });
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects an oversized body with 413 without touching storage', async () => {
    captureConsole();
    const { handler, send } = setup();
    const oversized = JSON.stringify({ ...validInput, message: 'x'.repeat(17 * 1024) });

    const response = await handler(apiEvent(oversized));

    expect(response.statusCode).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it('enforces the size cap on base64-encoded bodies after decoding', async () => {
    captureConsole();
    const { handler, send } = setup();
    const oversized = Buffer.from(
      JSON.stringify({ ...validInput, message: 'x'.repeat(17 * 1024) }),
    ).toString('base64');

    const response = await handler(apiEvent(oversized, { isBase64Encoded: true }));

    expect(response.statusCode).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it('accepts a base64-encoded valid body', async () => {
    captureConsole();
    const { handler, send } = setup();
    const encoded = Buffer.from(JSON.stringify(validInput)).toString('base64');

    const response = await handler(apiEvent(encoded, { isBase64Encoded: true }));

    expect(response.statusCode).toBe(201);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed JSON with 400 without echoing the input', async () => {
    captureConsole();
    const { handler, send } = setup();

    const response = await handler(apiEvent('{"name": "Ada Lovelace", broken'));

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Request body must be valid JSON.' });
    expect(response.body).not.toContain('Ada');
    expect(send).not.toHaveBeenCalled();
  });

  it('returns a controlled 400 for Zod failures without echoing input values', async () => {
    captureConsole();
    const { handler, send } = setup();
    const invalid = { ...validInput, email: 'not-an-email-Ada', message: 'short' };

    const response = await handler(apiEvent(JSON.stringify(invalid)));

    expect(response.statusCode).toBe(400);
    const body = validationErrorBodySchema.parse(JSON.parse(response.body));
    expect(body.message).toBe('Invalid submission.');
    expect(body.errors).toContainEqual({ field: 'email', message: 'Enter a valid email address.' });
    expect(body.errors.map((error) => error.field)).toContain('message');
    expect(response.body).not.toContain('not-an-email-Ada');
    expect(response.body).not.toContain('short');
    expect(send).not.toHaveBeenCalled();
  });

  it('never logs submission data or error messages', async () => {
    const lines = captureConsole();
    const { handler, send } = setup();
    const leakingMessage = 'Ada Lovelace ada@example.com Analytical Engines Ltd';

    await handler(apiEvent(JSON.stringify(validInput)));
    await handler(apiEvent('{"name":"Ada Lovelace", broken'));
    await handler(apiEvent(JSON.stringify({ ...validInput, email: 'bad-ada@example.com' })));
    send.mockRejectedValueOnce(new Error(leakingMessage));
    await handler(apiEvent(JSON.stringify(validInput)));

    const logs = lines.join('\n');
    expect(logs).toContain('req-123');
    expect(logs).toContain('"outcome":"created"');
    expect(logs).toContain('"outcome":"error"');
    for (const sensitive of [
      'Ada Lovelace',
      'ada@example.com',
      'bad-ada@example.com',
      'Analytical Engines Ltd',
      'difference engine',
    ]) {
      expect(logs).not.toContain(sensitive);
    }
  });
});
