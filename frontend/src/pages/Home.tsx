import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { TrendingSection } from '../components/TrendingSection';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <TrendingSection />
      <CategoryGrid />
      <ProductGrid />
    </>
  );
}
