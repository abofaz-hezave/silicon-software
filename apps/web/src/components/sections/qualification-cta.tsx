import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

function QualificationCta() {
  return (
    <section aria-labelledby="qualification-heading" className="border-t py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-primary text-primary-foreground grid gap-8 rounded-lg p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-[0.16em]">
              A useful next step
            </p>
            <h2
              id="qualification-heading"
              className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
            >
              Start with the workflow, not a sales pitch.
            </h2>
            <p className="text-primary-foreground/80 mt-6 max-w-xl text-lg leading-8">
              Share what your team is trying to improve, and we can determine whether a
              customization engagement is a fit.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/qualification">Discuss your workflow</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { QualificationCta };
