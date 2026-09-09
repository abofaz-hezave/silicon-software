import { cn } from '@/lib/utils';
import { mainNav, siteConfig } from '@/content/site';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-foreground text-lg font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'text-muted-foreground hover:text-foreground text-sm font-medium transition-colors',
                    link.href === '/' && 'text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
