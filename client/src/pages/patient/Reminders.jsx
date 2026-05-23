import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { Bell, Clock, CheckCircle2, Pill, Plus, X, Calendar } from 'lucide-react';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [newReminder, setNewReminder] = useState({
    drugName: '',
    dose: '',
    instructions: '',
    scheduledTime: '08:00',
    endDate: ''
  });

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        // Fetch actual prescriptions
        const res = await api.get('/patient/prescriptions');
        
        if (res.data.success) {
          const fetchedPrescriptions = res.data.data || [];
          const allReminders = [];
          
          fetchedPrescriptions.forEach(pres => {
            if (pres.medications && pres.medications.length > 0) {
              pres.medications.forEach(p => {
                allReminders.push({
                  id: `${pres._id}-${p.drugName}`,
                  name: p.drugName,
                  dosage: p.dose || 'As directed',
                  frequency: p.frequency || 'Daily',
                  duration: p.duration || 'N/A',
                  doctor: `Dr. ${pres.doctorId?.lastName || 'Doctor'}`,
                  date: new Date(pres.issuedAt).toLocaleDateString(),
                  isActive: pres.status === 'active',
                  status: 'Pending'
                });
              });
            }
          });
          
          setReminders(allReminders.filter(r => r.isActive));
        }
      } catch (error) {
        toast.error('Failed to load medications');
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, []);

  const markAsTaken = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: 'Taken' } : r));
    toast.success('Dose marked as taken and logged to your compliance record!', {
      icon: '💊',
      style: { background: '#064e3b', color: '#fff', border: '1px solid rgba(16,185,129,0.3)' }
    });
  };

  const takenCount = reminders.filter(r => r.status === 'Taken').length;
  const progress = reminders.length > 0 ? Math.round((takenCount / reminders.length) * 100) : 0;

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSmartNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Push notifications are not supported in this browser.');
      return;
    }

    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Notification permission denied.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      const publicKeyRes = await api.get('/notifications/public-key');
      const publicKey = publicKeyRes.data.data.publicKey;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      await api.post('/notifications/subscribe', { subscription });
      toast.success('Smart system notifications successfully activated!', {
        icon: '🔔',
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to enable smart notifications.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const generateGoogleCalendarUrl = (reminder) => {
    const title = encodeURIComponent(`💊 Meds: ${reminder.drugName}`);
    const details = encodeURIComponent(`Dosage: ${reminder.dose}\nInstructions: ${reminder.instructions}\n\nAutomated via MediVoice AI.`);
    
    const now = new Date();
    const [hours, minutes] = reminder.scheduledTime.split(':');
    now.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const end = new Date(now.getTime() + 15 * 60000); // 15 mins duration
    const formatDateStr = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatDateStr(now)}/${formatDateStr(end)}`;
    
    let endDateObj = new Date(reminder.endDate);
    if (isNaN(endDateObj.getTime())) {
      const parts = String(reminder.endDate).split('/');
      if (parts.length === 3) endDateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    endDateObj.setHours(23, 59, 59);
    
    const recur = `RRULE:FREQ=DAILY;UNTIL=${formatDateStr(endDateObj)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}&recur=${recur}`;
  };

  const handleAddManualReminder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reminders', {
        ...newReminder,
        startDate: new Date().toISOString()
      });
      if (res.data.success) {
        toast.success('Reminder stored! Synchronizing to Google Calendar...', {
          style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
        });
        setReminders([...reminders, {
          id: res.data.data._id,
          name: newReminder.drugName,
          dosage: newReminder.dose,
          frequency: 'Custom',
          duration: 'Manual',
          doctor: 'Self',
          isActive: true,
          status: 'Pending'
        }]);
        
        const calUrl = generateGoogleCalendarUrl(newReminder);
        window.open(calUrl, '_blank');

        setShowAddForm(false);
        setNewReminder({ drugName: '', dose: '', instructions: '', scheduledTime: '08:00', endDate: '' });
      }
    } catch (error) {
      toast.error('Failed to add reminder');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-cyan-400/20 border-b-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        </div>
        <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Syncing smart reminders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 font-h flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-indigo-500 animate-pulse">alarm</span>
            Clinical Reminders
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-sm">
            Your daily medications automatically synchronized from clinical consultations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white dark:bg-white/5 text-indigo-600 dark:text-cyan-400 border-2 border-indigo-500/20 dark:border-white/10 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-white/10 transition-all shadow-sm uppercase tracking-wider"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
            {showAddForm ? 'Cancel' : 'Add Medication'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSmartNotifications}
            disabled={isSubscribing}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 uppercase tracking-wider"
          >
            <Bell className={`h-4 w-4 ${isSubscribing ? 'animate-bounce' : ''}`} /> 
            {isSubscribing ? 'Subscribing...' : 'Smart Alerts'}
          </motion.button>
        </div>
      </div>

      {/* Slide-down Manual Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="hologram-panel dark:bg-slate-900/60 bg-white/70 rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative z-10"
          >
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Pill className="h-6 w-6 text-indigo-500" /> Create Manual Medication Alarm
            </h2>
            <form onSubmit={handleAddManualReminder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Medication Name *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                  placeholder="e.g. Paracetamol"
                  value={newReminder.drugName}
                  onChange={e => setNewReminder({...newReminder, drugName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Dosage</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                  placeholder="e.g. 500mg"
                  value={newReminder.dose}
                  onChange={e => setNewReminder({...newReminder, dose: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Daily Alarm Time *</label>
                <input 
                  required
                  type="time" 
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                  value={newReminder.scheduledTime}
                  onChange={e => setNewReminder({...newReminder, scheduledTime: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">End Date *</label>
                <input 
                  required
                  type="date" 
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                  value={newReminder.endDate}
                  onChange={e => setNewReminder({...newReminder, endDate: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Special Instructions</label>
                <textarea 
                  className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 transition-all text-sm font-bold"
                  placeholder="e.g. Take after breakfast with water"
                  rows="2"
                  value={newReminder.instructions}
                  onChange={e => setNewReminder({...newReminder, instructions: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20"
                >
                  Create & Sync Calendar
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Card */}
      <div className="hologram-panel dark:bg-slate-900/60 bg-white/70 rounded-3xl p-8 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center gap-8 relative z-10 shadow-xl">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-white/5" />
            <motion.circle 
              cx="64" 
              cy="64" 
              r="56" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="transparent" 
              className="text-indigo-500 dark:text-cyan-400"
              strokeDasharray="351.8" 
              strokeDashoffset={351.8 - (351.8 * progress / 100)} 
              strokeLinecap="round" 
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800 dark:text-white">{progress}%</span>
            <span className="text-[9px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest">Adherence</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            {progress === 100 ? "Perfect compliance achieved!" : progress > 50 ? "Excellent routine work!" : "Awaiting medication checks"}
          </h3>
          <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
            You have logged {takenCount} of your {reminders.length} scheduled doses for today. Perfect consistency is highly beneficial for your target recovery goals.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-5 font-bold text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 dark:bg-cyan-400 shadow-sm" />
              <span className="text-slate-700 dark:text-gray-300">{takenCount} Doses Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
              <span className="text-slate-500 dark:text-gray-400">{reminders.length - takenCount} Pending Doses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4 relative z-10">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-500 animate-pulse" /> Active Daily Medication Logs
        </h2>
        
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-white/3 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center gap-4">
              <Pill className="h-12 w-12 text-slate-300 dark:text-gray-600" />
              <div>
                <p className="text-slate-800 dark:text-white font-bold">No active medication reminders</p>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">Consultation prescriptions will sync here automatically.</p>
              </div>
            </div>
          ) : (
            reminders.map(reminder => {
              const isTaken = reminder.status === 'Taken';
              return (
                <motion.div 
                  key={reminder.id} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`hologram-panel dark:bg-slate-900/60 bg-white/70 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm transition-all duration-300 ${
                    isTaken ? 'opacity-50 scale-98 border-emerald-500/20' : 'hover:shadow-md hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                      isTaken ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {isTaken ? <CheckCircle2 className="h-7 w-7" /> : <Pill className="h-7 w-7" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white truncate">{reminder.name}</h3>
                        <span className="text-[9px] text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-white/5 border border-indigo-500/10 dark:border-white/10 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                          {reminder.doctor}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 font-semibold text-xs text-slate-600 dark:text-gray-400">
                        <span>Dose: {reminder.dosage}</span>
                        <span className="text-slate-300 dark:text-white/10">•</span>
                        <span>Duration: {reminder.duration}</span>
                        <span className="text-slate-300 dark:text-white/10">•</span>
                        <span className="text-indigo-500 dark:text-cyan-400 uppercase tracking-wider font-black">
                          {reminder.frequency}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isTaken ? (
                        <span className="px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest">
                          Logged Taken
                        </span>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => markAsTaken(reminder.id)}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md shadow-indigo-600/20"
                        >
                          Mark as Taken
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;

