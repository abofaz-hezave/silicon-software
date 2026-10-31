import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ServicesPage, { metadata } from './page';

describe('ServicesPage', () => {
  const html = renderToStaticMarkup(<ServicesPage />);

  it('renders exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('publishes the starting prices', () => {
    expect(html).toContain('€2,500');
    expect(html).toContain('€1,000');
    expect(html).toContain('per month');
  });

  it('marks discovery and complex customization as separately priced', () => {
    expect(html.match(/Priced separately/g)).toHaveLength(2);
    expect(html).toContain('Paid discovery');
    expect(html).toContain('Complex customization or scoped build');
  });

  it('gives each offer a path to qualification', () => {
    expect(html.match(/href="\/qualification"/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it('declares canonical metadata for its route', () => {
    expect(metadata.alternates?.canonical).toBe('/services');
    expect(metadata.title).toBe('Services and pricing');
  });
});
