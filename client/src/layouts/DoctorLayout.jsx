import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-hot-toast';

const DoctorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || false;
  });

  // Emergency Hub state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeAmbulanceEta, setActiveAmbulanceEta] = useState(4); // minutes
  const [traumaTeamStatus, setTraumaTeamStatus] = useState('Standby Alerted');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (!isEmergencyOpen) return;
    const interval = setInterval(() => {
      setActiveAmbulanceEta(prev => (prev > 1 ? prev - 1 : 4));
    }, 15000); // countdown every 15s when modal is open
    return () => clearInterval(interval);
  }, [isEmergencyOpen]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const handleNotifyER = () => {
    toast.success('Trauma ER Team notified! Cardiologist standby activated.', {
      icon: '🚨',
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
    setTraumaTeamStatus('Active - Preparing Bay');
  };

  const handleReroute = () => {
    toast.error('CCU Ambulance #402 rerouted to City General Cardiology Unit!', {
      icon: '🚑',
      style: {
        background: '#f59e0b',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  const handleDispatchCCU = () => {
    toast.success('System SOS Beacon Broadcasted. General alarm sounded in ER.', {
      icon: '🔔',
      style: {
        background: '#dc2626',
        color: '#fff',
        fontWeight: 'bold',
      }
    });
  };

  const navLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: 'dashboard' },
    { name: 'Patient Queue', path: '/doctor/queue', icon: 'groups' },
    { name: 'Clinical Notes', path: '/doctor/notes', icon: 'history_edu' },
    { name: 'Live Translator', path: '/doctor/translator', icon: 'translate' },
    { name: 'Analytics', path: '/doctor/analytics', icon: 'monitoring' },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 font-body text-on-surface dark:text-white selection:bg-primary/30 relative overflow-x-hidden transition-colors duration-500">
      {/* 3D Animated Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.4, 0.3], rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 dark:bg-secondary/20 rounded-full blur-[100px] pointer-events-none z-0"
      ></motion.div>

      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border-b border-outline-variant/30 dark:border-white/10 h-16 flex justify-between items-center px-md shadow-sm dark:shadow-lg dark:shadow-black/50 transition-colors duration-500">
        <div className="flex items-center gap-md">
          <span className="md:hidden font-h text-xl font-bold text-primary dark:text-white">MediVoice AI</span>
          <div className="hidden md:flex items-center bg-surface-container-low dark:bg-black/40 px-sm py-1.5 rounded-full border border-outline-variant/30 dark:border-white/10 w-64 ml-64 focus-within:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-gray-400 text-[18px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs text-on-surface dark:text-white placeholder-on-surface-variant/60 dark:placeholder-gray-500 w-full ml-xs" placeholder="Search patients or records..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs px-sm py-1 bg-secondary/10 text-secondary dark:text-sky-400 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary dark:bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary dark:bg-sky-400"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">On Call</span>
          </div>

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-surface-container-high dark:hover:bg-white/10 rounded-full transition-all text-on-surface-variant dark:text-gray-300"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </motion.button>

          <button className="p-2 hover:bg-surface-container-high dark:hover:bg-white/10 rounded-full transition-all text-on-surface-variant dark:text-gray-300">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-px bg-outline-variant/30 dark:bg-white/10"></div>
          <div className="flex items-center gap-sm">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface dark:text-white">Dr. {user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-on-surface-variant dark:text-primary uppercase tracking-widest">{user?.specialization || 'Senior Clinician'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary dark:bg-gradient-to-br dark:from-primary dark:to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-secondary/20 dark:shadow-[0_0_15px_rgba(37,99,235,0.5)] border-2 border-white dark:border-white/20">
              {user?.lastName?.[0] || 'D'}
            </div>
            <button onClick={handleLogout} className="ml-2 p-2 hover:bg-error/10 hover:text-error rounded-full transition-all text-on-surface-variant dark:text-gray-400" title="Logout">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border-r border-outline-variant/30 dark:border-white/10 shadow-md dark:shadow-[20px_0_40px_rgba(0,0,0,0.5)] z-40 hidden md:flex flex-col pt-4 transition-colors duration-500">
        <div className="px-md mb-lg relative z-10">
          <div className="flex items-center gap-sm mt-2">
            <motion.div 
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-primary dark:bg-gradient-to-br dark:from-primary dark:to-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 dark:shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-transparent dark:border-white/20"
            >
              <span className="material-symbols-outlined fill-current">medical_services</span>
            </motion.div>
            <div>
              <h1 className="font-h text-lg font-bold text-primary dark:text-white tracking-wide">MediVoice <span className="dark:text-primary">AI</span></h1>
              <p className="text-[9px] font-bold text-on-surface-variant dark:text-gray-500 uppercase tracking-widest">Provider Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-sm space-y-2 relative z-10">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-3 px-md py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                  ? 'text-white font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high dark:text-gray-400 dark:hover:text-white hover:translate-x-2'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeDoctorNavIndicator"
                    className="absolute inset-0 bg-primary dark:bg-gradient-to-r dark:from-primary/80 dark:to-primary/20 border border-transparent dark:border-primary/50 rounded-xl shadow-lg shadow-primary/20 dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`material-symbols-outlined relative z-10 ${isActive ? 'fill-current text-white' : 'group-hover:text-primary transition-colors'}`}>
                  {link.icon}
                </span>
                <span className="text-sm relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-md mt-auto relative z-10">
          <button 
            onClick={() => setIsEmergencyOpen(true)}
            className="w-full py-3 bg-red-600 dark:bg-gradient-to-r dark:from-red-600 dark:to-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 dark:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:brightness-110 active:scale-95 transition-all border border-transparent dark:border-white/20"
          >
            <span className="material-symbols-outlined text-sm animate-pulse">emergency_home</span>
            Emergency Hub
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 px-md pb-md md:px-lg md:pb-lg min-h-screen relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-container-max mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Emergency Operations Center (EOC) Modal */}
      <AnimatePresence>
        {isEmergencyOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-950/90 border border-red-500/35 rounded-3xl p-md md:p-lg text-white shadow-[0_0_50px_rgba(239,68,68,0.3)] backdrop-blur-3xl overflow-hidden"
            >
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[90px] pointer-events-none z-0" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none z-0" />

              {/* Close Button */}
              <button
                onClick={() => setIsEmergencyOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
              >
                <span className="material-symbols-outlined text-md">close</span>
              </button>

              <div className="relative z-10 space-y-md">
                {/* Header */}
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <span className="material-symbols-outlined text-2xl animate-pulse">emergency_share</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-h text-xl font-bold uppercase tracking-wider text-red-500">Emergency Operations</h2>
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Trauma & Dispatch Coordination Console</p>
                  </div>
                </div>

                {/* Critical Alert Warning banner */}
                <div className="p-sm bg-red-950/20 border border-red-500/20 rounded-xl flex items-center gap-sm">
                  <span className="material-symbols-outlined text-red-400 animate-bounce">warning</span>
                  <p className="text-xs text-red-300">
                    <span className="font-bold">ACTIVE BREACH:</span> SOS distress signal received from Cardiac Patient. GPS Tracker locked.
                  </p>
                </div>

                {/* Main Console Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Left Panel: Active Case Details */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-md space-y-sm">
                    <div className="flex justify-between items-center border-b border-white/10 pb-xs">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Patient Dispatch</span>
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[8px] font-black rounded uppercase">RED ALERT</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-md text-white">Arthur Morgan</h4>
                      <p className="text-[9px] text-gray-400 uppercase">DOB: June 22, 1863 • Male</p>
                    </div>
                    <div className="bg-black/30 p-sm rounded-lg border border-white/5 space-y-1">
                      <p className="text-[9px] font-bold text-red-400 uppercase">Chief Complaint:</p>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Severe tightness in chest, persistent coughing fits with blood-tinged sputum, and acute dyspnea.
                      </p>
                    </div>
                    <div className="space-y-xs">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">CCU Ambulance #402:</span>
                        <span className="font-bold text-red-400 animate-pulse">{activeAmbulanceEta} Mins ETA</span>
                      </div>
                      {/* Visual Ambulance Progress Bar */}
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 transition-all duration-1000 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                          style={{ width: `${100 - (activeAmbulanceEta * 20)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Panel: Hospital & Support Standby Status */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-md space-y-md">
                    <div className="flex justify-between items-center border-b border-white/10 pb-xs">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ER Bay Readiness</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[8px] font-black rounded uppercase">CONNECTED</span>
                    </div>

                    <div className="space-y-sm">
                      {/* Bed Capacities */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-xs">Hospital ER Capacities:</p>
                        <div className="space-y-xs">
                          <div className="flex justify-between text-xs bg-black/20 p-xs rounded border border-white/5">
                            <span className="text-gray-300">City General Hospital ER</span>
                            <span className="font-bold text-green-400">2 Beds Free</span>
                          </div>
                          <div className="flex justify-between text-xs bg-black/20 p-xs rounded border border-white/5">
                            <span className="text-gray-300">Fortis Trauma Center ER</span>
                            <span className="font-bold text-amber-400">7 Beds Free</span>
                          </div>
                        </div>
                      </div>

                      {/* Standby Team Status */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-xs">Medical Staff Team Status:</p>
                        <div className="bg-black/20 p-sm rounded border border-white/5 flex items-center justify-between text-xs">
                          <span className="text-gray-300">Trauma Team ER:</span>
                          <span className="font-bold text-red-400 animate-pulse uppercase tracking-wider">{traumaTeamStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations Control Actions Panel */}
                <div className="border-t border-white/10 pt-md">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-sm">Operations Controller Commands</p>
                  <div className="grid grid-cols-3 gap-sm">
                    <button
                      onClick={handleNotifyER}
                      className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95"
                    >
                      Alert ER Team
                    </button>
                    <button
                      onClick={handleReroute}
                      className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95"
                    >
                      Reroute CCU
                    </button>
                    <button
                      onClick={handleDispatchCCU}
                      className="py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-[10px] rounded-xl uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 border border-white/10"
                    >
                      SOS Beacon
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorLayout;
