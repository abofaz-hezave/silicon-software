import 'server-only';

import { z } from 'zod';

const submissionsApiUrlSchema = z.url();

export function getSubmissionsApiUrl(): string | undefined {
  const parsed = submissionsApiUrlSchema.safeParse(process.env.SUBMISSIONS_API_URL);

  return parsed.success ? parsed.data : undefined;
}

export function isProductionSite(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.SITE_STAGE === 'production';
}
