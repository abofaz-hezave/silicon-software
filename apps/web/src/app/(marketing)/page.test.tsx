import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomePage, { metadata } from './page';

describe('HomePage', () => {
  const html = renderToStaticMarkup(<HomePage />);

  it('renders exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('orders the labelled sections as services, evidence, process, founder, qualification, faq', () => {
    const sectionIds = [...html.matchAll(/<section aria-labelledby="([^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(sectionIds).toEqual([
      'services-heading',
      'technical-evidence-heading',
      'delivery-process-heading',
      'founder-heading',
      'qualification-heading',
      'faq-heading',
    ]);
    expect(html).not.toContain('product-heading');
  });

  it('links to qualification and the product preview', () => {
    expect(html).toContain('href="/qualification"');
    expect(html).toContain('href="/intelligent-briefing"');
  });

  it('states that the preview uses fixed sample content', () => {
    expect(html).toContain(
      'Fixed sample content only. The product preview accepts no visitor client data.',
    );
  });

  it('exposes Organization structured data as JSON-LD', () => {
    const script = /<script type="application\/ld\+json">([^<]*)<\/script>/.exec(html)?.[1] ?? '';
    const data: unknown = JSON.parse(script);

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Silicon Software',
      url: 'http://localhost:3000',
    });
  });

  it('declares canonical metadata for the homepage', () => {
    expect(metadata.alternates?.canonical).toBe('/');
    expect(metadata.title).toEqual(expect.any(String));
    expect(metadata.description).toEqual(expect.any(String));
  });
});
