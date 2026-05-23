import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 font-body bg-gray-950 text-white antialiased relative overflow-x-hidden">
      {/* 3D Animated Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[150px] pointer-events-none"
      ></motion.div>

      {/* Main Glass Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        {/* Left Side: 3D Visual Illustration */}
        <section className="hidden md:flex w-1/2 relative overflow-hidden items-center justify-center p-12 lg:p-16 border-r border-white/10 bg-blue-900/10">
          {/* Animated Background GIF */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: 'url(https://i.pinimg.com/originals/00/f7/95/00f795b7d97bf213382e87252f13ce11.gif)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 w-full flex flex-col h-full justify-between">
            <div>
              <Link to="/" className="text-3xl font-h font-bold tracking-tight text-white mb-2 inline-block">MediVoice AI</Link>
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
            
            <motion.div 
              animate={{ y: [-15, 15, -15], rotateY: [-5, 5, -5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative perspective-1000 my-10"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <img 
                alt="3D Healthcare AI Visualization" 
                className="w-full h-auto object-cover rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 relative z-10" 
                src="/images/3d-login.png"
              />
            </motion.div>
            
            <div>
              <h1 className="font-h text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                The Future of <br/> Clinical Documentation.
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                Harnessing advanced generative AI to transform patient conversations into secure, accurate medical intelligence in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Authentication Form */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="md:hidden flex justify-center mb-8">
              <h2 className="text-3xl font-h font-bold text-white">MediVoice AI</h2>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-8">
              <button className="flex-1 pb-4 font-bold text-xs uppercase tracking-widest text-primary border-b-2 border-primary">Sign In</button>
              <Link to={ROUTES.PUBLIC.REGISTER} className="flex-1 pb-4 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors text-center">Create Account</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">I am a</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole(ROLES.DOCTOR)}
                    className={`flex items-center justify-center py-4 border rounded-xl transition-all duration-300 ${role === ROLES.DOCTOR ? 'border-primary bg-primary/20 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(ROLES.PATIENT)}
                    className={`flex items-center justify-center py-4 border rounded-xl transition-all duration-300 ${role === ROLES.PATIENT ? 'border-primary bg-primary/20 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Patient
                  </button>
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    id="email" 
                    type="email"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block" htmlFor="password">Password</label>
                  <Link className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-indigo-300 transition-colors" to={ROUTES.PUBLIC.FORGOT_PASSWORD}>Forgot password?</Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">lock</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-8 relative overflow-hidden group"
              >
                <span className="relative z-10">{loading ? 'Authenticating...' : 'Access Portal'}</span>
                {!loading && <span className="material-symbols-outlined relative z-10">arrow_forward</span>}
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
              </motion.button>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="relative py-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center"><span className="bg-gray-950 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">OR</span></div>
              </motion.div>

              {/* SSO Button */}
              <motion.button 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                type="button"
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">key</span>
                Sign in with SSO
              </motion.button>
            </form>

            {/* Security Badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">HIPAA Compliant</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">encrypted</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">End-to-End Encryption</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">phonelink_lock</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">OTP Secured</span>
              </div>
            </motion.div>

            {/* Global Footer */}
            <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 flex flex-col items-center gap-4">
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">© 2024 MediVoice AI. Secure Medical Intelligence.</p>
              <div className="flex gap-4">
                <a className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-all" href="#">Privacy Policy</a>
                <a className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-all" href="#">Terms of Service</a>
              </div>
            </motion.footer>
          </div>
        </section>
      </motion.div>
    </main>
  );
};

export default Login;
