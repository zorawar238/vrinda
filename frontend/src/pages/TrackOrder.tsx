import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter a valid order ID');
      return;
    }
    
    if (!userInfo) {
      // You must be logged in to view an order
      navigate('/login?redirect=/order/' + orderId.trim());
    } else {
      navigate(`/order/${orderId.trim()}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 min-h-[70vh] flex flex-col justify-center">
      <div className="bg-background border-4 border-foreground shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] p-8 md:p-12 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-4">
          Track Your Order
        </h1>
        <p className="text-xl font-medium mb-12 text-foreground/80">
          Enter your order ID below to check its current status.
        </p>

        {error && (
          <div className="mb-6 bg-red-500 text-white font-bold p-4 border-4 border-foreground uppercase text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 64b8f...a12c"
            className="flex-1 bg-secondary/10 border-4 border-foreground px-6 py-4 font-bold outline-none focus:border-primary transition-colors text-xl font-mono uppercase placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-primary text-background font-bold text-xl uppercase px-12 py-4 border-4 border-foreground hover:bg-secondary hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-6 h-6" /> Track
          </button>
        </form>
      </div>
    </div>
  );
}
