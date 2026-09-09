import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top,hsl(var(--muted)),transparent_68%)]"
        aria-hidden="true"
      />
      <div className="mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="max-w-4xl">
          <p className="border-border bg-background/70 mb-8 inline-flex rounded-full border px-3 py-1 text-sm font-medium shadow-sm">
            Intelligent Briefing for marketing teams
          </p>
          <h1 className="font-display max-w-4xl text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Turn scattered client input into a briefing your team can act on.
          </h1>
          <p className="text-muted-foreground mt-8 max-w-2xl text-pretty text-lg leading-8 sm:text-xl">
            Silicon Software customizes Intelligent Briefing around your agency’s process, helping
            your team identify missing information and create clear, structured briefings without
            forcing every client into the same form.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/qualification">Discuss your workflow</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/intelligent-briefing">Explore the product preview</Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Fixed sample content only. The product preview accepts no visitor client data.
          </p>
        </div>
      </div>
    </section>
  );
}

export { Hero };
