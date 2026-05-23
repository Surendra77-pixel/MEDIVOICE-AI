import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { toast } from 'react-hot-toast';

const formatDoctorName = (doctor) => {
  if (!doctor) return '';
  const first = doctor.firstName || '';
  const last = doctor.lastName || '';
  // Avoid double "Dr." prefixing
  const cleanFirst = first.replace(/^Dr\.\s*/i, '');
  return `Dr. ${cleanFirst} ${last}`;
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReportName, setSelectedReportName] = useState(null);
  const [selectedReportContent, setSelectedReportContent] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const handleViewReport = async (filename) => {
    setSelectedReportName(filename);
    setIsLoadingReport(true);
    try {
      const res = await api.get(`/ai/reports/${filename}`);
      if (res.data.success) {
        setSelectedReportContent(res.data.data.content);
      } else {
        toast.error("Failed to load report content");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report content: " + err.message);
    } finally {
      setIsLoadingReport(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/patient/dashboard');
        setStats(res.data.data);
        
        // Register native browser medication reminders (Phase 2 Data Feature)
        if (res.data.data?.reminders?.length > 0) {
          import('../../services/reminderService').then(({ setMedicationReminder }) => {
            res.data.data.reminders.forEach(reminder => {
              if (reminder.status !== 'completed') {
                setMedicationReminder(reminder.medicationName, reminder.time);
              }
            });
          });
        }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="text-on-surface dark:text-white transition-colors duration-500"
    >
      {/* Welcome Header */}
      <header className="mb-xl relative z-10">
        <motion.h1 variants={itemVariants} className="font-h text-4xl font-bold mb-md">
          Welcome back, <span className="text-primary">{user?.firstName}!</span>
        </motion.h1>
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <motion.div whileHover={{ scale: 1.02, y: -5 }} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-md rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 dark:from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-on-surface-variant dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider relative z-10">Blood Pressure</span>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-h text-2xl text-on-surface dark:text-white">118/76</span>
              <span className="text-secondary font-bold text-xs">Normal</span>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, y: -5 }} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-md rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 dark:from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-on-surface-variant dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider relative z-10">Heart Rate</span>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-h text-2xl text-on-surface dark:text-white">72 BPM</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_down</span>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, y: -5 }} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-md rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 dark:from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-on-surface-variant dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider relative z-10">Sleep Quality</span>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-h text-2xl text-on-surface dark:text-white">8.5h</span>
              <span className="text-secondary font-bold text-xs">Excellent</span>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, y: -5 }} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-md rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 dark:from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-on-surface-variant dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider relative z-10">Appointments</span>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-h text-2xl text-on-surface dark:text-white">{stats?.totalAppointments || 0}</span>
              <span className="text-on-surface-variant/60 dark:text-gray-500 text-xs">Scheduled</span>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <div className="grid grid-cols-12 gap-lg relative z-10">
        {/* Center Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
          {/* Next Appointment Card */}
          {stats?.upcomingAppointments?.[0] ? (
            <motion.section 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="bg-primary dark:bg-gradient-to-br dark:from-primary/80 dark:to-primary text-white p-lg rounded-3xl shadow-lg dark:shadow-[0_15px_40px_rgba(37,99,235,0.4)] relative overflow-hidden flex flex-col md:flex-row justify-between items-center border border-transparent dark:border-white/20"
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
              
              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2 drop-shadow-md">Next Appointment</div>
                <h2 className="font-h text-3xl mb-1 font-bold text-white drop-shadow-lg">{formatDoctorName(stats.upcomingAppointments[0].doctorId)}</h2>
                <p className="text-lg text-white/90 mb-6 drop-shadow-md font-medium">
                  {stats.upcomingAppointments[0].doctorId?.specialty || 'Specialist'}
                  {stats.upcomingAppointments[0].doctorId?.city ? ` • ${stats.upcomingAppointments[0].doctorId.city}` : ''}
                  <br/>
                  <span className="opacity-80 text-sm">
                    {new Date(stats.upcomingAppointments[0].scheduledAt).toLocaleDateString()} at {new Date(stats.upcomingAppointments[0].scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/consultation/${stats.upcomingAppointments[0]._id}`)}
                  className="bg-white text-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all shadow-xl"
                >
                  <span className="material-symbols-outlined">video_call</span>
                  Join Consultation
                </motion.button>
              </div>
              <div className="hidden md:block relative z-10 w-48 h-48 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl">
                <img 
                  alt="Doctor Profile" 
                  className="w-full h-full object-cover" 
                  src="/professional_doctor_profile.png"
                />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/20 rounded-full blur-[80px]"
              ></motion.div>
            </motion.section>
          ) : (
            <motion.section variants={itemVariants} className="bg-primary/5 dark:bg-white/5 backdrop-blur-xl border border-dashed border-primary/30 dark:border-white/20 p-lg rounded-3xl flex flex-col items-center justify-center text-center gap-md shadow-sm dark:shadow-lg">
              <span className="material-symbols-outlined text-5xl text-primary/40 dark:text-primary/60 drop-shadow-lg">event_busy</span>
              <div>
                <h3 className="font-h text-xl text-primary dark:text-white mb-1 font-bold">No upcoming appointments</h3>
                <p className="text-on-surface-variant dark:text-gray-400 text-sm">Schedule a new consultation to get started.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(ROUTES.PATIENT.BOOK)}
                className="bg-primary text-white font-bold px-6 py-3 rounded-lg shadow-md dark:shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-primary/50"
              >
                Book Appointment
              </motion.button>
            </motion.section>
          )}

          {/* Other Upcoming Appointments */}
          {stats?.upcomingAppointments?.length > 1 && (
            <motion.section variants={itemVariants}>
              <div className="flex justify-between items-end mb-md">
                <h3 className="font-h text-2xl text-primary dark:text-white font-bold">Other Scheduled Appointments</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {stats.upcomingAppointments.slice(1).map((app, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={app._id} 
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-lg flex justify-between items-center hover:bg-surface-container-high dark:hover:bg-white/10 hover:border-primary/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-transparent dark:border-primary/30">
                        {app.doctorId?.firstName?.[0] || 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface dark:text-white text-sm group-hover:text-primary transition-colors">{formatDoctorName(app.doctorId)}</h4>
                        <p className="text-[11px] font-medium text-on-surface-variant/80 dark:text-gray-400 mt-0.5">
                          {new Date(app.scheduledAt).toLocaleDateString()} @ {new Date(app.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <button className="text-primary dark:text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs bg-primary/10 dark:bg-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white dark:shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Recent Medical History */}
          <motion.section variants={itemVariants}>
            <h3 className="font-h text-2xl text-primary dark:text-white font-bold mb-md">Recent Medical History</h3>
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/30 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container dark:bg-white/5 border-b border-outline-variant/30 dark:border-white/10">
                  <tr>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-400 tracking-wider">Date</th>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-400 tracking-wider">Reason</th>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-400 tracking-wider">Doctor</th>
                    <th className="px-gutter py-4 text-[10px] font-bold uppercase text-on-surface-variant dark:text-gray-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 dark:divide-white/5">
                  {stats?.recentConsultations?.length > 0 ? stats.recentConsultations.map((consult) => (
                    <tr key={consult._id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-gutter py-5 text-sm text-on-surface dark:text-gray-300">{new Date(consult.createdAt).toLocaleDateString()}</td>
                      <td className="px-gutter py-5 font-bold text-on-surface dark:text-white">{consult.reason || 'General Consultation'}</td>
                      <td className="px-gutter py-5 text-sm text-on-surface-variant dark:text-gray-400 group-hover:text-on-surface dark:group-hover:text-gray-300">
                        {consult.isReport ? 'MediVoice AI Translator' : formatDoctorName(consult.doctorId)}
                      </td>
                      <td className="px-gutter py-5 text-right">
                        {consult.isReport ? (
                          <button 
                            onClick={() => handleViewReport(consult.filename)}
                            className="text-primary font-bold text-sm hover:underline dark:hover:text-white flex items-center justify-end gap-1 transition-colors ml-auto animate-fade-in"
                          >
                            View Report <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>
                        ) : (
                          <Link to={`/patient/history#${consult._id}`} className="text-primary font-bold text-sm hover:underline dark:hover:text-white flex items-center justify-end gap-1 transition-colors">
                            View SOAP Note <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-gutter py-8 text-center text-on-surface-variant opacity-60 dark:opacity-100 dark:text-gray-500 italic">
                        No medical records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        {/* Right Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
          {/* Quick Actions */}
          <motion.section variants={itemVariants}>
            <h3 className="font-h text-2xl text-primary dark:text-white font-bold mb-md">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-md">
              <motion.button 
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(ROUTES.PATIENT.BOOK)}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-gutter rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-lg flex items-center gap-md hover:bg-surface-container-high dark:hover:bg-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-transparent dark:border-primary/30 dark:shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                  <span className="material-symbols-outlined">add_task</span>
                </div>
                <div className="text-left">
                  <div className="font-h text-lg font-bold text-primary dark:text-white group-hover:text-primary transition-colors">Book Appointment</div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400">Find a specialist quickly</div>
                </div>
                <span className="material-symbols-outlined ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(ROUTES.PATIENT.CHATBOT)}
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-gutter rounded-2xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-lg flex items-center gap-md hover:bg-surface-container-high dark:hover:bg-white/10 hover:border-secondary/50 transition-all group"
              >
                <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors border border-transparent dark:border-secondary/30 dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="material-symbols-outlined">psychiatry</span>
                </div>
                <div className="text-left">
                  <div className="font-h text-lg font-bold text-secondary dark:text-white group-hover:text-secondary transition-colors">AI Symptom Checker</div>
                  <div className="text-xs text-on-surface-variant dark:text-gray-400">Evaluate symptoms instantly</div>
                </div>
                <span className="material-symbols-outlined ml-auto text-secondary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </motion.button>
            </div>
          </motion.section>

          {/* Medication Reminders */}
          <motion.section variants={itemVariants} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-md rounded-3xl border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center mb-md relative z-10">
              <h3 className="font-h text-xl text-primary dark:text-white font-bold">Medication Reminders</h3>
              <motion.span 
                whileHover={{ rotate: 90, scale: 1.1 }}
                onClick={() => navigate(ROUTES.PATIENT.REMINDERS)}
                className="material-symbols-outlined text-primary cursor-pointer hover:bg-primary/5 dark:hover:bg-white/10 rounded-full p-2 transition-all"
              >
                edit
              </motion.span>
            </div>
            <div className="flex flex-col gap-md relative z-10">
              {stats?.reminders?.length > 0 ? stats.reminders.slice(0, 3).map((reminder) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={reminder._id} 
                  className={`flex items-start gap-md p-base bg-surface-container-low dark:bg-white/5 rounded-xl border-l-4 border-y border-r border-y-transparent border-r-transparent dark:border-y-white/5 dark:border-r-white/5 shadow-inner hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors ${reminder.status === 'completed' ? 'border-l-primary opacity-60' : 'border-l-secondary'}`}
                >
                  <div className="pt-1">
                    <input 
                      readOnly
                      checked={reminder.status === 'completed'}
                      className="rounded bg-transparent border-outline dark:border-gray-500 text-primary focus:ring-primary focus:ring-offset-gray-900 w-5 h-5 cursor-pointer" 
                      type="checkbox"
                    />
                  </div>
                  <div>
                    <div className={`font-bold text-on-surface dark:text-white ${reminder.status === 'completed' ? 'line-through text-on-surface-variant/40 dark:text-gray-500' : ''}`}>
                      {reminder.medicationName}
                    </div>
                    <div className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider mt-1">{reminder.time} • {reminder.dosage}</div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-6 text-on-surface-variant opacity-60 dark:opacity-100 dark:text-gray-500 text-sm italic bg-surface-container-low dark:bg-black/20 rounded-xl border border-outline-variant/30 dark:border-white/5">
                  No active reminders.
                </div>
              )}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(ROUTES.PATIENT.REMINDERS)}
              className="mt-lg w-full py-3 text-xs font-bold text-primary dark:text-white hover:text-primary bg-primary/5 dark:bg-white/5 hover:bg-primary/10 rounded-xl transition-colors border border-dashed border-primary/30 dark:border-white/20 hover:border-primary/50 relative z-10"
            >
              + View All Reminders
            </motion.button>
          </motion.section>
        </div>
      </div>

      {/* Report Viewer Modal Overlay */}
      {selectedReportName && (
        <div className="fixed top-16 bottom-0 right-0 left-0 md:left-64 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-on-surface dark:text-white">
          <div className="bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/20 bg-surface-container-high dark:bg-slate-800">
              <h2 className="text-xl font-bold font-h flex items-center gap-2 text-primary dark:text-sky-400">
                <span className="material-symbols-outlined text-2xl">description</span>
                Consultation Report Detail
              </h2>
              <button 
                onClick={() => {
                  setSelectedReportName(null);
                  setSelectedReportContent(null);
                }}
                className="w-10 h-10 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col bg-white dark:bg-slate-950/20">
              {isLoadingReport ? (
                <div className="h-full flex items-center justify-center py-20">
                  <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                </div>
              ) : selectedReportContent ? (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/10">
                    <span className="text-xs font-black uppercase text-primary dark:text-sky-400 tracking-wider">
                      Report Text File
                    </span>
                    <span className="text-xs font-bold text-on-surface-variant dark:text-gray-400 font-mono">
                      {selectedReportName}
                    </span>
                  </div>
                  <pre className="flex-1 bg-black/5 dark:bg-black/35 border border-outline-variant/10 rounded-2xl p-4 text-xs font-mono overflow-auto dark:text-green-400 text-slate-800 leading-relaxed max-h-[380px] custom-scrollbar whitespace-pre-wrap">
                    {selectedReportContent}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50 py-10">
                  <span className="material-symbols-outlined text-6xl mb-2">description</span>
                  <p className="font-bold">Failed to load report content.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatientDashboard;
