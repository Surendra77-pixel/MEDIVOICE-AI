import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Plus, Settings, ChevronLeft, ChevronRight, Save } from 'lucide-react';

const ScheduleManager = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/doctor/profile');
        if (res.data.success) {
          setAvailability(res.data.data.availability || []);
        }
      } catch (err) {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/doctor/profile', { availability });
      if (res.data.success) {
        toast.success('Schedule updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  const addSlot = (dayIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.push({ time: '09:00 AM', isBooked: false });
    setAvailability(newAvailability);
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(newAvailability);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Schedule Manager</h1>
          <p className="text-gray-500">Manage your recurring weekly availability.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-doctor text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-doctor-dark transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><Save className="h-5 w-5" /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availability.map((day, dIdx) => (
          <div key={day.day} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">{day.day}</h3>
              <button onClick={() => addSlot(dIdx)} className="p-1 hover:bg-doctor/10 text-doctor rounded-full transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3 flex-1">
              {day.slots.length === 0 ? (
                <p className="text-center py-4 text-xs text-gray-400 italic">No slots defined</p>
              ) : (
                day.slots.map((slot, sIdx) => (
                  <div key={sIdx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                    <input 
                      type="text" 
                      className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 w-24 p-0"
                      value={slot.time}
                      onChange={(e) => {
                        const newAvail = [...availability];
                        newAvail[dIdx].slots[sIdx].time = e.target.value;
                        setAvailability(newAvail);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${slot.isBooked ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                        {slot.isBooked ? 'Booked' : 'Open'}
                      </span>
                      <button 
                        onClick={() => removeSlot(dIdx, sIdx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Plus className="h-3 w-3 rotate-45" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManager;
