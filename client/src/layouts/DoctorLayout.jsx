import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const DoctorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: 'dashboard' },
    { name: 'Patient Queue', path: '/doctor/queue', icon: 'groups' },
    { name: 'Clinical Notes', path: '/doctor/notes', icon: 'history_edu' },
    { name: 'Analytics', path: '/doctor/analytics', icon: 'monitoring' },
  ];

  return (
    <div className="min-h-screen bg-background font-body text-on-surface selection:bg-primary/10">
      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 flex justify-between items-center px-md">
        <div className="flex items-center gap-md">
          <span className="md:hidden font-h text-xl font-bold text-primary">MediVoice AI</span>
          <div className="hidden md:flex items-center bg-surface-container-low px-sm py-1.5 rounded-full border border-outline-variant/30 w-64 ml-64">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs w-full ml-xs" placeholder="Search patients or records..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs px-sm py-1 bg-secondary/10 text-secondary rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">On Call</span>
          </div>
          <button className="p-2 hover:bg-surface-container-high rounded-full transition-all text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="flex items-center gap-sm">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface">Dr. {user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{user?.specialization || 'Senior Clinician'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-secondary/20 border-2 border-white">
              {user?.lastName?.[0] || 'D'}
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
              <span className="material-symbols-outlined fill-current">health_metrics</span>
            </div>
            <div>
              <h1 className="font-h text-lg font-bold text-primary">MediVoice AI</h1>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Provider Suite</p>
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
          <button className="w-full py-3 bg-secondary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm">emergency_home</span>
            Emergency Hub
          </button>
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

export default DoctorLayout;
