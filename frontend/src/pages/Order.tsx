import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
  size: string;
}

interface OrderDetails {
  _id: string;
  user: { name: string; email: string };
  shippingAddress: { address: string; city: string; postalCode: string; country: string };
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  orderItems: OrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverLoading, setDeliverLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch order');
        }
        
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userInfo]);

  const deliverHandler = async () => {
    setDeliverLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to update delivery status');
      
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeliverLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-2xl uppercase">Loading...</div>;
  if (error) return <div className="text-center py-20 font-black text-2xl uppercase text-red-500">{error}</div>;
  if (!order) return <div className="text-center py-20 font-black text-2xl uppercase">Order Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl md:text-5xl font-black uppercase mb-8 tracking-tight break-all">
        Order {order._id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight border-b-4 border-foreground pb-2">Shipping</h2>
            <p className="text-lg font-medium mb-4">
              <strong>Name:</strong> {order.user.name} <br />
              <strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-primary hover:underline">{order.user.email}</a> <br />
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-800 border-4 border-green-800 p-4 font-bold uppercase">
                Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 border-4 border-red-800 p-4 font-bold uppercase">
                Not Delivered
              </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight border-b-4 border-foreground pb-2">Payment Method</h2>
            <p className="text-lg font-medium mb-4">
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 border-4 border-green-800 p-4 font-bold uppercase">
                Paid on {new Date(order.paidAt!).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 border-4 border-red-800 p-4 font-bold uppercase">
                Not Paid
              </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight border-b-4 border-foreground pb-2">Order Items</h2>
            <ul className="space-y-4">
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex items-center space-x-4 border-4 border-foreground p-4 bg-secondary">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border-2 border-foreground" />
                  <div className="flex-1 font-bold">
                    <Link to={`/product/${item.product}`} className="hover:text-primary transition-colors uppercase">
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
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="border-4 border-foreground p-6 bg-secondary sticky top-8">
            <h2 className="text-2xl font-black uppercase mb-6 tracking-tight border-b-4 border-foreground pb-2">Order Summary</h2>
            
            <div className="space-y-4 text-lg font-bold">
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl pt-4 border-t-4 border-foreground">
                <span>Total</span>
                <span className="text-primary">₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {!order.isPaid && (
              <div className="mt-8 p-4 border-4 border-dashed border-gray-400 text-center font-bold text-gray-500 uppercase">
                Payment Gateway Integration Pending
              </div>
            )}

            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                disabled={deliverLoading}
                className={`w-full mt-8 py-4 px-8 border-4 border-foreground font-black uppercase tracking-widest transition-all ${
                  deliverLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-foreground text-background hover:bg-primary hover:text-background'
                }`}
              >
                {deliverLoading ? 'Processing...' : 'Mark As Delivered'}
              </button>
            )}
            
            {userInfo?.isAdmin && !order.isPaid && !order.isDelivered && (
              <div className="mt-4 p-4 border-4 border-orange-500 bg-orange-100 text-orange-800 text-center font-bold text-sm uppercase">
                Cannot deliver unpaid order
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
