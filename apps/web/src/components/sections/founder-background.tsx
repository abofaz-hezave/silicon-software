import { Card, CardContent } from '@repo/ui/components/card';

import { founderInformation } from '@/content/founder';

function FounderBackground() {
  return (
    <section aria-labelledby="founder-heading" className="border-t py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
        <div>
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">
            {founderInformation.eyebrow}
          </p>
          <h2
            id="founder-heading"
            className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            {founderInformation.title}
          </h2>
        </div>
        <Card className="shadow-none">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <p className="text-lg leading-8">{founderInformation.description}</p>
            <p className="text-muted-foreground leading-7">{founderInformation.note}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export { FounderBackground };
