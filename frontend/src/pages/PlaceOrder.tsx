import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PlaceOrder = () => {
  const { cartItems, shippingAddress, paymentMethod, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate prices
  const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = Number(addDecimals(cartTotal));
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number(addDecimals(Number((0.15 * itemsPrice).toFixed(2))));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error placing order');
      }

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 lg:py-24 px-6 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-display tracking-wide mb-12">Review Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-16">
          
          <section>
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Shipping</h2>
            <p className="font-sans text-sm tracking-wide leading-relaxed text-foreground/80">
              {shippingAddress.address}<br />
              {shippingAddress.city}, {shippingAddress.postalCode}<br />
              {shippingAddress.country}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Payment Method</h2>
            <p className="font-sans text-sm tracking-wide leading-relaxed text-foreground/80">
              {paymentMethod}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Order Items</h2>
            {cartItems.length === 0 ? (
              <div className="bg-muted/10 p-6 text-sm tracking-wide text-center">
                Your bag is empty
              </div>
            ) : (
              <ul className="space-y-6">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-6 border-b border-foreground/10 pb-6 last:border-0">
                    <img src={item.image} alt={item.name} className="w-20 h-28 object-cover bg-muted/20" />
                    <div className="flex-1">
                      <Link to={`/product/${item._id}`} className="font-sans text-sm tracking-wide hover:text-primary transition-colors block mb-1">
                        {item.name}
                      </Link>
                      <div className="text-xs font-sans tracking-widest uppercase text-foreground/50">Size: {item.size}</div>
                    </div>
                    <div className="text-sm font-sans tracking-wide text-right">
                      <span className="text-foreground/50 mr-2">{item.qty} x ₹{item.price}</span>
                      <br className="sm:hidden"/>
                      <span>₹{item.qty * item.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="border border-foreground/10 p-8 bg-background/50 sticky top-32">
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-8 border-b border-foreground/10 pb-2">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-sans tracking-wide">
              <div className="flex justify-between">
                <span className="text-foreground/70">Items</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Shipping</span>
                <span>₹{shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Tax</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="flex justify-between text-lg pt-6 border-t border-foreground/10 mt-6">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 text-red-500 text-sm tracking-wide text-center">
                {error}
              </div>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              className={`w-full mt-10 py-4 font-sans text-xs tracking-widest uppercase transition-colors ${
                cartItems.length === 0 || loading
                  ? 'bg-muted text-foreground/30 cursor-not-allowed'
                  : 'bg-foreground text-background hover:bg-primary'
              }`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;
