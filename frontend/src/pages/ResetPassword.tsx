import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/users/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-md border border-foreground/10 bg-background/50 p-10 md:p-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display tracking-wide mb-2 text-foreground">New Password</h2>
          <p className="font-sans text-xs tracking-widest uppercase text-foreground/50">Enter your new password below</p>
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
            <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">New Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={1.5} />
              <input 
                type="password" 
                className="w-full border-b border-foreground/30 py-3 pl-8 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" strokeWidth={1.5} />
              <input 
                type="password" 
                className="w-full border-b border-foreground/30 py-3 pl-8 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
