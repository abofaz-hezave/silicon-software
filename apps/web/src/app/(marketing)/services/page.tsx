import { EngagementPricing } from '@/components/sections/engagement-pricing';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Services and pricing',
  description:
    'Intelligent Briefing setup from €2,500 and product retainers from €1,000 per month. Discovery and complex customization are priced separately.',
  path: '/services',
});

function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-24 lg:px-8">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">Services</p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Fixed-scope customization, with discovery before larger builds.
        </h1>
        <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-8">
          Most teams begin with a fixed-scope Intelligent Briefing setup. Paid discovery defines the
          right shape for anything larger, and ongoing product retainers keep the briefing workflow
          current.
        </p>
      </section>
      <EngagementPricing />
    </>
  );
}

export default ServicesPage;
