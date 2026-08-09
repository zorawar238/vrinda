import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
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
          Register
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-500 text-white font-bold p-4 border-2 border-foreground uppercase">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block font-bold uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
              placeholder="ENTER NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <input 
              type="password" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
              placeholder="ENTER PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Confirm Password</label>
            <input 
              type="password" 
              className="w-full border-4 border-foreground p-4 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
              placeholder="CONFIRM PASSWORD"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-background font-display font-bold text-2xl py-4 border-4 border-foreground hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all uppercase disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center font-bold">
          <p>Already have an account?</p>
          <Link to="/login" className="text-primary hover:underline uppercase text-xl">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
