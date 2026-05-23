import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeInsights, setActiveInsights] = useState([]);

  const handleDismiss = (id) => {
    setActiveInsights(prev => prev.filter(insight => insight.id !== id));
  };

  const handleOptimize = async (insight) => {
    // Simulate optimization
    toast.success(`Optimizing schedule for ${insight.patientName}...`);
    handleDismiss(insight.id);
  };

  const handlePrioritize = (patientName) => {
    toast.success(`Prioritizing ${patientName} in the queue...`);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/doctor/dashboard');
        setStats(res.data.data);
        setActiveInsights(res.data.data.aiInsights || []);
      } catch (error) {
        console.error('Error fetching doctor dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-lg max-w-7xl mx-auto space-y-lg animate-fade-in relative z-10">
      {/* Top Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Today's Appointments */}
        <div className="bg-primary text-white p-md rounded-2xl shadow-xl shadow-primary/20 dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col justify-between transform hover:scale-[1.02] transition-all cursor-pointer group dark:bg-indigo-600/80 dark:border dark:border-white/10">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-white/20 p-xs rounded-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-white">calendar_today</span>
            </div>
            <span className="text-white/80 text-[10px] font-bold uppercase flex items-center bg-white/10 px-2 py-0.5 rounded-full">+5%</span>
          </div>
          <div>
            <p className="text-white/70 text-[10px] font-bold uppercase mb-xs tracking-wider">Today's Appointments</p>
            <h3 className="font-h text-3xl text-white">{stats?.todayAppointmentsCount || 0}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-full h-full text-white" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,25 Q10,15 20,20 T40,10 T60,18 T80,5 T100,12" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Card 2: Completed Calls */}
        <div className="bg-secondary text-white p-md rounded-2xl shadow-xl shadow-secondary/20 dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col justify-between transform hover:scale-[1.02] transition-all cursor-pointer group dark:bg-sky-500/80 dark:border dark:border-white/10">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-white/20 p-xs rounded-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-white">call_made</span>
            </div>
            <span className="text-white/80 text-[10px] font-bold uppercase flex items-center bg-white/10 px-2 py-0.5 rounded-full">+2%</span>
          </div>
          <div>
            <p className="text-white/70 text-[10px] font-bold uppercase mb-xs tracking-wider">Completed Calls</p>
            <h3 className="font-h text-3xl text-white">{stats?.completedConsultationsCount || 0}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-full h-full text-white" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,28 Q15,25 30,22 T50,15 T70,10 T85,12 T100,5" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Queue */}
        <div className="bg-tertiary text-white p-md rounded-2xl shadow-xl shadow-tertiary/20 dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col justify-between transform hover:scale-[1.02] transition-all cursor-pointer group dark:bg-rose-500/80 dark:border dark:border-white/10">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-white/20 p-xs rounded-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-white">queue</span>
            </div>
            <span className="text-white/80 text-[10px] font-bold uppercase flex items-center bg-white/10 px-2 py-0.5 rounded-full">-1%</span>
          </div>
          <div>
            <p className="text-white/70 text-[10px] font-bold uppercase mb-xs tracking-wider">Pending Queue</p>
            <h3 className="font-h text-3xl text-white">{stats?.queueCount || 0}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-full h-full text-white" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,5 Q20,8 40,12 T60,20 T80,25 T100,22" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Card 4: New Patients */}
        <div className="bg-primary-container text-white p-md rounded-2xl shadow-xl shadow-primary/20 dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex flex-col justify-between transform hover:scale-[1.02] transition-all cursor-pointer group dark:bg-indigo-900/80 dark:border dark:border-white/10">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-white/20 p-xs rounded-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-white">person_add</span>
            </div>
            <span className="text-white/80 text-[10px] font-bold uppercase flex items-center bg-white/10 px-2 py-0.5 rounded-full">+10%</span>
          </div>
          <div>
            <p className="text-white/70 text-[10px] font-bold uppercase mb-xs tracking-wider">New Patients</p>
            <h3 className="font-h text-3xl text-white">{stats?.totalPatients || 0}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-30 group-hover:opacity-50 transition-opacity">
            <svg className="w-full h-full text-white" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,25 L10,22 L25,18 L40,15 L60,10 L80,5 L100,2" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Main Layout: Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left/Main Column: Patient Queue */}
        <section className="lg:col-span-2 space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="font-h text-2xl text-on-surface dark:text-white">Patient Queue</h2>
            <button 
              onClick={() => navigate('/doctor/queue')}
              className="text-primary dark:text-indigo-300 font-bold text-sm hover:underline flex items-center gap-1"
            >
              View Full Queue <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl border border-outline-variant dark:border-white/10 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low dark:bg-white/5 border-b border-outline-variant dark:border-white/10">
                <tr>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-300 tracking-wider">Patient</th>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-300 tracking-wider">Time</th>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-300 tracking-wider">Status</th>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-300 tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant dark:divide-white/10">
                {stats?.todayAppointments?.length > 0 ? stats.todayAppointments.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-md py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-indigo-300 font-bold">
                          {app.patientId?.firstName?.[0] || 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-on-surface dark:text-white">{app.patientId?.firstName} {app.patientId?.lastName}</p>
                            <span className="px-1.5 py-0.5 bg-primary/5 dark:bg-primary/20 text-primary dark:text-indigo-300 text-[8px] font-black rounded-md border border-primary/10 dark:border-white/10 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">pill</span> {app.prescriptionCount || 0}
                            </span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant dark:text-gray-400 uppercase">ID: {app.patientId?._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-sm text-on-surface dark:text-gray-300">{app.timeSlot}</td>
                    <td className="px-md py-md">
                      <span className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'scheduled' ? 'bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-sky-300' : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-indigo-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-md py-md text-right">
                      <button 
                        onClick={() => navigate(`/consultation/${app._id}`)}
                        className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:brightness-110 dark:hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all uppercase tracking-widest shadow-md shadow-primary/10"
                      >
                        Start Session
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-md py-8 text-center text-on-surface-variant dark:text-gray-400 opacity-60 italic">
                      No appointments scheduled for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Alerts & Insights */}
        <aside className="space-y-lg">
          {/* Urgent Alerts */}
          <div className="space-y-md">
            <h2 className="font-h text-xl text-on-surface dark:text-white">Urgent Alerts</h2>
            {stats?.urgentAlerts?.length > 0 ? stats.urgentAlerts.map((alert) => (
              <div key={alert._id} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-md rounded-xl border border-outline-variant/30 dark:border-white/10 border-l-4 border-l-error dark:border-l-error shadow-lg animate-pulse-subtle">
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-error fill-current">warning</span>
                  <span className="text-[10px] font-bold text-error uppercase tracking-widest">High Risk Flag</span>
                </div>
                <div className="flex items-center gap-sm mb-md">
                  <div className="w-10 h-10 rounded-full bg-error/10 dark:bg-error/20 flex items-center justify-center text-error dark:text-red-300 font-bold">
                    {alert.patientId?.firstName?.[0] || 'P'}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface dark:text-white text-sm">{alert.patientId?.firstName} {alert.patientId?.lastName}</p>
                    <p className="text-[10px] text-on-surface-variant dark:text-gray-400 uppercase">AI Chat Intake • Just now</p>
                  </div>
                </div>
                <div className="bg-error/5 dark:bg-error/10 p-sm rounded-lg mb-md">
                  <p className="text-[10px] font-bold text-error uppercase mb-xs">Detected Symptoms:</p>
                  <p className="text-xs text-on-surface-variant dark:text-gray-300">{alert.chiefComplaint}</p>
                </div>
                <button 
                  onClick={() => handlePrioritize(`${alert.patientId?.firstName} ${alert.patientId?.lastName}`)}
                  className="w-full bg-error text-white py-2 rounded-lg font-bold text-xs hover:bg-red-700 transition-all active:scale-95 shadow-md"
                >
                  Prioritize Patient
                </button>
              </div>
            )) : (
              <div className="p-md bg-surface-container-lowest dark:bg-white/5 rounded-xl border border-outline-variant dark:border-white/10 text-center opacity-60 italic text-xs text-on-surface-variant dark:text-gray-400">
                No urgent alerts today.
              </div>
            )}
          </div>

          {/* AI Insights */}
          {activeInsights.map((insight) => (
            <section key={insight.id} className="bg-primary-container/10 dark:bg-indigo-950/20 p-md rounded-xl border border-primary/20 dark:border-indigo-500/30 flex flex-col gap-md animate-fade-in">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 bg-primary/10 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary dark:text-indigo-400 fill-current">psychology</span>
                </div>
                <h4 className="font-h text-lg text-primary dark:text-indigo-300">{insight.title}</h4>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-gray-300" dangerouslySetInnerHTML={{ __html: insight.message }} />
              <div className="flex gap-sm">
                <button 
                  onClick={() => handleOptimize(insight)}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase shadow-sm hover:brightness-110 active:scale-95 transition-all"
                >
                  {insight.actionLabel}
                </button>
                <button 
                  onClick={() => handleDismiss(insight.id)}
                  className="text-primary dark:text-indigo-300 px-4 py-2 rounded-lg text-[10px] font-bold uppercase border border-primary/20 dark:border-indigo-500/30 hover:bg-primary/5 dark:hover:bg-white/5 active:scale-95 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </section>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default DoctorDashboard;
