import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-md border border-foreground/10 bg-background/50 p-10 md:p-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display tracking-wide mb-2 text-foreground">
            Sign In
          </h1>
          <p className="font-sans text-xs tracking-widest uppercase text-foreground/50">Welcome back to Vrinda</p>
        </div>
        
        {error && (
          <div className="mb-8 bg-red-500/10 text-red-500 font-sans text-sm tracking-wide p-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-8">
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Email Address</label>
            <input 
              type="email" 
              className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Password</label>
            <div className="flex flex-col gap-3">
              <input 
                type="password" 
                className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgot-password" className="text-right font-sans text-xs tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-foreground/10 pt-8">
          <p className="font-sans text-xs tracking-wide text-foreground/50 mb-4">Don't have an account?</p>
          <Link to="/register" className="font-sans text-xs tracking-widest uppercase text-foreground hover:text-primary transition-colors underline underline-offset-4">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
