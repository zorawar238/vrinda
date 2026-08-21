import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Volume2, VolumeX, ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';

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
  product?: Product;
  likes?: number;
  comments?: number;
  shares?: number;
}

const StylePost = ({ reel, isMuted, toggleMute, onNext, onPrev }: { reel: Reel, isMuted: boolean, toggleMute: () => void, onNext: () => void, onPrev: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Reset state when reel changes
  useEffect(() => {
    setIsLiked(false);
    setIsPlaying(true);
    setShowDetails(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.error("Auto-play prevented", e));
    }
  }, [reel._id]);

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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Style Feed Reel',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Touch handlers for mobile swipe
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].screenY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum pixels to be considered a swipe
    if (touchStartY.current - touchEndY.current > swipeThreshold) {
      // Swiped up -> Next Reel
      onNext();
    }
    if (touchEndY.current - touchStartY.current > swipeThreshold) {
      // Swiped down -> Previous Reel
      onPrev();
    }
  };

  return (
    <div 
      className={`relative w-full h-full bg-black overflow-hidden group rounded-none md:rounded-2xl border-0 md:border border-white/10`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4 px-4 opacity-100 transition-opacity duration-300">
        
        {/* Top Header inside Post */}
        <div className="pt-6 md:pt-8 flex justify-between items-center px-2 pointer-events-auto">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-display text-white text-xs tracking-widest border border-white/40">V</div>
             <span className="text-white font-sans text-xs tracking-widest uppercase font-bold drop-shadow-md">Vrinda Official</span>
          </div>
          <button 
             className="text-white/80 hover:text-white p-2 transition-colors"
             onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && (
            <div className="bg-black/50 p-4 rounded-full text-white backdrop-blur-sm pointer-events-auto cursor-pointer transition-transform hover:scale-110" onClick={togglePlay}>
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          )}
        </div>

        {/* Bottom Content Area */}
        <div className={`pointer-events-auto flex items-end justify-between w-full pb-2 transition-all duration-300 ${showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          
          {/* Caption & Product */}
          <div className="flex-1 pr-4 flex flex-col">
            {reel.caption && (
               <p className="font-sans text-sm text-white/90 drop-shadow-md mb-4 max-w-[90%] leading-relaxed">
                 {reel.caption}
               </p>
            )}

            {reel.product && (
              <div className="mb-2">
                <div className="mb-3">
                  <h3 className="font-display tracking-widest text-lg md:text-xl uppercase text-white leading-tight drop-shadow-md">{reel.product.name}</h3>
                  <p className="font-sans font-bold text-sm md:text-base text-white/90 drop-shadow-md mt-1">₹{reel.product.price}</p>
                </div>
                
                <Link 
                  to={`/product/${reel.product._id}`}
                  className="inline-flex justify-center items-center bg-white text-black font-sans font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary hover:text-white transition-colors w-full max-w-[200px]"
                >
                  Shop Now &rarr;
                </Link>
              </div>
            )}
          </div>
          
          {/* Social Actions (Right Side) */}
          <div className="flex flex-col items-center justify-end gap-6 mb-1">
            <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} className="flex flex-col items-center gap-1 group">
               <div className={`p-3 rounded-full backdrop-blur-sm transition-colors ${isLiked ? 'bg-pink-500/20' : 'bg-black/40 group-hover:bg-black/60'}`}>
                 <Heart className={`w-6 h-6 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
               </div>
               <span className="text-white text-[10px] font-sans font-bold">{((reel.likes || 0) + (isLiked ? 1 : 0)) || 'Like'}</span>
            </button>

            <button className="flex flex-col items-center gap-1 group" onClick={(e) => e.stopPropagation()}>
               <div className="p-3 bg-black/40 rounded-full text-white backdrop-blur-sm group-hover:bg-black/60 transition-colors">
                 <MessageCircle className="w-6 h-6" />
               </div>
               <span className="text-white text-[10px] font-sans font-bold">{reel.comments || 'Comment'}</span>
            </button>

            <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
               <div className="p-3 bg-black/40 rounded-full text-white backdrop-blur-sm group-hover:bg-black/60 transition-colors">
                 <Share2 className="w-6 h-6" />
               </div>
               <span className="text-white text-[10px] font-sans font-bold">{reel.shares || 'Share'}</span>
            </button>

            <button 
              onClick={handleMuteToggle}
              className="p-3 bg-black/40 rounded-full text-white backdrop-blur-sm hover:bg-black/60 transition-colors mt-2 border border-white/20"
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

export const StyleFeedPage = () => {
  const { reelId } = useParams();
  const navigate = useNavigate();

  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [direction, setDirection] = useState(0);

  // Determine current active reel index
  const currentIndex = reels.findIndex(r => r._id === reelId);
  const hasNext = currentIndex >= 0 && currentIndex < reels.length - 1;
  const hasPrev = currentIndex > 0;

  useEffect(() => {
    const fetchReels = async () => {
      try {
        // Fetch up to 100 reels for the feed order
        const response = await fetch(`/api/reels?limit=100`);
        if (response.ok) {
          const data = await response.json();
          const loadedReels = data.reels || data;
          setReels(loadedReels);
          
          if (loadedReels.length > 0 && !reelId) {
            // Redirect to first reel if no reel ID in URL
            navigate(`/style-feed/${loadedReels[0]._id}`, { replace: true });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reels', error);
        setLoading(false);
      }
    };
    fetchReels();
  }, [reelId, navigate]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setDirection(1);
      navigate(`/style-feed/${reels[currentIndex + 1]._id}`, { replace: true });
    }
  }, [hasNext, currentIndex, navigate, reels]);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setDirection(-1);
      navigate(`/style-feed/${reels[currentIndex - 1]._id}`, { replace: true });
    }
  }, [hasPrev, currentIndex, navigate, reels]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        handleNext();
      } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        handlePrev();
      } else if (e.key === 'Escape') {
        navigate('/'); // Back to home
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, navigate]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 1
    })
  };

  return (
    <AnimatedPage className="bg-black min-h-[100dvh] flex flex-col relative">
      {/* Feed Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black border-b border-white/10 px-4 py-4 flex items-center justify-between pointer-events-auto">
         <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-primary transition-colors text-xs font-sans tracking-widest uppercase font-bold">
            <ArrowLeft className="w-4 h-4" /> Back
         </button>
         <h1 className="text-lg md:text-2xl font-display tracking-widest uppercase italic absolute left-1/2 -translate-x-1/2 text-white">
            Style<span className="text-white/50">//</span>Feed
         </h1>
         <div className="w-16 text-right">
            <span className="text-white/50 text-[10px] tracking-widest uppercase">Explore</span>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full h-[100dvh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-white/50 text-sm tracking-widest uppercase">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            Loading Feed...
          </div>
        ) : reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-4 text-white">
             <h2 className="text-3xl font-display uppercase tracking-widest mb-4">Style//Feed</h2>
             <p className="text-white/50 tracking-widest text-sm uppercase">Nothing to show yet.<br/>Check back soon.</p>
          </div>
        ) : currentIndex === -1 && reelId ? (
          <div className="flex flex-col items-center justify-center text-center px-4 text-white">
             <h2 className="text-3xl font-display uppercase tracking-widest mb-4">Reel Not Found</h2>
             <button onClick={() => navigate(`/style-feed/${reels[0]._id}`, { replace: true })} className="border border-white text-white px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors">
               Back to Feed
             </button>
          </div>
        ) : currentIndex >= 0 ? (
          <div className="relative w-full h-[100dvh] md:w-[auto] md:h-[90vh] md:aspect-[9/16] flex flex-col md:my-auto md:shadow-2xl shadow-primary/10">
            
            {/* Desktop Navigation - Previous */}
            {hasPrev && (
               <button 
                  onClick={handlePrev} 
                  className="hidden md:flex absolute top-1/2 -left-20 -translate-y-1/2 w-12 h-12 rounded-full bg-white hover:bg-white/80 shadow-lg items-center justify-center text-black transition-colors"
                  title="Previous Reel"
               >
                  <ChevronUp className="w-6 h-6" />
               </button>
            )}

            {/* Active Reel */}
            <div className="w-full h-full relative overflow-hidden bg-black">
               {/* Preload adjacent videos for instant playback */}
               <div className="hidden">
                 {hasNext && <video preload="auto" src={reels[currentIndex + 1].videoUrl} />}
                 {hasPrev && <video preload="auto" src={reels[currentIndex - 1].videoUrl} />}
               </div>

               <AnimatePresence initial={false} custom={direction}>
                 <motion.div
                   key={reels[currentIndex]._id}
                   custom={direction}
                   variants={variants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                   className="absolute inset-0 w-full h-full"
                 >
                   <StylePost 
                      reel={reels[currentIndex]}
                      isMuted={isMuted}
                      toggleMute={toggleMute}
                      onNext={handleNext}
                      onPrev={handlePrev}
                   />
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Desktop Navigation - Next */}
            {hasNext && (
               <button 
                  onClick={handleNext} 
                  className="hidden md:flex absolute top-1/2 -right-20 -translate-y-1/2 w-12 h-12 rounded-full bg-white hover:bg-white/80 shadow-lg items-center justify-center text-black transition-colors"
                  title="Next Reel"
               >
                  <ChevronDown className="w-6 h-6" />
               </button>
            )}

          </div>
        ) : null}
      </div>
    </AnimatedPage>
  );
};
