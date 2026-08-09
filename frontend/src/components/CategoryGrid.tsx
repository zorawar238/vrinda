export function CategoryGrid() {
  const categories = [
    { name: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80", color: "bg-primary" },
    { name: "Tops", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80", color: "bg-secondary" },
    { name: "Bottoms", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80", color: "bg-foreground text-background" },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-b-4 border-foreground overflow-hidden">
      <h2 className="text-5xl md:text-7xl font-display font-bold uppercase mb-16 text-center">
        Shop By <span className="text-primary">Category</span>
      </h2>
      
      <div className="grid md:grid-cols-3 gap-12">
        {categories.map((cat) => (
          <div key={cat.name} className="group cursor-pointer relative">
            <div className={`absolute inset-0 ${cat.color} translate-x-4 translate-y-4 border-4 border-foreground transition-transform group-hover:translate-x-6 group-hover:translate-y-6`}></div>
            <div className="relative border-4 border-foreground bg-background aspect-[3/4] overflow-hidden flex flex-col justify-end z-10">
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-90 group-hover:opacity-100" />
              <div className="relative bg-background border-t-4 border-foreground p-6 z-10 flex justify-between items-center group-hover:bg-primary group-hover:text-background transition-colors">
                <h3 className="text-4xl font-display font-bold uppercase">{cat.name}</h3>
                <span className="text-4xl">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
