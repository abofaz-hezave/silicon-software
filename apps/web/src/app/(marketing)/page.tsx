import { Hero } from '@/components/sections/hero';
import { DeliveryProcess } from '@/components/sections/delivery-process';
import { Faq } from '@/components/sections/faq';
import { FounderBackground } from '@/components/sections/founder-background';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { QualificationCta } from '@/components/sections/qualification-cta';
import { ServicesGrid } from '@/components/sections/services-grid';
import { TechnicalEvidence } from '@/components/sections/technical-evidence';

function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <ProductShowcase />
      <TechnicalEvidence />
      <DeliveryProcess />
      <FounderBackground />
      <QualificationCta />
      <Faq />
    </>
  );
}
export default HomePage;
