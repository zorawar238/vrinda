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
    <header className="sticky top-0 z-50 bg-background border-b-4 border-foreground">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 hover:bg-primary hover:text-background border-2 border-transparent hover:border-foreground transition-colors">
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Vrinda" className="h-10 w-10 object-contain" />
          <span className="text-3xl font-display font-bold uppercase tracking-widest hidden sm:block mt-1">
            Vrinda
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-lg">
          <Link to="/shop" className="hover:text-primary transition-colors uppercase">Shop</Link>
          <Link to="/collections" className="hover:text-primary transition-colors uppercase">Collections</Link>
          <Link to="/about" className="hover:text-primary transition-colors uppercase">About</Link>
          
          {userInfo?.isAdmin && (
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-primary transition-colors uppercase font-bold text-lg tracking-widest">
                <span>Admin</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full mt-4 w-48 bg-background border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/admin/dashboard" className="p-4 hover:bg-secondary font-bold uppercase border-b-2 border-foreground/20">Dashboard</Link>
                <Link to="/admin/productlist" className="p-4 hover:bg-secondary font-bold uppercase border-b-2 border-foreground/20">Products</Link>
                <Link to="/admin/orderlist" className="p-4 hover:bg-secondary font-bold uppercase border-b-2 border-foreground/20">Orders</Link>
                <Link to="/admin/userlist" className="p-4 hover:bg-secondary font-bold uppercase">Users</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {showSearch ? (
            <form onSubmit={handleSearch} className="hidden sm:flex items-center border-4 border-foreground relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="p-1 outline-none w-32 md:w-48 font-bold"
                autoFocus
              />
              <button type="button" onClick={() => setShowSearch(false)} className="p-1 hover:bg-secondary border-l-4 border-foreground">
                <X className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-secondary border-2 border-transparent hover:border-foreground transition-colors hidden sm:block"
            >
              <Search className="w-6 h-6" />
            </button>
          )}
          
          <Link 
            to={userInfo ? "/profile" : "/login"}
            className="p-2 hover:bg-secondary border-2 border-transparent hover:border-foreground transition-colors flex items-center gap-2"
          >
            <User className="w-6 h-6" />
            <span className="font-bold hidden lg:block uppercase text-sm">
              {userInfo ? userInfo.name.split(' ')[0] : 'Sign In'}
            </span>
          </Link>

          <Link 
            to="/wishlist"
            className="p-2 hover:bg-primary hover:text-background border-2 border-transparent hover:border-foreground transition-colors relative"
          >
            <Heart className="w-6 h-6" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-foreground text-xs font-bold border-2 border-foreground px-1.5 py-0.5 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button 
            onClick={openCart}
            className="p-2 hover:bg-primary hover:text-background border-2 border-transparent hover:border-foreground transition-colors relative"
          >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-foreground text-xs font-bold border-2 border-foreground px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
