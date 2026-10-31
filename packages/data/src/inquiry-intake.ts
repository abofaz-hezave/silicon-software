import { randomUUID } from 'node:crypto';

import { qualifiedInquiryInputSchema } from './qualified-inquiry';
import type { QualifiedInquiry } from './qualified-inquiry';

export interface InquiryStore {
  save(inquiry: QualifiedInquiry): Promise<void>;
  /** Newest first by `createdAt` across all stored inquiries, truncated to `limit`. */
  list(limit: number): Promise<QualifiedInquiry[]>;
}

export interface RateLimiter {
  check(clientId: string): Promise<{ allowed: boolean; resetAt: number }>;
}

export type SubmitResult =
  | { ok: true; inquiry: QualifiedInquiry }
  | { ok: false; reason: 'invalid'; issues: { path: string; message: string }[] }
  | { ok: false; reason: 'rate_limited'; resetAt: number };

export interface InquiryIntakeConfig {
  store: InquiryStore;
  rateLimiter: RateLimiter;
  now?: () => Date;
  newId?: () => string;
}

export interface InquiryIntake {
  submit(raw: unknown, ctx: { clientId: string }): Promise<SubmitResult>;
  list(limit?: number): Promise<QualifiedInquiry[]>;
}

export function createInquiryIntake(config: InquiryIntakeConfig): InquiryIntake {
  const now = config.now ?? (() => new Date());
  const newId = config.newId ?? randomUUID;
  const { store } = config;

  return {
    async submit(raw, ctx) {
      const limit = await config.rateLimiter.check(ctx.clientId);
      if (!limit.allowed) {
        return { ok: false, reason: 'rate_limited', resetAt: limit.resetAt };
      }
      const result = qualifiedInquiryInputSchema.safeParse(raw);
      if (!result.success) {
        return {
          ok: false,
          reason: 'invalid',
          issues: result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        };
      }
      const inquiry: QualifiedInquiry = {
        ...result.data,
        id: newId(),
        status: 'new',
        createdAt: now().toISOString(),
      };
      await store.save(inquiry);
      return { ok: true, inquiry };
    },
    async list(limit = 100) {
      return store.list(limit);
    },
  };
}
