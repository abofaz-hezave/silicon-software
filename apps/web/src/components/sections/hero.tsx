import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
          Silicon Software
        </p>
        <h1 className="font-display text-foreground max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          From client information to a structured briefing — guided by AI.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Intelligent Briefing is the first product from Silicon Software. It guides your marketing
          team through turning client information into a structured briefing, so every engagement
          starts from shared, complete context.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/qualification">Start a qualification</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/intelligent-briefing">See the product preview</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
