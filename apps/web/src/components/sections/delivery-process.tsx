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
      <div className="relative mt-12">
        <div
          className="bg-border absolute left-[12.5%] right-[12.5%] top-4 hidden h-px md:block"
          aria-hidden="true"
        />
        <ol className="grid gap-8 md:grid-cols-4">
          {deliveryStages.map((stage) => (
            <li key={stage.number} className="relative">
              <span className="bg-background relative flex size-8 items-center justify-center rounded-full border font-mono text-xs font-semibold">
                {stage.number}
              </span>
              <h3 className="mt-4 text-sm font-semibold">{stage.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export { DeliveryProcess };
