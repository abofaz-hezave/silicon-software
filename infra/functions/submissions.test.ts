import { afterEach, describe, expect, it, vi } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createDynamoInquiryStore, createInquiryIntake } from '@repo/data';
import type { RateLimiter } from '@repo/data';
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
  projectType: 'Scoped build',
  budget: '€5,000 – €15,000',
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

const allowAll: RateLimiter = { check: () => Promise.resolve({ allowed: true, resetAt: 0 }) };

function createTestIntake(rateLimiter: RateLimiter = allowAll) {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
  const send = vi.spyOn(client, 'send').mockResolvedValue(undefined);
  const store = createDynamoInquiryStore({ tableName: TABLE_NAME, region: 'us-east-1', client });
  return { intake: createInquiryIntake({ store, rateLimiter }), send };
}

function setup(rateLimiter?: RateLimiter) {
  const { intake, send } = createTestIntake(rateLimiter);
  const handler = createHandler({ intake: () => intake });
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
    let completeWrite = (): void => undefined;
    const write = new Promise<void>((resolve) => {
      completeWrite = () => {
        resolve();
      };
    });
    const { handler, send } = setup();
    send.mockImplementation(() => write as never);

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

  it('returns 429 without touching storage when the rate limiter denies', async () => {
    captureConsole();
    const denyAll: RateLimiter = { check: () => Promise.resolve({ allowed: false, resetAt: 1 }) };
    const { handler, send } = setup(denyAll);

    const response = await handler(apiEvent(JSON.stringify(validInput)));

    expect(response.statusCode).toBe(429);
    expect(JSON.parse(response.body)).toEqual({ message: 'Too many requests.' });
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
