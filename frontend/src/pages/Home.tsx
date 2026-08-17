import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryGrid } from '../components/CategoryGrid';
import { TrendingSection } from '../components/TrendingSection';
import { BrandStory } from '../components/BrandStory';
import { AnimatedPage } from '../components/AnimatedPage';

export function Home() {
  return (
    <AnimatedPage className="flex flex-col gap-24 lg:gap-32 pb-24">
      <Hero />
      <TrendingSection />
      <CategoryGrid />
      <ProductGrid />
      <BrandStory />
    </AnimatedPage>
  );
}
