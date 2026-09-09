'use client';

import { Button } from '@repo/ui/components/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6">
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
        Something went wrong
      </p>
      <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
        An unexpected error occurred
      </h1>
      <p className="text-muted-foreground max-w-xl">
        Please try again. If the problem persists, reach out through the qualification page.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
