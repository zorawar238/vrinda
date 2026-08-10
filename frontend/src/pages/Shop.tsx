import { useState, useEffect } from 'react';
import { WishlistButton } from '../components/WishlistButton';
import { Rating } from '../components/Rating';
import { Link, useSearchParams } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  isTrending?: boolean;
  rating?: number;
  numReviews?: number;
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Filter & Sort State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categories', { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchKeyword(search);
      setShowFilters(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchKeyword) queryParams.append('search', searchKeyword);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (sortOption) queryParams.append('sort', sortOption);

        const response = await fetch(`/api/products?${queryParams.toString()}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products ? data.products : data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Add a slight debounce for searching
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchKeyword, selectedCategory, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-4 border-foreground pb-4 gap-4">
        <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
          All <span className="text-primary">Products</span>
        </h1>
        <div className="flex gap-4 font-bold uppercase">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors shadow-brutal flex items-center gap-2"
          >
            Filter {showFilters ? '▲' : '▼'}
          </button>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-2 border-foreground px-4 py-2 bg-transparent outline-none cursor-pointer shadow-brutal"
          >
            <option value="">Sort: Featured</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="mb-12 bg-secondary border-4 border-foreground p-6 shadow-brutal animate-fade-in-down">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block font-bold uppercase mb-2">Search Products</label>
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-background border-4 border-foreground p-3 outline-none focus:border-primary transition-colors font-bold"
              />
            </div>
            <div>
              <label className="block font-bold uppercase mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 border-2 border-foreground font-bold uppercase transition-colors ${selectedCategory === '' ? 'bg-foreground text-background' : 'bg-background hover:bg-secondary'}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 border-2 border-foreground font-bold uppercase transition-colors ${selectedCategory === cat ? 'bg-foreground text-background' : 'bg-background hover:bg-secondary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <div className="flex items-center gap-2 mb-2">
                    <Rating value={p.rating || 0} />
                    <span className="text-sm font-bold opacity-70">({p.numReviews || 0})</span>
                  </div>
                  <p className="font-display font-bold text-2xl">₹{p.price}</p>
                </div>
                <div className="mt-6 flex gap-2">
                  <Link to={`/product/${p._id}`} className="flex-grow text-center block bg-primary text-background font-bold py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase relative overflow-hidden group/btn">
                    <span className="relative z-10">View Details</span>
                    <div className="absolute inset-0 bg-foreground scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300"></div>
                  </Link>
                  <WishlistButton product={p} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
