const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/patient/MedicalHistory.jsx', 'utf-8');

  // Strip header and aside
  code = code.replace(/<aside[\s\S]*?<\/aside>/i, '');
  code = code.replace(/<header[\s\S]*?<\/header>/i, '');
  code = code.replace(/<footer[\s\S]*?<\/footer>/i, '');
  code = code.replace(/<button className="fixed bottom-lg right-lg[\s\S]*?<\/button>/i, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  // We will replace the entire <section className="relative pl-8 md:pl-16"> with our dynamic list
  const sectionMatch = mainContent.match(/<section className="relative pl-8 md:pl-16">[\s\S]*?<\/section>/i);
  
  const dynamicSection = `
<section className="relative pl-8 md:pl-16">
  <div className="absolute left-4 md:left-8 top-4 bottom-4 timeline-line bg-outline-variant w-[2px]"></div>
  <div className="space-y-lg">
    {loading ? (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ) : history.length === 0 ? (
      <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-100 relative z-10">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">history</span>
        <h3 className="text-xl font-bold text-gray-800">No Medical History Found</h3>
        <p className="text-gray-500 mt-2">Your past consultations and notes will appear here.</p>
      </div>
    ) : (
      history.map((record, index) => {
        const dateObj = new Date(record.createdAt);
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const docName = record.doctorId ? (record.doctorId.userId?.firstName + ' ' + record.doctorId.userId?.lastName) : 'Unknown Doctor';
        const docSpec = record.doctorId?.specialization || 'General Practice';
        const notes = record.notes || {};

        return (
          <div key={record._id} className="relative group">
            <div className="absolute -left-4 md:-left-8 top-6 w-8 md:w-16 h-[2px] bg-outline-variant"></div>
            <div className="absolute -left-[22px] md:-left-[38px] top-4 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm ring-4 ring-primary-container/10"></div>
            <div className="glass-card ai-glow rounded-xl p-md shadow-sm transition-all hover:shadow-md bg-white">
              <div className="flex flex-col md:flex-row gap-md justify-between items-start">
                <div className="flex-1 space-y-sm">
                  <div className="flex items-center gap-md">
                    <div className="text-center bg-surface-container-high px-sm py-xs rounded-lg min-w-[70px]">
                      <p className="text-[10px] font-label uppercase text-outline">{month}</p>
                      <p className="text-h3 font-bold text-on-surface">{day}</p>
                      <p className="text-[10px] font-label text-outline">{year}</p>
                    </div>
                    <div>
                      <h3 className="font-h3 text-h3 text-on-surface">Consultation Record</h3>
                      <div className="flex flex-wrap gap-sm mt-xs">
                        <span className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">medical_information</span>
                          Dr. {docName}
                        </span>
                        <span className="text-outline/30">•</span>
                        <span className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">local_hospital</span>
                          {docSpec}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-body-md leading-relaxed">{record.symptoms || 'No symptoms recorded.'}</p>
                </div>
                <div className="flex flex-col items-end gap-sm">
                  {record.status === 'completed' && (
                    <span className="bg-primary-container/10 text-primary px-3 py-1 rounded-full text-[12px] font-bold border border-primary/20">AI Summarized</span>
                  )}
                  <button className="text-primary font-bold flex items-center gap-xs hover:underline">
                    Expand Details
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
              </div>

              {/* Expandable Content */}
              <div className="mt-lg pt-lg border-t border-outline-variant/30 grid grid-cols-1 lg:grid-cols-3 gap-lg">
                <div className="lg:col-span-2 space-y-md">
                  <div className="bg-surface-container-lowest/50 p-md rounded-xl border border-outline-variant/50">
                    <h4 className="font-label text-label uppercase text-primary mb-sm">AI-Generated SOAP Note</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <p className="text-[12px] font-bold text-on-surface uppercase mb-xs">Subjective</p>
                        <p className="text-body-sm text-on-surface-variant">{notes.subjective || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-on-surface uppercase mb-xs">Objective</p>
                        <p className="text-body-sm text-on-surface-variant">{notes.objective || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-on-surface uppercase mb-xs">Assessment</p>
                        <p className="text-body-sm text-on-surface-variant">{notes.assessment || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-on-surface uppercase mb-xs">Plan</p>
                        <p className="text-body-sm text-on-surface-variant">{notes.plan || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-md">
                  <div className="bg-surface-container-lowest/50 p-md rounded-xl border border-outline-variant/50 h-full">
                    <h4 className="font-label text-label uppercase text-primary mb-sm">Prescribed Medications</h4>
                    <ul className="space-y-sm">
                      {record.prescriptions && record.prescriptions.length > 0 ? (
                        record.prescriptions.map((med, i) => (
                          <li key={i} className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                            <span className="font-bold text-body-sm">{med.medicineName}</span>
                            <span className="text-body-sm text-outline">{med.dosage}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-body-sm text-on-surface-variant italic">No medications prescribed.</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
</section>
  `;

  mainContent = mainContent.replace(sectionMatch[0], dynamicSection);

  const newCode = `import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MedicalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/v1/patient/medical-history', {
          headers: { Authorization: \`Bearer \${token}\` }
        });
        if (res.data.success) {
          setHistory(res.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="animate-fade-in w-full">
      ${mainContent}
    </div>
  );
};

export default MedicalHistory;
`;

  fs.writeFileSync('client/src/pages/patient/MedicalHistory.jsx', newCode);
  console.log('Successfully refactored MedicalHistory.jsx');

} catch(e) {
  console.error(e);
}
