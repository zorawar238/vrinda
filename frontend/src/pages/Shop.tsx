import { useState, useEffect } from 'react';
import { WishlistButton } from '../components/WishlistButton';
import { Rating } from '../components/Rating';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatedPage } from '../components/AnimatedPage';
import { motion, Variants } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  isTrending?: boolean;
  rating?: number;
  numReviews?: number;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
    const sort = searchParams.get('sort');
    if (search !== null) {
      setSearchKeyword(search);
      setShowFilters(true);
    }
    if (sort !== null) {
      setSortOption(sort);
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
    <AnimatedPage className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-foreground/10 pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display tracking-tight text-foreground">
            All Products
          </h1>
          <p className="text-foreground/50 mt-2 font-sans text-sm tracking-wide">The entire collection.</p>
        </div>
        <div className="flex gap-4 font-sans text-xs tracking-widest uppercase text-foreground/70">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="border-b border-foreground/30 px-2 py-1 hover:border-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            Filter {showFilters ? '▲' : '▼'}
          </button>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-b border-foreground/30 px-2 py-1 bg-transparent outline-none cursor-pointer hover:border-foreground hover:text-foreground transition-colors appearance-none text-right"
          >
            <option value="">Sort: Featured</option>
            <option value="best">Best Sellers</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-12 bg-muted/10 border border-foreground/10 p-8 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Search Products</label>
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/30 py-2 outline-none focus:border-foreground transition-colors text-sm tracking-wide"
              />
            </div>
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Categories</label>
              <div className="flex flex-wrap gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory('')}
                  className={`px-5 py-2 border font-sans text-xs tracking-widest uppercase transition-colors ${selectedCategory === '' ? 'border-foreground bg-foreground text-background' : 'border-foreground/20 bg-transparent hover:border-foreground'}`}
                >
                  All
                </motion.button>
                {categories.map((cat) => (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 border font-sans text-xs tracking-widest uppercase transition-colors ${selectedCategory === cat ? 'border-foreground bg-foreground text-background' : 'border-foreground/20 bg-transparent hover:border-foreground'}`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
      >
        {loading ? (
          <div className="col-span-full py-8 text-center text-sm tracking-widest text-foreground/50 uppercase">Loading Catalog...</div>
        ) : error ? (
          <div className="col-span-full py-8 text-center text-sm tracking-widest text-red-500 uppercase">Database connection failed: {error}</div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-8 text-center text-sm tracking-widest text-foreground/50 uppercase">No products found.</div>
        ) : (
          products.map((p) => (
            <motion.div variants={item} key={p._id} className="group flex flex-col">
              <Link to={`/product/${p._id}`} className="relative aspect-[3/4] bg-muted/20 overflow-hidden mb-4 block">
                {p.isTrending && (
                  <div className="absolute top-3 left-3 z-10 bg-primary/90 backdrop-blur-sm text-background text-[10px] tracking-widest uppercase px-2 py-1 rounded-full">
                    Trending
                  </div>
                )}
                <img 
                  src={p.image} 
                  alt={p.name} 
                  loading="lazy"
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
            </motion.div>
          ))
        )}
      </motion.div>
    </AnimatedPage>
  );
}
