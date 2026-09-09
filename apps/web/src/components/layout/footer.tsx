import Link from 'next/link';

import { legalNavigation, mainNavigation } from '@/lib/site-navigation';

function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-md">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Silicon Software
          </Link>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Practical AI products, customized around the way your team works.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer navigation">
          {[...mainNavigation, ...legalNavigation].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-muted-foreground text-xs sm:col-span-2">
          © 2026 Silicon Software. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export { Footer };
