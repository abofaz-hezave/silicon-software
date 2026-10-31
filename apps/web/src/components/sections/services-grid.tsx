import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

import { services } from '@/content/services';

import { Section } from './section';

function ServicesGrid() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title="AI customization for the work your team already does."
      intro={
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          Silicon Software helps teams shape and adopt Intelligent Briefing without forcing their
          process into a generic template.
        </p>
      }
    >
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="h-full shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export { ServicesGrid };
