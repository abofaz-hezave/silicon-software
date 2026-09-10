import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

import { services } from '@/content/services';

function ServicesGrid() {
  return (
    <section aria-labelledby="services-heading" className="border-t py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">Services</p>
          <h2
            id="services-heading"
            className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            AI customization for the work your team already does.
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Silicon Software helps teams shape and adopt Intelligent Briefing without forcing their
            process into a generic template.
          </p>
        </div>
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
      </div>
    </section>
  );
}

export { ServicesGrid };
