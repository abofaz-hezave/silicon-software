import { describe, expect, it } from 'vitest';

import { createPageMetadata } from './metadata';

describe('createPageMetadata', () => {
  it('sets the title, description, and relative canonical path', () => {
    const metadata = createPageMetadata({
      title: 'Services',
      description: 'Starting prices for Intelligent Briefing customization.',
      path: '/services',
    });

    expect(metadata.title).toBe('Services');
    expect(metadata.description).toBe('Starting prices for Intelligent Briefing customization.');
    expect(metadata.alternates?.canonical).toBe('/services');
  });

  it('repeats the page path and copy in Open Graph and Twitter metadata', () => {
    const metadata = createPageMetadata({
      title: 'Services',
      description: 'Starting prices for Intelligent Briefing customization.',
      path: '/services',
    });

    expect(metadata.openGraph).toMatchObject({
      title: 'Services',
      description: 'Starting prices for Intelligent Briefing customization.',
      url: '/services',
      siteName: 'Silicon Software',
      type: 'website',
      images: ['/opengraph-image'],
    });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Services',
      description: 'Starting prices for Intelligent Briefing customization.',
      images: ['/opengraph-image'],
    });
  });
});
