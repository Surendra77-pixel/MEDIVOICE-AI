const fs = require('fs');

try {
  let appCode = fs.readFileSync('client/src/App.jsx', 'utf-8');

  // Move ConsultationRoom outside of DoctorLayout
  appCode = appCode.replace(
    /<Route path="consultation" element={<ConsultationRoom \/>} \/>\n/,
    ''
  );

  appCode = appCode.replace(
    /{ \/\* Doctor Routes \*\/ }/,
    `{/* Consultation Room (Full Screen) */}
            <Route path="/doctor/consultation" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <ConsultationRoom />
              </ProtectedRoute>
            } />
            <Route path="/doctor/consultation/:id" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <ConsultationRoom />
              </ProtectedRoute>
            } />
            
            {/* Doctor Routes */}`
  );

  fs.writeFileSync('client/src/App.jsx', appCode);
  console.log('Successfully updated App.jsx routing for ConsultationRoom');

  // Now refactor ConsultationRoom.jsx
  let code = fs.readFileSync('client/src/pages/doctor/ConsultationRoom.jsx', 'utf-8');

  // Inject state and data fetching
  const newHeader = `import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ConsultationRoom = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  
  const [consultation, setConsultation] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchConsultation = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch specific consultation (we can use the queue endpoint and filter, or a specific endpoint if exists)
        // For now, we'll fetch queue and find it
        const res = await axios.get('http://localhost:3000/api/v1/doctor/consultations', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          const cons = res.data.data.find(c => c._id === id);
          if (cons) setConsultation(cons);
        }
      } catch (err) {
        toast.error('Failed to load consultation room');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id]);

  const handleEndSession = async () => {
    if (!id) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(\`http://localhost:3000/api/v1/doctor/consultations/\${id}/end\`, {}, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      toast.success('Session ended and SOAP note generated!');
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error('Failed to end session');
    }
  };
`;

  code = code.replace(/import React from 'react';[\s\S]*?const ConsultationRoom = \(\) => {/, newHeader);

  // Bind patient name
  code = code.replace(/<span className="text-on-surface dark:text-inverse-on-surface font-bold">Sarah Miller<\/span>/, 
    `{consultation ? <span className="text-on-surface dark:text-inverse-on-surface font-bold">{consultation.patientId?.firstName} {consultation.patientId?.lastName}</span> : <span className="text-on-surface dark:text-inverse-on-surface font-bold">Loading...</span>}`
  );

  // Bind End Session button
  code = code.replace(/<button className="bg-error text-on-error px-md py-sm rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all">[\s\S]*?End Session[\s\S]*?<\/button>/, 
    `<button onClick={handleEndSession} className="bg-error text-on-error px-md py-sm rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all">End Session</button>`
  );

  fs.writeFileSync('client/src/pages/doctor/ConsultationRoom.jsx', code);
  console.log('Successfully refactored ConsultationRoom.jsx');

} catch(e) {
  console.error(e);
}
