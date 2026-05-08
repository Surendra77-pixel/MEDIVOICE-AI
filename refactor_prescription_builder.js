const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/doctor/PrescriptionBuilder.jsx', 'utf-8');

  // Strip layout elements
  code = code.replace(/<aside[\s\S]*?<\/aside>/i, '');
  code = code.replace(/<header[\s\S]*?<\/header>/i, '');
  code = code.replace(/<nav[\s\S]*?<\/nav>/i, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  const newCode = `import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const PrescriptionBuilder = () => {
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, name: 'Lisinopril', dose: '10mg', freq: 'QD', duration: '30 Days' }
  ]);

  const [newMeds, setNewMeds] = useState({ name: '', dose: '', freq: '', duration: '' });

  const handleAdd = () => {
    if (!newMeds.name || !newMeds.dose) {
      toast.error('Drug name and dosage required');
      return;
    }
    setPrescriptions([...prescriptions, { ...newMeds, id: Date.now() }]);
    setNewMeds({ name: '', dose: '', freq: '', duration: '' });
    toast.success('Medication added to prescription list');
  };

  const handleRemove = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast.success('Medication removed');
  };

  const handleSmartSuggest = (name, dose) => {
    setPrescriptions([...prescriptions, { name, dose, freq: 'QD', duration: '30 Days', id: Date.now() }]);
    toast.success('AI Suggestion added');
  };

  return (
    <div className="animate-fade-in w-full h-[calc(100vh-100px)] flex gap-gutter overflow-hidden">
      <section className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col">
        <div className="px-gutter py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright/50">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
            <h2 className="font-h3 text-h3">AI-Generated SOAP Note</h2>
          </div>
          <div className="flex gap-xs">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Cardiology</span>
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Verified</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-gutter space-y-md custom-scrollbar">
          
          <div className="group">
            <label className="font-label text-label text-outline block mb-xs group-focus-within:text-primary transition-colors">SUBJECTIVE</label>
            <textarea className="w-full bg-surface-container border border-transparent focus:border-primary focus:ring-0 rounded-lg p-sm font-body-md text-on-surface-variant resize-none h-28 leading-relaxed" spellCheck="false" defaultValue="64-year-old male presents with intermittent palpitations and mild exertional dyspnea over the last 3 weeks. Denies syncope or orthopnea. Patient reports a history of moderate hypertension, currently managed with lifestyle changes. Dietary compliance is self-reported as 'fair'. Sleep quality has been poor due to stress."></textarea>
          </div>

          <div className="group">
            <label className="font-label text-label text-outline block mb-xs group-focus-within:text-primary transition-colors">OBJECTIVE</label>
            <div className="bg-surface-container border border-transparent focus-within:border-primary rounded-lg p-sm space-y-sm">
              <div className="grid grid-cols-4 gap-sm">
                <div className="bg-surface-container-lowest p-xs rounded border border-outline-variant/30 text-center">
                  <p className="text-[10px] text-outline font-bold">BP</p>
                  <p className="font-h3 text-primary">148/92</p>
                </div>
                <div className="bg-surface-container-lowest p-xs rounded border border-outline-variant/30 text-center">
                  <p className="text-[10px] text-outline font-bold">HR</p>
                  <p className="font-h3 text-primary">88 bpm</p>
                </div>
                <div className="bg-surface-container-lowest p-xs rounded border border-outline-variant/30 text-center">
                  <p className="text-[10px] text-outline font-bold">SpO2</p>
                  <p className="font-h3 text-primary">97%</p>
                </div>
                <div className="bg-surface-container-lowest p-xs rounded border border-outline-variant/30 text-center">
                  <p className="text-[10px] text-outline font-bold">BMI</p>
                  <p className="font-h3 text-primary">29.4</p>
                </div>
              </div>
              <textarea className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-md text-on-surface-variant resize-none h-20" spellCheck="false" defaultValue="Physical exam reveals rhythmic heart sounds with a soft S4. No murmurs. Lungs clear to auscultation bilaterally. 1+ pedal edema noted in lower extremities. EKG performed in-office shows sinus rhythm with possible left ventricular hypertrophy."></textarea>
            </div>
          </div>

          <div className="group">
            <label className="font-label text-label text-outline block mb-xs group-focus-within:text-primary transition-colors">ASSESSMENT</label>
            <textarea className="w-full bg-surface-container border border-transparent focus:border-primary focus:ring-0 rounded-lg p-sm font-body-md text-on-surface-variant resize-none h-24" spellCheck="false" defaultValue="1. Stage 2 Essential Hypertension (I10) - suboptimally controlled.\\n2. Palpitations (R00.2) - likely secondary to HTN and stress.\\n3. Mild Hyperlipidemia (E78.5).\\n4. Overweight (E66.3)."></textarea>
          </div>

          <div className="group">
            <label className="font-label text-label text-outline block mb-xs group-focus-within:text-primary transition-colors">PLAN</label>
            <textarea className="w-full bg-surface-container border border-transparent focus:border-primary focus:ring-0 rounded-lg p-sm font-body-md text-on-surface-variant resize-none h-24" spellCheck="false" defaultValue="Initiate ACE inhibitor for BP management. Order 24-hour Holter monitor to investigate palpitations. Referral to clinical nutritionist. Follow-up appointment in 4 weeks with lipid panel results."></textarea>
          </div>
        </div>
      </section>

      <section className="w-[480px] flex flex-col gap-gutter">
        <div className="glassmorphism ai-glow rounded-xl p-gutter border-secondary-container/30 relative overflow-hidden bg-primary/5">
          <div className="absolute top-0 right-0 p-gutter opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-7xl text-secondary">psychology</span>
          </div>
          <div className="flex items-center gap-sm mb-md">
            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            <h3 className="font-label text-label text-secondary uppercase tracking-widest">AI Smart Suggestions</h3>
          </div>
          <div className="flex flex-wrap gap-sm">
            <button onClick={() => handleSmartSuggest('Lisinopril', '10mg')} className="bg-white/80 hover:bg-white border border-secondary-fixed text-on-secondary-fixed-variant px-sm py-2 rounded-full flex items-center gap-xs transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span className="font-body-sm font-bold">Lisinopril 10mg</span>
            </button>
            <button onClick={() => handleSmartSuggest('Atorvastatin', '20mg')} className="bg-white/80 hover:bg-white border border-secondary-fixed text-on-secondary-fixed-variant px-sm py-2 rounded-full flex items-center gap-xs transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span className="font-body-sm font-bold">Atorvastatin 20mg</span>
            </button>
          </div>
          <p className="mt-md text-[11px] text-secondary font-medium leading-tight">Based on Assessment: Stage 2 Hypertension and Mild Hyperlipidemia detected in clinical notes.</p>
        </div>

        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-gutter py-md border-b border-outline-variant flex justify-between items-center bg-white">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">pill</span>
              <h2 className="font-h3 text-h3">Prescription Builder</h2>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-sm py-3 font-label text-[10px] text-outline uppercase tracking-wider">Drug Name</th>
                  <th className="px-sm py-3 font-label text-[10px] text-outline uppercase tracking-wider">Dose</th>
                  <th className="px-sm py-3 font-label text-[10px] text-outline uppercase tracking-wider">Freq.</th>
                  <th className="px-sm py-3 font-label text-[10px] text-outline uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {prescriptions.map(p => (
                  <tr key={p.id} className="hover:bg-background transition-colors group">
                    <td className="px-sm py-4">
                      <p className="font-bold text-on-surface">{p.name}</p>
                      <p className="text-[11px] text-outline">Duration: {p.duration}</p>
                    </td>
                    <td className="px-sm py-4">
                      <div className="px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded text-sm text-center font-bold text-primary w-16">{p.dose}</div>
                    </td>
                    <td className="px-sm py-4">
                      <div className="px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded text-sm w-20 flex justify-between items-center text-on-surface-variant">
                        {p.freq}
                        <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                      </div>
                    </td>
                    <td className="px-sm py-4 text-center">
                      <button onClick={() => handleRemove(p.id)} className="text-outline hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-gutter border-t border-outline-variant bg-surface-container-lowest space-y-sm">
            <div className="grid grid-cols-2 gap-sm">
              <input 
                placeholder="Drug Name" 
                className="bg-surface-container-low border border-transparent focus:border-primary focus:ring-0 rounded-lg p-sm font-body-sm outline-none" 
                value={newMeds.name}
                onChange={e => setNewMeds({...newMeds, name: e.target.value})}
              />
              <input 
                placeholder="Dosage" 
                className="bg-surface-container-low border border-transparent focus:border-primary focus:ring-0 rounded-lg p-sm font-body-sm outline-none" 
                value={newMeds.dose}
                onChange={e => setNewMeds({...newMeds, dose: e.target.value})}
              />
            </div>
            <button onClick={handleAdd} className="w-full py-2 bg-surface-container-high text-on-surface font-bold rounded-lg hover:brightness-95 transition-all text-sm flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Custom Medication
            </button>
          </div>
          
          <div className="p-gutter border-t border-outline-variant bg-surface-container-low">
            <button className="w-full py-md bg-primary text-white font-bold rounded-xl shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined">send</span>
              Sign & Send to Pharmacy
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrescriptionBuilder;
`;

  fs.writeFileSync('client/src/pages/doctor/PrescriptionBuilder.jsx', newCode);
  console.log('Successfully refactored PrescriptionBuilder.jsx');

} catch(e) {
  console.error(e);
}
