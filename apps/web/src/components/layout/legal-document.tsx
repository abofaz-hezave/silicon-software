import type { LegalDocumentContent } from '@/content/legal';

type LegalDocumentProps = Readonly<{
  document: LegalDocumentContent;
}>;

function LegalDocument({ document }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
        {document.title}
      </h1>
      <p className="text-muted-foreground mt-4 font-mono text-xs">
        Last updated {document.lastUpdated}
      </p>
      <div className="mt-12 flex flex-col gap-10">
        {document.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground text-base leading-7">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}

export { LegalDocument };
