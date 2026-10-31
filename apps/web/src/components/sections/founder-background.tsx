import { founderInformation } from '@/content/founder';

import { Tag } from './tag';

function FounderBackground() {
  return (
    <section aria-labelledby="founder-heading" className="border-t py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-card flex flex-col gap-6 rounded-xl border p-6 md:flex-row md:items-center">
          <div
            className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold"
            aria-hidden="true"
          >
            SS
          </div>
          <div className="flex-1">
            <Tag>{founderInformation.eyebrow}</Tag>
            <h2 id="founder-heading" className="mt-2 text-lg font-semibold">
              {founderInformation.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {founderInformation.description}
            </p>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-6 md:border-l md:pl-6">
            {founderInformation.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export { FounderBackground };
