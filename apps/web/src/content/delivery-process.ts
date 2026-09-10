export interface DeliveryStage {
  number: string;
  title: string;
  description: string;
}

export const deliveryStages: readonly DeliveryStage[] = [
  {
    number: '01',
    title: 'Qualify the opportunity',
    description:
      'Start with the business need, available budget, and engagement fit. A qualified inquiry gives us the context needed for a useful conversation.',
  },
  {
    number: '02',
    title: 'Define the right shape',
    description:
      'Clarify the team’s current process, the information a briefing needs to capture, and the constraints that should guide the customization.',
  },
  {
    number: '03',
    title: 'Implement the agreement',
    description:
      'Move from an agreed plan to an appropriately scoped implementation of Intelligent Briefing around the defined context.',
  },
  {
    number: '04',
    title: 'Support what follows',
    description:
      'Deployment, ownership, and ongoing support terms are chosen separately for each engagement as the product and team needs become clearer.',
  },
] as const;
