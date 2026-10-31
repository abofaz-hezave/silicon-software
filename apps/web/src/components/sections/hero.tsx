import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

import { intelligentBriefing } from '@/content/products';

import { BriefingWorkspace } from './briefing-workspace';
import { Tag } from './tag';

function Hero() {
  return (
    <section className="border-b bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:18px_18px]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <Tag>Intelligent Briefing for marketing teams</Tag>
          <h1 className="font-display mt-5 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Turn scattered client input into a briefing your team can act on.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7">
            Silicon Software customizes Intelligent Briefing around your agency’s process, helping
            your team identify missing information and create clear, structured briefings without
            forcing every client into the same form.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/qualification">Discuss your workflow</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/intelligent-briefing">Explore the product preview</Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-5 font-mono text-xs">
            Fixed sample content only. The product preview accepts no visitor client data.
          </p>
        </div>
        <BriefingWorkspace
          fields={intelligentBriefing.previewItems}
          missingField={intelligentBriefing.previewMissingField}
          conversation={intelligentBriefing.previewConversation}
        />
      </div>
    </section>
  );
}

export { Hero };
