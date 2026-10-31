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
