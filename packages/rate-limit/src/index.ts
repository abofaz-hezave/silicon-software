/**
 * Rate limiting utility for abuse protection.
 *
 * This will be backed by DynamoDB (for serverless deployments)
 * or ElastiCache/Redis (for container-based deployments).
 *
 * Current implementation is a placeholder that always allows requests.
 * Replace with actual store-backed implementation before production use.
 */

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of remaining requests in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the rate limit window resets */
  resetAt: number;
}

/**
 * Check whether a request from the given identifier should be rate-limited.
 *
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID, API key)
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Duration of the rate limit window in milliseconds
 * @returns Rate limit result indicating if the request is allowed
 *
 * @example
 * ```ts
 * import { checkRateLimit } from '@repo/rate-limit';
 *
 * const result = await checkRateLimit(request.ip, 100, 60_000);
 * if (!result.allowed) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 * ```
 */
export async function checkRateLimit(
  _identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  // TODO: Replace with DynamoDB or ElastiCache-backed implementation.
  // This placeholder always allows requests.
  return {
    allowed: true,
    remaining: limit,
    resetAt: Date.now() + windowMs,
  };
}
