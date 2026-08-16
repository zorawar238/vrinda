import { Link } from 'react-router-dom';

export function CategoryGrid() {
  return (
    <section className="bg-[#f4f4f2] py-24 px-6 md:px-12 relative border-b-2 border-foreground min-h-[800px] flex items-center justify-center overflow-hidden" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
    }}>
      
      {/* Decorative scribbles / circles behind main image */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[100px] border-[2px] border-secondary/80 rounded-[100%] rotate-[-15deg] z-0 hidden md:block" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}></div>
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[350px] h-[120px] border-[1px] border-secondary/60 rounded-[100%] rotate-[5deg] z-0 hidden md:block" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}></div>
      <div className="absolute top-[32%] left-[48%] -translate-x-1/2 w-[280px] h-[90px] border-[1.5px] border-dashed border-secondary/50 rounded-[100%] rotate-[-5deg] z-0 hidden md:block"></div>

      <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Left column: Detail shots */}
        <div className="md:col-span-3 flex flex-col gap-6 justify-center">
          <div className="border border-foreground/20 p-2 bg-background shadow-lg transform -rotate-2 relative">
            <img src="/featured/image2.png" alt="Detail 1" className="w-full aspect-[4/5] object-cover filter contrast-125 saturate-150" />
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
          </div>
          <div className="border border-foreground/20 p-2 bg-background shadow-lg transform rotate-3 relative w-4/5 mx-auto">
            <img src="/featured/image3.png" alt="Detail 2" className="w-full aspect-square object-cover filter contrast-125 saturate-150 object-top" />
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
          </div>
          <div className="border border-foreground/20 p-2 bg-background shadow-lg transform -rotate-1 relative">
            <img src="/featured/image2.png" alt="Detail 3" className="w-full aspect-[4/5] object-cover filter contrast-125 saturate-150 object-bottom" />
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
          </div>
        </div>

        {/* Center: Main Image */}
        <div className="md:col-span-5 relative flex justify-center items-end">
          <img 
            src="/featured/image1.png" 
            alt="Main Feature" 
            className="w-full max-w-[500px] h-auto object-cover z-10 drop-shadow-2xl filter contrast-110 saturate-150" 
          />
        </div>

        {/* Right column: Typography & Thumbnails */}
        <div className="md:col-span-4 flex flex-col justify-center items-end text-right gap-12 relative mt-12 md:mt-0 pt-12 md:pt-32">
          
          <div className="space-y-4 text-right">
            <h3 className="font-script text-6xl md:text-7xl text-secondary rotate-[-4deg] mr-8">collection 1</h3>
            
            {/* The film strip / thumbnails */}
            <div className="bg-secondary p-3 shadow-xl transform rotate-2 my-8 inline-flex">
              <div className="flex gap-2">
                <div className="border border-white/20"><img src="/featured/image1.png" className="w-20 h-24 md:w-24 md:h-28 object-cover filter contrast-125 saturate-150 object-top" /></div>
                <div className="border border-white/20"><img src="/featured/image2.png" className="w-20 h-24 md:w-24 md:h-28 object-cover filter contrast-125 saturate-150 object-center" /></div>
                <div className="border border-white/20"><img src="/featured/image3.png" className="w-20 h-24 md:w-24 md:h-28 object-cover filter contrast-125 saturate-150 object-center" /></div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 relative">
              <h3 className="font-script text-5xl md:text-6xl text-secondary rotate-[-2deg] mr-4 relative z-10">drop 2</h3>
              <div className="w-48 h-[3px] bg-secondary absolute bottom-1 -right-2 rotate-[-1deg] z-0"></div>
            </div>
          </div>

          <div className="mt-auto space-y-1 relative pr-4">
             <p className="font-sans italic text-lg text-foreground/80 lowercase line-through tracking-wider">vrinda red crop zip--</p>
             <p className="font-sans text-sm tracking-[0.4em] text-foreground/60">--2026--</p>
             <div className="w-full h-[1px] bg-foreground/30 absolute bottom-[-5px] right-0"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
