import { technicalEvidence } from '@/content/technical-evidence';

import { BentoGrid } from './bento-grid';
import { Section } from './section';

const evidenceSpans = ['md:col-span-2 md:row-span-2', 'md:col-span-2', 'md:col-span-2'];

function TechnicalEvidence() {
  return (
    <Section
      id="technical-evidence"
      eyebrow="Technical evidence"
      title="Specific about what the software does, and where it stops."
    >
      <BentoGrid
        codePrefix="EVD"
        items={technicalEvidence}
        spans={evidenceSpans}
        className="md:grid-cols-4"
      />
    </Section>
  );
}

export { TechnicalEvidence };
