import { createDynamoInquiryStore, createInquiryIntake } from '@repo/data';
import type { InquiryIntake, RateLimiter } from '@repo/data';
import { z } from 'zod';

const MAX_BODY_BYTES = 16 * 1024;

const apiGatewayEventSchema = z.object({
  body: z.string().nullish(),
  isBase64Encoded: z.boolean().optional(),
  requestContext: z.object({
    requestId: z.string(),
    http: z.object({ sourceIp: z.string() }).optional(),
  }),
});

const runtimeEnvSchema = z.object({
  SUBMISSIONS_TABLE_NAME: z.string().min(1),
});

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface SubmissionsHandlerOptions {
  intake?: () => InquiryIntake;
}

const allowAll: RateLimiter = { check: () => Promise.resolve({ allowed: true, resetAt: 0 }) };

export function createHandler(options: SubmissionsHandlerOptions = {}) {
  let intake: InquiryIntake | undefined;

  function getIntake(): InquiryIntake {
    intake ??= options.intake?.() ?? createRuntimeIntake();
    return intake;
  }

  return async function handler(event: unknown): Promise<HttpResponse> {
    const parsedEvent = apiGatewayEventSchema.safeParse(event);
    if (!parsedEvent.success) {
      log('warn', 'unknown', 'invalid_event');
      return json(400, { message: 'Invalid request.' });
    }

    const requestId = parsedEvent.data.requestContext.requestId;
    try {
      return await handleSubmission(parsedEvent.data, requestId, getIntake);
    } catch (error) {
      log('error', requestId, 'error', error instanceof Error ? error.name : 'UnknownError');
      return json(500, { message: 'Internal error' });
    }
  };
}

async function handleSubmission(
  event: z.infer<typeof apiGatewayEventSchema>,
  requestId: string,
  getIntake: () => InquiryIntake,
): Promise<HttpResponse> {
  if (!event.body) {
    log('info', requestId, 'missing_body');
    return json(400, { message: 'Request body is required.' });
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64')
    : Buffer.from(event.body, 'utf8');
  if (rawBody.byteLength > MAX_BODY_BYTES) {
    log('info', requestId, 'body_too_large');
    return json(413, { message: 'Request body is too large.' });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    log('info', requestId, 'invalid_json');
    return json(400, { message: 'Request body must be valid JSON.' });
  }

  const result = await getIntake().submit(payload, {
    clientId: event.requestContext.http?.sourceIp ?? 'unknown',
  });
  if (result.ok) {
    log('info', requestId, 'created');
    return json(201, {
      id: result.inquiry.id,
      status: result.inquiry.status,
      createdAt: result.inquiry.createdAt,
    });
  }
  if (result.reason === 'invalid') {
    log('info', requestId, 'validation_failed');
    return json(400, {
      message: 'Invalid submission.',
      errors: result.issues.map((issue) => ({ field: issue.path, message: issue.message })),
    });
  }
  log('info', requestId, 'rate_limited');
  return json(429, { message: 'Too many requests.' });
}

function createRuntimeIntake(): InquiryIntake {
  const env = runtimeEnvSchema.parse(process.env);
  return createInquiryIntake({
    store: createDynamoInquiryStore({ tableName: env.SUBMISSIONS_TABLE_NAME }),
    rateLimiter: allowAll,
  });
}

function json(statusCode: number, body: unknown): HttpResponse {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function log(
  level: 'info' | 'warn' | 'error',
  requestId: string,
  outcome: string,
  errorName?: string,
): void {
  const record = { level, requestId, outcome, ...(errorName ? { errorName } : {}) };
  console[level](JSON.stringify(record));
}

export const handler = createHandler();

export default handler;
