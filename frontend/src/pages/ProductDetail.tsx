import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { Rating } from '../components/Rating';
import { ProductCard } from '../components/ProductCard';
import { AnimatedPage } from '../components/AnimatedPage';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  sizes: string[];
  rating: number;
  numReviews: number;
  reviews: { _id: string; name: string; rating: number; comment: string; createdAt: string }[];
}

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setMainImage(data.image);

        // Fetch related products
        try {
          const relatedRes = await fetch(`/api/products/${id}/related`, { credentials: 'include' });
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedProducts(relatedData);
          }
        } catch (e) {
          console.error('Could not fetch related products', e);
        }

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
        _id: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        qty: 1,
        image: product.image
      });
    }
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      setReviewSuccess(true);
      setRating(5);
      setComment('');
      
      // Refetch product to get new review
      const productRes = await fetch(`/api/products/${id}`, { credentials: 'include' });
      if (productRes.ok) {
        const productData = await productRes.json();
        setProduct(productData);
      }
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const inWishlist = product ? isInWishlist(product._id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-20"><h2 className="text-4xl font-bold">LOADING ITEM...</h2></div>;
  if (error || !product) return <div className="max-w-7xl mx-auto px-6 py-20"><h2 className="text-4xl font-bold text-red-500">ERROR: {error}</h2><Link to="/shop" className="underline mt-4 block">Return to Shop</Link></div>;

  return (
    <AnimatedPage className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
        {/* Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[3/4] bg-muted/20 overflow-hidden w-full border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]"
          >
            <motion.img 
              key={mainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={mainImage || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </motion.div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {/* Primary Image Thumbnail */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-[3/4] bg-muted/20 cursor-pointer overflow-hidden border-2 transition-all ${mainImage === product.image ? 'border-primary' : 'border-foreground hover:opacity-80'}`}
                onClick={() => setMainImage(product.image)}
              >
                 <img src={product.image} alt="Thumbnail Primary" className="w-full h-full object-cover" />
              </motion.div>
              
              {/* Additional Images Thumbnails */}
              {product.images.map((img, idx) => (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={idx} 
                  className={`aspect-[3/4] bg-muted/20 cursor-pointer overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary' : 'border-foreground hover:opacity-80'}`}
                  onClick={() => setMainImage(img)}
                >
                   <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-display tracking-wide mb-4 text-foreground leading-snug">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="text-2xl font-sans text-foreground/80">₹{product.price.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="mb-10">
            <p className="text-sm font-sans tracking-wide leading-relaxed text-foreground/70 max-w-prose">
              <strong className="block font-display italic text-lg text-foreground mb-2">The Story</strong>
              {product.description}
            </p>
          </div>

          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-sans text-xs tracking-widest uppercase text-foreground/70">Size</h3>
              <button className="underline font-sans text-xs tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.sizes.map(s => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 border font-sans text-sm tracking-widest uppercase transition-colors ${
                    selectedSize === s 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-foreground/20 bg-transparent text-foreground hover:border-foreground'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-grow bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors"
            >
              Add to Bag
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
              className={`px-6 border transition-colors flex items-center justify-center ${inWishlist ? 'border-primary text-primary bg-primary/5' : 'border-foreground/20 text-foreground hover:border-foreground'}`}
              title="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-foreground/10 pt-8 font-sans text-xs tracking-widest uppercase text-foreground/60">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full"></div>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full"></div>
              <span>7 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-foreground/10 pt-16">
          <h2 className="text-3xl font-display tracking-wide mb-12 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard
                key={rp._id}
                id={rp._id}
                name={rp.name}
                price={rp.price}
                image={rp.image}
                rating={rp.rating}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-24 border-t border-foreground/10 pt-16">
        <h2 className="text-3xl font-display tracking-wide mb-12 text-center">Reviews & Ratings</h2>
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          
          {/* Reviews List */}
          <div>
            <h3 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-8">Customer Reviews</h3>
            {product.reviews.length === 0 ? (
              <div className="bg-muted/10 text-foreground/60 p-6 text-sm tracking-wide text-center">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              <div className="space-y-8">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-foreground/10 pb-6">
                    <div className="flex justify-between items-center mb-3">
                      <strong className="font-sans text-sm tracking-wide">{review.name}</strong>
                      <Rating value={review.rating} />
                    </div>
                    <p className="text-xs text-foreground/40 mb-3">{review.createdAt.substring(0, 10)}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review */}
          <div>
            <h3 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-8">Write a Review</h3>
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-6">
                {reviewSuccess && (
                  <div className="bg-primary/10 text-primary p-4 text-sm tracking-wide text-center">
                    Review submitted successfully!
                  </div>
                )}
                {reviewError && (
                  <div className="bg-red-500/10 text-red-500 p-4 text-sm tracking-wide text-center">
                    {reviewError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-foreground/70 mb-2">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors appearance-none"
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-widest uppercase text-foreground/70 mb-2">Comment</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-foreground/30 p-4 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                    placeholder="Write your review here..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-muted/10 text-foreground/60 p-6 text-sm tracking-wide text-center">
                Please <Link to="/login" className="text-foreground hover:text-primary transition-colors underline">sign in</Link> to write a review.
              </div>
            )}
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
}
