import { Hero } from '@/components/sections/hero';
import { DeliveryProcess } from '@/components/sections/delivery-process';
import { Faq } from '@/components/sections/faq';
import { FounderBackground } from '@/components/sections/founder-background';
import { QualificationCta } from '@/components/sections/qualification-cta';
import { ServicesGrid } from '@/components/sections/services-grid';
import { TechnicalEvidence } from '@/components/sections/technical-evidence';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Intelligent Briefing customization for marketing teams',
  description:
    'Silicon Software customizes Intelligent Briefing to turn client information into clear, structured briefings.',
  path: '/',
});

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Silicon Software',
  url: env.NEXT_PUBLIC_SITE_URL,
  description:
    'Silicon Software customizes Intelligent Briefing to turn client information into clear, structured briefings.',
};

function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Hero />
      <ServicesGrid />
      <TechnicalEvidence />
      <DeliveryProcess />
      <FounderBackground />
      <QualificationCta />
      <Faq />
    </>
  );
}
export default HomePage;
