import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import MarketingLayout from './layout';

function hrefsWithin(html: string, ariaLabel: string): string[] {
  const nav = new RegExp(`<nav[^>]*aria-label="${ariaLabel}"[^>]*>(.*?)</nav>`).exec(html)?.[1];
  if (nav === undefined) throw new Error(`Missing nav: ${ariaLabel}`);
  return [...nav.matchAll(/href="([^"]+)"/g)].map((match) => match[1] ?? '');
}

describe('MarketingLayout', () => {
  const html = renderToStaticMarkup(
    <MarketingLayout>
      <p>Page content</p>
    </MarketingLayout>,
  );

  it('places the page content inside main', () => {
    expect(html).toMatch(/<main[^>]*><p>Page content<\/p><\/main>/);
  });

  it('renders the header with main navigation and the qualification call to action', () => {
    expect(hrefsWithin(html, 'Main navigation')).toEqual([
      '/',
      '/services',
      '/intelligent-briefing',
      '/about',
    ]);
    expect(html).toMatch(/<a[^>]*href="\/qualification"[^>]*>Start a conversation<\/a>/);
  });

  it('renders the footer navigation with main and legal links', () => {
    expect(hrefsWithin(html, 'Footer navigation')).toEqual([
      '/',
      '/services',
      '/intelligent-briefing',
      '/about',
      '/privacy',
      '/terms',
    ]);
  });
});
