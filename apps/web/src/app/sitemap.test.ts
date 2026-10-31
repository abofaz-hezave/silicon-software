import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('sitemap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://silicon.example');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('lists every public route as an absolute URL', async () => {
    const { default: sitemap } = await import('./sitemap');

    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://silicon.example/',
      'https://silicon.example/services',
      'https://silicon.example/intelligent-briefing',
      'https://silicon.example/about',
      'https://silicon.example/qualification',
      'https://silicon.example/privacy',
      'https://silicon.example/terms',
    ]);
  });
});
