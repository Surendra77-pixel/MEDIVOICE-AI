import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const AppointmentBooking = () => {
  const [step, setStep] = useState(1);
  const [specialties] = useState([
    'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedist', 'Dermatologist', 'General Physician'
  ]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const triageSymptoms = location.state?.triageSymptoms || [];

  useEffect(() => {
    if (location.state?.preSelectedDoctor) {
      const doc = location.state.preSelectedDoctor;
      setSelectedSpecialty(doc.specialty);
      
      // Map the augmented doctor back to the format expected by handleBooking
      setSelectedDoctor({
        _id: doc._id,
        userId: { 
          _id: doc._id, 
          firstName: doc.name.replace('Dr. ', '').split(' ')[0], 
          lastName: doc.name.replace('Dr. ', '').split(' ')[1] || '' 
        },
        specialization: doc.specialty,
        experience: doc.experience
      });
      
      // Wait for state to settle then jump to schedule step
      setTimeout(() => {
        setStep(3);
      }, 0);
    }
  }, [location.state]);

  const fetchDoctors = async (specialty) => {
    setLoading(true);
    try {
      const res = await api.get(`/patient/doctors/search?specialty=${specialty}`);
      setDoctors(res.data.data.doctors || res.data.data || []);
      setStep(2);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      return toast.error('Please complete all fields');
    }
    setLoading(true);
    try {
      const scheduledAt = new Date(`${selectedDate} ${selectedTimeSlot}`);
      await api.post('/patient/appointments', {
        doctorId: selectedDoctor.userId._id || selectedDoctor.userId,
        scheduledAt: scheduledAt.toISOString(),
        chiefComplaint: `Consultation for ${selectedSpecialty}`,
        triageData: {
          symptoms: triageSymptoms.map(s => s.name),
          riskLevel: triageSymptoms.some(s => s.severity === 'MODERATE') ? 'YELLOW' : 
                     triageSymptoms.some(s => s.severity === 'SEVERE') ? 'RED' : 'GREEN'
        }
      });
      toast.success('Appointment booked successfully!');
      setStep(5);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 pt-6 min-h-[80vh] animate-fade-in relative max-w-7xl mx-auto w-full">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pb-xl">
        {/* Step Header */}
        <div className="mb-lg">
          <h1 className="font-h text-4xl text-primary mb-xs">Book Appointment</h1>
          <p className="text-on-surface-variant">Schedule your session with our elite clinical specialists.</p>
        </div>

        {/* Step Progress Indicator - 3D Animated */}
        <div className="flex items-center gap-md mb-xl overflow-x-auto pb-6 pt-4 perspective-1000">
          {[
            { num: 1, label: 'Specialty' },
            { num: 2, label: 'Doctor' },
            { num: 3, label: 'Schedule' }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div 
                className={`flex items-center gap-3 shrink-0 transition-all duration-700 ease-out transform-gpu ${
                  step >= s.num ? 'text-primary dark:text-primary scale-105' : 'text-on-surface-variant/50 dark:text-gray-600 scale-95 opacity-70'
                }`}
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transform: step === s.num ? 'translateZ(20px)' : 'translateZ(0px)' 
                }}
              >
                <div 
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-700 ease-out ${
                    step >= s.num 
                      ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.4),inset_0_-3px_5px_rgba(0,0,0,0.2),inset_0_3px_5px_rgba(255,255,255,0.4)] ring-4 ring-primary/20' 
                      : 'bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.05)]'
                  }`}
                  style={{
                    transform: step === s.num ? 'rotateY(0deg) scale(1.1)' : step > s.num ? 'rotateY(10deg) scale(0.9)' : 'rotateY(-10deg) scale(0.9)',
                  }}
                >
                  {step > s.num ? (
                    <span className="material-symbols-outlined text-white font-black animate-scale-up">check</span>
                  ) : (
                    s.num
                  )}
                  
                  {/* Glowing aura for active step */}
                  {step === s.num && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10 animate-pulse"></div>
                  )}
                </div>
                <span className={`font-bold text-xs uppercase tracking-widest transition-all duration-500 ${step === s.num ? 'drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : ''}`}>
                  {s.label}
                </span>
              </div>
              
              {/* Connector Line */}
              {i < 2 && (
                <div className="relative h-[2px] flex-1 min-w-[20px] max-w-[80px] shrink rounded-full overflow-hidden bg-outline-variant/30 dark:bg-white/5">
                  <div 
                    className="absolute inset-0 h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-1000 ease-in-out"
                    style={{ 
                      width: step > s.num ? '100%' : '0%',
                      boxShadow: '0 0 10px rgba(37,99,235,0.8)'
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Specialty Selection */}
        {step === 1 && (
          <section className="space-y-lg animate-slide-up">
            <h2 className="font-h text-2xl text-on-surface dark:text-white font-bold drop-shadow-md">Select Medical Specialty</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    fetchDoctors(spec);
                  }}
                  className="bg-surface/50 dark:bg-white/5 backdrop-blur-xl p-lg rounded-2xl border border-outline-variant/30 dark:border-white/10 text-center hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/20 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_10px_30px_rgba(37,99,235,0.2)] transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined text-4xl text-primary mb-sm block group-hover:scale-110 transition-transform duration-300 drop-shadow-md">medical_services</span>
                  <span className="font-bold text-on-surface dark:text-gray-200 group-hover:text-primary dark:group-hover:text-white transition-colors">{spec}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <section className="space-y-lg animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="font-h text-2xl text-on-surface dark:text-white font-bold drop-shadow-md">Choose Your Specialist</h2>
              <button onClick={() => setStep(1)} className="text-primary font-bold text-xs hover:underline bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Change Specialty</button>
            </div>
            <div className="grid grid-cols-1 gap-md">
              {doctors.length > 0 ? doctors.map(doc => (
                <div 
                  key={doc._id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setStep(3);
                  }}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/50 dark:border-white/10 p-md rounded-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center gap-md hover:border-primary/50 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden group-hover:scale-105 transition-transform">
                    {doc.userId.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <h3 className="font-h text-xl text-on-surface dark:text-white group-hover:text-primary transition-colors">Dr. {doc.userId.firstName} {doc.userId.lastName}</h3>
                      <span className="bg-secondary/10 text-secondary border border-secondary/20 px-sm py-xs rounded-full text-[8px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">Available</span>
                    </div>
                    <p className="text-primary text-sm font-bold mb-xs">{doc.specialization} • {doc.experience || 5}+ Years Exp.</p>
                    <div className="flex items-center gap-md text-xs text-on-surface-variant dark:text-gray-400">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-secondary text-[16px] fill-current">star</span>
                        <span className="text-xs font-bold text-on-surface">4.9</span>
                      </div>
                      <div className="flex items-center gap-xs text-on-surface-variant text-xs">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>Clinical Plaza</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary px-lg py-2 text-xs">Select</button>
                </div>
              )) : (
                <div className="text-center py-20 bg-surface-container-low rounded-xl">
                  <p className="text-on-surface-variant italic">No doctors found for this specialty.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Step 3: Schedule Selection */}
        {step === 3 && (
          <section className="space-y-lg animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="font-h text-2xl text-on-surface dark:text-white font-bold drop-shadow-md">Select Date & Time</h2>
              <button onClick={() => setStep(2)} className="text-primary font-bold text-xs hover:underline bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Change Doctor</button>
            </div>

            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/50 dark:border-white/10 p-lg rounded-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] space-y-lg">
              {/* Doctor Summary */}
              <div className="flex items-center gap-md border-b border-outline-variant/30 dark:border-white/10 pb-md">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                  {selectedDoctor.userId.firstName[0]}
                </div>
                <div>
                  <h3 className="font-h text-lg text-on-surface dark:text-white">Dr. {selectedDoctor.userId.firstName} {selectedDoctor.userId.lastName}</h3>
                  <p className="text-on-surface-variant dark:text-gray-400 text-sm">{selectedDoctor.specialization}</p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="perspective-1000">
                <label className="block text-sm font-bold text-on-surface dark:text-gray-200 mb-sm">Select Date</label>
                <div className="flex gap-md overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x px-2">
                  {[...Array(14)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const isSelected = selectedDate === date.toISOString().split('T')[0];
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                        className={`snap-center shrink-0 min-w-[85px] p-md rounded-2xl text-center transition-all duration-500 ease-out transform-gpu flex flex-col items-center gap-1 ${
                          isSelected 
                            ? 'bg-gradient-to-b from-primary to-blue-600 border border-primary/50 text-white shadow-[0_15px_30px_rgba(37,99,235,0.4),inset_0_-3px_10px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.4)] scale-110 z-10' 
                            : 'bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-gray-400 hover:text-on-surface dark:hover:text-white hover:border-primary/50 hover:bg-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.05),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.2)] hover:-translate-y-2'
                        }`}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isSelected ? 'translateZ(20px) rotateX(10deg)' : 'translateZ(0px) rotateX(0deg)'
                        }}
                      >
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'opacity-90 text-white' : 'opacity-60'}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className={`text-2xl font-black my-1 ${isSelected ? 'drop-shadow-md' : ''}`}>{date.getDate()}</div>
                        <div className={`text-xs font-bold ${isSelected ? 'opacity-90 text-white' : 'opacity-60'}`}>{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                        
                        {isSelected && (
                          <div className="absolute -bottom-1 w-8 h-1 rounded-full bg-white/50 blur-sm shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="animate-fade-in perspective-1000 mt-lg">
                  <label className="block text-sm font-bold text-on-surface dark:text-gray-200 mb-sm">Select Time</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => {
                      const isSelected = selectedTimeSlot === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`p-3 rounded-2xl text-sm font-bold transition-all duration-500 ease-out transform-gpu flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-gradient-to-b from-primary to-blue-600 border border-primary/50 text-white shadow-[0_15px_30px_rgba(37,99,235,0.4),inset_0_-3px_10px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.4)] scale-110 z-10'
                              : 'bg-surface-container-low dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-gray-400 hover:text-on-surface dark:hover:text-white hover:border-primary/50 hover:bg-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.05),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.2)] hover:-translate-y-2'
                          }`}
                          style={{
                            transformStyle: 'preserve-3d',
                            transform: isSelected ? 'translateZ(20px) rotateX(10deg)' : 'translateZ(0px) rotateX(0deg)'
                          }}
                        >
                          <span className={isSelected ? 'drop-shadow-md' : ''}>{time}</span>
                          {isSelected && (
                            <div className="absolute -bottom-1 w-12 h-1 rounded-full bg-white/50 blur-sm shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="ai-insight-card p-md rounded-xl flex items-start gap-md bg-primary/5 border border-primary/20 mt-lg">
              <div className="bg-primary p-xs rounded-lg text-white">
                <span className="material-symbols-outlined text-lg">psychology</span>
              </div>
              <div>
                <h4 className="font-h text-sm text-primary mb-xs">AI Smart Suggestion</h4>
                <p className="text-xs text-on-surface-variant">Based on Dr. {selectedDoctor?.userId?.lastName}'s average consultation length, we recommend the 10:30 AM slot for a thorough evaluation.</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Side Summary Panel */}
      <aside className="w-full xl:w-80 flex shrink-0 xl:sticky xl:top-24 h-fit bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-outline-variant/30 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex-col p-md md:p-lg gap-md transition-all">
        <div className="flex items-center gap-sm mb-md">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h4 className="font-h text-lg text-primary dark:text-white drop-shadow-sm">Booking Summary</h4>
            <p className="text-[10px] font-bold text-on-surface-variant dark:text-primary uppercase tracking-widest">Step {step} of 3</p>
          </div>
        </div>

        <div className="space-y-sm">
          <div className={`p-md rounded-xl flex items-center gap-sm transition-all duration-300 ${selectedSpecialty ? 'bg-primary/10 border border-primary/30 text-primary dark:text-white shadow-inner' : 'bg-surface-container-low dark:bg-white/5 opacity-50 dark:opacity-30'}`}>
            <span className="material-symbols-outlined text-sm">assignment</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-70">Specialty</span>
              <span className="font-bold text-xs">{selectedSpecialty || 'Not selected'}</span>
            </div>
            {selectedSpecialty && <span className="material-symbols-outlined ml-auto text-xs text-primary drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]">check_circle</span>}
          </div>

          <div className={`p-md rounded-xl flex items-center gap-sm transition-all duration-300 ${selectedDoctor ? 'bg-primary/10 border border-primary/30 text-primary dark:text-white shadow-inner' : 'bg-surface-container-low dark:bg-white/5 opacity-50 dark:opacity-30'}`}>
            <span className="material-symbols-outlined text-sm">medical_information</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-70">Doctor</span>
              <span className="font-bold text-xs">{selectedDoctor ? `Dr. ${selectedDoctor.userId.lastName}` : 'Not selected'}</span>
            </div>
            {selectedDoctor && <span className="material-symbols-outlined ml-auto text-xs text-primary drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]">check_circle</span>}
          </div>

          <div className={`p-md rounded-xl flex items-center gap-sm transition-all duration-300 ${selectedDate && selectedTimeSlot ? 'bg-primary/10 border border-primary/30 text-primary dark:text-white shadow-inner' : 'bg-surface-container-low dark:bg-white/5 opacity-50 dark:opacity-30'}`}>
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-70">Schedule</span>
              <span className="font-bold text-xs">{selectedDate && selectedTimeSlot ? `${selectedDate} @ ${selectedTimeSlot}` : 'Not selected'}</span>
            </div>
            {selectedDate && selectedTimeSlot && <span className="material-symbols-outlined ml-auto text-xs text-primary drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]">check_circle</span>}
          </div>
        </div>

        <div className="mt-auto pt-md border-t border-outline-variant/30 dark:border-white/10">
          <div className="mb-md p-md bg-surface-container-low dark:bg-black/40 rounded-xl space-y-xs border border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant dark:text-gray-400">Consultation Fee</span>
              <span className="font-bold text-on-surface dark:text-white">$120.00</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-on-surface-variant dark:text-gray-400">AI Analysis</span>
              <span className="font-bold text-secondary dark:text-emerald-400 uppercase tracking-tighter drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">Complimentary</span>
            </div>
          </div>
          <button 
            disabled={step < 3 || !selectedDate || !selectedTimeSlot || loading}
            onClick={() => setStep(4)}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 dark:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-primary/50 hover:-translate-y-1 active:opacity-80 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Review Booking
          </button>
        </div>
      </aside>
      
      {/* Step 4: Review & Confirm (Full Screen Overlay) */}
      {step === 4 && (
        <div className="fixed inset-0 z-[100] bg-surface/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-md overflow-y-auto">
          <div className="max-w-2xl w-full bg-white dark:bg-[#1a1c23] rounded-3xl shadow-2xl border border-outline-variant/30 dark:border-white/10 p-xl animate-scale-up">
            <button 
              onClick={() => setStep(3)}
              className="flex items-center gap-xs text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary font-bold text-sm mb-lg transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Schedule
            </button>
            
            <h1 className="font-h text-3xl text-on-surface dark:text-white mb-xs font-bold drop-shadow-md">Review & Confirm</h1>
            <p className="text-on-surface-variant dark:text-gray-400 mb-xl">Please verify your appointment details and complete the payment to confirm your slot.</p>

            <div className="bg-surface-container-low dark:bg-white/5 rounded-2xl p-lg mb-lg border border-outline-variant/50 dark:border-white/10 shadow-inner">
               <h3 className="font-bold text-on-surface dark:text-white mb-md text-lg">Appointment Details</h3>
               <div className="grid grid-cols-2 gap-md">
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant dark:text-gray-500 uppercase tracking-wider mb-1">Doctor</p>
                   <p className="font-bold text-on-surface dark:text-white text-lg">Dr. {selectedDoctor?.userId?.lastName}</p>
                   <p className="text-sm text-on-surface-variant dark:text-primary">{selectedDoctor?.subSpecialty}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant dark:text-gray-500 uppercase tracking-wider mb-1">Date & Time</p>
                   <p className="font-bold text-on-surface dark:text-white text-lg">{selectedDate}</p>
                   <p className="text-sm text-on-surface-variant dark:text-primary">{selectedTimeSlot}</p>
                 </div>
               </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-lg mb-xl border border-primary/20 shadow-inner">
               <h3 className="font-bold text-primary dark:text-primary mb-md text-lg">Payment Summary</h3>
               <div className="space-y-sm">
                 <div className="flex justify-between">
                   <span className="text-on-surface-variant dark:text-gray-300">Consultation Fee</span>
                   <span className="font-bold text-on-surface dark:text-white">${selectedDoctor?.consultationFee || 120}.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-on-surface-variant dark:text-gray-300">Platform Fee</span>
                   <span className="font-bold text-on-surface dark:text-white">$5.00</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-on-surface-variant dark:text-gray-300">AI Symptom Analysis</span>
                   <span className="font-bold text-secondary dark:text-emerald-400 uppercase tracking-wider text-xs drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">Complimentary</span>
                 </div>
                 <div className="border-t border-primary/20 pt-md mt-md flex justify-between items-end">
                   <span className="font-bold text-primary text-lg">Total</span>
                   <span className="font-black text-primary text-4xl drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]">${(selectedDoctor?.consultationFee || 120) + 5}.00</span>
                 </div>
               </div>
            </div>

            <button 
              disabled={loading}
              onClick={handleBooking}
              className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 dark:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all text-xl flex justify-center items-center gap-2"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : 'Pay & Confirm Booking'}
            </button>
            <p className="text-center text-xs text-outline dark:text-gray-500 mt-md flex items-center justify-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs">lock</span> Secure 256-bit SSL encryption
            </p>
          </div>
        </div>
      )}
      
      {/* Step 5: Success Screen */}
      {step === 5 && (
        <div className="fixed inset-0 z-[110] bg-surface-bright flex items-center justify-center p-md">
          <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl border border-outline-variant/30 p-xl text-center animate-scale-up">
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-secondary text-5xl animate-bounce-subtle">check_circle</span>
            </div>
            
            <h1 className="font-h text-3xl text-primary mb-sm">Booking Confirmed!</h1>
            <p className="text-on-surface-variant mb-xl leading-relaxed">
              Your appointment with <span className="font-bold text-on-surface">Dr. {selectedDoctor?.userId?.lastName}</span> has been successfully scheduled and added to your health timeline.
            </p>

            <div className="bg-surface-container-low rounded-2xl p-md mb-xl text-left border border-outline-variant/30">
               <div className="flex items-center gap-md mb-md">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">calendar_month</span>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date & Time</p>
                   <p className="font-bold text-on-surface text-sm">{selectedDate} @ {selectedTimeSlot}</p>
                 </div>
               </div>
               <div className="flex items-center gap-md">
                 <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">videocam</span>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
                   <p className="font-bold text-on-surface text-sm">Secure Virtual Room</p>
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-base">
              <button 
                onClick={() => navigate('/patient/dashboard')}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => navigate('/patient/dashboard')}
                className="w-full py-3 text-primary font-bold text-sm hover:underline"
              >
                View in Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
