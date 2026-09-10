export interface Faq {
  question: string;
  answer: string;
}

export const faqs: readonly Faq[] = [
  {
    question: 'Does the Intelligent Briefing preview use my client information?',
    answer:
      'No. The homepage preview is an anonymous, non-production experience using fixed sample content. It does not accept visitor or customer client data.',
  },
  {
    question: 'What does Intelligent Briefing do today?',
    answer:
      'Briefing creation is the current product boundary for Intelligent Briefing. It guides a marketing team through gathering information, identifying what is missing, and creating a structured briefing.',
  },
  {
    question: 'Can Intelligent Briefing fit our process?',
    answer:
      'The product can be customized around an agency’s context, including its briefing model, optional template, guidance, and workflow. The right scope is defined during the engagement.',
  },
  {
    question: 'What happens after I send a qualification inquiry?',
    answer:
      'Silicon Software reviews the business need, budget, and engagement fit before deciding whether a conversation is the right next step. Any booking link is shared manually with suitable prospects.',
  },
] as const;
