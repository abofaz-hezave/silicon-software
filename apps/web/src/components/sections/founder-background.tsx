import { Card, CardContent } from '@repo/ui/components/card';

import { founderInformation } from '@/content/founder';

import { Section } from './section';

function FounderBackground() {
  return (
    <Section
      id="founder"
      layout="split"
      gridClassName="gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
      eyebrow={founderInformation.eyebrow}
      title={founderInformation.title}
    >
      <Card className="shadow-none">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <p className="text-lg leading-8">{founderInformation.description}</p>
          <p className="text-muted-foreground leading-7">{founderInformation.note}</p>
        </CardContent>
      </Card>
    </Section>
  );
}

export { FounderBackground };
