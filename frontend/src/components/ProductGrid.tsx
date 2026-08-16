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
          setProducts((data.products ? data.products : data).slice(0, 3)); // Show only first 3
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
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-foreground/10 pb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
        {loading ? (
          <div className="col-span-full py-8 text-center text-sm tracking-widest text-foreground/50 uppercase">Loading...</div>
        ) : (
          products.map((p) => (
            <div key={p._id} className="group flex flex-col">
              <Link to={`/product/${p._id}`} className="relative aspect-[3/4] bg-muted/20 overflow-hidden mb-4 block">
                {p.isTrending && (
                  <div className="absolute top-3 left-3 z-10 bg-primary/90 backdrop-blur-sm text-background text-[10px] tracking-widest uppercase px-2 py-1 rounded-full">
                    Trending
                  </div>
                )}
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <WishlistButton product={p} />
                </div>
              </Link>
              <div className="flex flex-col justify-between flex-1">
                <Link to={`/product/${p._id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-sans text-sm tracking-wide text-foreground mb-1">{p.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-sans text-sm text-foreground/70">₹{p.price}</p>
                  <div className="flex items-center gap-1">
                    <Rating value={p.rating || 0} />
                    <span className="text-xs text-foreground/40">({p.numReviews || 0})</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-12 text-center md:hidden">
        <Link to="/shop" className="inline-block font-sans text-xs uppercase tracking-widest bg-foreground text-background px-8 py-4 hover:bg-primary transition-colors">
          View All
        </Link>
      </div>
    </section>
  );
}
