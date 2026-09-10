import { Hero } from '@/components/sections/hero';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { ServicesGrid } from '@/components/sections/services-grid';

function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <ProductShowcase />
    </>
  );
}

export default HomePage;
