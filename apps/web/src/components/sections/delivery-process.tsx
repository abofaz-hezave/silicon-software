import { deliveryStages } from '@/content/delivery-process';

function DeliveryProcess() {
  return (
    <section
      aria-labelledby="delivery-process-heading"
      className="bg-muted/40 border-t py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">Process</p>
          <h2
            id="delivery-process-heading"
            className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
          >
            From a useful question to software your team can use.
          </h2>
        </div>
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
      </div>
    </section>
  );
}

export { DeliveryProcess };
