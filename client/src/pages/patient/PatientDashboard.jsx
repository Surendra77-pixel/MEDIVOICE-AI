import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/patient/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
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
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <header className="mb-xl">
        <h1 className="font-h text-4xl text-primary mb-md">Welcome back, {user?.firstName}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Blood Pressure</span>
            <div className="flex items-baseline gap-2">
              <span className="font-h text-2xl text-on-surface">118/76</span>
              <span className="text-secondary font-bold text-xs">Normal</span>
            </div>
          </div>
          <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Heart Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="font-h text-2xl text-on-surface">72 BPM</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_down</span>
            </div>
          </div>
          <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Sleep Quality</span>
            <div className="flex items-baseline gap-2">
              <span className="font-h text-2xl text-on-surface">8.5h</span>
              <span className="text-secondary font-bold text-xs">Excellent</span>
            </div>
          </div>
          <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm flex flex-col gap-1">
            <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Appointments</span>
            <div className="flex items-baseline gap-2">
              <span className="font-h text-2xl text-on-surface">{stats?.upcomingAppointments?.length || 0}</span>
              <span className="text-on-surface-variant/40 text-xs">Scheduled</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-lg">
        {/* Center Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
          {/* Next Appointment Card */}
          {stats?.upcomingAppointments?.[0] ? (
            <section className="bg-primary text-white p-lg rounded-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Next Appointment</div>
                <h2 className="font-h text-3xl mb-1">Dr. {stats.upcomingAppointments[0].doctorId?.firstName} {stats.upcomingAppointments[0].doctorId?.lastName}</h2>
                <p className="text-lg opacity-90 mb-6">
                  Specialist • {new Date(stats.upcomingAppointments[0].scheduledAt).toLocaleDateString()} at {new Date(stats.upcomingAppointments[0].scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <button 
                  onClick={() => navigate(`/consultation/${stats.upcomingAppointments[0]._id}`)}
                  className="bg-white text-primary font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-all shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined">video_call</span>
                  Join Consultation
                </button>
              </div>
              <div className="hidden md:block relative z-10 w-48 h-48 rounded-full border-4 border-white/20 overflow-hidden">
                <img 
                  alt="Doctor Profile" 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                />
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </section>
          ) : (
            <section className="bg-primary/5 border border-dashed border-primary/30 p-lg rounded-xl flex flex-col items-center justify-center text-center gap-md">
              <span className="material-symbols-outlined text-5xl text-primary/40">event_busy</span>
              <div>
                <h3 className="font-h text-xl text-primary mb-1">No upcoming appointments</h3>
                <p className="text-on-surface-variant">Schedule a new consultation to get started.</p>
              </div>
              <button 
                onClick={() => navigate(ROUTES.PATIENT.BOOK)}
                className="btn-primary"
              >
                Book Appointment
              </button>
            </section>
          )}

          {/* Recent Medical History */}
          <section>
            <h3 className="font-h text-2xl text-primary mb-md">Recent Medical History</h3>
            <div className="bg-white border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container">
                  <tr>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Date</th>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Reason</th>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Doctor</th>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {stats?.recentConsultations?.length > 0 ? stats.recentConsultations.map((consult) => (
                    <tr key={consult._id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-gutter py-5 text-sm text-on-surface">{new Date(consult.createdAt).toLocaleDateString()}</td>
                      <td className="px-gutter py-5 font-bold text-on-surface">{consult.reason || 'General Consultation'}</td>
                      <td className="px-gutter py-5 text-sm text-on-surface-variant">Dr. {consult.doctorId?.lastName}</td>
                      <td className="px-gutter py-5 text-right">
                        <Link to={`/patient/history#${consult._id}`} className="text-primary font-bold text-sm hover:underline flex items-center justify-end gap-1">
                          View SOAP Note <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </Link>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-gutter py-8 text-center text-on-surface-variant opacity-60 italic">
                        No medical records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          {/* Quick Actions */}
          <section>
            <h3 className="font-h text-2xl text-primary mb-md">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-md">
              <button 
                onClick={() => navigate(ROUTES.PATIENT.BOOK)}
                className="glass-card p-gutter rounded-xl shadow-md flex items-center gap-md hover:bg-white transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">add_task</span>
                </div>
                <div className="text-left">
                  <div className="font-h text-lg text-primary">Book Appointment</div>
                  <div className="text-xs text-on-surface-variant">Find a specialist quickly</div>
                </div>
                <span className="material-symbols-outlined ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate(ROUTES.PATIENT.CHATBOT)}
                className="glass-card p-gutter rounded-xl shadow-md flex items-center gap-md hover:bg-white transition-all group"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">psychiatry</span>
                </div>
                <div className="text-left">
                  <div className="font-h text-lg text-secondary">AI Symptom Checker</div>
                  <div className="text-xs text-on-surface-variant">Evaluate symptoms instantly</div>
                </div>
                <span className="material-symbols-outlined ml-auto text-secondary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Medication Reminders */}
          <section className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-h text-lg text-primary">Medication Reminders</h3>
              <span 
                onClick={() => navigate(ROUTES.PATIENT.REMINDERS)}
                className="material-symbols-outlined text-primary cursor-pointer hover:bg-primary/5 rounded-full p-1"
              >
                edit
              </span>
            </div>
            <div className="flex flex-col gap-md">
              {stats?.reminders?.length > 0 ? stats.reminders.slice(0, 3).map((reminder) => (
                <div key={reminder._id} className={`flex items-start gap-md p-base bg-surface-container-low rounded-lg border-l-4 ${reminder.status === 'completed' ? 'border-primary opacity-60' : 'border-secondary'}`}>
                  <div className="pt-1">
                    <input 
                      readOnly
                      checked={reminder.status === 'completed'}
                      className="rounded border-outline text-primary focus:ring-primary w-5 h-5" 
                      type="checkbox"
                    />
                  </div>
                  <div>
                    <div className={`font-bold text-on-surface ${reminder.status === 'completed' ? 'line-through decoration-on-surface-variant/40' : ''}`}>
                      {reminder.medicationName}
                    </div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase">{reminder.time} • {reminder.dosage}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-on-surface-variant opacity-60 text-xs italic">
                  No active reminders.
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate(ROUTES.PATIENT.REMINDERS)}
              className="mt-md w-full py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-primary/30"
            >
              + View All Reminders
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
