import type { MetadataRoute } from 'next';

import { env } from '@/lib/env';
import { isProductionSite } from '@/lib/server-env';

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', env.NEXT_PUBLIC_SITE_URL).toString(),
  };
}
