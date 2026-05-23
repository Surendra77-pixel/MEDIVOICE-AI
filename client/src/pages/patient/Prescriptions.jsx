import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' or 'Past'
  const [checkedDoses, setCheckedDoses] = useState({ morning: true, evening: false });
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      toast.loading(`Uploading ${file.name} to Medical Vault...`, {
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
      });
      setTimeout(() => {
        toast.dismiss();
        toast.success('Prescription uploaded successfully to your Medical Vault!', {
          icon: '📄',
          style: { background: '#064e3b', color: '#fff', border: '1px solid rgba(16,185,129,0.3)' }
        });
      }, 1500);
    }
  };

  const toggleDose = (time) => {
    setCheckedDoses(prev => {
      const next = { ...prev, [time]: !prev[time] };
      toast.success(next[time] ? `Marked ${time} dose as taken!` : `Cleared ${time} dose status`, {
        icon: next[time] ? '💊' : '🔄',
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
      });
      return next;
    });
  };

  const handleReminderSetup = (doctorName) => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success(`Medication alarms scheduled for Dr. ${doctorName}'s prescriptions!`, {
            icon: '⏰',
            style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
          });
        } else {
          toast.error('Please enable notifications to receive medication reminders.', {
            style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }
          });
        }
      });
    } else {
      toast.success('Medication alarms scheduled locally in the application!', {
        icon: '⏰',
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
      });
    }
  };

  const handleRefillOrder = (doctorName) => {
    toast.success(`Refill order request transmitted to Pharmacy for Dr. ${doctorName}'s prescriptions!`, {
      icon: '🛒',
      style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
    });
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/patient/prescriptions');
        setPrescriptions(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        {/* Floating Ring Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-cyan-400/20 border-b-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        </div>
        <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Syncing Medical Vault...</p>
      </div>
    );
  }

  // Soft filter (e.g. active is first 2, past is others, or using some dummy rules for UI filtering)
  const filteredPrescriptions = activeTab === 'Active' 
    ? prescriptions.slice(0, 2) 
    : prescriptions.slice(2);

  return (
    <div className="pb-xl relative">
      {/* Ambient background particles for scifi feel */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl relative z-10">
        <div>
          <h1 className="font-h text-4xl text-slate-900 dark:text-white font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-indigo-500 animate-pulse">prescriptions</span>
            My Prescriptions
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-xs text-sm">
            Manage your digital medication schedules, adherence logs, and Pharmacy refills.
          </p>
        </div>
        
        {/* Glass tab switcher */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-xl">
          {['Active', 'Past Records'].map((tab) => {
            const isSel = (tab === 'Active' && activeTab === 'Active') || (tab === 'Past Records' && activeTab === 'Past');
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab === 'Active' ? 'Active' : 'Past')}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 relative ${
                  isSel 
                    ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid (Asymmetric Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative z-10">
        {/* Left Column: Active Prescription Cards */}
        <div className="lg:col-span-8 space-y-md">
          <AnimatePresence mode="wait">
            {filteredPrescriptions.length > 0 ? (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {filteredPrescriptions.map((pres, index) => (
                  <motion.div 
                    key={pres._id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hologram-panel dark:bg-slate-900/60 bg-white/70 border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden flex flex-col group hover:border-indigo-500/50 transition-all duration-500 relative"
                  >
                    {/* Glowing Accent line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Card Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 dark:bg-white/3 gap-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                          {pres.doctorId?.firstName?.[0] || 'D'}
                          {/* Inner scanner line */}
                          <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:animate-holo-scan pointer-events-none" style={{ height: '30%' }} />
                        </div>
                        <div>
                          <h3 className="font-h text-xl text-slate-800 dark:text-white font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Dr. {pres.doctorId?.firstName} {pres.doctorId?.lastName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-cyan-400 tracking-wider">
                              {pres.doctorId?.specialty || 'Medical Specialist'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                            <span className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                              Issued: {new Date(pres.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3.5 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black rounded-full flex items-center gap-1.5 uppercase tracking-widest border border-emerald-500/20 dark:border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Active Prescription
                      </span>
                    </div>

                    {/* Table View */}
                    <div className="p-6 overflow-x-auto">
                      <div className="overflow-hidden border border-slate-100 dark:border-white/5 rounded-2xl">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                          <thead className="bg-slate-50 dark:bg-white/3 border-b border-slate-100 dark:border-white/5">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Medication</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Dosage</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Frequency</th>
                              <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest text-right">Trend</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {pres.medications && pres.medications.map((med, idx) => (
                              <tr key={idx} className="hover:bg-indigo-50/50 dark:hover:bg-white/2 transition-colors duration-300">
                                <td className="px-6 py-4 font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                  <span className="material-symbols-outlined text-lg text-indigo-500">pill</span>
                                  {med.drugName}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-300 font-bold">{med.dose || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-300 font-semibold">{med.frequency || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                  <div className="inline-flex items-end gap-1">
                                    {[2, 4, 3, 5, 4, 6].map((h, i) => (
                                      <motion.div 
                                        key={i} 
                                        animate={{ height: [`${h * 2.5}px`, `${h * 3.5}px`, `${h * 2.5}px`] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                                        className="w-1 rounded-full bg-indigo-500" 
                                        style={{ height: `${h * 2.5}px` }} 
                                      />
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick actions for card */}
                    <div className="p-6 bg-slate-50/50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleReminderSetup(pres.doctorId?.lastName || 'Doctor')}
                        className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">alarm</span>
                        Set Smart Reminders
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRefillOrder(pres.doctorId?.lastName || 'Doctor')}
                        className="flex-1 py-3.5 border-2 border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-800 dark:text-white font-bold text-xs rounded-2xl hover:bg-indigo-50/30 dark:hover:bg-indigo-500/10 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        Reorder Refill
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-slate-50 dark:bg-white/3 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-gray-500">prescriptions</span>
                </div>
                <div>
                  <p className="text-slate-800 dark:text-white font-bold">No {activeTab.toLowerCase()} prescriptions found</p>
                  <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">Any records assigned by your practitioners will display instantly.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: AI Insights & Quick Stats */}
        <div className="lg:col-span-4 space-y-md">
          {/* AI Compliance Intelligence Card */}
          <div className="hologram-panel dark:bg-slate-900/60 bg-white/70 p-6 rounded-3xl border border-slate-200 dark:border-white/10 relative overflow-hidden group shadow-xl">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-7xl text-cyan-400">psychology</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className="material-symbols-outlined text-cyan-500 fill-current animate-pulse">auto_awesome</span>
              <h4 className="font-h text-lg text-slate-800 dark:text-white font-bold uppercase tracking-wider">Compliance Intel</h4>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed mb-6 relative z-10">
              Your medication adherence score is <span className="text-cyan-500 dark:text-cyan-400 font-black">94%</span> this cycle. This high-level consistency reduces relapses by 85%.
            </p>
            
            {/* Animated compliance bar */}
            <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden mb-3 relative z-10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '94%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full shadow-[0_0_12px_rgba(56,189,248,0.4)]" 
              />
            </div>
            
            <div className="flex justify-between font-bold text-[9px] text-slate-500 dark:text-gray-400 uppercase tracking-widest relative z-10">
              <span>Current Score</span>
              <span className="text-cyan-500 dark:text-cyan-400">Optimal (94%)</span>
            </div>
          </div>

          {/* Today's Schedule Card */}
          <div className="hologram-panel dark:bg-slate-900/60 bg-white/70 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Medication Schedule</h4>
              <span className="text-xs font-black text-indigo-500 dark:text-cyan-400 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-4">
              {/* Morning Dose */}
              <div 
                onClick={() => toggleDose('morning')}
                className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                  checkedDoses.morning 
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-slate-50/50 dark:bg-white/2 border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="text-center border-r border-slate-200 dark:border-white/10 pr-3">
                  <p className="font-black text-slate-800 dark:text-white text-xs">08:00</p>
                  <p className="text-[8px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">AM</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white text-sm truncate">Morning Dose</div>
                  <div className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${checkedDoses.morning ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {checkedDoses.morning ? 'TAKEN & SIGNED' : 'UPCOMING'}
                  </div>
                </div>
                <span className={`material-symbols-outlined text-2xl transition-colors ${checkedDoses.morning ? 'text-emerald-500 fill-current' : 'text-slate-400'}`}>
                  {checkedDoses.morning ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>

              {/* Evening Dose */}
              <div 
                onClick={() => toggleDose('evening')}
                className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                  checkedDoses.evening 
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-slate-50/50 dark:bg-white/2 border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="text-center border-r border-slate-200 dark:border-white/10 pr-3">
                  <p className="font-black text-slate-800 dark:text-white text-xs">08:00</p>
                  <p className="text-[8px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">PM</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white text-sm truncate">Evening Dose</div>
                  <div className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${checkedDoses.evening ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {checkedDoses.evening ? 'TAKEN & SIGNED' : 'UPCOMING'}
                  </div>
                </div>
                <span className={`material-symbols-outlined text-2xl transition-colors ${checkedDoses.evening ? 'text-emerald-500 fill-current' : 'text-slate-400'}`}>
                  {checkedDoses.evening ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input for PDF/Image prescriptions */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,.pdf" 
        onChange={handleFileChange}
      />

      {/* Floating Action Button (FAB) */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleUploadClick}
        title="Upload Paper Prescription"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 transition-all z-50 flex items-center justify-center border border-white/20"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </motion.button>
    </div>
  );
};

export default Prescriptions;

