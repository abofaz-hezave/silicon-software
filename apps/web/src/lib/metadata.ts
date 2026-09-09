import type { Metadata } from 'next';

import { siteConfig } from '@/content/site';
import { env } from './env';

interface CreateMetadataInput {
  title: string;
  description: string;
  /** Absolute path of the page, e.g. "/services". */
  path: string;
}

export function createMetadata({ title, description, path }: CreateMetadataInput): Metadata {
  const url = new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
    },
  };
}
