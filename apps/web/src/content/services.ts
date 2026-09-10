export interface Service {
  title: string;
  description: string;
}

export const services: readonly Service[] = [
  {
    title: 'Intelligent Briefing customization',
    description:
      'Shape the briefing model, guidance, and workflow around the way your marketing team gathers client information.',
  },
  {
    title: 'Paid discovery',
    description:
      'Clarify the right product shape, constraints, and priorities before committing to a build.',
  },
  {
    title: 'Build and ongoing product support',
    description:
      'Move from an agreed plan to an appropriately scoped implementation, with product support as your needs evolve.',
  },
] as const;
