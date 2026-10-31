import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import QualificationPage, { metadata } from './page';

describe('QualificationPage', () => {
  const html = renderToStaticMarkup(<QualificationPage />);

  it('renders exactly one h1 and the qualification form', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain('name="projectType"');
    expect(html).toContain('Send Message');
  });

  it('explains that inquiries are reviewed and answered by email', () => {
    expect(html).toContain('replies by email');
    expect(html).not.toMatch(/book(ing)? a (call|meeting)|schedul/i);
  });

  it('declares canonical metadata for its route', () => {
    expect(metadata.alternates?.canonical).toBe('/qualification');
    expect(metadata.title).toBe('Qualification');
    expect(metadata.description).toEqual(expect.any(String));
  });
});
