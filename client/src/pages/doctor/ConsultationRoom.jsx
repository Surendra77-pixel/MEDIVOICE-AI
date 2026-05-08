import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const ConsultationRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soapNote, setSoapNote] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchConsultation = async () => {
      try {
        const res = await api.get(`/${user.role}/consultation/${id}`);
        if (res.data.success) {
          setConsultation(res.data.data);
          if (res.data.data.soapNote) {
            setSoapNote(res.data.data.soapNote);
          }
        }
      } catch (err) {
        toast.error('Failed to load consultation room');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id, user.role]);

  const handleEndSession = async () => {
    if (user.role !== ROLES.DOCTOR) {
      navigate('/patient/dashboard');
      return;
    }

    try {
      await api.post(`/doctor/consultation/soap`, {
        consultationId: id,
        soapNote
      });

      await api.patch(`/doctor/consultation/${id}/end`);
      
      toast.success('Consultation ended successfully');
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-inverse-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-inverse-surface text-surface-variant font-body min-h-screen overflow-hidden flex flex-col">
      {/* Top Header */}
      <header className="bg-inverse-surface/80 backdrop-blur-md border-b border-outline/20 h-16 flex justify-between items-center px-md z-50 shrink-0">
        <div className="flex items-center gap-md">
          <span className="font-h text-2xl font-bold text-primary">MediVoice AI</span>
          <div className="h-6 w-px bg-outline/20"></div>
          <div className="flex items-center gap-sm">
            <span className="text-white font-bold">
              {user.role === ROLES.DOCTOR ? `${consultation?.patientId?.firstName} ${consultation?.patientId?.lastName}` : `Dr. ${consultation?.doctorId?.userId?.lastName}`}
            </span>
            <span className="bg-error/10 text-error px-sm py-xs rounded-full text-[10px] font-bold border border-error/20 flex items-center gap-1 uppercase">
              <span className="material-symbols-outlined text-[12px] fill-current">warning</span>
              LIVE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm font-bold text-primary">
            <span className="material-symbols-outlined">schedule</span>
            <span className="tabular-nums">00:15:24</span>
          </div>
          <button 
            onClick={handleEndSession}
            className="bg-error text-white px-md py-sm rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all"
          >
            End Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-md grid grid-cols-12 gap-md overflow-hidden">
        {/* Left: AI SOAP Note (Visible to Doctors only or simplified for patients) */}
        <aside className={`${user.role === ROLES.DOCTOR ? 'col-span-3' : 'hidden'} flex flex-col gap-md overflow-y-auto custom-scrollbar`}>
          <div className="flex items-center justify-between">
            <h2 className="font-h text-xl text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">clinical_notes</span>
              AI SOAP Note
            </h2>
            <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Auto-Generating</span>
          </div>
          <div className="space-y-md">
            {['subjective', 'objective', 'assessment', 'plan'].map((field) => (
              <div key={field} className="glass-panel bg-white/5 border border-white/10 rounded-xl p-md flex flex-col gap-sm">
                <div className="flex items-center gap-2 text-primary font-bold border-b border-white/5 pb-2 uppercase text-[10px] tracking-widest">
                  <span className="font-label">{field}</span>
                </div>
                <textarea
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-surface-variant/80 resize-none min-h-[80px]"
                  value={soapNote[field]}
                  onChange={(e) => setSoapNote({ ...soapNote, [field]: e.target.value })}
                  placeholder={`Enter ${field}...`}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Video Feed */}
        <section className={`${user.role === ROLES.DOCTOR ? 'col-span-6' : 'col-span-9'} flex flex-col gap-md`}>
          <div className="flex-1 grid grid-rows-2 gap-md overflow-hidden">
            {/* Participant 1 */}
            <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/20 bg-black/40">
              <img 
                className="w-full h-full object-cover opacity-80" 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
                alt="Patient"
              />
              <div className="absolute bottom-md left-md bg-black/50 backdrop-blur-md px-md py-xs rounded-lg flex items-center gap-2 border border-white/10">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-sm">
                  {user.role === ROLES.DOCTOR ? consultation?.patientId?.firstName : "You"}
                </span>
              </div>
            </div>
            {/* Participant 2 */}
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <img 
                className="w-full h-full object-cover opacity-80" 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"
                alt="Doctor"
              />
              <div className="absolute bottom-md left-md bg-black/50 backdrop-blur-md px-md py-xs rounded-lg flex items-center gap-2 border border-white/10">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-white font-bold text-sm">
                  {user.role === ROLES.DOCTOR ? "You" : `Dr. ${consultation?.doctorId?.userId?.lastName}`}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Live Transcript */}
        <aside className="col-span-3 flex flex-col gap-md overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="font-h text-xl text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">translate</span>
              Live STT
            </h2>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-50"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-20"></div>
            </div>
          </div>
          <div className="glass-panel bg-white/5 border border-white/10 flex-1 rounded-xl p-md flex flex-col gap-md overflow-y-auto custom-scrollbar">
            {consultation?.transcript?.length > 0 ? consultation.transcript.map((line, idx) => (
              <div key={idx} className="flex flex-col gap-sm animate-fade-in">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{line.speaker}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">{line.originalLang}</span>
                </div>
                <div className={`p-sm rounded-lg border-l-2 ${line.speaker === 'doctor' ? 'bg-primary/10 border-primary' : 'bg-secondary/10 border-secondary'}`}>
                  <p className="text-white text-sm mb-1">{line.originalText}</p>
                  <p className="text-primary font-bold text-sm italic">"{line.translatedText}"</p>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center text-center p-md">
                <p className="text-surface-variant/40 italic text-sm">Waiting for conversation to start...</p>
              </div>
            )}
            <div className="pt-sm border-t border-white/5 text-center mt-auto shrink-0">
              <p className="text-[10px] text-surface-variant/40 uppercase tracking-widest font-bold">Real-time AI Processing Active</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Control Bar */}
      <footer className="h-24 flex items-center justify-center px-md shrink-0">
        <div className="bg-black/50 backdrop-blur-xl px-xl py-sm rounded-full flex items-center gap-lg border border-white/10 shadow-2xl">
          <div className="flex items-center gap-md pr-lg border-r border-white/10">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <span className="material-symbols-outlined">{isMuted ? 'mic_off' : 'mic'}</span>
            </button>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <span className="material-symbols-outlined">{isVideoOff ? 'videocam_off' : 'videocam'}</span>
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">present_to_all</span>
            </button>
          </div>
          <button className="bg-primary text-white px-xl py-sm rounded-full font-h font-bold flex items-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">history_edu</span>
            {user.role === ROLES.DOCTOR ? 'Clinical Records' : 'Medical History'}
          </button>
          <div className="flex items-center gap-md pl-lg border-l border-white/10">
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConsultationRoom;
