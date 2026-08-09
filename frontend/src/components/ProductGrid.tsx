export function ProductGrid() {
  const products = [
    { id: 1, name: "Oversized Graphic Tee", price: "₹1,299", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80", tag: "NEW" },
    { id: 2, name: "Utility Cargo Pants", price: "₹2,499", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80", tag: "HOT" },
    { id: 3, name: "Neon Crop Top", price: "₹899", img: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80" },
    { id: 4, name: "Mesh Overlay Dress", price: "₹3,199", img: "https://images.unsplash.com/photo-1515347619152-32c024ddf380?auto=format&fit=crop&q=80" },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16 border-b-4 border-foreground pb-4">
        <h2 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter">
          New Arrivals
        </h2>
        <a href="#" className="hidden md:inline-block font-bold text-xl uppercase hover:text-primary transition-colors">
          View All &rarr;
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <div key={p.id} className="group border-4 border-foreground bg-background shadow-brutal hover:-translate-y-2 hover:shadow-brutal-lg transition-all flex flex-col">
            <div className="relative aspect-[3/4] border-b-4 border-foreground bg-foreground overflow-hidden">
              {p.tag && (
                <div className="absolute top-4 left-4 z-10 bg-secondary text-foreground font-bold px-3 py-1 border-2 border-foreground uppercase">
                  {p.tag}
                </div>
              )}
              <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-background z-10">
              <div>
                <h3 className="font-bold text-lg uppercase leading-tight mb-2">{p.name}</h3>
                <p className="font-display font-bold text-2xl">{p.price}</p>
              </div>
              <button className="mt-6 w-full bg-primary text-background font-bold py-3 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase relative overflow-hidden group/btn">
                <span className="relative z-10">Add to Cart</span>
                <div className="absolute inset-0 bg-foreground scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center md:hidden">
        <a href="#" className="inline-block font-bold text-xl uppercase bg-foreground text-background px-8 py-4 border-4 border-foreground hover:bg-background hover:text-foreground transition-colors">
          View All
        </a>
      </div>
    </section>
  );
}
