import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

import { technicalEvidence } from '@/content/technical-evidence';

function TechnicalEvidence() {
  return (
    <section aria-labelledby="technical-evidence-heading" className="border-t py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">
            Technical evidence
          </p>
          <h2
            id="technical-evidence-heading"
            className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            Specific about what the software does, and where it stops.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {technicalEvidence.map((item) => (
            <Card key={item.title} className="h-full shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-7">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TechnicalEvidence };
