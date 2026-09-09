import { z } from 'zod';

/**
 * Public environment variables, validated at startup with Zod.
 *
 * Infrastructure values (submissions API URL, table name) are deliberately
 * absent: they arrive at runtime through SST `Resource` bindings, never
 * through environment variables or hardcoded values.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
});

export const env = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
