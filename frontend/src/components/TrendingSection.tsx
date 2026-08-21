import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
          // Filter to only items where isTrending is true, take top 3
          const trending = (data.products ? data.products : data).filter((p: Product) => p.isTrending).slice(0, 3);
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
    <section className="w-full bg-secondary py-6 px-4 md:px-8 border-y-2 border-foreground overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 md:min-h-[75vh]">
        
        {/* Left side: Products and Image Blocks */}
        <div className="md:col-span-9 flex flex-col gap-4">
          {/* Top row: 3 Product Boxes */}
          <div className={`grid grid-cols-1 gap-4 flex-1 ${
            trendingItems.length === 1 ? 'md:grid-cols-1' : 
            trendingItems.length === 2 ? 'md:grid-cols-2' : 
            'md:grid-cols-3'
          }`}>
            {loading ? (
               <div className="col-span-full text-background font-sans">Loading...</div>
            ) : (
               trendingItems.map((item) => (
                  <div key={item._id} className="bg-background border-2 border-foreground relative group flex flex-col aspect-[4/5] md:aspect-auto md:h-full overflow-hidden">
                    <Link to={`/product/${item._id}`} className="absolute inset-0 z-10"></Link>
                    <div className="absolute top-4 left-4 font-display text-foreground text-sm uppercase tracking-widest z-20">
                      / {item.name.substring(0, 15)}...
                    </div>
                    <div className="flex-1 p-4 pt-12 md:p-8 md:mt-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover md:w-auto md:h-auto md:max-h-full md:object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="absolute bottom-4 right-4 z-20">
                      <div className="bg-secondary text-background p-2 rounded-none hover:bg-foreground transition-colors cursor-pointer shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
               ))
            )}
          </div>
        </div>

        {/* Right side: Editorial Graphic */}
        <div className="hidden md:flex md:col-span-3 border-2 border-foreground bg-background items-center justify-center relative overflow-hidden">
          
          {/* Repeating Background Text */}
          <div className="absolute inset-0 flex flex-col justify-center translate-y-12 pl-2">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="font-display text-[100px] lg:text-[130px] xl:text-[160px] text-secondary leading-[0.75] tracking-tighter uppercase select-none">
                VRINDA
              </span>
            ))}
          </div>


          {/* Footer Signature */}
          <div className="absolute bottom-6 left-0 w-full text-center z-20">
            <span className="font-sans text-xs text-secondary font-bold tracking-widest uppercase bg-background px-4 py-1 border border-secondary">
              Creation By @vrinda_official
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
