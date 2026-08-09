import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
}

export function Profile() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/mine', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6 border-b-4 border-foreground pb-2">User Profile</h2>
          <div className="bg-secondary border-4 border-foreground p-6">
            <div className="mb-4">
              <span className="block text-sm font-bold uppercase text-gray-500">Name</span>
              <span className="text-xl font-bold">{userInfo?.name}</span>
            </div>
            <div className="mb-8">
              <span className="block text-sm font-bold uppercase text-gray-500">Email</span>
              <span className="text-xl font-bold">{userInfo?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-foreground text-background font-black uppercase py-3 border-4 border-foreground hover:bg-background hover:text-foreground transition-all"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-6 border-b-4 border-foreground pb-2">My Orders</h2>
          {loadingOrders ? (
            <p className="font-bold uppercase text-2xl">Loading orders...</p>
          ) : error ? (
            <p className="font-bold uppercase text-red-500 text-2xl">{error}</p>
          ) : orders.length === 0 ? (
            <div className="bg-secondary border-4 border-foreground p-6 text-center font-bold uppercase">
              You have not placed any orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-4 border-foreground bg-secondary text-left">
                <thead className="bg-foreground text-background uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-4 border-b-4 border-r-4 border-foreground">ID</th>
                    <th className="p-4 border-b-4 border-r-4 border-foreground">Date</th>
                    <th className="p-4 border-b-4 border-r-4 border-foreground">Total</th>
                    <th className="p-4 border-b-4 border-r-4 border-foreground">Paid</th>
                    <th className="p-4 border-b-4 border-foreground">Delivered</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b-4 border-foreground hover:bg-background transition-colors">
                      <td className="p-4 border-r-4 border-foreground">
                        <Link to={`/order/${order._id}`} className="text-primary hover:underline font-bold">
                          {order._id.substring(0, 10)}...
                        </Link>
                      </td>
                      <td className="p-4 border-r-4 border-foreground">{order.createdAt.substring(0, 10)}</td>
                      <td className="p-4 border-r-4 border-foreground text-primary font-bold">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="p-4 border-r-4 border-foreground">
                        {order.isPaid ? order.paidAt.substring(0, 10) : <span className="text-red-500 font-bold uppercase">No</span>}
                      </td>
                      <td className="p-4 border-foreground">
                        {order.isDelivered ? order.deliveredAt.substring(0, 10) : <span className="text-red-500 font-bold uppercase">No</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
