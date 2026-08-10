import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

export function Rating({ value, text, color = '#111' }: RatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-primary">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star className="w-5 h-5 fill-current" style={{ color }} />
            ) : value >= index - 0.5 ? (
              <StarHalf className="w-5 h-5 fill-current" style={{ color }} />
            ) : (
              <Star className="w-5 h-5" style={{ color }} />
            )}
          </span>
        ))}
      </div>
      {text && <span className="font-bold text-sm uppercase">{text}</span>}
    </div>
  );
}
