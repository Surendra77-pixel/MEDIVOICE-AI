const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/patient/AppointmentBooking.jsx', 'utf-8');

  // Extract the main content wrapper (we already stripped the header in the previous failed run? No, we didn't save because it threw)
  code = code.replace(/<header[\s\S]*?<\/header>/, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  const doctorsGridMatch = mainContent.match(/<div className="grid grid-cols-1 gap-md">([\s\S]*?)<div className="ai-insight-card/);
  
  if (doctorsGridMatch) {
    const dynamicGrid = `
<div className="grid grid-cols-1 gap-md mb-lg">
  {loading ? (
    <div className="p-8 text-center text-on-surface-variant">Loading recommended specialists...</div>
  ) : doctors.map((doc, i) => (
    <div 
      key={doc._id || i}
      onClick={() => setSelectedDoctor(doc)}
      className={\`bg-surface-container-lowest border p-md rounded-xl shadow-sm flex items-center gap-md transition-all cursor-pointer group \${selectedDoctor?._id === doc._id ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/50 hover:border-primary/50'}\`}
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center text-primary font-h1">
        {doc.user?.firstName?.[0] || 'D'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-sm mb-xs">
          <h3 className="font-h3 text-h3 text-on-surface">Dr. {doc.user?.firstName} {doc.user?.lastName}</h3>
          {doc.availability === 'available' && <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full text-label font-bold">AVAILABLE</span>}
        </div>
        <p className="text-primary font-body-md font-semibold mb-xs">{doc.specialization?.join(', ') || 'Specialist'} • {doc.experience || 5} Years Exp.</p>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-secondary text-[18px]">star</span>
            <span className="font-body-sm text-on-surface font-bold">{doc.rating || '4.9'}</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">payments</span>
            <span className="font-body-sm text-on-surface-variant">$\${doc.consultationFee || 150} / session</span>
          </div>
        </div>
      </div>
      <button className={\`px-lg py-base rounded-lg font-bold transition-all \${selectedDoctor?._id === doc._id ? 'bg-primary text-on-primary' : 'border border-primary text-primary group-hover:bg-primary-container'}\`}>
        {selectedDoctor?._id === doc._id ? 'Selected' : 'Select'}
      </button>
    </div>
  ))}
</div>
<div className="ai-insight-card`;
    
    mainContent = mainContent.replace(doctorsGridMatch[0], dynamicGrid);
  }

  mainContent = mainContent.replace(
    /<span className="font-bold font-body-sm italic">Selecting\.\.\.<\/span>/,
    `{selectedDoctor ? <span className="font-bold font-body-sm text-primary">Dr. {selectedDoctor.user?.lastName}</span> : <span className="font-bold font-body-sm italic text-on-surface-variant">Selecting...</span>}`
  );

  mainContent = mainContent.replace(
    /<span className="font-bold text-on-surface">\$120\.00<\/span>/,
    `<span className="font-bold text-on-surface">\${selectedDoctor?.consultationFee || 0}.00</span>`
  );

  mainContent = mainContent.replace(
    /<button className="w-full py-md bg-primary text-on-primary rounded-lg font-bold shadow-lg hover:shadow-primary\/20 active:opacity-80 transition-all">/,
    `<button onClick={handleConfirm} disabled={!selectedDoctor || isSubmitting} className="w-full py-md bg-primary text-on-primary rounded-lg font-bold shadow-lg hover:shadow-primary/20 active:opacity-80 transition-all disabled:opacity-50">`
  );
  mainContent = mainContent.replace(
    /Confirm Appointment/,
    `{isSubmitting ? 'Confirming...' : 'Confirm Appointment'}`
  );

  const newCode = `import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/patient/doctors/search', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          setDoctors(res.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleConfirm = async () => {
    if (!selectedDoctor) return toast.error('Please select a doctor first');
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const res = await axios.post('http://localhost:3000/api/v1/patient/appointments/book', {
        doctorId: selectedDoctor._id,
        date: tomorrow.toISOString(),
        timeSlot: '10:00 AM',
        reason: 'General Consultation',
        type: 'online'
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      
      if (res.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full">
      ${mainContent}
    </div>
  );
};

export default AppointmentBooking;
`;

  fs.writeFileSync('client/src/pages/patient/AppointmentBooking.jsx', newCode);
  console.log('Successfully refactored AppointmentBooking.jsx');
} catch(e) {
  console.error(e);
}
