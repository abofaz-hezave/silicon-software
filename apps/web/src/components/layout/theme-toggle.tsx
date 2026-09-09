'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

type ThemeValue = (typeof themeOptions)[number]['value'];

type ThemeProviderProps = Readonly<{
  children: ReactNode;
}>;

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

function subscribe() {
  return () => undefined;
}

function SunIcon({ className }: Pick<ComponentProps<'svg'>, 'className'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: Pick<ComponentProps<'svg'>, 'className'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon({ className }: Pick<ComponentProps<'svg'>, 'className'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function CheckIcon({ className }: Pick<ComponentProps<'svg'>, 'className'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const themeIcons: Record<ThemeValue, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

function ThemeToggle({ className }: Pick<ComponentProps<'div'>, 'className'>) {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const activeTheme: ThemeValue =
    mounted && theme === 'dark' ? 'dark' : mounted && theme === 'light' ? 'light' : 'system';
  const ActiveIcon = themeIcons[activeTheme];

  return (
    <div ref={rootRef} className={`relative ${className ?? ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className="border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2"
        aria-expanded={open}
        aria-controls="theme-menu"
        aria-label="Change color theme"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <ActiveIcon className="size-4" />
      </button>
      {open ? (
        <div
          id="theme-menu"
          className="bg-background border-border absolute right-0 top-full z-50 mt-2 min-w-36 rounded-lg border p-1 shadow-lg"
        >
          {themeOptions.map((option) => {
            const selected = mounted && theme === option.value;
            const OptionIcon = themeIcons[option.value];

            return (
              <button
                key={option.value}
                type="button"
                className="hover:bg-accent hover:text-accent-foreground text-foreground flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors"
                aria-pressed={selected}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <OptionIcon className="size-4" />
                {option.label}
                {selected ? <CheckIcon className="text-foreground ml-auto size-3.5" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export { ThemeProvider, ThemeToggle };
