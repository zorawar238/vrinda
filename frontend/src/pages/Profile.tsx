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
  status: string;
}

export function Profile() {
  const { userInfo, logout, login } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  // Edit Profile State
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Reset form when toggling
  useEffect(() => {
    if (!editMode) {
      setPassword('');
      setConfirmPassword('');
      setUpdateError('');
      setUpdateSuccess(false);
      setName(userInfo?.name || '');
      setEmail(userInfo?.email || '');
    }
  }, [editMode, userInfo]);

  const updateProfileHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error updating profile');

      login(data); // update global state and local storage
      setUpdateSuccess(true);
      setTimeout(() => {
        setEditMode(false);
      }, 1500);
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

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
          
          {editMode ? (
            <form onSubmit={updateProfileHandler} className="bg-secondary border-4 border-foreground p-6 shadow-brutal">
              {updateError && <div className="mb-4 p-3 bg-red-100 text-red-700 border-2 border-red-700 font-bold uppercase">{updateError}</div>}
              {updateSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 border-2 border-green-700 font-bold uppercase">Profile Updated!</div>}
              
              <div className="mb-4">
                <label className="block text-sm font-bold uppercase text-gray-500 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border-2 border-foreground p-2 font-bold outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold uppercase text-gray-500 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border-2 border-foreground p-2 font-bold outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold uppercase text-gray-500 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full bg-background border-2 border-foreground p-2 font-bold outline-none focus:border-primary placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase text-gray-500 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background border-2 border-foreground p-2 font-bold outline-none focus:border-primary"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-primary text-background font-black uppercase py-3 border-4 border-foreground hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="w-full bg-background text-foreground font-black uppercase py-3 border-4 border-foreground hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-secondary border-4 border-foreground p-6 shadow-brutal">
              <div className="mb-4">
                <span className="block text-sm font-bold uppercase text-gray-500">Name</span>
                <span className="text-xl font-bold">{userInfo?.name}</span>
              </div>
              <div className="mb-8">
                <span className="block text-sm font-bold uppercase text-gray-500">Email</span>
                <span className="text-xl font-bold break-all">{userInfo?.email}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-primary text-background font-black uppercase py-3 border-4 border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-foreground text-background font-black uppercase py-3 border-4 border-foreground hover:bg-background hover:text-foreground transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
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
                    <th className="p-4 border-b-4 border-foreground">Status</th>
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
                      <td className="p-4 border-foreground font-bold uppercase">
                        <span className={order.status === 'Delivered' ? 'text-primary' : ''}>
                          {order.status || 'Processing'}
                        </span>
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
