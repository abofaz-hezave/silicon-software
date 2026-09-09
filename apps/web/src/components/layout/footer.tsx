import { mainNav, siteConfig } from '@/content/site';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-foreground text-sm font-semibold">{siteConfig.name}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Intelligent Briefing — from client information to structured briefing.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted-foreground text-sm">
          © {siteConfig.copyrightYear} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
