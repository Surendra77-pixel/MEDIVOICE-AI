import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.DOCTOR);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({ email, password, role });
      const user = response.data?.user;
      if (user && user.isVerified === false) {
        navigate(ROUTES.PUBLIC.VERIFY_OTP, { state: { email, role: user.role } });
      } else if (user) {
        toast.success('Login successful!');
        navigate(user.role === ROLES.DOCTOR ? '/doctor/dashboard' : user.role === ROLES.ADMIN ? '/admin/dashboard' : '/patient/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-body bg-surface text-on-surface antialiased overflow-hidden">
      {/* Left Side: Visual Illustration */}
      <section className="hidden md:flex w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-secondary opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 w-full max-w-xl text-white animate-fade-in">
          <div className="mb-lg">
            <Link to="/" className="text-2xl font-h font-bold tracking-tight">MediVoice AI</Link>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm mb-lg">
            <img 
              alt="Healthcare AI Visualization" 
              className="w-full h-[400px] object-cover mix-blend-lighten opacity-90" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqULX7IzttyzBwiBGe3wYJ87MJzPZpVwL9sPbscVhi49R0mJkoI1vL8NkE0qHdZz90DjudAn8bJ3G5fvPr--D-z1kdKDqZ6LdxB_I4bv858WdP2lXvBCIOmkhgqJNZx3LfV1U3ydSqBiYup2FsNdr5Zigqdx8s1tIVfML97MrqPe2jiK4wl91UUog_bb-EZ3ocMi-kh1tO2V4Li85KgfQ5O5JvIrryFSTl0n44j7S_jt6Zqy93ev1Puw_ZN2ZPX2tDk9pYU4KL8kE"
            />
          </div>
          <div className="space-y-md">
            <h1 className="font-h text-5xl leading-tight">The Future of <br/> Clinical Documentation.</h1>
            <p className="text-lg text-on-primary-container leading-relaxed opacity-90">
              Harnessing advanced generative AI to transform patient conversations into secure, accurate medical intelligence in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Authentication Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-md md:p-xl bg-surface animate-slide-up">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="md:hidden flex justify-center mb-lg">
            <h2 className="text-2xl font-h font-bold text-primary">MediVoice AI</h2>
          </div>
          
          <div className="glass-card rounded-xl border border-outline-variant/30 p-md md:p-lg shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant/30 mb-md">
              <button className="flex-1 py-sm font-bold text-xs uppercase tracking-wider text-primary border-b-2 border-primary">Sign In</button>
              <Link to={ROUTES.PUBLIC.REGISTER} className="flex-1 py-sm font-bold text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors text-center">Create Account</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">I am a</label>
                <div className="grid grid-cols-2 gap-sm">
                  <button
                    type="button"
                    onClick={() => setRole(ROLES.DOCTOR)}
                    className={`flex items-center justify-center p-sm border rounded-lg transition-all ${role === ROLES.DOCTOR ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant/30 text-on-surface-variant'}`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(ROLES.PATIENT)}
                    className={`flex items-center justify-center p-sm border rounded-lg transition-all ${role === ROLES.PATIENT ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant/30 text-on-surface-variant'}`}
                  >
                    Patient
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                  <input 
                    className="w-full pl-10 pr-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    id="email" 
                    type="email"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-xs">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block" htmlFor="password">Password</label>
                  <Link className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline" to={ROUTES.PUBLIC.FORGOT_PASSWORD}>Forgot password?</Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                  <input 
                    className="w-full pl-10 pr-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-sm rounded-lg font-h font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-sm disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Portal'}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>

              <div className="relative py-sm text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
                <div className="relative flex justify-center"><span className="bg-surface px-sm text-[10px] font-bold text-on-surface-variant">OR</span></div>
              </div>

              {/* SSO Button */}
              <button 
                type="button"
                className="w-full bg-surface border border-outline-variant/50 hover:bg-surface-container-low text-on-surface py-sm rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">key</span>
                SIGN IN WITH SSO
              </button>
            </form>

            {/* Security Badges */}
            <div className="mt-lg pt-lg border-t border-outline-variant/20 grid grid-cols-3 gap-xs">
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] fill-current">verified_user</span>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-tighter mt-xs">HIPAA Compliant</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] fill-current">encrypted</span>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-tighter mt-xs">End-to-End Encryption</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] fill-current">phonelink_lock</span>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-tighter mt-xs">OTP Secured</span>
              </div>
            </div>
          </div>

          {/* Global Footer */}
          <footer className="mt-lg flex flex-col items-center gap-sm">
            <p className="text-[10px] text-on-surface-variant opacity-60">© 2024 MediVoice AI. Secure Medical Intelligence.</p>
            <div className="flex gap-md">
              <a className="text-[10px] font-bold text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy Policy</a>
              <a className="text-[10px] font-bold text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms of Service</a>
              <a className="text-[10px] font-bold text-on-surface-variant hover:text-primary underline transition-all" href="#">Security Compliance</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
