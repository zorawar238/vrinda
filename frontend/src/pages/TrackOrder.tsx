import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="max-w-3xl mx-auto px-6 py-24 min-h-[70vh] flex flex-col justify-center animate-fade-in">
      <div className="border border-foreground/10 bg-background/50 p-10 md:p-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-4">
          Track Order
        </h1>
        <p className="font-sans text-sm tracking-wide text-foreground/60 mb-12">
          Enter your order ID below to check its current status.
        </p>

        {error && (
          <div className="mb-8 bg-red-500/10 text-red-500 font-sans text-sm tracking-wide p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 64b8f...a12c"
            className="flex-1 border-b border-foreground/30 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
          />
          <button
            type="submit"
            className="bg-foreground text-background font-sans text-xs tracking-widest uppercase px-10 py-4 hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            Track
          </button>
        </form>
      </div>
    </div>
  );
}
