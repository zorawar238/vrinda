import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] md:min-h-0 md:h-[90vh] bg-background overflow-hidden flex flex-col items-center justify-start pt-24 pb-12 px-4 md:px-0 md:pt-0 md:pb-0 md:block">
      
      {/* VRINDA */}
      <motion.div 
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="order-1 relative md:absolute z-20 w-full md:w-auto text-center md:text-left md:top-12 md:left-12 text-[14vw] sm:text-[12vw] md:text-[12vw] font-display text-secondary leading-none tracking-tighter uppercase select-none pointer-events-none mb-6 md:mb-0"
      >
        VRINDA
      </motion.div>

      {/* Top Right Paragraph (Moved to order 2 for mobile) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="order-2 relative md:absolute z-30 md:top-24 md:right-12 w-[90%] max-w-[320px] md:w-48 text-center md:text-right text-sm md:text-xs text-foreground font-sans leading-tight tracking-wide pointer-events-auto mb-8 md:mb-0"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
      </motion.div>

      {/* Foreground image - Model */}
      <motion.img 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
        src="/hero.png" 
        alt="Fashion Model" 
        className="order-3 relative md:absolute z-10 md:inset-0 md:m-auto w-[min(90vw,420px)] md:w-auto h-auto md:h-[90%] aspect-[3/4] md:aspect-auto object-cover drop-shadow-2xl pointer-events-none mb-8 md:mb-0"
      />

      {/* Shop Now Box */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="order-4 relative md:absolute z-30 md:top-1/3 md:left-24 pointer-events-auto mb-10 md:mb-0"
      >
        <Link to="/shop" className="inline-block border border-foreground text-foreground px-8 py-4 md:px-6 md:py-3 font-sans text-sm md:text-xs uppercase tracking-widest hover:scale-110 transition-transform duration-300 bg-background">
          SHOP NOW
        </Link>
      </motion.div>

      {/* Bottom Left Bold Overlay (AVANT) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="order-5 relative md:absolute z-30 md:bottom-24 md:left-24 text-[clamp(4rem,15vw,6rem)] md:text-6xl lg:text-8xl font-display text-secondary leading-none tracking-tighter uppercase select-none pointer-events-none text-center md:text-left -mb-4 md:mb-0"
      >
        AVANT
      </motion.div>

      {/* COLLECTION */}
      <motion.div 
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        className="order-6 relative md:absolute z-20 md:bottom-12 md:right-12 w-full md:w-auto text-center md:text-right text-[14vw] sm:text-[12vw] md:text-[12vw] font-display text-secondary leading-none tracking-tighter uppercase select-none pointer-events-none"
      >
        COLLECTION
      </motion.div>

      {/* Floating Text 2025 (Hidden on mobile to keep clean composition) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="hidden md:block absolute top-1/2 left-12 -rotate-90 origin-bottom-left text-xs font-sans tracking-widest uppercase font-bold z-30 pointer-events-none"
      >
        2025
      </motion.div>

      {/* Floating Script Overlay (Hidden on mobile to keep clean composition) */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="hidden md:block absolute bottom-1/4 right-32 text-6xl md:text-8xl font-script text-foreground -rotate-6 select-none z-30 pointer-events-none"
      >
        Signature
      </motion.div>

    </section>
  );
}
