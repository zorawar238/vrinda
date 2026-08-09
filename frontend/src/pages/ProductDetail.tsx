import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
}

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    
    if (product) {
      addToCart({
        id: `${product._id}-${selectedSize}`,
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: 1,
        img: product.image
      });
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20"><h2 className="text-4xl font-bold">LOADING ITEM...</h2></div>;
  if (error || !product) return <div className="max-w-7xl mx-auto px-6 py-20"><h2 className="text-4xl font-bold text-red-500">ERROR: {error}</h2><Link to="/shop" className="underline mt-4 block">Return to Shop</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-6">
          <div className="aspect-[3/4] border-4 border-foreground bg-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square border-2 border-foreground cursor-pointer hover:opacity-80 transition-opacity">
                 <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-8 border-b-4 border-foreground pb-8">
            <h1 className="text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter mb-4">
              {product.name}
            </h1>
            <p className="text-4xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="mb-8">
            <p className="text-xl font-medium leading-relaxed max-w-prose">
              {product.description}
            </p>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-display font-bold text-2xl uppercase">Size</h3>
              <button className="underline font-bold uppercase text-sm hover:text-primary transition-colors">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.sizes.map(s => (
                <button 
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 border-2 border-foreground font-bold text-lg uppercase transition-all ${
                    selectedSize === s 
                    ? 'bg-foreground text-background shadow-[4px_4px_0px_0px_rgba(255,0,127,1)]' 
                    : 'bg-background text-foreground hover:bg-secondary shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-background font-display font-bold text-3xl py-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] transition-all uppercase tracking-wide"
          >
            Add to Cart
          </button>
          
          <div className="mt-8 grid grid-cols-2 gap-4 border-t-4 border-foreground pt-8 font-bold uppercase">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary border-2 border-foreground rounded-full"></div>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary border-2 border-foreground rounded-full"></div>
              <span>7 Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
