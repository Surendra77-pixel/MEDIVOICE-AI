import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.PATIENT,
    licenseNumber: '',
    city: 'Hyderabad',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await signup(formData);
      toast.success('Registration successful! You can now log in.');
      navigate(ROUTES.PUBLIC.LOGIN);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : (error.message || 'Registration failed'));
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
                src="/images/3d-register.png"
              />
            </motion.div>
            
            <div>
              <h1 className="font-h text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
                Join the Future <br/> of Medical Care.
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                Create your clinical identity today and experience the power of AI-driven healthcare communication.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Registration Form */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-8">
              <Link to={ROUTES.PUBLIC.LOGIN} className="flex-1 pb-4 font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors text-center">Sign In</Link>
              <button className="flex-1 pb-4 font-bold text-xs uppercase tracking-widest text-primary border-b-2 border-primary">Create Account</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Registering as</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.DOCTOR })}
                    className={`flex items-center justify-center py-3 border rounded-xl transition-all duration-300 ${formData.role === ROLES.DOCTOR ? 'border-primary bg-primary/20 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.PATIENT })}
                    className={`flex items-center justify-center py-3 border rounded-xl transition-all duration-300 ${formData.role === ROLES.PATIENT ? 'border-primary bg-primary/20 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    Patient
                  </button>
                </div>
              </motion.div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">First Name</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Last Name</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              </div>

              {/* Email & City Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    name="email"
                    type="email"
                    placeholder="name@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">City</label>
                  <select 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600 [&>option]:bg-gray-900" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Goa">Goa</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                </motion.div>
              </div>

              {/* License Number (Doctor only) */}
              {formData.role === ROLES.DOCTOR && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Medical License Number</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    name="licenseNumber"
                    placeholder="LIC-12345678"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Confirm</label>
                  <input 
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder-gray-600" 
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-8 relative overflow-hidden group"
              >
                <span className="relative z-10">{loading ? 'Registering...' : 'Create Account'}</span>
                {!loading && <span className="material-symbols-outlined relative z-10">person_add</span>}
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
              </motion.button>
            </form>

            {/* Security Badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">HIPAA Compliant</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">encrypted</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">AES-256</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">phonelink_lock</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">OTP Verified</span>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </main>
  );
};

export default Register;
