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
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l-8 border-foreground z-[70] shadow-[-16px_0px_0px_0px_rgba(17,17,17,1)] flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="flex items-center justify-between p-6 border-b-4 border-foreground bg-primary text-foreground">
          <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="p-2 border-2 border-transparent hover:border-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-6 uppercase">Your cart is empty.</p>
              <button 
                onClick={closeCart}
                className="bg-foreground text-background font-bold py-3 px-8 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(255,0,127,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase"
              >
                Keep Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id + item.size} className="flex gap-4 border-2 border-foreground p-3 bg-secondary">
                <div className="w-24 h-32 border-2 border-foreground bg-background overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold uppercase text-lg leading-tight mb-1">
                      <Link to={`/product/${item._id}`} onClick={closeCart} className="hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    <p className="font-medium">Size: <span className="font-bold">{item.size}</span></p>
                    <p className="font-display font-bold text-lg mt-1 text-primary">₹{item.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-2 border-foreground bg-background">
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.qty - 1)}
                        className="px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold px-3 py-1 border-x-2 border-foreground">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.qty + 1)}
                        className="px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id, item.size)}
                      className="p-2 text-foreground hover:text-primary hover:bg-foreground/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          /* Footer */
          <div className="border-t-4 border-foreground p-6 bg-secondary">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold uppercase">Total</span>
              <span className="text-2xl font-black">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <button
              onClick={() => {
                closeCart();
                window.location.href = '/shipping';
              }}
              disabled={cartItems.length === 0}
              className={`w-full py-4 border-4 border-foreground font-black uppercase tracking-widest transition-all ${
                cartItems.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-background hover:bg-foreground hover:text-background'
              }`}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
