import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PrivacyPage, { metadata } from './page';

describe('PrivacyPage', () => {
  const html = renderToStaticMarkup(<PrivacyPage />);

  it('renders exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('lists the qualification fields collected from inquiries', () => {
    expect(html).toContain(
      'name, email address, company (optional), project type, budget range, and message',
    );
  });

  it('separates inquiry data from the fixed sample content in the product preview', () => {
    expect(html).toContain('fixed sample content');
    expect(html).toContain('does not collect, store, or process any visitor data');
  });

  it('does not claim accounts, notifications, scheduling, or analytics', () => {
    expect(html).toContain('no accounts');
    expect(html).not.toMatch(/sign up|log in|create an account/i);
  });

  it('declares canonical metadata for its route', () => {
    expect(metadata.alternates?.canonical).toBe('/privacy');
    expect(metadata.title).toBe('Privacy');
  });
});
