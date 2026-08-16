import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/users/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email sent! Check your terminal console (since we are using Ethereal Email for local dev) for the reset link.');
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-md border border-foreground/10 bg-background/50 p-10 md:p-14 relative">
        <Link to="/login" className="absolute top-6 left-6 text-foreground/50 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </Link>
        
        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl md:text-4xl font-display tracking-wide mb-2 text-foreground">Reset Password</h2>
          <p className="font-sans text-xs tracking-wide leading-relaxed text-foreground/60 px-4">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 text-red-500 font-sans text-sm tracking-wide p-4 text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-8 bg-primary/10 text-primary font-sans text-sm tracking-wide p-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-8">
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={1.5} />
              <input 
                type="email" 
                className="w-full border-b border-foreground/30 py-3 pl-8 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
