import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Order {
  _id: string;
  user: { _id: string; name: string };
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
}

const OrderList = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Error fetching orders');
        
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8 border-b-4 border-foreground pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tight">Orders</h1>
      </div>

      {loading ? (
        <div className="text-center font-bold uppercase text-2xl">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 border-4 border-red-700 p-4 font-bold uppercase">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-4 border-foreground bg-secondary text-left">
            <thead className="bg-foreground text-background uppercase font-black tracking-wider">
              <tr>
                <th className="p-4 border-b-4 border-r-4 border-foreground">ID</th>
                <th className="p-4 border-b-4 border-r-4 border-foreground">USER</th>
                <th className="p-4 border-b-4 border-r-4 border-foreground">DATE</th>
                <th className="p-4 border-b-4 border-r-4 border-foreground">TOTAL</th>
                <th className="p-4 border-b-4 border-r-4 border-foreground">PAID</th>
                <th className="p-4 border-b-4 border-r-4 border-foreground">DELIVERED</th>
                <th className="p-4 border-b-4 border-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              {orders.map((order) => (
                <tr key={order._id} className="border-b-4 border-foreground hover:bg-background transition-colors">
                  <td className="p-4 border-r-4 border-foreground">{order._id.substring(0, 10)}...</td>
                  <td className="p-4 border-r-4 border-foreground">{order.user?.name || 'Deleted User'}</td>
                  <td className="p-4 border-r-4 border-foreground">{order.createdAt.substring(0, 10)}</td>
                  <td className="p-4 border-r-4 border-foreground font-bold">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="p-4 border-r-4 border-foreground">
                    {order.isPaid ? order.paidAt.substring(0, 10) : <span className="text-red-500 font-bold">❌</span>}
                  </td>
                  <td className="p-4 border-r-4 border-foreground">
                    {order.isDelivered ? order.deliveredAt.substring(0, 10) : <span className="text-red-500 font-bold">❌</span>}
                  </td>
                  <td className="p-4 border-foreground">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-primary text-background font-bold uppercase px-4 py-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
