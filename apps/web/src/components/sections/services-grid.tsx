import { services } from '@/content/services';

import { BentoTile } from './bento-tile';
import { Section } from './section';

const serviceSpans = ['md:col-span-4', 'md:col-span-2', 'md:col-span-6'];

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
      <div className="mt-12 grid gap-3 md:grid-cols-6">
        {services.map((service, index) => (
          <BentoTile
            key={service.title}
            code={`SVC-${String(index + 1).padStart(2, '0')}`}
            title={service.title}
            description={service.description}
            className={serviceSpans[index]}
          />
        ))}
      </div>
    </Section>
  );
}

export { ServicesGrid };
