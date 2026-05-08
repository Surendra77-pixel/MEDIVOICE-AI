import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success('OTP sent to your email!');
      navigate(ROUTES.PUBLIC.RESET_PASSWORD, { state: { email } });
    } catch (error) {
      toast.error(error || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-md font-body">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-2xl border border-outline-variant/30 p-lg shadow-xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center mb-lg">
            <Link to="/" className="text-2xl font-h font-bold text-primary mb-xs block">MediVoice AI</Link>
            <h1 className="text-2xl font-h font-bold text-on-surface mb-xs">Forgot Password?</h1>
            <p className="text-sm text-on-surface-variant">Enter your email and we'll send you an OTP to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md relative z-10">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Email Address</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-md">mail</span>
                <input 
                  type="email"
                  className="w-full pl-xl pr-md py-sm bg-surface/50 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-sm rounded-xl font-h font-bold text-lg shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-sm disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset OTP'}
              {!loading && <span className="material-symbols-outlined">send</span>}
            </button>
          </form>

          <div className="mt-lg pt-md border-t border-outline-variant/20 text-center relative z-10">
            <Link to={ROUTES.PUBLIC.LOGIN} className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
