import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import IntelligentBriefingPage, { metadata } from './page';

describe('IntelligentBriefingPage', () => {
  const html = renderToStaticMarkup(<IntelligentBriefingPage />);

  it('renders exactly one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('accepts no visitor input', () => {
    expect(html).not.toMatch(/<input[\s>]/);
    expect(html).not.toMatch(/<textarea[\s>]/);
    expect(html).not.toMatch(/<form[\s>]/);
  });

  it('explains the canonical model, templates, and both ways of entering information', () => {
    expect(html).toContain('canonical briefing model');
    expect(html).toContain('optional templates');
    expect(html).toContain('Briefing Assistant');
    expect(html).toContain('missing information');
  });

  it('shows the fixed sample preview', () => {
    expect(html).toContain('briefing-assistant / sample');
    expect(html).toContain('Autumn campaign launch');
    expect(html).toContain('Fixed sample content only');
  });

  it('states the version-one boundary and the deferred capabilities', () => {
    expect(html).toContain('edit, save, and export');
    for (const deferred of [
      'Collaboration',
      'Approval',
      'Versioning',
      'Downstream workflow automation',
      'Project creation',
    ]) {
      expect(html).toContain(deferred);
    }
  });

  it('declares canonical metadata for its route', () => {
    expect(metadata.alternates?.canonical).toBe('/intelligent-briefing');
    expect(metadata.title).toBe('Intelligent Briefing');
  });
});
