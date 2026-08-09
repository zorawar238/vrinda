export function About() {
  const dummyImg = "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        <div className="order-2 lg:order-1 border-4 border-foreground shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] bg-foreground overflow-hidden">
          <img 
            src={dummyImg} 
            alt="Vrinda Model" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4]"
          />
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <div className="inline-block bg-primary text-background font-bold px-4 py-2 border-2 border-foreground uppercase tracking-widest">
            Our Story
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none">
            Unapologetic <br />
            <span className="text-primary">Design.</span>
          </h1>
          
          <div className="space-y-6 text-xl font-medium max-w-lg">
            <p>
              Vrinda was born out of a desire to break the rules. We don't do subtle. We don't do quiet. We create bold, structured, high-contrast pieces for the new era of fashion in India.
            </p>
            <p>
              Every garment is a statement. Designed with sharp angles, heavy fabrics, and an attitude that refuses to be ignored.
            </p>
          </div>

          <div className="pt-8 border-t-4 border-foreground grid grid-cols-2 gap-8 font-bold uppercase">
            <div>
              <p className="text-4xl font-display text-primary">100%</p>
              <p>Designed in India</p>
            </div>
            <div>
              <p className="text-4xl font-display text-primary">0%</p>
              <p>Compromise</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
