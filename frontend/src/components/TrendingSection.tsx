import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WishlistButton } from './WishlistButton';
import { Rating } from './Rating';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  isTrending?: boolean;
  rating?: number;
  numReviews?: number;
}

export function TrendingSection() {
  const [trendingItems, setTrendingItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/products', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          // Filter to only items where isTrending is true, take top 2
          const trending = (data.products ? data.products : data).filter((p: Product) => p.isTrending).slice(0, 2);
          setTrendingItems(trending);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <section className="bg-secondary text-foreground py-20 px-6 border-b-4 border-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Flame className="w-12 h-12 text-primary fill-primary animate-pulse" />
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight">
            What's Trending <span className="text-background bg-foreground px-2">Now</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {loading ? (
            <div className="col-span-full py-8 font-bold text-xl">IGNITING TRENDS...</div>
          ) : (
            trendingItems.map((item) => (
              <div key={item._id} className="group flex flex-col lg:flex-row border-4 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] transition-all hover:-translate-y-2">
                <Link to={`/product/${item._id}`} className="lg:w-2/5 border-b-4 lg:border-b-0 lg:border-r-4 border-foreground relative overflow-hidden bg-foreground block">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover aspect-square lg:aspect-auto grayscale hover:grayscale-0 transition-all duration-300" />
                  <div className="absolute top-4 left-4 bg-primary text-background font-bold px-3 py-1 border-2 border-foreground uppercase flex items-center gap-2">
                    <Flame className="w-4 h-4" /> TRENDING
                  </div>
                </Link>
                
                <div className="p-8 lg:w-3/5 flex flex-col justify-center bg-background relative z-10">
                  <div className="mb-4 inline-block bg-red-600 text-white font-bold px-3 py-1 border-2 border-foreground uppercase text-sm animate-pulse w-fit shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                    Only {item.stock} stock left!
                  </div>
                  <Link to={`/product/${item._id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-display font-bold text-4xl uppercase mb-2 leading-tight">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <Rating value={item.rating || 0} />
                    <span className="text-sm font-bold opacity-70">({item.numReviews || 0})</span>
                  </div>
                  <p className="font-bold text-2xl text-primary mb-8">₹{item.price}</p>
                  <div className="flex gap-2">
                    <Link to={`/product/${item._id}`} className="flex-grow text-center bg-foreground text-background font-bold py-4 border-4 border-foreground hover:bg-background hover:text-foreground transition-colors uppercase text-xl">
                      Snag it Now
                    </Link>
                    <div className="flex items-center">
                      <WishlistButton product={item} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
