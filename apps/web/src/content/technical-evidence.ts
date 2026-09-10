export interface TechnicalEvidence {
  title: string;
  description: string;
}

export const technicalEvidence: readonly TechnicalEvidence[] = [
  {
    title: 'A real product boundary',
    description:
      'Intelligent Briefing has a defined job: guide client information into a structured briefing. The current release ends at briefing creation rather than promising an entire downstream workflow.',
  },
  {
    title: 'Customization with structure',
    description:
      'The briefing model, optional templates, guidance, and workflow can be shaped around an agency context instead of forcing every team into one generic form.',
  },
  {
    title: 'A static-first foundation',
    description:
      'The marketing site uses server-rendered pages, typed local content, strict TypeScript, and shared UI primitives. Dynamic behavior is reserved for the qualification submission flow.',
  },
] as const;
