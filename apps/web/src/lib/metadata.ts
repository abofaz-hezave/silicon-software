import type { Metadata } from 'next';

const OG_IMAGE_PATH = '/opengraph-image';

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
}

export function createPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Silicon Software',
      type: 'website',
      images: [OG_IMAGE_PATH],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
