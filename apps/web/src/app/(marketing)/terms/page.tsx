import { LegalDocument } from '@/components/layout/legal-document';
import { termsDocument } from '@/content/legal';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Terms',
  description:
    'Terms for using the Silicon Software website, the non-production Intelligent Briefing preview, qualification inquiries, and separately agreed engagements.',
  path: '/terms',
});

function TermsPage() {
  return <LegalDocument document={termsDocument} />;
}

export default TermsPage;
