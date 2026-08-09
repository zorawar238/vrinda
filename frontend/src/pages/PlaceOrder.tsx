import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PlaceOrder = () => {
  const { cartItems, shippingAddress, paymentMethod, cartTotal, clearCart } = useCart();
  const { userInfo } = useAuth();
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
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
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight border-b-4 border-foreground pb-2">Shipping</h2>
            <p className="text-lg font-medium">
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight border-b-4 border-foreground pb-2">Payment Method</h2>
            <p className="text-lg font-medium">
              <strong>Method:</strong> {paymentMethod}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight border-b-4 border-foreground pb-2">Order Items</h2>
            {cartItems.length === 0 ? (
              <div className="bg-secondary p-4 border-4 border-foreground font-bold uppercase">
                Your cart is empty
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4 border-4 border-foreground p-4 bg-secondary">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border-2 border-foreground" />
                    <div className="flex-1 font-bold">
                      <Link to={`/product/${item._id}`} className="hover:text-primary transition-colors uppercase">
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500">Size: {item.size}</div>
                    </div>
                    <div className="font-black text-lg">
                      {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="border-4 border-foreground p-6 bg-secondary sticky top-8">
            <h2 className="text-2xl font-black uppercase mb-6 tracking-tight border-b-4 border-foreground pb-2">Order Summary</h2>
            
            <div className="space-y-4 text-lg font-bold">
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="flex justify-between text-2xl pt-4 border-t-4 border-foreground">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 border-4 border-red-700 font-bold uppercase">
                {error}
              </div>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              className={`w-full mt-8 py-4 px-8 border-4 border-foreground font-black uppercase tracking-widest transition-all ${
                cartItems.length === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-background hover:bg-foreground hover:text-background'
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
