import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] cursor-pointer transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-foreground/10 z-[70] shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-8 border-b border-foreground/10">
          <h2 className="text-2xl font-display tracking-wide">Your Bag</h2>
          <button 
            onClick={closeCart}
            className="p-2 text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-sm tracking-widest uppercase text-foreground/50 mb-8">Your bag is empty</p>
              <button 
                onClick={closeCart}
                className="bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 px-10 hover:bg-primary transition-colors"
              >
                Keep Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id + item.size} className="flex gap-6 border-b border-foreground/10 pb-6 last:border-0 last:pb-0">
                <div className="w-24 h-32 bg-muted/20 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-sans text-sm tracking-wide mb-1">
                      <Link to={`/product/${item._id}`} onClick={closeCart} className="hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="font-sans text-xs text-foreground/50 tracking-wide">Size: {item.size}</p>
                    <p className="font-sans text-sm text-foreground/80 mt-2">₹{item.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-foreground/20">
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.qty - 1)}
                        className="px-3 py-1 text-foreground/50 hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-sans text-xs tracking-widest px-3">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.qty + 1)}
                        className="px-3 py-1 text-foreground/50 hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id, item.size)}
                      className="text-foreground/40 hover:text-primary transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          /* Footer */
          <div className="border-t border-foreground/10 p-8 bg-background/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 font-sans">
              <span className="text-sm tracking-widest uppercase text-foreground/70">Subtotal</span>
              <span className="text-lg tracking-wide text-foreground">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => {
                closeCart();
                window.location.href = '/shipping';
              }}
              disabled={cartItems.length === 0}
              className={`w-full py-4 font-sans text-xs tracking-widest uppercase transition-colors ${
                cartItems.length === 0 
                  ? 'bg-muted text-foreground/30 cursor-not-allowed'
                  : 'bg-foreground text-background hover:bg-primary'
              }`}
            >
              Checkout
            </button>
            <p className="text-center font-sans text-[10px] tracking-widest uppercase text-foreground/40 mt-4">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
