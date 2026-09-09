import { Hero } from '@/components/sections/hero';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Silicon Software — Intelligent Briefing',
  description:
    'Silicon Software is a software agency whose first product is Intelligent Briefing, which guides a marketing team from client information to a structured briefing.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}
