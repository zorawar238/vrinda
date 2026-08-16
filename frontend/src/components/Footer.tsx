import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-background border-t border-foreground/10 pt-20 pb-10 text-foreground">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="text-4xl font-display italic tracking-widest hover:text-primary transition-colors block">Vrinda</Link>
          <p className="font-sans text-sm text-foreground/70 max-w-sm leading-relaxed">
            Unapologetic fashion for the bold. Designed in India for the new era.
          </p>
        </div>
        
        <div>
          <h3 className="font-sans text-xs tracking-[0.2em] uppercase mb-6 text-foreground/50">Shop</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/shop" className="hover:text-primary transition-colors block">New Arrivals</Link></li>
            <li><Link to="/shop?sort=best" className="hover:text-primary transition-colors block">Best Sellers</Link></li>
            <li><Link to="/collections" className="hover:text-primary transition-colors block">Collections</Link></li>
            <li><Link to="/shop?category=sale" className="hover:text-primary transition-colors block">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs tracking-[0.2em] uppercase mb-6 text-foreground/50">Help</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/faq" className="hover:text-primary transition-colors block">FAQ</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-primary transition-colors block">Shipping & Returns</Link></li>
            <li><Link to="/track-order" className="hover:text-primary transition-colors block">Track Order</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors block">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs tracking-[0.2em] uppercase mb-6 text-foreground/50">Stay Bold</h3>
          <p className="mb-4 text-sm text-foreground/70">Join the club for 10% off your first order.</p>
          <div className="flex border-b border-foreground/30 focus-within:border-foreground transition-colors pb-2">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              className="bg-transparent w-full outline-none placeholder:text-foreground/30 text-sm tracking-wide"
            />
            <button className="text-foreground text-sm uppercase tracking-widest hover:text-primary transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-foreground/10 pt-8 text-center text-xs text-foreground/40 tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Vrinda. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
