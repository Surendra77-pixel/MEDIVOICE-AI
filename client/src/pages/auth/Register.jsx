import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    licenseNumber: '', // For doctors
    city: 'Hyderabad', // Default city to match the first option in the select
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
      toast.success('Registration successful! Please verify your email.');
      navigate(ROUTES.PUBLIC.VERIFY_OTP, { state: { email: formData.email, role: formData.role } });
    } catch (error) {
      toast.error(typeof error === 'string' ? error : (error.message || 'Registration failed'));
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
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxBN1j3KBgdkIBFIt4fBM1a6JHL0tIPtz68RRQfb79qE5aZooYpnSbqhrE7iWxEHbfHkN_69oFTlFVbJhEJ2FobpTOFlvTWhvdyXwmlQcu3bYa1qukcuuHTi5YQWHjNikb7q1C-cUbsNPk4MM3oKeIcxsCXD94n7nb8IUAgY40ZkaFdqQSg8fro-FRVgyqhhzm7gDX5j71zvdBlDehQpp3p9pJczJbjooqO6CRDPOGu61zC7o-wZoZabJV5QE3PdwB4KpXk6RVMEk"
            />
          </div>
          <div className="space-y-md">
            <h1 className="font-h text-5xl leading-tight">Join the Future <br/> of Medical Care.</h1>
            <p className="text-lg text-on-primary-container leading-relaxed opacity-90">
              Create your clinical identity today and experience the power of AI-driven healthcare communication and documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-md md:p-xl bg-surface animate-slide-up overflow-y-auto">
        <div className="w-full max-w-md py-lg">
          <div className="glass-card rounded-xl border border-outline-variant/30 p-md md:p-lg shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant/30 mb-md">
              <Link to={ROUTES.PUBLIC.LOGIN} className="flex-1 py-sm font-bold text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors text-center">Sign In</Link>
              <button className="flex-1 py-sm font-bold text-xs uppercase tracking-wider text-primary border-b-2 border-primary">Create Account</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-sm">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Registering as</label>
                <div className="grid grid-cols-2 gap-sm">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.DOCTOR })}
                    className={`flex items-center justify-center p-sm border rounded-lg transition-all ${formData.role === ROLES.DOCTOR ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant/30 text-on-surface-variant'}`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.PATIENT })}
                    className={`flex items-center justify-center p-sm border rounded-lg transition-all ${formData.role === ROLES.PATIENT ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant/30 text-on-surface-variant'}`}
                  >
                    Patient
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">First Name</label>
                  <input 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Last Name</label>
                  <input 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email & City Grid */}
              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Email Address</label>
                  <input 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    name="email"
                    type="email"
                    placeholder="name@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">City</label>
                  <select 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
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
                </div>
              </div>

              {/* License Number (Doctor only) */}
              {formData.role === ROLES.DOCTOR && (
                <div className="animate-fade-in">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Medical License Number</label>
                  <input 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    name="licenseNumber"
                    placeholder="LIC-12345678"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Password</label>
                  <input 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-xs">Confirm</label>
                  <input 
                    className="w-full px-md py-sm bg-surface border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-sm rounded-lg font-h font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-sm disabled:opacity-50 mt-md"
              >
                {loading ? 'Registering...' : 'Create Account'}
                {!loading && <span className="material-symbols-outlined">person_add</span>}
              </button>
            </form>

            {/* Security Badges */}
            <div className="mt-md pt-md border-t border-outline-variant/20 grid grid-cols-3 gap-xs">
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[20px] fill-current">verified_user</span>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase mt-xs">HIPAA Compliant</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[20px] fill-current">encrypted</span>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase mt-xs">AES-256</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary text-[20px] fill-current">phonelink_lock</span>
                <span className="text-[8px] font-bold text-on-surface-variant uppercase mt-xs">OTP Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
