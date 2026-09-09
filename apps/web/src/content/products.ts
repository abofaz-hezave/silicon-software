export interface ProductPreviewItem {
  label: string;
  value: string;
}

export interface Product {
  name: string;
  eyebrow: string;
  description: string;
  customization: string;
  previewNote: string;
  previewItems: readonly ProductPreviewItem[];
  href: string;
}

export const intelligentBriefing: Product = {
  name: 'Intelligent Briefing',
  eyebrow: 'Silicon Softwares current product',
  description:
    'A customizable AI briefing experience that helps marketing teams turn scattered client information into a clear, structured brief.',
  customization:
   'We adapt its briefing model, guidance, and workflow to fit the way your team works.',
  previewNote: 'Anonymous fixed sample content. No visitor or customer data is used.',
  previewItems: [
    { label: 'Project', value: 'Autumn campaign launch' },
    { label: 'Audience', value: 'Returning customers' },
    { label: 'Primary goal', value: 'Increase qualified enquiries' },
  ],
  href: '/intelligent-briefing',
};
