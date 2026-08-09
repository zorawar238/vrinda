export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t-8 border-primary">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h2 className="text-6xl font-display font-bold uppercase tracking-widest text-primary">Vrinda</h2>
          <p className="font-medium max-w-sm">
            Unapologetic fashion for the bold. Designed in India for the new era.
          </p>
        </div>
        
        <div>
          <h3 className="font-display font-bold text-2xl uppercase mb-6 text-secondary">Shop</h3>
          <ul className="space-y-4 font-medium uppercase">
            <li><a href="#" className="hover:text-primary transition-colors block">New Arrivals</a></li>
            <li><a href="#" className="hover:text-primary transition-colors block">Best Sellers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors block">Collections</a></li>
            <li><a href="#" className="hover:text-primary transition-colors block">Sale</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-2xl uppercase mb-6 text-secondary">Help</h3>
          <ul className="space-y-4 font-medium uppercase">
            <li><a href="#" className="hover:text-primary transition-colors block">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors block">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-primary transition-colors block">Track Order</a></li>
            <li><a href="#" className="hover:text-primary transition-colors block">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-bold text-2xl uppercase mb-6 text-secondary">Stay Bold</h3>
          <p className="mb-4 font-medium">Join the club for 10% off your first order.</p>
          <div className="flex border-4 border-background focus-within:border-primary transition-colors">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="bg-transparent px-4 py-3 w-full outline-none placeholder:text-gray-400 font-bold uppercase"
            />
            <button className="bg-primary text-foreground font-bold px-6 uppercase hover:bg-secondary transition-colors border-l-4 border-background">
              Go
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t-4 border-background/20 py-6 text-center font-bold uppercase text-sm">
        <p>&copy; {new Date().getFullYear()} Vrinda. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
