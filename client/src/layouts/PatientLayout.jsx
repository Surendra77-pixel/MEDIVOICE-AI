import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import api from '../services/api.js';

const PatientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || false;
  });

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
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/reminders');
        setNotifications(res.data.data.reminders || res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: 'dashboard' },
    { name: 'Symptom Checker', path: '/patient/chatbot', icon: 'stethoscope' },
    { name: 'Live Translator', path: '/patient/translator', icon: 'translate' },
    { name: 'Find Doctors', path: '/patient/find-doctors', icon: 'person_search' },
    { name: 'Book Appointment', path: '/patient/book', icon: 'calendar_today' },
    { name: 'Medical Vault', path: '/patient/history', icon: 'folder_shared' },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: 'prescriptions' },
    { name: 'Hospital Finder', path: '/patient/hospitals', icon: 'map' },
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
          <span className="md:hidden font-h text-xl font-bold text-primary">MediVoice AI</span>
          <div className="hidden md:flex items-center bg-surface-container-low dark:bg-black/40 px-sm py-1.5 rounded-full border border-outline-variant/30 dark:border-white/10 w-64 ml-64 focus-within:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-gray-400 text-[18px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs text-on-surface dark:text-white placeholder-on-surface-variant/60 dark:placeholder-gray-500 w-full ml-xs" placeholder="Search health records..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-md">
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

          <div className="relative" ref={notifRef}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 hover:bg-surface-container-high dark:hover:bg-white/10 rounded-full transition-all text-on-surface-variant dark:text-gray-300 relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.some(n => !n.isAcknowledged) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error dark:bg-secondary rounded-full border-2 border-white dark:border-gray-950 animate-pulse"></span>
              )}
            </motion.button>
            
            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-outline-variant/30 dark:border-white/10 overflow-hidden z-[100]"
              >
                <div className="p-md bg-surface-container-low dark:bg-white/5 border-b border-outline-variant/30 dark:border-white/10 flex justify-between items-center">
                  <h3 className="font-h text-sm text-primary dark:text-white font-bold">Notifications</h3>
                  <span className="text-[10px] font-bold bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-full border border-transparent dark:border-primary/30">{notifications.length} New</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif._id} className="p-md border-b border-outline-variant/20 dark:border-white/5 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-sm">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.drugName ? 'bg-secondary/10 dark:bg-secondary/20 text-secondary dark:border border-secondary/30' : 'bg-primary/10 dark:bg-primary/20 text-primary dark:border border-primary/30'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {notif.drugName ? 'medication' : 'event_note'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface dark:text-white">{notif.notificationTitle || notif.drugName || 'New Reminder'}</h4>
                        <p className="text-[11px] text-on-surface-variant dark:text-gray-400 mt-0.5">{notif.notificationBody || notif.instructions || 'Check your schedule.'}</p>
                        <p className="text-[9px] font-bold text-on-surface-variant/60 dark:text-primary uppercase mt-1">
                          {notif.scheduledTime || 'Scheduled'}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-xl text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-500">
                      <span className="material-symbols-outlined text-4xl opacity-20 mb-2">notifications_paused</span>
                      <p className="text-xs">You're all caught up!</p>
                    </div>
                  )}
                </div>
                <div className="p-2 bg-surface-container-low dark:bg-white/5 border-t border-outline-variant/30 dark:border-white/10 text-center">
                  <Link to="/patient/prescriptions" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline dark:hover:text-white transition-colors" onClick={() => setIsNotifOpen(false)}>View All Reminders</Link>
                </div>
              </motion.div>
            )}
          </div>
          <div className="h-8 w-px bg-outline-variant/30 dark:bg-white/10"></div>
          <div className="flex items-center gap-sm">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface dark:text-white">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-on-surface-variant dark:text-primary uppercase tracking-widest">Patient Portal</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-primary dark:bg-gradient-to-br dark:from-primary dark:to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 dark:shadow-[0_0_15px_rgba(37,99,235,0.5)] border-2 border-white dark:border-white/20 cursor-pointer"
            >
              {user?.firstName?.[0] || 'U'}
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout} 
              className="ml-2 p-2 rounded-full transition-colors text-on-surface-variant dark:text-gray-400" 
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </motion.button>
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
              <p className="text-[9px] font-bold text-on-surface-variant dark:text-gray-500 uppercase tracking-widest">Clinical Excellence</p>
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
                  ? 'text-white' 
                  : 'text-on-surface-variant hover:bg-surface-container-high dark:text-gray-400 dark:hover:text-white hover:translate-x-2'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-primary dark:bg-gradient-to-r dark:from-primary/80 dark:to-primary/20 border border-transparent dark:border-primary/50 rounded-xl shadow-lg shadow-primary/20 dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`material-symbols-outlined relative z-10 ${isActive ? 'fill-current text-white' : 'group-hover:text-primary transition-colors'}`}>
                  {link.icon}
                </span>
                <span className="text-sm font-semibold relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-md mt-auto relative z-10">
          <div className="bg-primary/5 dark:bg-white/5 backdrop-blur-xl border border-primary/10 dark:border-white/10 rounded-2xl p-md shadow-sm dark:shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">AI Health Assistant</p>
            <p className="text-[11px] text-on-surface-variant dark:text-gray-400 mb-4">Check your symptoms instantly with our advanced AI triage system.</p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/patient/chatbot" className="w-full py-2.5 bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-secondary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-md dark:shadow-[0_0_15px_rgba(37,99,235,0.4)] relative z-10 border border-transparent dark:border-white/20 hover:brightness-110">
                <span className="material-symbols-outlined text-[16px]">psychiatry</span>
                Start Check
              </Link>
            </motion.div>
          </div>
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
    </div>
  );
};

export default PatientLayout;
