import { ShoppingBag, Search, Menu, User, ChevronDown, X, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export function Header() {
  const { openCart, cartItems } = useCart();
  const { userInfo } = useAuth();
  const { wishlistItems } = useWishlist();
  const itemCount = cartItems.reduce((total, item) => total + (item.qty || 1), 0); // Note: quantity in ProductDetail uses qty, previously quantity
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <span className="text-3xl sm:text-4xl font-display italic tracking-widest mt-1">
            Vrinda
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-foreground/80">
          <Link to="/shop" className="hover:text-primary transition-colors uppercase">Shop</Link>
          <Link to="/collections" className="hover:text-primary transition-colors uppercase">Collections</Link>
          <Link to="/about" className="hover:text-primary transition-colors uppercase">About</Link>
          
          {userInfo?.isAdmin && (
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-primary transition-colors uppercase tracking-widest">
                <span>Admin</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute left-0 top-full mt-6 w-48 bg-background border border-foreground/10 shadow-elegant flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/admin/dashboard" className="px-5 py-3 hover:bg-muted/30 uppercase text-xs tracking-widest">Dashboard</Link>
                <Link to="/admin/productlist" className="px-5 py-3 hover:bg-muted/30 uppercase text-xs tracking-widest">Products</Link>
                <Link to="/admin/orderlist" className="px-5 py-3 hover:bg-muted/30 uppercase text-xs tracking-widest">Orders</Link>
                <Link to="/admin/userlist" className="px-5 py-3 hover:bg-muted/30 uppercase text-xs tracking-widest">Users</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 text-foreground/80">
          {showSearch ? (
            <form onSubmit={handleSearch} className="hidden sm:flex items-center border-b border-foreground/30 relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="py-1 outline-none w-32 md:w-48 bg-transparent text-sm tracking-wide"
                autoFocus
              />
              <button type="button" onClick={() => setShowSearch(false)} className="p-1 text-foreground/50 hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 hover:text-primary transition-colors hidden sm:block"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          
          <Link 
            to={userInfo ? "/profile" : "/login"}
            className="p-2 hover:text-primary transition-colors flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            <span className="hidden lg:block uppercase text-xs tracking-widest font-medium">
              {userInfo ? userInfo.name.split(' ')[0] : 'Sign In'}
            </span>
          </Link>

          <Link 
            to="/wishlist"
            className="p-2 hover:text-primary transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute top-1 right-0 bg-primary text-background text-[10px] font-medium h-4 w-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button 
            onClick={openCart}
            className="p-2 hover:text-primary transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-0 bg-primary text-background text-[10px] font-medium h-4 w-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
