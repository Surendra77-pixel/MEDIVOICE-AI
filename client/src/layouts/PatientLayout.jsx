import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const PatientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: 'dashboard' },
    { name: 'Symptom Checker', path: '/patient/chatbot', icon: 'stethoscope' },
    { name: 'Find Doctors', path: '/patient/find-doctors', icon: 'person_search' },
    { name: 'Book Appointment', path: '/patient/book', icon: 'calendar_today' },
    { name: 'Medical Vault', path: '/patient/history', icon: 'folder_shared' },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: 'prescriptions' },
    { name: 'Hospital Finder', path: '/patient/hospitals', icon: 'map' },
  ];

  return (
    <div className="min-h-screen bg-background font-body text-on-surface selection:bg-primary/10">
      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 flex justify-between items-center px-md">
        <div className="flex items-center gap-md">
          <span className="md:hidden font-h text-xl font-bold text-primary">MediVoice AI</span>
          <div className="hidden md:flex items-center bg-surface-container-low px-sm py-1.5 rounded-full border border-outline-variant/30 w-64 ml-64">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs w-full ml-xs" placeholder="Search health records..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="flex items-center gap-sm">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Patient Portal</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 border-2 border-white">
              {user?.firstName?.[0] || 'U'}
            </div>
            <button onClick={handleLogout} className="ml-2 p-2 hover:bg-error/10 hover:text-error rounded-full transition-all" title="Logout">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-outline-variant/30 shadow-md z-40 hidden md:flex flex-col pt-4">
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined fill-current">medical_services</span>
            </div>
            <div>
              <h1 className="font-h text-lg font-bold text-primary">MediVoice AI</h1>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Clinical Excellence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-sm space-y-1">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-3 px-md py-3 rounded-xl transition-all group ${
                  isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill-current' : 'group-hover:text-primary transition-colors'}`}>
                  {link.icon}
                </span>
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-md mt-auto">
          <div className="bg-primary/5 rounded-2xl p-md border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">AI Health Assistant</p>
            <p className="text-[11px] text-on-surface-variant mb-3">Check your symptoms instantly with our AI triage system.</p>
            <Link to="/patient/chatbot" className="w-full py-2 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-widest text-center block shadow-md hover:brightness-110 transition-all">
              Start Check
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 pt-24 px-md pb-md md:px-lg md:pb-lg min-h-screen">
        <div className="max-w-container-max mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;
