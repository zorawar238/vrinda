import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  isTrending?: boolean;
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-foreground pb-4 gap-4">
        <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
          All <span className="text-primary">Products</span>
        </h1>
        <div className="flex gap-4 font-bold uppercase">
          <button className="border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors shadow-brutal">
            Filter +
          </button>
          <select className="border-2 border-foreground px-4 py-2 bg-transparent outline-none cursor-pointer shadow-brutal">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {loading ? (
          <h2 className="text-2xl font-bold col-span-full">LOADING CATALOG...</h2>
        ) : error ? (
          <h2 className="text-2xl font-bold text-red-500 col-span-full">DATABASE CONNECTION FAILED: {error}</h2>
        ) : products.length === 0 ? (
          <h2 className="text-2xl font-bold col-span-full">NO PRODUCTS FOUND.</h2>
        ) : (
          products.map((p) => (
            <div key={p._id} className="group border-4 border-foreground bg-background shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-all flex flex-col">
              <Link to={`/product/${p._id}`} className="relative aspect-[3/4] border-b-4 border-foreground bg-foreground overflow-hidden block">
                {p.isTrending && (
                  <div className="absolute top-4 left-4 z-10 bg-secondary text-foreground font-bold px-3 py-1 border-2 border-foreground uppercase">
                    HOT
                  </div>
                )}
                <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
              </Link>
              <div className="p-4 flex-1 flex flex-col justify-between bg-background z-10">
                <div>
                  <Link to={`/product/${p._id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-bold text-xl uppercase leading-tight mb-2">{p.name}</h3>
                  </Link>
                  <p className="font-display font-bold text-2xl">₹{p.price}</p>
                </div>
                <button className="mt-6 w-full bg-primary text-background font-bold py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase relative overflow-hidden group/btn">
                  <span className="relative z-10">Add to Cart</span>
                  <div className="absolute inset-0 bg-foreground scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300"></div>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
