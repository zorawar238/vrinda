import { Link } from 'react-router-dom';

export function BrandStory() {
  return (
    <section className="bg-background py-16 md:py-32 px-6 overflow-hidden relative border-b-2 border-foreground">
      {/* Cursive Overlay */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none text-secondary font-script text-5xl md:text-7xl -rotate-6 whitespace-nowrap opacity-90 mix-blend-multiply">
        Vrinda Collection
      </div>

      <div className="max-w-7xl mx-auto relative h-auto md:h-[60vh]">
        {/* Center Image */}
        <div className="absolute inset-x-0 bottom-0 md:inset-0 z-10 flex items-end md:items-center justify-center pointer-events-none">
           <img 
              src="/featured/brand_story_model.jpg"
              alt="Model in white dress"
              className="w-full md:w-auto h-[300px] md:h-full object-cover"
           />
           {/* Shop Now Overlay */}
           <div className="absolute bottom-10 z-30 pointer-events-auto">
             <Link to="/about" className="font-display uppercase text-2xl md:text-4xl text-background mix-blend-difference hover:text-secondary transition-colors tracking-widest">
                SHOP NOW
             </Link>
           </div>
        </div>

        {/* Text Layout */}
        <div className="relative z-20 flex flex-col md:flex-row justify-between h-full pt-10 pb-64 md:py-10">
          
          {/* Left Text Block */}
          <div className="w-full md:w-1/3 space-y-4 mb-8 md:mb-0">
             <h3 className="font-display text-2xl md:text-3xl uppercase tracking-widest text-foreground">
               Brand Story
             </h3>
             <p className="font-sans text-[10px] md:text-xs leading-tight text-foreground/80 tracking-wide">
               We believe fashion should be bold, unapologetic, and accessible. Every piece is designed in-house to bring you the best of international aesthetics with local craftsmanship. You're going to get noticed.
             </p>
          </div>

          {/* Right Text Block */}
          <div className="w-full md:w-1/3 flex flex-col justify-end space-y-4 md:text-right mt-16 md:mt-0">
             <h3 className="font-display text-2xl md:text-3xl uppercase tracking-widest text-foreground">
               Vrinda Signature
             </h3>
             <p className="font-sans text-[10px] md:text-xs leading-tight text-foreground/80 tracking-wide md:ml-auto">
               Impossible to ignore. A little dramatic, a little romantic, perfectly you. Designed to break the grid and make a statement.
             </p>
          </div>

        </div>
      </div>
    </section>
  );
}
