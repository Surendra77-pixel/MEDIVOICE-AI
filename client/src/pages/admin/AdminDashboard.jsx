import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-sm">
            <div className="p-xs bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-secondary font-bold text-xs">+12.4%</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Users</p>
          <h2 className="font-h text-2xl text-on-surface mt-xs">{stats?.totalUsers || 12840}</h2>
        </div>
        <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-sm">
            <div className="p-xs bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <span className="text-secondary font-bold text-xs">+5.2%</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Consultations</p>
          <h2 className="font-h text-2xl text-on-surface mt-xs">{stats?.totalConsultations || 4215}</h2>
        </div>
        <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-secondary">
          <div className="flex items-center justify-between mb-sm">
            <div className="p-xs bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <span className="text-secondary font-bold text-xs">Peak</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Accuracy</p>
          <h2 className="font-h text-2xl text-on-surface mt-xs">99.4%</h2>
        </div>
        <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-sm">
            <div className="p-xs bg-error/10 rounded-lg text-error">
              <span className="material-symbols-outlined">security</span>
            </div>
            <span className="text-error font-bold text-xs">Normal</span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Security Events</p>
          <h2 className="font-h text-2xl text-on-surface mt-xs">28</h2>
        </div>
      </section>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg mb-lg">
        {/* Platform Growth Chart */}
        <div className="xl:col-span-2 glass-card rounded-xl p-md border border-outline-variant shadow-sm flex flex-col bg-white">
          <div className="flex justify-between items-center mb-md">
            <div>
              <h3 className="font-h text-xl text-on-surface">Platform Growth</h3>
              <p className="text-xs text-on-surface-variant">Registered Doctors vs Patients (Last 30 Days)</p>
            </div>
            <div className="flex gap-sm">
              <span className="flex items-center gap-xs text-[10px] font-bold text-on-surface-variant uppercase"><span className="w-2 h-2 rounded-full bg-primary"></span> Patients</span>
              <span className="flex items-center gap-xs text-[10px] font-bold text-on-surface-variant uppercase"><span className="w-2 h-2 rounded-full bg-secondary"></span> Doctors</span>
            </div>
          </div>
          <div className="relative flex-grow min-h-[300px] w-full mt-base">
            <svg className="w-full h-full opacity-60" viewBox="0 0 800 300">
              <path d="M0,280 Q100,240 200,250 T400,180 T600,120 T800,40" fill="none" stroke="#003d9b" strokeLinecap="round" strokeWidth="3"></path>
              <path d="M0,290 Q100,280 200,270 T400,240 T600,200 T800,150" fill="none" stroke="#00687b" strokeDasharray="8,4" strokeLinecap="round" strokeWidth="3"></path>
            </svg>
          </div>
        </div>

        {/* Doctor Verification Queue */}
        <div className="glass-card rounded-xl p-md border border-outline-variant shadow-sm flex flex-col bg-white">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-h text-xl text-on-surface">Verification Queue</h3>
            <span className="bg-primary/10 text-primary px-sm py-xs rounded-full text-[10px] font-bold">5 PENDING</span>
          </div>
          <div className="space-y-sm overflow-y-auto max-h-[400px] custom-scrollbar">
            {stats?.pendingDoctors?.length > 0 ? stats.pendingDoctors.map((doctor) => (
              <div key={doctor._id} className="p-sm bg-surface-container-low border border-outline-variant rounded-lg group hover:border-primary transition-colors">
                <div className="flex items-start gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {doctor.userId.firstName[0]}
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-on-surface text-sm">{doctor.userId.firstName} {doctor.userId.lastName}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">{doctor.specialization} • #{doctor.licenseNumber}</p>
                  </div>
                </div>
                <div className="flex gap-xs mt-sm">
                  <button className="flex-1 text-[10px] font-bold py-1.5 bg-primary text-white rounded-md hover:brightness-110 active:scale-95 transition-all uppercase">Approve</button>
                  <button className="flex-1 text-[10px] font-bold py-1.5 border border-outline-variant text-on-surface-variant rounded-md hover:bg-error/10 hover:text-error hover:border-error active:scale-95 transition-all uppercase">Reject</button>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-on-surface-variant opacity-60 italic text-sm">
                No pending verifications.
              </div>
            )}
          </div>
          <button className="w-full mt-md text-primary font-bold text-xs hover:underline py-xs uppercase tracking-wider">View All Pending</button>
        </div>
      </div>

      {/* Recent Security Logs */}
      <section className="glass-card rounded-xl border border-outline-variant shadow-sm overflow-hidden bg-white">
        <div className="px-md py-md border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-h text-xl text-on-surface">Recent Security Logs</h3>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors uppercase">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
            </button>
            <button className="flex items-center gap-xs px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors uppercase">
              <span className="material-symbols-outlined text-[18px]">download</span> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-md py-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event</th>
                <th className="px-md py-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">User Role</th>
                <th className="px-md py-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">IP Address</th>
                <th className="px-md py-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                <th className="px-md py-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {stats?.securityLogs?.length > 0 ? stats.securityLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                  <td className="px-md py-md flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary text-lg">login</span>
                    <span className="text-sm text-on-surface">{log.event}</span>
                  </td>
                  <td className="px-md py-md text-sm text-on-surface-variant">{log.userRole}</td>
                  <td className="px-md py-md text-sm font-mono text-on-surface-variant">{log.ipAddress}</td>
                  <td className="px-md py-md text-sm text-on-surface-variant">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-md py-md">
                    <span className={`inline-flex items-center px-sm py-xs rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      log.status === 'SUCCESS' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-md py-10 text-center text-on-surface-variant opacity-60 italic text-sm">
                    No recent security events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
