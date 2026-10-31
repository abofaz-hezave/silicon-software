export type EngagementPrice =
  { kind: 'from'; amountEur: number; period?: 'month' } | { kind: 'separate'; note: string };

export interface EngagementOffer {
  title: string;
  description: string;
  price: EngagementPrice;
}

export const engagementOffers: readonly EngagementOffer[] = [
  {
    title: 'Initial Intelligent Briefing setup',
    description:
      'Fixed-scope customization of the briefing model, optional templates, and guidance around the way your team gathers client information.',
    price: { kind: 'from', amountEur: 2500 },
  },
  {
    title: 'Ongoing product retainer',
    description:
      'Continued product support as your briefing workflow evolves, with changes scoped and agreed in advance.',
    price: { kind: 'from', amountEur: 1000, period: 'month' },
  },
  {
    title: 'Paid discovery',
    description:
      'Clarify the right product shape, constraints, and priorities before committing to a build.',
    price: {
      kind: 'separate',
      note: 'Priced separately. The amount depends on factors still being defined.',
    },
  },
  {
    title: 'Complex customization or scoped build',
    description:
      'Customization beyond the initial setup, scoped and priced after discovery once requirements are agreed.',
    price: { kind: 'separate', note: 'Priced separately, after discovery.' },
  },
] as const;
