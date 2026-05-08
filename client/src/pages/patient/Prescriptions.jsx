import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      toast.loading(`Uploading ${file.name}...`);
      setTimeout(() => {
        toast.dismiss();
        toast.success('Prescription uploaded to your Medical Vault!');
      }, 1500);
    }
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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h1 className="font-h text-4xl text-primary">My Prescriptions</h1>
          <p className="text-on-surface-variant mt-xs">Manage your medication schedules, clinical trends, and renewals.</p>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-xl w-fit border border-outline-variant/20 shadow-sm">
          <button className="px-md py-2 bg-white shadow-sm rounded-lg font-bold text-primary text-xs uppercase tracking-wider">Active</button>
          <button className="px-md py-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider">Past Records</button>
        </div>
      </div>

      {/* Content Grid (Asymmetric Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column: Active Prescription Cards */}
        <div className="lg:col-span-8 space-y-md">
          {prescriptions.length > 0 ? prescriptions.map((pres) => (
            <div key={pres._id} className="bg-white border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-md border-b border-outline-variant/20 flex justify-between items-start bg-surface-bright/30">
                <div className="flex gap-md">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {pres.doctorId?.firstName?.[0] || 'D'}
                  </div>
                  <div>
                    <h3 className="font-h text-xl text-on-surface">Dr. {pres.doctorId?.firstName} {pres.doctorId?.lastName}</h3>
                    <div className="flex items-center gap-2 mt-xs">
                      <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Medical Specialist</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Issued: {new Date(pres.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-[8px] font-bold rounded-full flex items-center gap-1 uppercase tracking-widest border border-secondary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="p-md">
                <div className="overflow-hidden border border-outline-variant/20 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="px-md py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Medication</th>
                        <th className="px-md py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Dosage</th>
                        <th className="px-md py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Frequency</th>
                        <th className="px-md py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {pres.medications && pres.medications.map((med, idx) => (
                        <tr key={idx} className="hover:bg-primary/5 transition-colors">
                          <td className="px-md py-md font-bold text-sm text-on-surface">{med.drugName}</td>
                          <td className="px-md py-md text-sm text-on-surface-variant font-medium">{med.dose || '-'}</td>
                          <td className="px-md py-md text-sm text-on-surface-variant font-medium">{med.frequency || '-'}</td>
                          <td className="px-md py-md text-right">
                            <div className="inline-flex items-center gap-1">
                              {[2, 3, 4, 2, 3].map((h, i) => (
                                <div key={i} className="w-1 rounded-full bg-secondary" style={{ height: `${h * 4}px` }}></div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-md bg-surface-container-low/30 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-base">
                <button className="flex-1 py-3 bg-primary text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider transition-all">
                  <span className="material-symbols-outlined text-[18px]">alarm</span>
                  Set Reminders
                </button>
                <button className="flex-1 py-3 border-2 border-primary text-primary font-bold text-xs rounded-xl hover:bg-primary/5 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider transition-all">
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  Reorder Refill
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-5xl text-outline-variant/50 mb-4">prescriptions</span>
              <p className="text-on-surface-variant font-bold">No active prescriptions found.</p>
              <p className="text-on-surface-variant/60 text-sm mt-1">New prescriptions from your doctor will appear here.</p>
            </div>
          )}
        </div>

        {/* Right Column: AI Insights & Quick Stats */}
        <div className="lg:col-span-4 space-y-lg">
          {/* AI Insight Card */}
          <div className="glass-card p-md rounded-2xl shadow-xl border border-secondary/20 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl text-secondary">psychology</span>
            </div>
            <div className="flex items-center gap-sm mb-md relative z-10">
              <span className="material-symbols-outlined text-secondary fill-current">auto_awesome</span>
              <h4 className="font-h text-lg text-primary">Compliance Intelligence</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-md relative z-10">
              Your medication adherence is at <span className="text-secondary font-bold">94%</span> this month. This consistency significantly improves your therapeutic outcomes.
            </p>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-2 relative z-10">
              <div className="bg-secondary h-full shadow-[0_0_8px_rgba(0,104,123,0.5)]" style={{ width: '94%' }}></div>
            </div>
            <div className="flex justify-between font-bold text-[10px] text-on-surface-variant uppercase tracking-widest relative z-10">
              <span>Score</span>
              <span className="text-secondary">Optimal</span>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white p-md rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Medication Schedule</h4>
              <span className="text-xs font-bold text-primary">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="space-y-md">
              <div className="flex items-center gap-md p-sm bg-surface-container-low/50 rounded-xl border border-outline-variant/10">
                <div className="font-bold text-primary w-14 text-center border-r border-outline-variant/30 pr-2 text-xs">08:00 AM</div>
                <div className="flex-1">
                  <div className="font-bold text-on-surface text-sm">Morning Dose</div>
                  <div className="text-[10px] font-bold text-secondary uppercase">Taken</div>
                </div>
                <span className="material-symbols-outlined text-secondary fill-current">check_circle</span>
              </div>
              <div className="flex items-center gap-md p-sm border border-secondary/20 rounded-xl">
                <div className="font-bold text-primary w-14 text-center border-r border-outline-variant/30 pr-2 text-xs">08:00 PM</div>
                <div className="flex-1">
                  <div className="font-bold text-on-surface text-sm">Evening Dose</div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Upcoming</div>
                </div>
                <span className="material-symbols-outlined text-outline-variant">schedule</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,.pdf" 
        onChange={handleFileChange}
      />
      <button 
        onClick={handleUploadClick}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default Prescriptions;
