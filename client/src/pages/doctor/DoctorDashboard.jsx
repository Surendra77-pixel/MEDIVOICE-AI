import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/doctor/dashboard');
        setStats(res.data.data);
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
    <div className="p-lg max-w-7xl mx-auto space-y-lg animate-fade-in">
      {/* Top Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Today's Appointments */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-primary/10 p-xs rounded-lg">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <span className="text-secondary text-[10px] font-bold uppercase flex items-center">+5% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-xs">Today's Appointments</p>
            <h3 className="font-h text-2xl text-on-surface">{stats?.todayAppointmentsCount || 24}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-40">
            <svg className="w-full h-full text-secondary" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,25 Q10,15 20,20 T40,10 T60,18 T80,5 T100,12" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Card 2: Completed Calls */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-secondary/10 p-xs rounded-lg">
              <span className="material-symbols-outlined text-secondary">call_made</span>
            </div>
            <span className="text-secondary text-[10px] font-bold uppercase flex items-center">+2% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-xs">Completed Calls</p>
            <h3 className="font-h text-2xl text-on-surface">{stats?.completedConsultationsCount || 18}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-40">
            <svg className="w-full h-full text-secondary" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,28 Q15,25 30,22 T50,15 T70,10 T85,12 T100,5" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Queue */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-tertiary/10 p-xs rounded-lg">
              <span className="material-symbols-outlined text-tertiary">queue</span>
            </div>
            <span className="text-error text-[10px] font-bold uppercase flex items-center">-1% <span className="material-symbols-outlined text-[14px]">trending_down</span></span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-xs">Pending Queue</p>
            <h3 className="font-h text-2xl text-on-surface">{stats?.queueCount || 6}</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-40">
            <svg className="w-full h-full text-error" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,5 Q20,8 40,12 T60,20 T80,25 T100,22" fill="none" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Card 4: New Patients */}
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="bg-primary/10 p-xs rounded-lg">
              <span className="material-symbols-outlined text-primary">person_add</span>
            </div>
            <span className="text-secondary text-[10px] font-bold uppercase flex items-center">+10% <span className="material-symbols-outlined text-[14px]">trending_up</span></span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-xs">New Patients</p>
            <h3 className="font-h text-2xl text-on-surface">4</h3>
          </div>
          <div className="mt-md h-8 w-full opacity-40">
            <svg className="w-full h-full text-secondary" preserveAspectRatio="none" viewBox="0 0 100 30">
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
            <h2 className="font-h text-2xl text-on-surface">Patient Queue</h2>
            <button 
              onClick={() => navigate('/doctor/queue')}
              className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
            >
              View Full Queue <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Patient</th>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Time</th>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Status</th>
                  <th className="px-md py-sm text-[10px] font-bold uppercase text-on-surface-variant tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {stats?.todayAppointments?.length > 0 ? stats.todayAppointments.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-md py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {app.patientId.userId.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{app.patientId.userId.firstName} {app.patientId.userId.lastName}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase">ID: {app.patientId._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-sm text-on-surface">{app.timeSlot}</td>
                    <td className="px-md py-md">
                      <span className={`px-sm py-xs rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'scheduled' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-md py-md text-right">
                      <button 
                        onClick={() => navigate(`/consultation/${app._id}`)}
                        className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-widest shadow-md shadow-primary/10"
                      >
                        Start Session
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-md py-8 text-center text-on-surface-variant opacity-60 italic">
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
            <h2 className="font-h text-xl text-on-surface">Urgent Alerts</h2>
            <div className="glass-card p-md rounded-xl border-l-4 border-l-error shadow-lg">
              <div className="flex items-center gap-sm mb-sm">
                <span className="material-symbols-outlined text-error fill-current">warning</span>
                <span className="text-[10px] font-bold text-error uppercase tracking-widest">High Risk Flag</span>
              </div>
              <div className="flex items-center gap-sm mb-md">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error font-bold">S</div>
                <div>
                  <p className="font-bold text-on-surface text-sm">Sarah Miller</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">AI Chat Intake • 2m ago</p>
                </div>
              </div>
              <div className="bg-error/5 p-sm rounded-lg mb-md">
                <p className="text-[10px] font-bold text-error uppercase mb-xs">Detected Symptoms:</p>
                <p className="text-xs text-on-surface-variant">Acute Respiratory Distress reported via AI Symptom Checker.</p>
              </div>
              <button className="w-full bg-error text-white py-2 rounded-lg font-bold text-xs hover:bg-red-700 transition-all active:scale-95 shadow-md">
                Prioritize Patient
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <section className="bg-primary-container/10 p-md rounded-xl border border-primary/20 flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary fill-current">psychology</span>
              </div>
              <h4 className="font-h text-lg text-primary">AI Smart Schedule</h4>
            </div>
            <p className="text-xs text-on-surface-variant">
              Based on predicted consultation durations, we recommend optimizing your afternoon slot for <b>Arthur Morgan</b>.
            </p>
            <div className="flex gap-sm">
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase shadow-sm">Optimize</button>
              <button className="text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase border border-primary/20 hover:bg-primary/5 transition-all">Dismiss</button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default DoctorDashboard;
