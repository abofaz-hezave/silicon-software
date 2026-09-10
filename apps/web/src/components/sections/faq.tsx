import { faqs } from '@/content/faqs';

function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-muted/40 border-t py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">FAQ</p>
          <h2
            id="faq-heading"
            className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            Clear answers before a conversation.
          </h2>
        </div>
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
      </div>
    </section>
  );
}

export { Faq };
