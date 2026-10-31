import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
  const html = renderToStaticMarkup(<NotFoundPage />);

  it('tells the visitor the page is not part of the briefing', () => {
    expect(html).toMatch(/<h1[^>]*>This page is not part of the briefing\.<\/h1>/);
  });

  it('offers a link back to the homepage', () => {
    expect(html).toMatch(/<a[^>]*href="\/"[^>]*>Return home<\/a>/);
  });
});
