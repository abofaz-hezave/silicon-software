import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import TermsPage, { metadata } from './page';

describe('TermsPage', () => {
  const html = renderToStaticMarkup(<TermsPage />);

  it('renders exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('separates the non-production preview from separately agreed engagements', () => {
    expect(html).toContain('non-production');
    expect(html).toContain('separate written agreement');
  });

  it('makes no promise of deferred product capabilities', () => {
    expect(html).toContain('customer workspaces, collaboration, approval, versioning');
    expect(html).not.toMatch(/sign up|log in|create an account/i);
  });

  it('declares canonical metadata for its route', () => {
    expect(metadata.alternates?.canonical).toBe('/terms');
    expect(metadata.title).toBe('Terms');
  });
});
