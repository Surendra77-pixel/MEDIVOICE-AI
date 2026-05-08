import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await resetPassword({
        email: formData.email,
        code: formData.code,
        newPassword: formData.newPassword
      });
      toast.success('Password reset successfully! Please login.');
      navigate(ROUTES.PUBLIC.LOGIN);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : (error.message || 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-md font-body">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-2xl border border-outline-variant/30 p-lg shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center mb-lg">
            <h1 className="text-2xl font-h font-bold text-on-surface mb-xs">Reset Password</h1>
            <p className="text-sm text-on-surface-variant">Enter the 6-digit OTP sent to your email and your new password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md relative z-10">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Email Address</label>
              <input 
                type="email"
                name="email"
                readOnly
                className="w-full px-md py-sm bg-surface/30 border border-outline-variant/30 rounded-xl outline-none opacity-70 cursor-not-allowed" 
                value={formData.email}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">6-Digit OTP Code</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-md">lock_reset</span>
                <input 
                  type="text"
                  name="code"
                  maxLength="6"
                  className="w-full pl-xl pr-md py-sm bg-surface/50 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all tracking-[0.5em] font-mono text-center text-lg" 
                  placeholder="000000"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">New Password</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-md">password</span>
                <input 
                  type="password"
                  name="newPassword"
                  className="w-full pl-xl pr-md py-sm bg-surface/50 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Confirm New Password</label>
              <div className="relative">
                <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-md">check_circle</span>
                <input 
                  type="password"
                  name="confirmPassword"
                  className="w-full pl-xl pr-md py-sm bg-surface/50 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-sm rounded-xl font-h font-bold text-lg shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-sm disabled:opacity-50 mt-lg"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
              {!loading && <span className="material-symbols-outlined">restart_alt</span>}
            </button>
          </form>

          <div className="mt-lg pt-md border-t border-outline-variant/20 text-center relative z-10">
            <Link to={ROUTES.PUBLIC.LOGIN} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
              Cancel and Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
