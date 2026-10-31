import type { Faq as FaqItem } from '@/content/faqs';
import { faqs } from '@/content/faqs';

import { Section } from './section';

type FaqColumnProps = Readonly<{
  items: readonly FaqItem[];
}>;

function FaqColumn({ items }: FaqColumnProps) {
  return (
    <div className="divide-border divide-y border-y">
      {items.map((faq) => (
        <details key={faq.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span
              className="text-muted-foreground font-mono text-lg transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="text-muted-foreground mt-3 text-sm leading-6">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

function Faq() {
  const midpoint = Math.ceil(faqs.length / 2);

  return (
    <Section id="faq" eyebrow="FAQ" title="Clear answers before a conversation." tone="muted">
      <div className="mt-12 grid gap-x-10 md:grid-cols-2">
        <FaqColumn items={faqs.slice(0, midpoint)} />
        <FaqColumn items={faqs.slice(midpoint)} />
      </div>
    </Section>
  );
}

export { Faq };
