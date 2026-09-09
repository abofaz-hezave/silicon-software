export interface NavLink {
  href: string;
  label: string;
}

export const siteConfig = {
  name: 'Silicon Software',
  description:
    'Silicon Software is a software agency whose focused on building AI-powered solutions.',
  copyrightYear: 2026,
} as const;

export const mainNav: readonly NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/intelligent-briefing', label: 'Intelligent Briefing' },
  { href: '/about', label: 'About' },
  { href: '/qualification', label: 'Qualification' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];
