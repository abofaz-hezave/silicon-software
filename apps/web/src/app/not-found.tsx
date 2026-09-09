import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col items-start justify-center gap-6 px-4 py-24 sm:px-6">
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">404</p>
      <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
        This page could not be found
      </h1>
      <p className="text-muted-foreground max-w-xl">
        The page you are looking for does not exist or may have moved.
      </p>
      <Button asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}
