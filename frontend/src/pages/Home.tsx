import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryGrid } from '../components/CategoryGrid';
import { TrendingSection } from '../components/TrendingSection';
import { BrandStory } from '../components/BrandStory';

export function Home() {
  return (
    <div className="flex flex-col gap-24 lg:gap-32 pb-24">
      <Hero />
      <TrendingSection />
      <CategoryGrid />
      <ProductGrid />
      <BrandStory />
    </div>
  );
}
