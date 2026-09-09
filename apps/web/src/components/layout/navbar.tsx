import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

import { mainNavigation } from '@/lib/site-navigation';

import { MobileMenu } from './mobile-menu';
import { ThemeToggle } from './theme-toggle';

function Navbar() {
  return (
    <header className="border-border/70 bg-background/90 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="h-18 mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight"
          aria-label="Silicon Software home"
        >
          Silicon Software
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {mainNavigation.map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/qualification">Start a conversation</Link>
          </Button>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}

export { Navbar };
