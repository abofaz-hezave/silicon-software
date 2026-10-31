import type { MetadataRoute } from 'next';

import { env } from '@/lib/env';
import { siteRoutes } from '@/lib/site-routes';

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes.map((route) => ({
    url: new URL(route, env.NEXT_PUBLIC_SITE_URL).toString(),
  }));
}
