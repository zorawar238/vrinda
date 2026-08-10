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
    <div className="group border-4 border-foreground bg-background shadow-brutal hover:-translate-y-2 hover:shadow-brutal-lg transition-all flex flex-col">
      <Link to={`/product/${id}`} className="relative aspect-[3/4] border-b-4 border-foreground bg-foreground overflow-hidden block">
        {isTrending && (
          <div className="absolute top-4 left-4 z-10 bg-secondary text-foreground font-bold px-3 py-1 border-2 border-foreground uppercase">
            HOT
          </div>
        )}
        <img src={image} alt={name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between bg-background z-10">
        <div>
          <Link to={`/product/${id}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-lg uppercase leading-tight mb-2">{name}</h3>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <Rating value={rating} />
            <span className="text-sm font-bold opacity-70">({numReviews})</span>
          </div>
          <p className="font-display font-bold text-2xl">₹{price}</p>
        </div>
        <div className="mt-6 flex gap-2">
          <Link to={`/product/${id}`} className="flex-grow text-center block bg-primary text-background font-bold py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase relative overflow-hidden group/btn">
            <span className="relative z-10">View Item</span>
            <div className="absolute inset-0 bg-foreground scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300"></div>
          </Link>
          <WishlistButton product={{ _id: id, name, price, image }} />
        </div>
      </div>
    </div>
  );
}
