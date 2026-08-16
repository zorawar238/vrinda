import { Link } from 'react-router-dom';

export function Collections() {
  const collections = [
    {
      id: "summer-drop",
      title: "Summer 2026 Drop",
      subtitle: "Lightweight fabrics. Heavy impact.",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
      color: "bg-muted/30"
    },
    {
      id: "matrix-line",
      title: "The Midnight Edit",
      subtitle: "For plans that start at 8.",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80",
      color: "bg-foreground text-background"
    },
    {
      id: "neon-nights",
      title: "Vacation Girl",
      subtitle: "Catch flights, not feelings.",
      img: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80",
      color: "bg-primary/5"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 animate-fade-in">
      <div className="mb-16 border-b border-foreground/10 pb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-display tracking-wide mb-4">
          Curated <span className="italic text-primary">Edits</span>
        </h1>
        <p className="font-sans text-sm tracking-widest text-foreground/50 uppercase">Discover your aesthetic</p>
      </div>

      <div className="space-y-16">
        {collections.map((c) => (
          <Link 
            key={c.id} 
            to="/shop" 
            className={`group block overflow-hidden ${c.color} flex flex-col md:flex-row hover:shadow-elegant transition-shadow duration-500`}
          >
            <div className={`md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative z-10`}>
              <h2 className="text-3xl md:text-5xl font-display leading-tight tracking-wide mb-4">
                {c.title}
              </h2>
              <p className="text-sm font-sans tracking-wide opacity-80 mb-12">
                {c.subtitle}
              </p>
              
              <div className={`inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase border-b ${c.color.includes('bg-foreground') ? 'border-background/30 hover:border-background' : 'border-foreground/30 hover:border-foreground'} pb-2 self-start transition-colors`}>
                Explore Edit &rarr;
              </div>
            </div>
            
            <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
              <img 
                src={c.img} 
                alt={c.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
