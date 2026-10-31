export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
}

export interface LegalDocumentContent {
  title: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
}

const lastUpdated = '31 October 2026';

export const privacyDocument: LegalDocumentContent = {
  title: 'Privacy',
  lastUpdated,
  sections: [
    {
      heading: 'Who we are',
      paragraphs: [
        'This website is operated by [LEGAL_ENTITY]. You can contact us at [CONTACT_EMAIL] or write to [REGISTERED_ADDRESS].',
      ],
    },
    {
      heading: 'Qualification inquiries',
      paragraphs: [
        'When you submit the qualification form we collect your name, email address, company (optional), project type, budget range, and message.',
        'We use these details to assess your inquiry. If it looks like a fit, a Silicon Software operator replies to you by email. We do not send automated notifications or booking invitations.',
        'Inquiries are stored in AWS infrastructure and kept for [RETENTION_PERIOD].',
      ],
    },
    {
      heading: 'Intelligent Briefing preview',
      paragraphs: [
        'The Intelligent Briefing preview uses fixed sample content. It does not collect, store, or process any visitor data, and it does not create a customer workspace.',
      ],
    },
    {
      heading: 'Technical data and local storage',
      paragraphs: [
        'Our hosting providers keep technical request logs, such as IP address and browser details, as part of operating the site.',
        'The site stores your light or dark theme preference in your browser’s local storage. This preference stays on your device.',
      ],
    },
    {
      heading: 'What the site does not do',
      paragraphs: [
        'The site has no accounts, newsletter, notifications, scheduling, or analytics.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can ask us to access, correct, or delete the details you submitted in a qualification inquiry by emailing [CONTACT_EMAIL].',
      ],
    },
  ],
};

export const termsDocument: LegalDocumentContent = {
  title: 'Terms',
  lastUpdated,
  sections: [
    {
      heading: 'About this website',
      paragraphs: [
        'This website is operated by [LEGAL_ENTITY] and provides information about Silicon Software and its services. By using the site you agree to these terms.',
      ],
    },
    {
      heading: 'Intelligent Briefing preview',
      paragraphs: [
        'The Intelligent Briefing preview is a non-production demonstration built from fixed sample content. It is provided without warranty of any kind. Do not enter client information into it.',
      ],
    },
    {
      heading: 'Qualification inquiries',
      paragraphs: [
        'Submitting a qualification inquiry creates no obligation for you or for Silicon Software. We review inquiries and may reply by email if they look like a fit.',
      ],
    },
    {
      heading: 'Engagements and pricing',
      paragraphs: [
        'Customization, discovery, build, and retainer work is governed by a separate written agreement signed by both parties.',
        'Published prices are starting prices. Paid discovery and complex customization are priced separately once the scope is defined.',
      ],
    },
    {
      heading: 'Product scope',
      paragraphs: [
        'Nothing on this site is a promise of customer workspaces, collaboration, approval, versioning, automated scheduling, or downstream workflow. Those capabilities are not part of the current product.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The content of this site, including the Silicon Software name and product descriptions, belongs to [LEGAL_ENTITY] or its licensors.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'To the fullest extent permitted by law, [LEGAL_ENTITY] is not liable for any loss arising from your use of this website or the fixed-content preview.',
      ],
    },
    {
      heading: 'Governing law and contact',
      paragraphs: [
        'These terms are governed by the laws of [JURISDICTION]. Questions about these terms can be sent to [CONTACT_EMAIL].',
      ],
    },
  ],
};
