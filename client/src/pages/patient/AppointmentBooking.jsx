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
    <div className="flex pt-6 min-h-[80vh] animate-fade-in relative">
      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl mx-auto px-md pb-xl">
        {/* Step Header */}
        <div className="mb-lg">
          <h1 className="font-h text-4xl text-primary mb-xs">Book Appointment</h1>
          <p className="text-on-surface-variant">Schedule your session with our elite clinical specialists.</p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center gap-md mb-xl overflow-x-auto pb-2">
          <div className={`flex items-center gap-xs shrink-0 ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-surface-container'}`}>1</span>
            <span className="font-bold text-[10px] uppercase tracking-wider">Specialty</span>
          </div>
          <div className="h-px w-12 bg-outline-variant shrink-0"></div>
          <div className={`flex items-center gap-xs shrink-0 ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-surface-container'}`}>2</span>
            <span className="font-bold text-[10px] uppercase tracking-wider">Doctor</span>
          </div>
          <div className="h-px w-12 bg-outline-variant shrink-0"></div>
          <div className={`flex items-center gap-xs shrink-0 ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-surface-container'}`}>3</span>
            <span className="font-bold text-[10px] uppercase tracking-wider">Schedule</span>
          </div>
        </div>

        {/* Step 1: Specialty Selection */}
        {step === 1 && (
          <section className="space-y-lg animate-slide-up">
            <h2 className="font-h text-2xl text-on-surface">Select Medical Specialty</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    fetchDoctors(spec);
                  }}
                  className="glass-card p-lg rounded-xl border border-outline-variant/30 text-center hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <span className="material-symbols-outlined text-4xl text-primary mb-sm block group-hover:scale-110 transition-transform">medical_services</span>
                  <span className="font-bold text-on-surface">{spec}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <section className="space-y-lg animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="font-h text-2xl text-on-surface">Choose Your Specialist</h2>
              <button onClick={() => setStep(1)} className="text-primary font-bold text-xs hover:underline">Change Specialty</button>
            </div>
            <div className="grid grid-cols-1 gap-md">
              {doctors.length > 0 ? doctors.map(doc => (
                <div 
                  key={doc._id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setStep(3);
                  }}
                  className="bg-white border border-outline-variant/50 p-md rounded-xl shadow-sm flex items-center gap-md hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                    {doc.userId.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-sm mb-xs">
                      <h3 className="font-h text-xl text-on-surface">Dr. {doc.userId.firstName} {doc.userId.lastName}</h3>
                      <span className="bg-secondary/10 text-secondary px-sm py-xs rounded-full text-[8px] font-bold uppercase tracking-wider">Available</span>
                    </div>
                    <p className="text-primary text-sm font-bold mb-xs">{doc.specialization} • {doc.experience || 5}+ Years Exp.</p>
                    <div className="flex items-center gap-md">
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
              <h2 className="font-h text-2xl text-on-surface">Pick Date & Time</h2>
              <button onClick={() => setStep(2)} className="text-primary font-bold text-xs hover:underline">Change Doctor</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-md">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Consultation Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-md bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-md">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Available Slots</label>
                <div className="grid grid-cols-2 gap-sm">
                  {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-sm border rounded-xl font-bold text-sm transition-all ${selectedTimeSlot === slot ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-outline-variant hover:border-primary/50'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
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
      <aside className="hidden lg:flex sticky top-24 h-fit w-72 bg-white border border-outline-variant/30 rounded-2xl shadow-xl flex-col p-md gap-md">
        <div className="flex items-center gap-sm mb-md">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h4 className="font-h text-lg text-primary">Booking Summary</h4>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Step {step} of 3</p>
          </div>
        </div>

        <div className="space-y-sm">
          <div className={`p-sm rounded-lg flex items-center gap-sm transition-all ${selectedSpecialty ? 'bg-primary/5 border border-primary/20 text-primary' : 'bg-surface-container-low opacity-50'}`}>
            <span className="material-symbols-outlined text-sm">assignment</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-70">Specialty</span>
              <span className="font-bold text-xs">{selectedSpecialty || 'Not selected'}</span>
            </div>
            {selectedSpecialty && <span className="material-symbols-outlined ml-auto text-xs">check_circle</span>}
          </div>

          <div className={`p-sm rounded-lg flex items-center gap-sm transition-all ${selectedDoctor ? 'bg-primary/5 border border-primary/20 text-primary' : 'bg-surface-container-low opacity-50'}`}>
            <span className="material-symbols-outlined text-sm">medical_information</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-70">Doctor</span>
              <span className="font-bold text-xs">{selectedDoctor ? `Dr. ${selectedDoctor.userId.lastName}` : 'Not selected'}</span>
            </div>
            {selectedDoctor && <span className="material-symbols-outlined ml-auto text-xs">check_circle</span>}
          </div>

          <div className={`p-sm rounded-lg flex items-center gap-sm transition-all ${selectedDate && selectedTimeSlot ? 'bg-primary/5 border border-primary/20 text-primary' : 'bg-surface-container-low opacity-50'}`}>
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-70">Schedule</span>
              <span className="font-bold text-xs">{selectedDate && selectedTimeSlot ? `${selectedDate} @ ${selectedTimeSlot}` : 'Not selected'}</span>
            </div>
            {selectedDate && selectedTimeSlot && <span className="material-symbols-outlined ml-auto text-xs">check_circle</span>}
          </div>
        </div>

        <div className="mt-auto pt-md border-t border-outline-variant/30">
          <div className="mb-md p-sm bg-surface-container-low rounded-lg space-y-xs">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Consultation Fee</span>
              <span className="font-bold text-on-surface">$120.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">AI Analysis</span>
              <span className="font-bold text-secondary uppercase tracking-tighter">Complimentary</span>
            </div>
          </div>
          <button 
            disabled={step < 3 || !selectedDate || !selectedTimeSlot || loading}
            onClick={() => setStep(4)}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-primary/20 active:opacity-80 transition-all disabled:opacity-50"
          >
            Review Booking
          </button>
        </div>
      </aside>
      
      {/* Step 4: Review & Confirm (Full Screen Overlay) */}
      {step === 4 && (
        <div className="fixed inset-0 z-[100] bg-surface flex items-center justify-center p-md overflow-y-auto">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-outline-variant/30 p-lg animate-slide-up">
            <button 
              onClick={() => setStep(3)}
              className="flex items-center gap-xs text-on-surface-variant hover:text-primary font-bold text-sm mb-lg transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Schedule
            </button>
            
            <h1 className="font-h text-3xl text-on-surface mb-xs">Review & Confirm</h1>
            <p className="text-on-surface-variant mb-lg">Please verify your appointment details and complete the payment to confirm your slot.</p>

            <div className="bg-surface-container-low rounded-2xl p-md mb-lg border border-outline-variant/50">
               <h3 className="font-bold text-on-surface mb-md">Appointment Details</h3>
               <div className="grid grid-cols-2 gap-md">
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Doctor</p>
                   <p className="font-bold text-on-surface">Dr. {selectedDoctor?.userId?.lastName}</p>
                   <p className="text-sm text-on-surface-variant">{selectedDoctor?.subSpecialty}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date & Time</p>
                   <p className="font-bold text-on-surface">{selectedDate}</p>
                   <p className="text-sm text-on-surface-variant">{selectedTimeSlot}</p>
                 </div>
               </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-md mb-xl border border-primary/20">
               <h3 className="font-bold text-primary mb-md">Payment Summary</h3>
               <div className="space-y-sm">
                 <div className="flex justify-between">
                   <span className="text-on-surface-variant">Consultation Fee</span>
                   <span className="font-bold text-on-surface">${selectedDoctor?.consultationFee || 120}.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-on-surface-variant">Platform Fee</span>
                   <span className="font-bold text-on-surface">$5.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-on-surface-variant">AI Symptom Analysis</span>
                   <span className="font-bold text-secondary uppercase tracking-wider text-xs">Complimentary</span>
                 </div>
                 <div className="border-t border-primary/20 pt-sm mt-sm flex justify-between">
                   <span className="font-bold text-primary text-lg">Total</span>
                   <span className="font-black text-primary text-2xl">${(selectedDoctor?.consultationFee || 120) + 5}.00</span>
                 </div>
               </div>
            </div>

            <button 
              disabled={loading}
              onClick={handleBooking}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/30 hover:shadow-primary/40 active:opacity-80 transition-all text-lg flex justify-center items-center gap-2"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : 'Pay & Confirm Booking'}
            </button>
            <p className="text-center text-xs text-outline mt-sm flex items-center justify-center gap-1">
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
