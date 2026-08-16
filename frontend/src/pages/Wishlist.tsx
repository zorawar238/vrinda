import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Trash2 } from 'lucide-react';

export function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen animate-fade-in">
      <div className="flex justify-between items-end mb-12 border-b border-foreground/10 pb-6">
        <h1 className="text-4xl md:text-5xl font-display tracking-wide">My Wishlist</h1>
        <span className="font-sans text-xs tracking-widest uppercase text-foreground/50 mb-1">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-32 border border-foreground/10 bg-background/50">
          <p className="font-sans text-sm tracking-widest uppercase text-foreground/50 mb-8">Your wishlist is empty</p>
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-foreground text-background font-sans text-xs tracking-widest uppercase hover:bg-primary transition-colors"
          >
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div key={product._id} className="group relative">
              <div className="aspect-[2/3] relative bg-muted/20 overflow-hidden mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-4 right-4 p-2 text-foreground/50 hover:text-primary transition-colors z-10"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="flex flex-col">
                <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors mb-1">
                  <h3 className="font-sans text-sm tracking-wide leading-tight">{product.name}</h3>
                </Link>
                <div className="font-sans text-sm text-foreground/80 mb-6">₹{product.price.toFixed(2)}</div>
                
                <Link
                  to={`/product/${product._id}`}
                  className="w-full text-center py-3 border border-foreground/30 font-sans text-xs tracking-widest uppercase hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                >
                  View Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
