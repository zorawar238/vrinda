import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative w-full h-[90vh] bg-background overflow-hidden flex items-center justify-center">
      {/* Background Typography */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-12 pointer-events-none">
        <div className="text-[15vw] md:text-[12vw] font-display text-secondary leading-none tracking-tighter uppercase select-none">
          VRINDA
        </div>
        <div className="text-[15vw] md:text-[12vw] font-display text-secondary leading-none tracking-tighter uppercase text-right select-none">
          COLLECTION
        </div>
      </div>

      {/* Foreground image - Model */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <img 
          src="/hero.png" 
          alt="Fashion Model" 
          className="h-[80%] md:h-[90%] w-auto object-cover drop-shadow-2xl"
        />
      </div>

      {/* Floating Elements / UI */}
      <div className="absolute inset-0 z-30 container mx-auto px-6 pointer-events-none">
        
        {/* Top Right Paragraph */}
        <div className="absolute top-12 right-6 md:right-12 md:top-24 w-48 text-[10px] md:text-xs text-foreground font-sans text-right leading-tight tracking-wide pointer-events-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
        </div>

        {/* Shop Now Box */}
        <div className="absolute top-1/3 left-6 md:left-24 pointer-events-auto">
          <Link to="/shop" className="inline-block border border-foreground text-foreground px-6 py-3 font-sans text-xs uppercase tracking-widest hover:scale-110 transition-transform duration-300 bg-background">
            SHOP NOW
          </Link>
        </div>

        {/* Floating Text 2025 */}
        <div className="absolute top-1/2 left-6 md:left-12 -rotate-90 origin-bottom-left text-xs font-sans tracking-widest uppercase font-bold">
          2025
        </div>

        {/* Floating Script Overlay */}
        <div className="absolute bottom-1/4 right-4 md:right-32 text-6xl md:text-8xl font-script text-foreground -rotate-6 select-none opacity-90">
          Signature
        </div>

        {/* Bottom Left Bold Overlay */}
        <div className="absolute bottom-12 left-6 md:bottom-24 md:left-24 text-6xl md:text-8xl font-display text-secondary leading-none tracking-tighter uppercase select-none pointer-events-none">
          AVANT
        </div>
      </div>
    </section>
  );
}
