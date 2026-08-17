import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  numReviews?: number;
  isTrending?: boolean;
}

export function ProductCard({ id, name, price, image, rating = 0, numReviews = 0, isTrending = false }: ProductCardProps) {
  return (
    <div className="group flex flex-col">
      <Link to={`/product/${id}`} className="relative aspect-[3/4] bg-muted/20 overflow-hidden mb-4 block">
        {isTrending && (
          <div className="absolute top-3 left-3 z-10 bg-primary/90 backdrop-blur-sm text-background text-[10px] tracking-widest uppercase px-2 py-1 rounded-full">
            Trending
          </div>
        )}
        <img 
          src={image} 
          alt={name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton product={{ _id: id, name, price, image }} />
        </div>
      </Link>
      <div className="flex flex-col justify-between flex-1">
        <Link to={`/product/${id}`} className="hover:text-primary transition-colors">
          <h3 className="font-sans text-sm tracking-wide text-foreground mb-1">{name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <p className="font-sans text-sm text-foreground/70">₹{price}</p>
          <div className="flex items-center gap-1">
            <Rating value={rating} />
            <span className="text-xs text-foreground/40">({numReviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
