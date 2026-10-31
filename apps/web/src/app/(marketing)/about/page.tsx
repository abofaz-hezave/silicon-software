import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

import { DeliveryProcess } from '@/components/sections/delivery-process';
import { FounderBackground } from '@/components/sections/founder-background';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'About',
  description:
    'Silicon Software is a founder-led agency. Learn who delivers the work and how an engagement progresses from first conversation to delivery.',
  path: '/about',
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-24 lg:px-8">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.16em]">About</p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
          A small, founder-led team building practical AI customization.
        </h1>
        <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-8">
          Silicon Software customizes Intelligent Briefing for marketing teams. The founder who
          shapes the product also qualifies each opportunity and stays close to the work.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/services">View services and pricing</Link>
          </Button>
          <Button asChild>
            <Link href="/qualification">Discuss your workflow</Link>
          </Button>
        </div>
      </section>
      <FounderBackground />
      <DeliveryProcess />
    </>
  );
}

export default AboutPage;
