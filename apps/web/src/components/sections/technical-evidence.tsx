import { technicalEvidence } from '@/content/technical-evidence';

import { BentoTile } from './bento-tile';
import { Section } from './section';

const evidenceSpans = ['md:col-span-2 md:row-span-2', 'md:col-span-2', 'md:col-span-2'];

function TechnicalEvidence() {
  return (
    <Section
      id="technical-evidence"
      eyebrow="Technical evidence"
      title="Specific about what the software does, and where it stops."
    >
      <div className="mt-12 grid gap-3 md:grid-cols-4">
        {technicalEvidence.map((item, index) => (
          <BentoTile
            key={item.title}
            code={`EVD-${String(index + 1).padStart(2, '0')}`}
            title={item.title}
            description={item.description}
            className={evidenceSpans[index]}
          />
        ))}
      </div>
    </Section>
  );
}

export { TechnicalEvidence };
