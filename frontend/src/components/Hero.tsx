export function Hero() {
  return (
    <section className="relative border-b-4 border-foreground overflow-hidden bg-primary text-foreground">
      {/* Abstract Graphic Element */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polygon points="0,100 100,0 100,100" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 relative z-20">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-none tracking-tighter">
            Unapologetic<br/>
            <span className="text-background bg-foreground px-2 inline-block -rotate-2 mt-2">Fashion.</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-md">
            Bold styles for the new era. Stand out, be loud, and embrace the chaos.
          </p>
          <button className="bg-secondary text-foreground font-bold text-xl px-8 py-4 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all uppercase tracking-wide">
            Shop Collection
          </button>
        </div>

        <div className="relative z-10 px-4 md:px-0">
          {/* Brutalist image container */}
          <div className="aspect-[4/5] border-4 border-foreground bg-background shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
              alt="Fashion Model" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          {/* Sticker badge */}
          <div className="absolute -bottom-6 -left-2 md:-left-12 bg-secondary text-foreground font-display font-bold text-3xl uppercase p-6 border-4 border-foreground rounded-full -rotate-12 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:rotate-0 transition-transform">
            HOT!
          </div>
        </div>
      </div>
    </section>
  );
}
