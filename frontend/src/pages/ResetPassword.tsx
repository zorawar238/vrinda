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
      <div className="w-full max-w-md border-4 border-foreground bg-background p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-2">New Password</h2>
        <p className="font-bold mb-8 text-foreground/70">Enter your new password below.</p>

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
            <label className="block font-bold uppercase mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/50" />
              <input 
                type="password" 
                className="w-full border-4 border-foreground p-4 pl-14 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
                placeholder="ENTER NEW PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div>
            <label className="block font-bold uppercase mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/50" />
              <input 
                type="password" 
                className="w-full border-4 border-foreground p-4 pl-14 bg-secondary font-medium focus:outline-none focus:bg-background transition-colors"
                placeholder="CONFIRM NEW PASSWORD"
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
            className="w-full bg-primary text-background font-bold text-xl py-4 border-4 border-foreground hover:bg-foreground hover:text-background transition-colors uppercase disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
