import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

import { technicalEvidence } from '@/content/technical-evidence';

import { Section } from './section';

function TechnicalEvidence() {
  return (
    <Section
      id="technical-evidence"
      eyebrow="Technical evidence"
      title="Specific about what the software does, and where it stops."
    >
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
    </Section>
  );
}

export { TechnicalEvidence };
