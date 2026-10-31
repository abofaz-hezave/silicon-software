import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

import { BriefingWorkspace } from '@/components/sections/briefing-workspace';
import { Section } from '@/components/sections/section';
import { intelligentBriefingCopy, intelligentBriefingPreview } from '@/content/products';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Intelligent Briefing',
  description:
    'See how Intelligent Briefing turns client information into a structured briefing, with an anonymous preview built from fixed sample content.',
  path: '/intelligent-briefing',
});

function IntelligentBriefingPage() {
  const {
    modelIntro,
    inputModes,
    availableSummary,
    availableItems,
    deferredItems,
    deferredNote,
    previewNote,
  } = intelligentBriefingCopy;

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-24 lg:px-8">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">
          Product preview
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
          Intelligent Briefing
        </h1>
        <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-8">{modelIntro}</p>
      </section>

      <Section
        id="input-modes"
        eyebrow="Two ways in"
        title="Enter the details yourself, or let the assistant ask for what is missing."
      >
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {inputModes.map((mode) => (
            <li key={mode.title} className="bg-card rounded-xl border p-6">
              <h3 className="text-base font-semibold">{mode.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{mode.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="preview"
        eyebrow="Anonymous preview"
        title="A briefing built from sample content."
        intro={<p className="text-muted-foreground mt-6 text-lg leading-8">{previewNote}</p>}
      >
        <div className="mt-12">
          <BriefingWorkspace preview={intelligentBriefingPreview} />
        </div>
      </Section>

      <Section
        id="version-one"
        eyebrow="Version one"
        title="What ships now, and what is deferred."
        tone="muted"
      >
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-xl border p-6">
            <h3 className="text-base font-semibold">Available in version one</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{availableSummary}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              {availableItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-xl border p-6">
            <h3 className="text-base font-semibold">Deferred</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-6">{deferredNote}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              {deferredItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12">
          <Button asChild>
            <Link href="/qualification">Discuss your workflow</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

export default IntelligentBriefingPage;
