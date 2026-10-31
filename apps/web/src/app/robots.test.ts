import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('robots', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://silicon.example');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('allows crawling and points to the sitemap only in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SITE_STAGE', 'production');
    const { default: robots } = await import('./robots');

    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://silicon.example/sitemap.xml',
    });
  });

  it('disallows crawling when built with NODE_ENV production outside the production stage', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('SITE_STAGE', 'staging');
    const { default: robots } = await import('./robots');

    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });

  it('disallows crawling in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('SITE_STAGE', 'production');
    const { default: robots } = await import('./robots');

    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });
});
