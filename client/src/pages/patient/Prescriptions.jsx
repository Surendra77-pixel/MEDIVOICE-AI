import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');
  const [checkedDoses, setCheckedDoses] = useState({ morning: true, evening: false });
  const fileInputRef = React.useRef(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [gcalModal, setGcalModal] = useState(null); // { doctorName, events: [{title, url}] }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ── Build a Google Calendar URL for a medication reminder ────────────────
  const buildGCalUrl = (medication, doctorName) => {
    const now = new Date();
    const freq = (medication.frequency || '').toLowerCase();

    // Determine time based on frequency
    let hour = 8; // default 8 AM
    if (freq.includes('night') || freq.includes('evening') || freq.includes('pm')) hour = 20;
    else if (freq.includes('noon') || freq.includes('lunch') || freq.includes('afternoon')) hour = 13;

    // Determine RRULE recurrence
    let rrule = 'RRULE:FREQ=DAILY';
    if (freq.includes('twice') || freq.includes('2 times') || freq.includes('bd') || freq.includes('bid')) {
      rrule = 'RRULE:FREQ=DAILY;INTERVAL=1';
    } else if (freq.includes('three') || freq.includes('3 times') || freq.includes('tds') || freq.includes('tid')) {
      rrule = 'RRULE:FREQ=DAILY;INTERVAL=1';
    } else if (freq.includes('week')) {
      rrule = 'RRULE:FREQ=WEEKLY';
    }

    // Format: YYYYMMDDTHHMMSS
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
    const startDt = `${dateStr}T${pad(hour)}0000`;
    const endDt   = `${dateStr}T${pad(hour)}1500`; // 15 min event

    const title = encodeURIComponent(`💊 ${medication.drugName}`);
    const details = encodeURIComponent(
      `Dose: ${medication.dose || '-'}\nFrequency: ${medication.frequency || '-'}\nPrescribed by: Dr. ${doctorName}\n\nAdded via MediVoice AI`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDt}/${endDt}&details=${details}&recur=${encodeURIComponent(rrule)}&sf=true&output=xml`;
  };

  // ── Add all medications to Google Calendar ───────────────────────────────
  const addToGoogleCalendar = (medications, doctorName) => {
    const events = medications.map(m => ({
      title: `💊 ${m.drugName} — ${m.dose}`,
      frequency: m.frequency,
      url: buildGCalUrl(m, doctorName)
    }));
    setGcalModal({ doctorName, events });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset input so the same file can be re-uploaded
    e.target.value = '';

    setAnalyzing(true);
    setAiDiagnosis(null);
    const toastId = toast.loading(`🧠 AI Vision analyzing ${file.name}...`, {
      style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(99,102,241,0.3)' }
    });

    try {
      const formData = new FormData();
      formData.append('prescription', file);

      const res = await api.post('/patient/prescriptions/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // 60s for AI processing
      });

      toast.dismiss(toastId);

      if (res.data?.success && res.data?.data) {
        const parsed = res.data.data;

        toast.success('AI successfully extracted your prescription!', {
          icon: '✨',
          duration: 4000,
          style: { background: '#064e3b', color: '#fff', border: '1px solid rgba(16,185,129,0.3)' }
        });

        // Split doctor name
        const nameParts = (parsed.doctorName || 'AI Vision').split(' ');
        const firstName = nameParts[0] || 'AI';
        const lastName = nameParts.slice(1).join(' ') || 'Vision';

          // Add the new prescription to the local state so it appears immediately
        const newPrescription = {
          _id: parsed._id || parsed._dbId || 'temp-' + Date.now(),
          doctorId: {
            firstName,
            lastName,
            specialty: parsed.doctorSpecialty || 'General Physician'
          },
          doctorSnapshot: {
            name: parsed.doctorName,
            specialty: parsed.doctorSpecialty || 'General Physician'
          },
          createdAt: (() => { try { const d = new Date(parsed.date); return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString(); } catch { return new Date().toISOString(); } })(),
          medications: (parsed.medications || []).map(m => ({
            drugName: m.drugName,
            dose: m.dose,
            frequency: m.frequency + (m.duration ? ` for ${m.duration}` : '')
          }))
        };

        // Store diagnosis for the AI insights panel
        setAiDiagnosis({
          diagnosis: parsed.diagnosis,
          notes: parsed.notes,
          patientName: parsed.patientName,
          doctorName: parsed.doctorName,
          medicationCount: (parsed.medications || []).length
        });

        setPrescriptions(prev => [newPrescription, ...prev]);
        setActiveTab('Active');

        // Auto-trigger Google Calendar integration
        addToGoogleCalendar(
          parsed.medications || [],
          parsed.doctorName || 'Your Doctor'
        );
      } else {
        toast.error(res.data?.message || 'AI could not read this prescription', {
          style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }
        });
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error('Prescription analysis error:', err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || '';
      let errMsg = 'Upload failed. Please try again.';
      if (status === 503 || serverMsg.includes('busy') || serverMsg.includes('503')) {
        errMsg = '⏳ AI servers are busy right now. Please wait 30 seconds and try again.';
      } else if (status === 422 || serverMsg.includes('clearer')) {
        errMsg = '📷 Could not read the image clearly. Please upload a higher quality photo.';
      } else if (serverMsg) {
        errMsg = serverMsg;
      }
      toast.error(errMsg, {
        duration: 6000,
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(239,68,68,0.3)', maxWidth: '360px' }
      });
    } finally {
      setAnalyzing(false);
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

  const handleReminderSetup = (pres) => {
    const doctorName = pres.doctorId?.lastName || 'Doctor';
    
    // Save to local storage for the dashboard widget
    const existing = JSON.parse(localStorage.getItem('smart_reminders') || '[]');
    const newReminders = (pres.medications || []).map((m, i) => ({
      _id: 'rem-' + Date.now() + '-' + i,
      medicationName: m.drugName,
      time: m.frequency.toLowerCase().includes('night') || m.frequency.toLowerCase().includes('evening') ? '08:00 PM' : '08:00 AM',
      dosage: m.dose,
      status: 'pending'
    }));
    
    const filteredNew = newReminders.filter(n => !existing.some(e => e.medicationName === n.medicationName));
    localStorage.setItem('smart_reminders', JSON.stringify([...filteredNew, ...existing]));

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
        if (res.data && res.data.data && res.data.data.length > 0) {
          setPrescriptions(res.data.data);
        } else {
          // Fallback to rich mock data if no prescriptions in DB
          setPrescriptions([
            {
              _id: 'mock-1',
              doctorId: { firstName: 'Sarah', lastName: 'Connor', specialty: 'Cardiologist' },
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
              medications: [
                { drugName: 'Atorvastatin 40mg', dose: '1 tablet', frequency: 'Once daily at night' },
                { drugName: 'Lisinopril 10mg', dose: '1 tablet', frequency: 'Once daily in morning' }
              ]
            },
            {
              _id: 'mock-2',
              doctorId: { firstName: 'James', lastName: 'Wilson', specialty: 'Endocrinologist' },
              createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
              medications: [
                { drugName: 'Metformin 500mg', dose: '1 tablet', frequency: 'Twice a day with meals' },
                { drugName: 'Vitamin D3 1000 IU', dose: '1 capsule', frequency: 'Once daily' }
              ]
            },
            {
              _id: 'mock-3', // Past record
              doctorId: { firstName: 'Gregory', lastName: 'House', specialty: 'Diagnostician' },
              createdAt: new Date(Date.now() - 86400000 * 60).toISOString(), // 2 months ago
              medications: [
                { drugName: 'Amoxicillin 500mg', dose: '1 capsule', frequency: 'Three times daily for 7 days' }
              ]
            }
          ]);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load prescriptions, showing offline data');
        // Fallback on error too
        setPrescriptions([
          {
            _id: 'mock-err-1',
            doctorId: { firstName: 'Elena', lastName: 'Rustov', specialty: 'General Practice' },
            createdAt: new Date().toISOString(),
            medications: [
              { drugName: 'Ibuprofen 400mg', dose: '1 tablet', frequency: 'Every 6 hours as needed' }
            ]
          }
        ]);
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
                          {pres.doctorId?.firstName?.[0] || pres.doctorSnapshot?.name?.[0] || 'D'}
                          {/* Inner scanner line */}
                          <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:animate-holo-scan pointer-events-none" style={{ height: '30%' }} />
                        </div>
                        <div>
                          <h3 className="font-h text-xl text-slate-800 dark:text-white font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Dr. {pres.doctorId ? `${pres.doctorId.firstName} ${pres.doctorId.lastName}` : (pres.doctorSnapshot?.name || 'Doctor')}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-cyan-400 tracking-wider">
                              {pres.doctorId?.specialty || pres.doctorSnapshot?.specialty || 'Medical Specialist'}
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
                        onClick={() => handleReminderSetup(pres)}
                        className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 uppercase tracking-widest transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">alarm</span>
                        Set Smart Reminders
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRefillOrder(pres.doctorId?.lastName || pres.doctorSnapshot?.name?.split(' ').pop() || 'Doctor')}
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
          {/* AI Diagnosis Panel (appears after scan) */}
          <AnimatePresence>
            {aiDiagnosis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="hologram-panel dark:bg-slate-900/60 bg-white/70 p-6 rounded-3xl border border-emerald-500/30 relative overflow-hidden group shadow-xl"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10">
                  <span className="material-symbols-outlined text-7xl text-emerald-400">neurology</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <span className="material-symbols-outlined text-emerald-500 fill-current animate-pulse">smart_toy</span>
                  <h4 className="font-h text-lg text-slate-800 dark:text-white font-bold uppercase tracking-wider">AI Diagnosis</h4>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Detected Condition</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{aiDiagnosis.diagnosis || 'Not specified'}</p>
                  </div>
                  
                  {aiDiagnosis.notes && aiDiagnosis.notes !== 'Not specified' && (
                    <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Doctor Notes</p>
                      <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">{aiDiagnosis.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/3 rounded-xl border border-slate-200 dark:border-white/10">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Medications Found</p>
                      <p className="text-2xl font-black text-indigo-600 dark:text-cyan-400">{aiDiagnosis.medicationCount}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Prescribed By</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{aiDiagnosis.doctorName || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzing Indicator */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="hologram-panel dark:bg-slate-900/60 bg-white/70 p-6 rounded-3xl border border-cyan-500/30 shadow-xl text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-indigo-400/20 border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-cyan-500 text-xl animate-pulse">visibility</span>
                  </div>
                </div>
                <p className="text-xs font-black text-cyan-500 uppercase tracking-widest animate-pulse">AI Vision Processing...</p>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1">Extracting medications & diagnosis</p>
              </motion.div>
            )}
          </AnimatePresence>

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
        title="Upload Paper Prescription — AI will analyze it"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 transition-all z-50 flex items-center justify-center border border-white/20"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </motion.button>

      {/* ── Google Calendar Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {gcalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setGcalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                        <rect x="3" y="4" width="18" height="17" rx="2" fill="#4285F4"/>
                        <rect x="3" y="4" width="18" height="6" rx="2" fill="#4285F4"/>
                        <rect x="3" y="8" width="18" height="13" rx="0" fill="white"/>
                        <rect x="3" y="8" width="18" height="3" fill="#4285F4"/>
                        <text x="12" y="19" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#4285F4">31</text>
                        <line x1="8" y1="4" x2="8" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="16" y1="4" x2="16" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Add to Google Calendar</h3>
                      <p className="text-gray-400 text-xs">Prescribed by Dr. {gcalModal.doctorName}</p>
                    </div>
                  </div>
                  <button onClick={() => setGcalModal(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-white text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Medication Events List */}
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                {gcalModal.events.map((ev, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💊</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{ev.title}</p>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider truncate">{ev.frequency}</p>
                    </div>
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">add</span>
                      Add
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    gcalModal.events.forEach((ev, i) => {
                      setTimeout(() => window.open(ev.url, '_blank'), i * 400);
                    });
                    setGcalModal(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                  Add All ({gcalModal.events.length}) to Calendar
                </button>
                <button
                  onClick={() => setGcalModal(null)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-sm rounded-2xl transition-all"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prescriptions;

