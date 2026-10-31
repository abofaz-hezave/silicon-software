export interface BriefingPreviewField {
  label: string;
  value: string;
}

export interface PreviewMessage {
  speaker: 'assistant' | 'team';
  text: string;
}

export interface BriefingPreview {
  windowTitle: string;
  structuredLabel: string;
  fields: readonly BriefingPreviewField[];
  missingField: string;
  conversation: readonly PreviewMessage[];
}

export const intelligentBriefingPreview: BriefingPreview = {
  windowTitle: 'briefing-assistant / sample',
  structuredLabel: 'Structured briefing',
  fields: [
    { label: 'Project', value: 'Autumn campaign launch' },
    { label: 'Audience', value: 'Returning customers' },
    { label: 'Primary goal', value: 'Increase qualified enquiries' },
  ],
  missingField: 'Deadline',
  conversation: [
    { speaker: 'assistant', text: 'What is this brief for?' },
    {
      speaker: 'team',
      text: 'Autumn campaign launch for returning customers. Main goal is more qualified enquiries.',
    },
    {
      speaker: 'assistant',
      text: 'Got it. When does this campaign need to go live? I don’t have a date yet.',
    },
  ],
};

export const intelligentBriefingCopy = {
  modelIntro:
    'Every briefing is built on one canonical briefing model, so the same core structure applies to every client. Teams can layer customer-configurable, optional templates on top of it to capture the fields each engagement needs.',
  inputModes: [
    {
      title: 'Enter fields directly',
      description:
        'Complete the briefing fields yourself when the client information is already in hand.',
    },
    {
      title: 'Work with the Briefing Assistant',
      description:
        'The assistant identifies missing information and asks follow-up questions before the briefing is created.',
    },
  ] as const,
  availableSummary: 'Production users can edit, save, and export generated briefings.',
  availableItems: ['Edit generated briefings', 'Save briefings', 'Export briefings'],
  deferredItems: [
    'Collaboration between team members',
    'Approval of briefings',
    'Versioning of briefings',
    'Downstream workflow automation',
    'Project creation',
  ],
  deferredNote:
    'Downstream workflow automation and project creation are future possibilities, not current features.',
  previewNote:
    'Fixed sample content only. The preview accepts no visitor data and creates no customer workspace.',
} as const;
