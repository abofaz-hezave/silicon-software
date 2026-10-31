import { Button } from '@repo/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import Link from 'next/link';

import { intelligentBriefing } from '@/content/products';

import { Section } from './section';

function ProductShowcase() {
  return (
    <Section
      id="product"
      layout="split"
      tone="muted"
      gridClassName="gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)] lg:items-center"
      eyebrow={intelligentBriefing.eyebrow}
      title={intelligentBriefing.name}
      intro={
        <>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            {intelligentBriefing.description}
          </p>
          <p className="mt-5 leading-7">{intelligentBriefing.customization}</p>
          <Button asChild className="mt-8" size="lg">
            <Link href={intelligentBriefing.href}>See Intelligent Briefing</Link>
          </Button>
        </>
      }
    >
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-background/70 border-b">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-xl">Briefing preview</CardTitle>
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-[0.14em]">
              Sample
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {intelligentBriefing.previewItems.map((item) => (
            <div key={item.label} className="border-b pb-5 last:border-b-0 last:pb-0">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.14em]">
                {item.label}
              </p>
              <p className="mt-2 font-medium">{item.value}</p>
            </div>
          ))}
          <p className="text-muted-foreground border-t pt-5 text-sm leading-6">
            {intelligentBriefing.previewNote}
          </p>
        </CardContent>
      </Card>
    </Section>
  );
}

export { ProductShowcase };
