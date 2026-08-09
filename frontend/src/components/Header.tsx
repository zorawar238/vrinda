import { ShoppingBag, Search, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b-4 border-foreground">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 hover:bg-primary hover:text-background border-2 border-transparent hover:border-foreground transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Vrinda" className="h-10 w-10 object-contain" />
          <span className="text-3xl font-display font-bold uppercase tracking-widest hidden sm:block mt-1">
            Vrinda
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-lg">
          <a href="#" className="hover:text-primary transition-colors uppercase">Shop</a>
          <a href="#" className="hover:text-primary transition-colors uppercase">Collections</a>
          <a href="#" className="hover:text-primary transition-colors uppercase">About</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-secondary border-2 border-transparent hover:border-foreground transition-colors">
            <Search className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-primary hover:text-background border-2 border-transparent hover:border-foreground transition-colors relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-secondary text-foreground text-xs font-bold border-2 border-foreground px-1.5 py-0.5 rounded-full">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
