import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import AboutPage, { metadata } from './page';

describe('AboutPage', () => {
  const html = renderToStaticMarkup(<AboutPage />);

  it('renders exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('presents the founder background and delivery process from the homepage', () => {
    expect(html).toContain('A direct, founder-led engagement.');
    expect(html).toContain('From a useful question to software your team can use.');
  });

  it('links to services and qualification', () => {
    expect(html).toContain('href="/services"');
    expect(html).toContain('href="/qualification"');
  });

  it('declares canonical metadata for its route', () => {
    expect(metadata.alternates?.canonical).toBe('/about');
    expect(metadata.title).toBe('About');
  });
});
