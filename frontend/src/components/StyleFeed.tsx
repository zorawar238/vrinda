import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

interface Reel {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const StyleFeed = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch('/api/reels?page=1&limit=4');
        if (response.ok) {
          const data = await response.json();
          setReels(data.reels ? data.reels : data.slice(0, 4));
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reels', error);
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  if (loading) {
    return <div className="py-24 text-center tracking-widest uppercase text-sm">Loading Style Feed...</div>;
  }

  if (reels.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-24 w-full overflow-hidden bg-background">
      <div className="px-6 max-w-7xl mx-auto mb-8">
        <h2 className="text-4xl md:text-6xl font-display tracking-tight text-foreground uppercase mb-2">
          Style<span className="text-primary">//</span>Feed
        </h2>
        <p className="font-sans text-xs md:text-sm tracking-widest uppercase font-bold text-foreground/50 mb-8">
          Watch. Discover. Shop.
        </p>

        {/* Desktop & Mobile Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {reels.map((reel) => (
            <Link 
              to={`/style-feed/${reel._id}`}
              key={reel._id}
              className="relative group cursor-pointer border border-transparent hover:border-primary transition-colors overflow-hidden bg-black aspect-[9/16] rounded-xl"
            >
              <video 
                src={reel.videoUrl} 
                poster={reel.thumbnailUrl} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                muted
                loop
                playsInline
                onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                onMouseOut={(e) => {
                  (e.target as HTMLVideoElement).pause();
                  (e.target as HTMLVideoElement).currentTime = 0;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 p-4 rounded-full text-white backdrop-blur-sm">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link 
            to="/style-feed"
            className="inline-block border border-foreground text-foreground px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-colors"
          >
            Enter Style//Feed &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
