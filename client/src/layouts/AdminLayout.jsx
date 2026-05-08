import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  const navLinks = [
    { name: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
    { name: 'Patient Data', path: '/admin/patients', icon: 'patient_list' },
    { name: 'Users', path: ROUTES.ADMIN.USERS, icon: 'group' },
    { name: 'Security Monitor', path: ROUTES.ADMIN.SECURITY, icon: 'security' },
    { name: 'System Logs', path: ROUTES.ADMIN.LOGS, icon: 'terminal' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-md bg-surface dark:bg-inverse-surface border-r border-outline-variant dark:border-outline shadow-sm z-50">
        <div className="px-md mb-xl">
          <h1 className="font-h3 text-h3 font-bold text-primary dark:text-primary-fixed">MediVoice AI</h1>
          <p className="font-label text-label text-on-surface-variant">Admin Portal</p>
        </div>
        <nav className="flex-grow space-y-xs">
          {navLinks.map(link => {
            const isActive = location.pathname.includes(link.path);
            let linkClass = "flex items-center gap-sm px-md py-sm transition-colors active:scale-95 duration-150 ";
            linkClass += isActive 
              ? "text-primary dark:text-primary-fixed font-bold border-r-4 border-primary dark:border-primary-fixed bg-primary-fixed/10"
              : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest";
              
            return (
              <Link key={link.name} to={link.path} className={linkClass}>
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-body-md">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-md space-y-xs">
          <button className="w-full bg-primary-container text-on-primary font-bold py-sm rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all mb-md">
            New Report
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-sm py-sm text-on-surface-variant dark:text-surface-variant hover:text-error transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label text-label">Log Out</span>
          </button>
        </div>
      </aside>

      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-50 flex justify-between items-center h-16 px-gutter ml-64 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md border-b border-outline-variant dark:border-outline shadow-sm">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full focus-within:ring-2 focus-within:ring-primary rounded-lg transition-all">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="w-full pl-10 pr-md py-base bg-surface-container-low border-none rounded-lg focus:ring-0 text-body-md" placeholder="Search platform data..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-md ml-gutter">
          <button className="relative p-xs text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="h-8 w-px bg-outline-variant mx-xs"></div>
          <div className="flex items-center gap-sm">
            <div className="text-right">
              <p className="font-label text-label text-on-surface leading-tight">{user?.firstName || 'A'} {user?.lastName || 'Admin'}</p>
              <p className="font-label text-[10px] text-outline uppercase tracking-wider">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-error ring-2 ring-error/30">
              {user?.firstName?.[0] || 'A'}
            </div>
          </div>
        </div>
      </header>

      <main className="ml-64 mt-16 p-gutter min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
