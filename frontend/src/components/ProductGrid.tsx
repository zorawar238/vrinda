import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  isTrending?: boolean;
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.slice(0, 4)); // Show only first 4
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
      <div className="flex justify-between items-end mb-16 border-b-4 border-foreground pb-4">
        <h2 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter">
          New Arrivals
        </h2>
        <Link to="/shop" className="hidden md:inline-block font-bold text-xl uppercase hover:text-primary transition-colors">
          View All &rarr;
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full py-8 font-bold">LOADING NEW ARRIVALS...</div>
        ) : (
          products.map((p) => (
            <div key={p._id} className="group border-4 border-foreground bg-background shadow-brutal hover:-translate-y-2 hover:shadow-brutal-lg transition-all flex flex-col">
              <Link to={`/product/${p._id}`} className="relative aspect-[3/4] border-b-4 border-foreground bg-foreground overflow-hidden block">
                {p.isTrending && (
                  <div className="absolute top-4 left-4 z-10 bg-secondary text-foreground font-bold px-3 py-1 border-2 border-foreground uppercase">
                    HOT
                  </div>
                )}
                <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
              </Link>
              <div className="p-4 flex-1 flex flex-col justify-between bg-background z-10">
                <div>
                  <Link to={`/product/${p._id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-bold text-lg uppercase leading-tight mb-2">{p.name}</h3>
                  </Link>
                  <p className="font-display font-bold text-2xl">₹{p.price}</p>
                </div>
                <Link to={`/product/${p._id}`} className="mt-6 w-full text-center block bg-primary text-background font-bold py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase relative overflow-hidden group/btn">
                  <span className="relative z-10">View Item</span>
                  <div className="absolute inset-0 bg-foreground scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300"></div>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-12 text-center md:hidden">
        <Link to="/shop" className="inline-block font-bold text-xl uppercase bg-foreground text-background px-8 py-4 border-4 border-foreground hover:bg-background hover:text-foreground transition-colors">
          View All
        </Link>
      </div>
    </section>
  );
}
