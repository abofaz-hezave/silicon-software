import type { Metadata } from 'next';
import { Geist, Inter } from 'next/font/google';

import { createMetadata } from '@/lib/metadata';

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

export const metadata: Metadata = createMetadata({
  title: 'Silicon Software — Intelligent Briefing',
  description:
    'Silicon Software customizes Intelligent Briefing, the AI product that guides a marketing team from client information to a structured briefing.',
  path: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
