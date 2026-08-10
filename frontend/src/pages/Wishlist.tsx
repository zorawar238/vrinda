import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Trash2 } from 'lucide-react';

export function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-4 border-foreground pb-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase">My Wishlist</h1>
        <span className="text-2xl font-bold uppercase">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 border-4 border-foreground bg-secondary shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
          <h2 className="text-3xl font-bold uppercase mb-4">Your wishlist is empty</h2>
          <p className="mb-8 font-medium">Explore our shop and find something you love!</p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 bg-primary text-background font-black uppercase text-xl border-4 border-foreground hover:-translate-y-1 hover:shadow-brutal transition-all"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div key={product._id} className="group border-4 border-foreground bg-background hover:-translate-y-2 hover:shadow-brutal transition-all flex flex-col">
              <div className="aspect-[3/4] relative border-b-4 border-foreground overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="absolute top-4 right-4 p-2 bg-background border-2 border-foreground hover:bg-red-500 hover:text-white transition-colors z-10"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-lg uppercase leading-tight mb-2">{product.name}</h3>
                </Link>
                <div className="font-black text-xl mb-4 mt-auto">₹{product.price.toFixed(2)}</div>
                
                <Link
                  to={`/product/${product._id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background font-black uppercase border-4 border-transparent hover:bg-background hover:text-foreground hover:border-foreground transition-all mt-auto"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
