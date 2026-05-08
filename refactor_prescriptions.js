const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/patient/Prescriptions.jsx', 'utf-8');

  // Strip header and nav
  code = code.replace(/<header[\s\S]*?<\/header>/i, '');
  code = code.replace(/<nav[\s\S]*?<\/nav>/i, '');
  code = code.replace(/<button className="fixed bottom-lg right-lg[\s\S]*?<\/button>/i, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  // We will replace the entire <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg"> with our dynamic code
  const gridMatch = mainContent.match(/<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">[\s\S]*?<\/div>\s*<\/div>/i);
  
  const dynamicGrid = `
<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
  <div className="lg:col-span-8 space-y-md">
    {loading ? (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ) : consultations.filter(c => c.prescriptions && c.prescriptions.length > 0).length === 0 ? (
      <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-100">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">prescriptions</span>
        <h3 className="text-xl font-bold text-gray-800">No Prescriptions Found</h3>
        <p className="text-gray-500 mt-2">You currently have no active prescriptions from your consultations.</p>
      </div>
    ) : (
      consultations.filter(c => c.prescriptions && c.prescriptions.length > 0).map(consultation => {
        const docName = consultation.doctorId ? (consultation.doctorId.userId?.firstName + ' ' + consultation.doctorId.userId?.lastName) : 'Unknown Doctor';
        const docSpec = consultation.doctorId?.specialization || 'General Practice';
        const initial = docName.replace('Dr. ', '').charAt(0);
        
        return (
          <div key={consultation._id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-md border-b border-outline-variant/20 bg-surface-container-lowest flex justify-between items-start">
              <div className="flex gap-md">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container/10 flex items-center justify-center font-bold text-primary text-xl">
                  {initial}
                </div>
                <div>
                  <h3 className="font-h3 text-h3 text-on-surface">Dr. {docName}</h3>
                  <div className="flex items-center gap-base mt-xs">
                    <span className="font-label text-label uppercase text-primary tracking-widest">{docSpec}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="font-body-sm text-on-surface-variant">Issued: {new Date(consultation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <span className="px-sm py-xs bg-green-100 text-green-700 text-label rounded-full font-bold flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                ACTIVE
              </span>
            </div>
            <div className="p-md flex-1">
              <div className="overflow-hidden border border-outline-variant/10 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low">
                    <tr>
                      <th className="px-md py-sm font-label text-label text-on-surface-variant border-b border-outline-variant/20">Drug Name</th>
                      <th className="px-md py-sm font-label text-label text-on-surface-variant border-b border-outline-variant/20">Dosage</th>
                      <th className="px-md py-sm font-label text-label text-on-surface-variant border-b border-outline-variant/20">Instructions</th>
                      <th className="px-md py-sm font-label text-label text-on-surface-variant border-b border-outline-variant/20 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {consultation.prescriptions.map((med, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-md py-md font-bold text-on-surface border-b border-outline-variant/10">{med.medicineName}</td>
                        <td className="px-md py-md text-on-surface-variant border-b border-outline-variant/10">{med.dosage}</td>
                        <td className="px-md py-md text-on-surface-variant border-b border-outline-variant/10">{med.instructions}</td>
                        <td className="px-md py-md text-right border-b border-outline-variant/10">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-md bg-surface-container-low/30 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-base">
              <button className="flex-1 py-sm px-md bg-primary-container text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined text-[20px]">alarm</span>
                Set Reminder
              </button>
            </div>
          </div>
        );
      })
    )}
  </div>

  <div className="lg:col-span-4 space-y-lg">
    <div className="ai-card p-md rounded-xl shadow-md border border-secondary-container/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-sm opacity-10">
        <span className="material-symbols-outlined text-6xl text-secondary">psychology</span>
      </div>
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
        <h4 className="font-h3 text-h3 text-primary">AI Compliance</h4>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-md">
        Based on your records, you've maintained <span className="text-secondary font-bold">100% compliance</span>. Keep up the good work!
      </p>
      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
        <div className="bg-secondary h-full" style={{ width: '100%' }}></div>
      </div>
    </div>

    <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
      <h4 className="font-label text-label uppercase text-on-surface-variant tracking-widest mb-md">Primary Pharmacy</h4>
      <div className="flex items-start gap-md">
        <div className="p-sm bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-primary">local_pharmacy</span>
        </div>
        <div>
          <div className="font-bold text-on-surface">MediVoice Direct Rx</div>
          <div className="font-body-sm text-on-surface-variant">Home Delivery Enabled</div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  if(gridMatch) {
    mainContent = mainContent.replace(gridMatch[0], dynamicGrid);
  }

  const newCode = `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Prescriptions = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/patient/medical-history', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          setConsultations(res.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="animate-fade-in w-full">
      ${mainContent}
    </div>
  );
};

export default Prescriptions;
`;

  fs.writeFileSync('client/src/pages/patient/Prescriptions.jsx', newCode);
  console.log('Successfully refactored Prescriptions.jsx');

} catch(e) {
  console.error(e);
}
