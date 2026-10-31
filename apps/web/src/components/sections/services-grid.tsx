import { services } from '@/content/services';

import { BentoGrid } from './bento-grid';
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
      <BentoGrid
        codePrefix="SVC"
        items={services}
        spans={serviceSpans}
        className="md:grid-cols-6"
      />
    </Section>
  );
}

export { ServicesGrid };
