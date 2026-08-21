import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface Reel {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  product: Product;
}

const StyleFeedItem = ({ reel, isActive, isMuted, toggleMute }: { reel: Reel, isActive: boolean, isMuted: boolean, toggleMute: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMute();
  };

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden group rounded-xl`}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity duration-300">
        
        {/* Top/Center Controls */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && (
            <div className="bg-black/50 p-4 rounded-full text-white backdrop-blur-sm pointer-events-auto cursor-pointer transition-transform hover:scale-110" onClick={togglePlay}>
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="pointer-events-auto flex items-end justify-between w-full pb-2">
          <div className="flex-1 pr-4 flex flex-col">
            <div className="mb-4">
              <h3 className="font-display tracking-widest text-xl uppercase text-white leading-tight drop-shadow-md">{reel.product?.name}</h3>
              <p className="font-sans font-bold text-base text-white/90 drop-shadow-md mt-1">₹{reel.product?.price}</p>
            </div>
            
            <Link 
              to={`/product/${reel.product?._id}`}
              className="inline-flex justify-center items-center bg-white text-black font-sans font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-primary hover:text-white transition-colors w-full max-w-[240px]"
            >
              Shop Now &rarr;
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-end mb-1">
            <button 
              onClick={handleMuteToggle}
              className="p-3 bg-black/40 rounded-full text-white backdrop-blur-sm hover:bg-black/60 transition-colors border border-white/10"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StyleFeed = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [expandedReel, setExpandedReel] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch('/api/reels');
        if (response.ok) {
          const data = await response.json();
          setReels(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reels', error);
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  useEffect(() => {
    // Only setup intersection observer for mobile view where we have a vertical scroll container
    if (window.innerWidth >= 768 || expandedReel !== null) return;

    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            setActiveReelIndex(index);
          }
        }
      });
    }, options);

    itemRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [reels, expandedReel]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  if (loading) {
    return <div className="py-24 text-center tracking-widest uppercase text-sm">Loading Style Feed...</div>;
  }

  if (reels.length === 0) {
    return null;
  }

  return (
    <section id="style-feed" className="py-8 md:py-24 w-full overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto mb-6 md:mb-16">
        <h2 className="text-4xl md:text-6xl font-display tracking-tight text-foreground uppercase mb-2">
          Style<span className="text-primary">//</span>Feed
        </h2>
        <p className="font-sans text-xs md:text-sm tracking-widest uppercase font-bold text-foreground/50">
          Watch. Discover. Shop.
        </p>
      </div>

      {/* Mobile View: Vertical Snap Scrolling */}
      <div className="md:hidden">
        <div 
          ref={containerRef}
          className="w-full h-[75dvh] overflow-y-scroll snap-y snap-mandatory bg-background scroll-smooth px-4"
        >
          {reels.map((reel, index) => (
            <div 
              key={reel._id} 
              ref={(el) => { itemRefs.current[index] = el; }}
              className="w-full h-full snap-start snap-always pb-6"
            >
              <StyleFeedItem 
                reel={reel} 
                isActive={index === activeReelIndex} 
                isMuted={isMuted} 
                toggleMute={toggleMute}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View: Grid/Carousel */}
      <div className="hidden md:block px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
          {reels.map((reel, index) => (
            <div 
              key={reel._id}
              className="relative group cursor-pointer border-2 border-transparent hover:border-primary transition-colors overflow-hidden bg-black"
              onClick={() => {
                setExpandedReel(index);
                setActiveReelIndex(index);
              }}
            >
              <div className="aspect-[9/16] relative pointer-events-none">
                <video 
                  src={reel.videoUrl} 
                  poster={reel.thumbnailUrl} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  muted
                  loop
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                  onMouseOut={(e) => {
                    (e.target as HTMLVideoElement).pause();
                    (e.target as HTMLVideoElement).currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-black/50 p-4 rounded-full text-white backdrop-blur-sm">
                      <Play className="w-8 h-8 fill-current" />
                   </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h4 className="font-display tracking-widest uppercase text-sm">{reel.product?.name}</h4>
                  <p className="font-sans text-xs mt-1">₹{reel.product?.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Fullscreen Reel Viewer Modal */}
      {expandedReel !== null && (
        <div className="hidden md:flex fixed inset-0 z-[100] bg-black/95 backdrop-blur-md items-center justify-center">
          <button 
            onClick={() => setExpandedReel(null)}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          {expandedReel > 0 && (
            <button
              onClick={() => {
                setExpandedReel(expandedReel - 1);
                setActiveReelIndex(expandedReel - 1);
              }}
              className="absolute left-4 md:left-[calc(50%-280px)] p-3 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div className="relative w-full max-w-[400px] h-[85vh] rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
            <StyleFeedItem 
              reel={reels[expandedReel]} 
              isActive={true} 
              isMuted={isMuted} 
              toggleMute={toggleMute}
            />
          </div>

          {expandedReel < reels.length - 1 && (
            <button
              onClick={() => {
                setExpandedReel(expandedReel + 1);
                setActiveReelIndex(expandedReel + 1);
              }}
              className="absolute right-4 md:right-[calc(50%-280px)] p-3 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
