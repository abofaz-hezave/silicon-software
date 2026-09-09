'use client';

import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { mainNavigation } from '@/lib/site-navigation';

import { ThemeToggle } from './theme-toggle';

function MenuIcon({ open }: Readonly<{ open: boolean }>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    firstLinkRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <MenuIcon open={open} />
      </Button>
      {open ? (
        <>
          <button
            type="button"
            className="top-18 backdrop-blur-xs fixed inset-0 -z-10 bg-black/20"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={closeMenu}
          />
          <div
            id="mobile-navigation"
            className="bg-background border-border absolute inset-x-0 top-full border-b px-6 py-6 shadow-xl"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {mainNavigation.map((item, index) => (
                <Button key={item.href} asChild variant="ghost" className="justify-start">
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </Button>
              ))}
              <Button asChild className="mt-2 justify-start">
                <Link href="/qualification" onClick={closeMenu}>
                  Start a conversation
                </Link>
              </Button>
            </nav>
            <div className="border-border mt-6 flex items-center justify-between border-t pt-6">
              <span className="text-muted-foreground text-sm font-medium">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export { MobileMenu };
