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
      <div className="w-full max-w-md border-4 border-foreground bg-background p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
        <Link to="/login" className="inline-flex items-center gap-2 font-bold uppercase mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Login
        </Link>
        
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-2">Reset Password</h2>
        <p className="font-bold mb-8 text-foreground/70">Enter your email and we'll send you a link to reset your password.</p>

        {error && (
          <div className="bg-red-500 text-white font-bold p-4 mb-6 border-4 border-foreground uppercase">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-primary text-background font-bold p-4 mb-6 border-4 border-foreground">
            {message}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block font-bold uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/50" />
              <input 
                type="email" 
                className="w-full border-4 border-foreground p-4 pl-14 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
                placeholder="ENTER EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-background font-bold text-xl py-4 border-4 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
