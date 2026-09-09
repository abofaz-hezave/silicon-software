import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

function NotFoundPage() {
  return (
    <main className="bg-background grid min-h-screen place-items-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-[0.2em]">
          404
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          This page is not part of the briefing.
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          The address may have changed, or the page may not exist. Return home to continue exploring
          Silicon Software.
        </p>
        <Button asChild className="mt-10" size="lg">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}

export default NotFoundPage;
