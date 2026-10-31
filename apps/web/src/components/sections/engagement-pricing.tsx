import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

import { type EngagementPrice, engagementOffers } from '@/content/engagement-pricing';

import { Section } from './section';

const priceFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

function formatPrice(price: EngagementPrice) {
  if (price.kind === 'separate') {
    return { label: 'Separately priced', detail: price.note };
  }

  return {
    label: `From ${priceFormatter.format(price.amountEur)}${price.period === 'month' ? ' per month' : ''}`,
    detail: null,
  };
}

function EngagementPricing() {
  return (
    <Section
      id="engagement-pricing"
      eyebrow="Engagements"
      title="Starting prices, with separately priced discovery and customization."
    >
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {engagementOffers.map((offer) => {
          const price = formatPrice(offer.price);

          return (
            <li key={offer.title} className="bg-card flex flex-col gap-4 rounded-xl border p-6">
              <h3 className="text-lg font-semibold">{offer.title}</h3>
              <p className="text-muted-foreground text-sm leading-6">{offer.description}</p>
              <div className="mt-auto flex flex-col gap-4">
                <div>
                  <p className="font-display text-2xl font-semibold">{price.label}</p>
                  {price.detail ? (
                    <p className="text-muted-foreground mt-1 text-xs">{price.detail}</p>
                  ) : null}
                </div>
                <Button asChild variant="outline" className="w-fit">
                  <Link href="/qualification">Discuss this engagement</Link>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export { EngagementPricing };
