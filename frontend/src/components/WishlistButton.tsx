import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export function WishlistButton({ product }: { product: any }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <button
      onClick={handleToggle}
      className={`p-3 border-2 border-foreground hover:-translate-y-1 transition-all flex items-center justify-center shadow-brutal ${inWishlist ? 'bg-primary text-background shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]' : 'bg-background text-foreground hover:bg-secondary shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]'}`}
      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
    </button>
  );
}
