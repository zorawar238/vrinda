import { Link } from 'react-router-dom';

export function Collections() {
  const collections = [
    {
      id: "summer-drop",
      title: "Summer 2026 Drop",
      subtitle: "Lightweight fabrics. Heavy impact.",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
      color: "bg-primary"
    },
    {
      id: "matrix-line",
      title: "The Matrix Line",
      subtitle: "Monochrome structure for the bold.",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80",
      color: "bg-secondary"
    },
    {
      id: "neon-nights",
      title: "Neon Nights",
      subtitle: "Stand out in the dark.",
      img: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80",
      color: "bg-foreground"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16 border-b-4 border-foreground pb-4">
        <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
          Curated <span className="text-primary">Collections</span>
        </h1>
      </div>

      <div className="space-y-12">
        {collections.map((c) => (
          <Link 
            key={c.id} 
            to="/shop" 
            className={`group block border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-all overflow-hidden ${c.color === 'bg-foreground' ? 'text-background' : 'text-foreground'} bg-background flex flex-col md:flex-row`}
          >
            <div className={`md:w-1/2 p-8 md:p-16 flex flex-col justify-center ${c.color} border-b-4 md:border-b-0 md:border-r-4 border-foreground relative z-10`}>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-4 group-hover:scale-105 origin-left transition-transform duration-300">
                {c.title}
              </h2>
              <p className="text-xl md:text-2xl font-medium">
                {c.subtitle}
              </p>
              
              <div className={`mt-12 inline-flex items-center gap-2 font-bold uppercase border-2 ${c.color === 'bg-foreground' ? 'border-background hover:bg-background hover:text-foreground' : 'border-foreground hover:bg-foreground hover:text-background'} px-6 py-3 self-start transition-colors`}>
                Explore Collection &rarr;
              </div>
            </div>
            
            <div className="md:w-1/2 relative bg-foreground h-64 md:h-auto">
              <img 
                src={c.img} 
                alt={c.title} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
