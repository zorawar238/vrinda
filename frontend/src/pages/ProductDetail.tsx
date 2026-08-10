import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { Rating } from '../components/Rating';
import { ProductCard } from '../components/ProductCard';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
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
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        try {
          const relatedRes = await fetch(`/api/products/${id}/related`);
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      setReviewSuccess(true);
      setRating(5);
      setComment('');
      
      // Refetch product to get new review
      const productRes = await fetch(`/api/products/${id}`);
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
            <div className="flex items-center gap-4 mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} color="#ff4d00" />
            </div>
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

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-grow bg-primary text-background font-display font-bold text-3xl py-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] transition-all uppercase tracking-wide"
            >
              Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`px-8 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] transition-all flex items-center justify-center ${inWishlist ? 'bg-primary text-background' : 'bg-background text-foreground hover:bg-secondary'}`}
              title="Toggle Wishlist"
            >
              <Heart className={`w-8 h-8 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
          
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t-4 border-foreground pt-12">
          <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-12">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <div className="mt-20 border-t-4 border-foreground pt-12">
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-12">Reviews & Ratings</h2>
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Reviews List */}
          <div>
            <h3 className="text-2xl font-bold uppercase mb-6">Customer Reviews</h3>
            {product.reviews.length === 0 ? (
              <div className="bg-secondary text-foreground p-6 font-bold uppercase border-4 border-foreground">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-4 border-foreground p-6 bg-background shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                    <div className="flex justify-between items-center mb-4">
                      <strong className="font-bold uppercase text-xl">{review.name}</strong>
                      <Rating value={review.rating} />
                    </div>
                    <p className="text-foreground/80 font-medium">{review.createdAt.substring(0, 10)}</p>
                    <p className="mt-4 font-bold">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review */}
          <div>
            <h3 className="text-2xl font-bold uppercase mb-6">Write a Review</h3>
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="border-4 border-foreground p-8 bg-background shadow-brutal">
                {reviewSuccess && (
                  <div className="bg-primary text-background p-4 mb-6 font-bold uppercase border-4 border-foreground">
                    Review submitted successfully!
                  </div>
                )}
                {reviewError && (
                  <div className="bg-red-500 text-white p-4 mb-6 font-bold uppercase border-4 border-foreground">
                    {reviewError}
                  </div>
                )}
                <div className="mb-6">
                  <label className="block font-bold uppercase mb-2">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border-4 border-foreground p-4 bg-secondary font-bold uppercase focus:outline-none focus:bg-background transition-colors appearance-none"
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block font-bold uppercase mb-2">Comment</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border-4 border-foreground p-4 bg-secondary font-bold focus:outline-none focus:bg-background transition-colors"
                    placeholder="WRITE YOUR REVIEW HERE..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full bg-primary text-background font-bold text-xl py-4 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] transition-all uppercase disabled:opacity-50"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-secondary text-foreground p-6 font-bold uppercase border-4 border-foreground">
                Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to write a review.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
