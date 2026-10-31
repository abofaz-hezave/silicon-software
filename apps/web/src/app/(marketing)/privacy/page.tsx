import { LegalDocument } from '@/components/layout/legal-document';
import { privacyDocument } from '@/content/legal';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Privacy',
  description:
    'How Silicon Software handles qualification inquiries, the fixed-content Intelligent Briefing preview, and technical data on this website.',
  path: '/privacy',
});

function PrivacyPage() {
  return <LegalDocument document={privacyDocument} />;
}

export default PrivacyPage;
