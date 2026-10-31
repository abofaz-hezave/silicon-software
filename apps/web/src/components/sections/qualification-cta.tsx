import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

function QualificationCta() {
  return (
    <section aria-labelledby="qualification-heading" className="border-t py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-primary text-primary-foreground flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="qualification-heading" className="text-lg font-semibold">
              Start with the workflow, not a sales pitch.
            </h2>
            <p className="mt-1 text-sm opacity-80">
              Share what your team is trying to improve, and we can determine whether a
              customization engagement is a fit.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/qualification">Discuss your workflow</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export { QualificationCta };
