import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Section } from './section';

describe('Section', () => {
  it('labels the landmark with its h2 and renders eyebrow, title and body inside it', () => {
    const html = renderToStaticMarkup(
      <Section id="faq" eyebrow="FAQ" title="Clear answers before a conversation.">
        <p>Body copy</p>
      </Section>,
    );

    expect(html).toMatch(/^<section aria-labelledby="faq-heading"/);
    expect(html).toContain('>FAQ</span>');
    expect(html).toContain('<h2 id="faq-heading"');
    expect(html).toContain('Clear answers before a conversation.</h2>');
    expect(html).toContain('<p>Body copy</p>');
    expect(html.endsWith('</section>')).toBe(true);
  });

  it('renders the eyebrow inside the mono Tag chip', () => {
    const html = renderToStaticMarkup(
      <Section id="faq" eyebrow="FAQ" title="Title">
        <div>Body</div>
      </Section>,
    );

    expect(html).toMatch(/<span class="[^"]*font-mono[^"]*">FAQ<\/span>/);
  });

  it('renders intro directly after the heading inside the header block', () => {
    const html = renderToStaticMarkup(
      <Section
        id="services"
        eyebrow="Services"
        title="Title"
        intro={<p className="intro">Lead paragraph</p>}
      >
        <div>Body</div>
      </Section>,
    );

    expect(html).toContain(
      'Title</h2><p class="intro">Lead paragraph</p></div><div>Body</div></div></section>',
    );
  });

  it('adds the muted background only when tone is muted', () => {
    const muted = renderToStaticMarkup(
      <Section id="faq" eyebrow="FAQ" title="Title" tone="muted">
        <div>Body</div>
      </Section>,
    );
    const defaultTone = renderToStaticMarkup(
      <Section id="faq" eyebrow="FAQ" title="Title">
        <div>Body</div>
      </Section>,
    );

    expect(muted).toMatch(
      /^<section aria-labelledby="faq-heading" class="bg-muted\/40 border-t py-20"/,
    );
    expect(defaultTone).toMatch(/^<section aria-labelledby="faq-heading" class="border-t py-20"/);
  });

  it('constrains the container to max-w-7xl', () => {
    const html = renderToStaticMarkup(
      <Section id="services" eyebrow="Services" title="Title">
        <div>Body</div>
      </Section>,
    );

    expect(html).toContain('<div class="mx-auto max-w-7xl px-6 lg:px-8">');
  });
});
