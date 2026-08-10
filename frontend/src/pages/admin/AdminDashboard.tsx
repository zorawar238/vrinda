import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, Users, ShoppingBag } from 'lucide-react';

interface AnalyticsData {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  salesData: { date: string; revenue: number; orders: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
}

export function AdminDashboard() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/orders/analytics', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (res.ok) {
          const analyticsData = await res.json();
          setData(analyticsData);
        } else {
          setError('Failed to fetch analytics');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userInfo, navigate]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-24"><h2 className="text-4xl font-bold uppercase">Loading Analytics...</h2></div>;
  }

  if (error || !data) {
    return <div className="max-w-7xl mx-auto px-6 py-24"><h2 className="text-4xl font-bold text-red-500 uppercase">Error: {error}</h2></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex justify-between items-end mb-12 border-b-4 border-foreground pb-4">
        <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter">
          Admin <span className="text-background bg-foreground px-2">Dashboard</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="border-4 border-foreground bg-primary text-background p-6 shadow-brutal hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-2xl uppercase">Total Revenue</h3>
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-5xl font-display font-bold">₹{data.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="border-4 border-foreground bg-secondary text-foreground p-6 shadow-brutal hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-2xl uppercase">Total Orders</h3>
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-5xl font-display font-bold">{data.totalOrders}</p>
        </div>

        <div className="border-4 border-foreground bg-background text-foreground p-6 shadow-brutal hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-2xl uppercase">Total Users</h3>
            <Users className="w-8 h-8" />
          </div>
          <p className="text-5xl font-display font-bold">{data.totalUsers}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div className="border-4 border-foreground bg-background p-6 shadow-brutal">
          <h3 className="font-bold text-3xl uppercase mb-8 border-b-4 border-foreground pb-2 inline-block">Sales Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                <XAxis dataKey="date" stroke="#111" style={{ fontWeight: 'bold' }} />
                <YAxis stroke="#111" style={{ fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '4px solid #111', borderRadius: 0, fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#ff4d00" strokeWidth={6} activeDot={{ r: 8, fill: '#111' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-4 border-foreground bg-background p-6 shadow-brutal">
          <h3 className="font-bold text-3xl uppercase mb-8 border-b-4 border-foreground pb-2 inline-block">Top Products</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                <XAxis type="number" stroke="#111" style={{ fontWeight: 'bold' }} />
                <YAxis dataKey="name" type="category" stroke="#111" style={{ fontWeight: 'bold' }} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '4px solid #111', borderRadius: 0, fontWeight: 'bold' }}
                />
                <Bar dataKey="qty" fill="#111" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
