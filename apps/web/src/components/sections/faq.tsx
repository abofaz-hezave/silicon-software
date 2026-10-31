import { faqs } from '@/content/faqs';

import { Section } from './section';

function Faq() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Clear answers before a conversation."
      tone="muted"
      width="narrow"
    >
      <div className="divide-border mt-10 divide-y border-y">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                className="text-muted-foreground text-2xl font-normal transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="text-muted-foreground max-w-3xl pt-4 leading-7">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export { Faq };
