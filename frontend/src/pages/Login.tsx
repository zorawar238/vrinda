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
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary">
      <div className="w-full max-w-md bg-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] p-8">
        <h1 className="text-4xl font-display font-bold uppercase mb-8 border-b-4 border-foreground pb-4">
          Login
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-500 text-white font-bold p-4 border-2 border-foreground uppercase">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block font-bold uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
              placeholder="ENTER EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Password</label>
            <div className="flex flex-col gap-2">
              <input 
                type="password" 
                className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
                placeholder="ENTER PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgot-password" className="text-right font-bold text-sm uppercase hover:text-primary transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-background font-display font-bold text-2xl py-4 border-4 border-foreground hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all uppercase disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center font-bold">
          <p>New Customer?</p>
          <Link to="/register" className="text-primary hover:underline uppercase text-xl">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
