'use client';

import { Button } from '@repo/ui/components/button';

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="bg-background grid min-h-[70vh] place-items-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-[0.2em]">
          Something went wrong
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          We could not load this page.
        </h1>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          Please try again. If the problem continues, return to the homepage and choose another
          route.
        </p>
        <Button className="mt-10" size="lg" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}

export default ErrorPage;
