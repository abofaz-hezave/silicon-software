import { describe, expect, it } from 'vitest';

import { createRateLimiter } from './index';

describe('createRateLimiter', () => {
  it('allows the first request with the full quota remaining', async () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 1000 });

    const result = await limiter.check('x');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
    expect(result.resetAt).toBeGreaterThan(Date.now() - 1);
  });
});
