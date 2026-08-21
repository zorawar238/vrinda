import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WishlistButton } from './WishlistButton';
import { Rating } from './Rating';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  isTrending?: boolean;
  rating?: number;
  numReviews?: number;
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setProducts((data.products ? data.products : data).slice(0, 4)); // Show 4 on mobile, 3 on desktop
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-foreground/10 pb-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-display tracking-tight text-foreground">
            New Arrivals
          </h2>
          <p className="text-foreground/50 mt-2 font-sans text-sm tracking-wide">The latest styles to obsess over.</p>
        </div>
        <Link to="/shop" className="hidden md:inline-block font-sans text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors">
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-16">
        {loading ? (
          <div className="col-span-full py-8 text-center text-sm tracking-widest text-foreground/50 uppercase">Loading...</div>
        ) : (
          products.map((p, index) => (
            <div key={p._id} className={`group flex flex-col ${index === 3 ? 'md:hidden' : ''}`}>
              <Link to={`/product/${p._id}`} className="relative aspect-[3/4] bg-muted/20 overflow-hidden mb-2 md:mb-4 block">
                {p.isTrending && (
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-primary/90 backdrop-blur-sm text-background text-[9px] md:text-[10px] tracking-widest uppercase px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                    Trending
                  </div>
                )}
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <WishlistButton product={p} />
                </div>
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <Link to={`/product/${p._id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-sans text-[15px] md:text-sm tracking-wide text-foreground md:mb-1 leading-snug">{p.name}</h3>
                </Link>
                <div className="flex flex-col items-start mt-1 md:flex-row md:items-center md:justify-between md:mt-1">
                  <p className="font-sans text-[16px] font-semibold text-foreground md:text-sm md:font-normal md:text-foreground/70">₹{p.price}</p>
                  <div className="flex items-center gap-1 mt-0.5 md:mt-0 opacity-80 md:opacity-100 [&_svg]:w-[13px] [&_svg]:h-[13px] md:[&_svg]:w-5 md:[&_svg]:h-5">
                    <Rating value={p.rating || 0} />
                    <span className="text-[11px] opacity-50 md:text-xs md:opacity-100 text-foreground md:text-foreground/40">
                      <span className="md:hidden">
                        {p.numReviews === 0 ? 'No reviews' : `· ${p.numReviews}`}
                      </span>
                      <span className="hidden md:inline">({p.numReviews || 0})</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-16 text-center">
        <Link to="/shop" className="inline-block font-sans text-xs uppercase tracking-widest border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-colors">
          View All Products
        </Link>
      </div>
    </section>
  );
}
