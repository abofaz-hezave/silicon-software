import { deliveryStages } from '@/content/delivery-process';

import { Section } from './section';

function DeliveryProcess() {
  return (
    <Section
      id="delivery-process"
      eyebrow="Process"
      title="From a useful question to software your team can use."
      tone="muted"
    >
      <ol className="mt-12 grid gap-0 border-l md:grid-cols-4 md:gap-4 md:border-l-0">
        {deliveryStages.map((stage) => (
          <li
            key={stage.number}
            className="relative border-b px-6 py-6 last:border-b-0 md:border-b-0 md:border-l md:py-2"
          >
            <span className="text-primary text-sm font-semibold" aria-hidden="true">
              {stage.number}
            </span>
            <h3 className="mt-4 text-xl font-semibold">{stage.title}</h3>
            <p className="text-muted-foreground mt-3 leading-7">{stage.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export { DeliveryProcess };
