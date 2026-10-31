import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { initialQualificationState } from '@/lib/qualification-form';

import { QualificationForm } from './qualification-form';

function openingTagFor(html: string, name: string): string {
  return new RegExp(`<(?:input|select|textarea)[^>]*name="${name}"[^>]*>`).exec(html)?.[0] ?? '';
}

describe('QualificationForm', () => {
  const html = renderToStaticMarkup(<QualificationForm />);

  it('marks the required fields and applies native email and length constraints', () => {
    expect(openingTagFor(html, 'name')).toContain('required=""');
    expect(openingTagFor(html, 'name')).toContain('minLength="2"');
    expect(openingTagFor(html, 'email')).toContain('type="email"');
    expect(openingTagFor(html, 'email')).toContain('required=""');
    expect(openingTagFor(html, 'projectType')).toContain('required=""');
    expect(openingTagFor(html, 'budget')).toContain('required=""');
    expect(openingTagFor(html, 'message')).toContain('required=""');
    expect(openingTagFor(html, 'message')).toContain('minLength="10"');
    expect(openingTagFor(html, 'company')).not.toContain('required=""');
  });

  it('offers the controlled project type and budget options', () => {
    for (const option of [
      'Intelligent Briefing customization',
      'Paid discovery',
      'Scoped build',
      'Ongoing product retainer',
      'Not sure yet',
      'Under €2,500',
      '€2,500 – €5,000',
      '€5,000 – €15,000',
      '€15,000+',
    ]) {
      expect(html).toContain(`>${option}</option>`);
    }
  });

  it('links invalid fields to their errors and restores the submitted entries', () => {
    const invalidHtml = renderToStaticMarkup(
      <QualificationForm
        initialState={{
          success: false,
          message: 'Please correct the highlighted fields.',
          attempt: 1,
          errors: { email: ['Enter a valid email address.'] },
          values: { name: 'Ada Lovelace', email: 'not-an-email', message: 'Short note here.' },
        }}
      />,
    );

    expect(openingTagFor(invalidHtml, 'email')).toContain('aria-invalid="true"');
    expect(openingTagFor(invalidHtml, 'email')).toContain('aria-describedby="email-error"');
    expect(invalidHtml).toContain(
      '<p id="email-error" class="text-destructive text-sm">Enter a valid email address.</p>',
    );
    expect(openingTagFor(invalidHtml, 'name')).not.toContain('aria-invalid');
    expect(openingTagFor(invalidHtml, 'name')).toContain('value="Ada Lovelace"');
    expect(openingTagFor(invalidHtml, 'email')).toContain('value="not-an-email"');
    expect(invalidHtml).toContain('Short note here.</textarea>');
    expect(invalidHtml).toContain('Please correct the highlighted fields.');
  });

  it('announces the success message in the live status region', () => {
    const successHtml = renderToStaticMarkup(
      <QualificationForm
        initialState={{
          ...initialQualificationState,
          success: true,
          message:
            "Thanks — we've received your inquiry and will reply by email if it looks like a fit.",
        }}
      />,
    );

    expect(successHtml).toMatch(/<p[^>]*role="status"[^>]*aria-live="polite"[^>]*>Thanks/);
  });
});
