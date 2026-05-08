import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { Bell, Clock, CheckCircle2, Pill } from 'lucide-react';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    toast.success('Dose marked as taken!', { icon: '💊' });
  };

  const takenCount = reminders.filter(r => r.status === 'Taken').length;
  const progress = reminders.length > 0 ? Math.round((takenCount / reminders.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Clinical Reminders</h1>
          <p className="text-gray-500">Your prescriptions automatically synchronized from your consultations.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20">
          <Bell className="h-5 w-5" /> Smart Notifications
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary transition-all duration-1000" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * progress / 100)} strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-900">{progress}%</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Today</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {progress === 100 ? "Perfect adherence!" : progress > 50 ? "You're doing great!" : "Time for your medicine"}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            You've taken {takenCount} out of {reminders.length} prescribed doses today. Consistent adherence is key to your recovery.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs font-bold text-gray-700">{takenCount} Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span className="text-xs font-bold text-gray-700">{reminders.length - takenCount} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Active Prescriptions
        </h2>
        
        {reminders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No active prescriptions found.</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all ${reminder.status === 'Taken' ? 'opacity-60' : 'hover:shadow-md'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${reminder.status === 'Taken' ? 'bg-green-100' : 'bg-primary/10'}`}>
                  {reminder.status === 'Taken' ? <CheckCircle2 className="h-7 w-7 text-green-600" /> : <Pill className="h-7 w-7 text-primary" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{reminder.name}</h3>
                    <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{reminder.doctor}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <p className="text-sm font-medium text-gray-600">{reminder.dosage} • {reminder.duration}</p>
                    <p className="text-xs font-bold text-primary uppercase tracking-tighter">
                      {reminder.frequency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    disabled={reminder.status === 'Taken'}
                    onClick={() => markAsTaken(reminder.id)}
                    className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${
                      reminder.status === 'Taken' 
                        ? 'bg-green-50 text-green-600 cursor-default' 
                        : 'bg-primary text-white hover:brightness-110 active:scale-95 shadow-lg shadow-primary/10'
                    }`}
                  >
                    {reminder.status === 'Taken' ? 'Taken' : 'Mark as Taken'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reminders;
