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
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
          credentials: 'include',
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
    <div className="max-w-7xl mx-auto py-12 lg:py-24 px-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="lg:col-span-1">
          <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-8 border-b border-foreground/10 pb-2">Profile</h2>
          
          {editMode ? (
            <form onSubmit={updateProfileHandler} className="border border-foreground/10 bg-background/50 p-8 space-y-6">
              {updateError && <div className="p-4 bg-red-500/10 text-red-500 text-sm tracking-wide text-center">{updateError}</div>}
              {updateSuccess && <div className="p-4 bg-primary/10 text-primary text-sm tracking-wide text-center">Profile Updated!</div>}
              
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-foreground/30 py-2 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-foreground/30 py-2 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full border-b border-foreground/30 py-2 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-foreground/30 py-2 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-3 hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="w-full bg-transparent text-foreground font-sans text-xs tracking-widest uppercase py-3 border border-foreground/30 hover:border-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-foreground/10 bg-background/50 p-8 space-y-8">
              <div>
                <span className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-1">Name</span>
                <span className="font-sans text-sm tracking-wide text-foreground">{userInfo?.name}</span>
              </div>
              <div>
                <span className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-1">Email</span>
                <span className="font-sans text-sm tracking-wide text-foreground break-all">{userInfo?.email}</span>
              </div>
              
              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-3 hover:bg-primary transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-transparent text-foreground/70 font-sans text-xs tracking-widest uppercase py-3 hover:text-foreground transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-3">
          <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-8 border-b border-foreground/10 pb-2">Order History</h2>
          {loadingOrders ? (
            <p className="font-sans text-sm tracking-widest uppercase text-foreground/50 py-12 text-center">Loading orders...</p>
          ) : error ? (
            <p className="font-sans text-sm tracking-wide text-red-500 py-12 text-center">{error}</p>
          ) : orders.length === 0 ? (
            <div className="border border-foreground/10 bg-background/50 p-12 text-center">
              <p className="font-sans text-sm tracking-widest uppercase text-foreground/50 mb-6">No orders found</p>
              <Link to="/shop" className="inline-block bg-foreground text-background font-sans text-xs tracking-widest uppercase py-3 px-8 hover:bg-primary transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4 w-full">
                {orders.map((order) => (
                  <div key={order._id} className="border border-foreground/10 bg-background/50 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-foreground/10 pb-4">
                      <div>
                        <span className="block text-[10px] font-sans tracking-widest uppercase text-foreground/50 mb-1">Order ID</span>
                        <Link to={`/order/${order._id}`} className="hover:text-primary transition-colors underline underline-offset-4 text-sm font-sans tracking-wide">
                          #{order._id.substring(order._id.length - 6)}
                        </Link>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-sans tracking-widest uppercase text-foreground/50 mb-1">Date</span>
                        <span className="text-sm font-sans tracking-wide text-foreground/80">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-foreground/10">
                      <div>
                        <span className="block text-[10px] font-sans tracking-widest uppercase text-foreground/50 mb-1">Total</span>
                        <span className="text-sm font-sans tracking-wide text-foreground/80 font-bold">₹{order.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-sans tracking-widest uppercase text-foreground/50 mb-1">Payment</span>
                        {order.isPaid ? (
                          <span className="text-xs font-sans tracking-wide text-primary">Paid</span>
                        ) : (
                          <span className="text-xs font-sans tracking-wide text-foreground/50">Pending</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-sans tracking-widest uppercase text-foreground/50">Status</span>
                      <span className={`text-xs font-sans tracking-wide uppercase px-3 py-1 border ${order.status === 'Delivered' ? 'border-primary text-primary bg-primary/5' : 'border-foreground/20 text-foreground/70'}`}>
                        {order.status || 'Processing'}
                      </span>
                    </div>
                    
                    <Link to={`/order/${order._id}`} className="mt-2 w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-3 text-center hover:bg-primary transition-colors">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto border border-foreground/10 bg-background/50 w-full">
                <table className="w-full text-left font-sans text-sm min-w-[600px]">
                  <thead className="bg-foreground/5 border-b border-foreground/10">
                    <tr>
                      <th className="p-4 font-normal tracking-widest uppercase text-xs text-foreground/50">Order</th>
                      <th className="p-4 font-normal tracking-widest uppercase text-xs text-foreground/50">Date</th>
                      <th className="p-4 font-normal tracking-widest uppercase text-xs text-foreground/50">Total</th>
                      <th className="p-4 font-normal tracking-widest uppercase text-xs text-foreground/50">Paid</th>
                      <th className="p-4 font-normal tracking-widest uppercase text-xs text-foreground/50">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                        <td className="p-4">
                          <Link to={`/order/${order._id}`} className="hover:text-primary transition-colors underline underline-offset-4">
                            #{order._id.substring(order._id.length - 6)}
                          </Link>
                        </td>
                        <td className="p-4 text-foreground/80">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-foreground/80">₹{order.totalPrice.toFixed(2)}</td>
                        <td className="p-4">
                          {order.isPaid ? (
                            <span className="text-foreground/80">{new Date(order.paidAt).toLocaleDateString()}</span>
                          ) : (
                            <span className="text-foreground/30">Pending</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`tracking-wide ${order.status === 'Delivered' ? 'text-primary' : 'text-foreground/60'}`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
