import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ... (interfaces remain the same)
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
  status: string;
  orderItems: OrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          credentials: 'include',
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

  const statusHandler = async (newStatus: string) => {
    setDeliverLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to update order status');
      
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeliverLoading(false);
    }
  };

  const payHandler = async () => {
    setPayLoading(true);
    try {
      // 1. Fetch Razorpay Key
      const keyRes = await fetch('/api/payment/razorpay-key', { credentials: 'include' });
      const { keyId } = await keyRes.json();

      // 2. Create Razorpay Order
      const orderRes = await fetch('/api/payment/razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ orderId: id }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create Razorpay order');

      // 3. Open Razorpay Checkout Widget
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Vrinda Store',
        description: `Payment for Order ${id}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 4. Verify payment on backend
            const verifyRes = await fetch(`/api/orders/${id}/pay`, {
              method: 'PUT',
              headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (!verifyRes.ok) throw new Error(verifyData.message || 'Payment verification failed');
            
            setOrder(verifyData);
          } catch (err: any) {
            alert(err.message);
          }
        },
        prefill: {
          name: order?.user.name,
          email: order?.user.email,
        },
        theme: {
          color: '#111111',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-black text-2xl uppercase">Loading...</div>;
  if (error) return <div className="text-center py-20 font-black text-2xl uppercase text-red-500">{error}</div>;
  if (!order) return <div className="text-center py-20 font-black text-2xl uppercase">Order Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 lg:py-24 px-6 animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-display tracking-wide mb-12 break-all">
        Order {order._id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-16">
          
          <section>
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Order Status</h2>
            
            <div className="mb-12">
              <div className="flex justify-between mb-4 font-sans text-xs tracking-widest uppercase">
                <span className={`${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-foreground' : 'text-foreground/30'}`}>Processing</span>
                <span className={`${order.status === 'Shipped' || order.status === 'Delivered' ? 'text-foreground' : 'text-foreground/30'}`}>Shipped</span>
                <span className={`${order.status === 'Delivered' ? 'text-foreground' : 'text-foreground/30'}`}>Delivered</span>
              </div>
              <div className="w-full h-1 bg-foreground/10 flex overflow-hidden">
                <div className={`h-full bg-foreground transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  order.status === 'Delivered' ? 'w-full' : 
                  order.status === 'Shipped' ? 'w-1/2' : 
                  'w-1/4'
                }`}></div>
              </div>
            </div>

            <p className="font-sans text-sm tracking-wide leading-relaxed text-foreground/80 mb-6">
              <strong className="text-foreground">Name:</strong> {order.user.name} <br />
              <strong className="text-foreground">Email:</strong> <a href={`mailto:${order.user.email}`} className="text-primary hover:underline">{order.user.email}</a> <br />
              <strong className="text-foreground">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-primary/5 text-primary border border-primary/20 p-4 font-sans text-xs tracking-widest uppercase text-center">
                Delivered on {new Date(order.deliveredAt!).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-muted/10 text-foreground/70 border border-foreground/10 p-4 font-sans text-xs tracking-widest uppercase text-center">
                Current Status: {order.status}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Payment Method</h2>
            <p className="font-sans text-sm tracking-wide leading-relaxed text-foreground/80 mb-6">
              <strong className="text-foreground">Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-primary/5 text-primary border border-primary/20 p-4 font-sans text-xs tracking-widest uppercase text-center">
                Paid on {new Date(order.paidAt!).toLocaleDateString()}
              </div>
            ) : (
              <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 font-sans text-xs tracking-widest uppercase text-center">
                Not Paid
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6 border-b border-foreground/10 pb-2">Order Items</h2>
            <ul className="space-y-6">
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex items-center space-x-6 border-b border-foreground/10 pb-6 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-20 h-28 object-cover bg-muted/20" />
                  <div className="flex-1">
                    <Link to={`/product/${item.product}`} className="font-sans text-sm tracking-wide hover:text-primary transition-colors block mb-1">
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
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="border border-foreground/10 p-8 bg-background/50 sticky top-32">
            <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-8 border-b border-foreground/10 pb-2">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-sans tracking-wide">
              <div className="flex justify-between">
                <span className="text-foreground/70">Items</span>
                <span>₹{order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Shipping</span>
                <span>₹{order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Tax</span>
                <span>₹{order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg pt-6 border-t border-foreground/10 mt-6">
                <span>Total</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {!order.isPaid && (
              <button
                onClick={payHandler}
                disabled={payLoading}
                className={`w-full mt-10 py-4 font-sans text-xs tracking-widest uppercase transition-colors ${
                  payLoading
                    ? 'bg-muted text-foreground/30 cursor-not-allowed'
                    : 'bg-foreground text-background hover:bg-primary'
                }`}
              >
                {payLoading ? 'Loading...' : `Pay With Razorpay`}
              </button>
            )}

            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-10 border-t border-foreground/10 pt-8">
                <h3 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-6">Admin Actions</h3>
                <div className="flex flex-col gap-4">
                  {order.status === 'Processing' && (
                    <button
                      onClick={() => statusHandler('Shipped')}
                      disabled={deliverLoading}
                      className="w-full py-4 font-sans text-xs tracking-widest uppercase bg-transparent border border-foreground/30 hover:border-foreground transition-colors"
                    >
                      {deliverLoading ? 'Wait...' : 'Mark as Shipped'}
                    </button>
                  )}
                  {order.status === 'Shipped' && (
                    <button
                      onClick={() => statusHandler('Delivered')}
                      disabled={deliverLoading}
                      className="w-full py-4 font-sans text-xs tracking-widest uppercase bg-foreground text-background hover:bg-primary transition-colors"
                    >
                      {deliverLoading ? 'Wait...' : 'Mark as Delivered'}
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {userInfo?.isAdmin && !order.isPaid && !order.isDelivered && (
              <div className="mt-6 p-4 bg-red-500/10 text-red-500 text-sm tracking-wide text-center">
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
