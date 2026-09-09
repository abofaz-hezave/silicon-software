import type { Metadata } from 'next';
import { Geist, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/components/layout/theme-toggle';
import { env } from '@/lib/env';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Silicon Software | Intelligent software for practical work',
    template: '%s | Silicon Software',
  },
  description:
    'Silicon Software customizes Intelligent Briefing to turn client information into clear, structured briefings.',
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geist.variable} [font-family:var(--font-inter)]`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
