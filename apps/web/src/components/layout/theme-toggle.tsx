'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type { ComponentProps, ReactNode } from 'react';
import { useSyncExternalStore } from 'react';

const themeOptions = ['light', 'dark', 'system'] as const;

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

function ThemeToggle({ className }: Pick<ComponentProps<'fieldset'>, 'className'>) {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <fieldset
      className={`border-border bg-muted/60 inline-flex rounded-lg border p-1 ${className ?? ''}`}
    >
      <legend className="sr-only">Color theme</legend>
      {themeOptions.map((option) => {
        const selected = mounted && theme === option;

        return (
          <button
            key={option}
            type="button"
            className="aria-pressed:bg-background aria-pressed:text-foreground text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2"
            aria-pressed={selected}
            onClick={() => {
              setTheme(option);
            }}
          >
            {option}
          </button>
        );
      })}
    </fieldset>
  );
}

export { ThemeProvider, ThemeToggle };
