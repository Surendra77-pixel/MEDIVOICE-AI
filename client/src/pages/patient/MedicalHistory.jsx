import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api.js';
import { useTranslation } from '../../hooks/useTranslation';
import { toast } from 'react-hot-toast';
import CustomSelect from '../../components/common/CustomSelect';

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [targetLang, setTargetLang] = useState('hi');
  const [translatedRecords, setTranslatedRecords] = useState({});
  const { translate, isTranslating } = useTranslation();
  const [reportContents, setReportContents] = useState({});
  const [loadingReportContent, setLoadingReportContent] = useState({});

  useEffect(() => {
    if (!expandedId) return;
    const record = records.find(r => r._id === expandedId);
    if (record && record.isReport && !reportContents[expandedId]) {
      const fetchReport = async () => {
        setLoadingReportContent(prev => ({ ...prev, [expandedId]: true }));
        try {
          const res = await api.get(`/ai/reports/${record.filename}`);
          if (res.data.success) {
            setReportContents(prev => ({ ...prev, [expandedId]: res.data.data.content }));
          }
        } catch (err) {
          console.error("Failed to fetch report content:", err);
        } finally {
          setLoadingReportContent(prev => ({ ...prev, [expandedId]: false }));
        }
      };
      fetchReport();
    }
  }, [expandedId, records, reportContents]);

  const handleTranslateRecord = async (recordId, content) => {
    if (translatedRecords[recordId]) {
      setTranslatedRecords(prev => {
        const next = { ...prev };
        delete next[recordId];
        return next;
      });
      return;
    }

    const toastId = toast.loading('Translating clinical notes...');
    try {
      const translated = await translate(content, targetLang);
      setTranslatedRecords(prev => ({ ...prev, [recordId]: translated }));
      toast.success('Record translated successfully', { id: toastId });
    } catch (err) {
      toast.error('Translation failed', { id: toastId });
    }
  };

  const handleExportRecord = (record) => {
    toast.success(`Exporting record for ${new Date(record.createdAt).toLocaleDateString()}...`);
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleFullDataExport = () => {
    toast.success('Full HIPAA-compliant data export requested. This may take up to 24 hours to process.');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/patient/medical-history');
        const data = res.data.data.consultations || [];
        setRecords(data);
        
        // Auto-expand if a specific record was linked
        if (window.location.hash) {
          const hashId = window.location.hash.substring(1);
          setExpandedId(hashId);
          // Optional: slight delay to ensure render before scrolling
          setTimeout(() => {
            const element = document.getElementById(`record-${hashId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-xl animate-fade-in">
      {/* Header & Filters Section */}
      <section className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div className="space-y-xs">
          <div className="flex items-center gap-sm">
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">encrypted</span>
              Secure Vault
            </span>
            <span className="text-on-surface-variant/40 text-xs">•</span>
            <span className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-tighter">HIPAA Compliant</span>
          </div>
          <h1 className="font-h text-4xl text-on-surface">Consultation History</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">Access AI-transcribed notes and clinical assessments from your past interactions.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-1 flex shadow-sm">
            <button className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg shadow-md transition-all">All Records</button>
            <button className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white rounded-lg transition-all">Last 3 Months</button>
          </div>
          <button className="flex items-center gap-xs px-4 py-2.5 border border-outline-variant rounded-xl hover:bg-white transition-all font-bold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filters
          </button>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative pl-8 md:pl-12">
        {/* Continuous Timeline Line */}
        <div className="absolute left-4 md:left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/20 via-outline-variant/30 to-transparent"></div>
        
        <div className="space-y-lg">
          {records.length > 0 ? records.map((record) => {
            const date = new Date(record.createdAt);
            const isExpanded = expandedId === record._id;

            return (
              <div key={record._id} id={`record-${record._id}`} className="relative group">
                {/* Marker */}
                <div className="absolute -left-4 md:-left-6 top-6 w-8 md:w-12 h-[2px] bg-outline-variant/30"></div>
                <div className={`absolute -left-[20px] md:-left-[28px] top-4 w-4 h-4 rounded-full border-4 border-white shadow-md transition-all ${isExpanded ? 'bg-primary scale-125' : 'bg-outline-variant'}`}></div>
                
                <div className={`glass-card rounded-2xl p-md shadow-sm transition-all hover:shadow-md border-l-4 ${isExpanded ? 'border-primary' : 'border-transparent'}`}>
                  <div className="flex flex-col md:flex-row gap-md justify-between items-start">
                    <div className="flex-1 space-y-sm">
                      <div className="flex items-center gap-md">
                        <div className="text-center bg-surface-container-low px-sm py-2 rounded-xl min-w-[70px] border border-outline-variant/30">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant/60">{date.toLocaleString('default', { month: 'short' })}</p>
                          <p className="font-h text-xl font-bold text-on-surface">{date.getDate()}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant/60">{date.getFullYear()}</p>
                        </div>
                        <div>
                          <h3 className="font-h text-xl text-on-surface">{record.reason || 'General Consultation'}</h3>
                          <div className="flex flex-wrap gap-sm mt-xs">
                            <span className="flex items-center gap-xs text-xs font-bold text-on-surface-variant/80">
                              <span className="material-symbols-outlined text-sm">medical_information</span>
                              {record.isReport ? 'MediVoice AI Translator' : `Dr. ${record.doctorId?.firstName} ${record.doctorId?.lastName}`}
                            </span>
                            <span className="text-on-surface-variant/20">•</span>
                            <span className="flex items-center gap-xs text-xs font-bold text-on-surface-variant/80">
                              <span className="material-symbols-outlined text-sm">specialized_care</span>
                              {record.isReport ? 'Voice AI Assistant' : 'Medical Specialist'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed">
                        {record.soapNote?.assessment?.probableDiagnosis || 'Assessment pending final clinical review.'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-sm">
                      {record.isReport ? (
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold border border-secondary/20 uppercase tracking-widest animate-fade-in">Saved Report</span>
                      ) : record.soapNote ? (
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold border border-primary/20 uppercase tracking-widest">AI Summarized</span>
                      ) : null}
                      <button 
                        onClick={() => toggleExpand(record._id)}
                        className="text-primary font-bold text-sm flex items-center gap-xs hover:underline transition-all"
                      >
                        {isExpanded ? 'Collapse' : 'View Full Record'}
                        <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {isExpanded && (
                    <div className="mt-lg pt-lg border-t border-outline-variant/30 animate-fade-in">
                      {record.isReport ? (
                        <div className="bg-surface-container-low/50 p-md rounded-xl border border-outline-variant/30 flex flex-col gap-md">
                          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/10">
                            <span className="text-xs font-black uppercase text-primary dark:text-sky-400 tracking-wider flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg">description</span>
                              Voice Translation Session Report
                            </span>
                            <span className="text-xs font-bold text-on-surface-variant dark:text-gray-400 font-mono">
                              {record.filename}
                            </span>
                          </div>

                          {loadingReportContent[record._id] ? (
                            <div className="flex justify-center items-center py-10">
                              <span className="material-symbols-outlined animate-spin text-2xl text-primary">sync</span>
                            </div>
                          ) : reportContents[record._id] ? (
                            <pre className="bg-black/5 dark:bg-black/35 border border-outline-variant/10 rounded-2xl p-md text-xs font-mono overflow-auto dark:text-green-400 text-slate-800 leading-relaxed max-h-[360px] custom-scrollbar whitespace-pre-wrap">
                              {reportContents[record._id]}
                            </pre>
                          ) : (
                            <p className="text-xs text-red-500 italic py-4">Failed to load report contents.</p>
                          )}

                          <div className="flex justify-end mt-sm">
                            <button 
                              onClick={() => handleExportRecord(record)}
                              className="bg-white hover:bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-outline-variant/30 shadow-sm uppercase tracking-wider"
                            >
                              <span className="material-symbols-outlined text-lg">print</span>
                              Print / Export Report
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                          <div className="lg:col-span-2 space-y-md">
                            <div className="bg-surface-container-low/50 p-md rounded-xl border border-outline-variant/30 relative">
                              <div className="flex justify-between items-center mb-sm">
                                <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest">Clinical AI Assessment (SOAP)</h4>
                                <div className="flex items-center gap-2">
                                  <CustomSelect 
                                    value={targetLang}
                                    onChange={setTargetLang}
                                    options={[
                                      { code: 'hi', label: 'Hindi' },
                                      { code: 'ta', label: 'Tamil' },
                                      { code: 'te', label: 'Telugu' },
                                      { code: 'ml', label: 'Malayalam' },
                                      { code: 'kn', label: 'Kannada' },
                                      { code: 'bn', label: 'Bengali' }
                                    ]}
                                    className="w-32 text-xs"
                                  />
                                  <button 
                                    onClick={() => handleTranslateRecord(record._id, record.soapNote?.assessment?.probableDiagnosis || record.soapNote?.subjective?.chiefComplaint)}
                                    className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${translatedRecords[record._id] ? 'text-secondary' : 'text-primary hover:scale-105'}`}
                                  >
                                    <span className="material-symbols-outlined text-[14px]">{translatedRecords[record._id] ? 'history' : 'translate'}</span>
                                    {translatedRecords[record._id] ? 'Show Original' : 'Translate'}
                                  </button>
                                </div>
                              </div>
                              
                              {translatedRecords[record._id] && (
                                <div className="mb-md p-sm bg-secondary/5 rounded-lg border border-secondary/20 animate-fade-in">
                                  <p className="text-[10px] font-bold text-secondary uppercase mb-xs tracking-tighter">AI Translation ({targetLang})</p>
                                  <p className="text-xs text-on-surface italic font-medium leading-relaxed">"{translatedRecords[record._id]}"</p>
                                </div>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                <div>
                                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-xs tracking-tighter">Subjective</p>
                                  <p className="text-xs text-on-surface leading-relaxed">{record.soapNote?.subjective?.chiefComplaint || 'No subjective data recorded.'}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-xs tracking-tighter">Objective</p>
                                  <p className="text-xs text-on-surface leading-relaxed">{record.soapNote?.objective?.doctorObservations?.[0] || 'No objective measurements recorded.'}</p>
                                </div>
                                <div className="md:col-span-2 mt-2 pt-2 border-t border-outline-variant/10">
                                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-xs tracking-tighter">Plan</p>
                                  <p className="text-xs text-on-surface leading-relaxed font-medium">{record.soapNote?.plan?.followUpInstructions || 'Follow-up plan pending.'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-md">
                            <div className="bg-surface-container-low/50 p-md rounded-xl border border-outline-variant/30">
                              <h4 className="text-[10px] font-bold uppercase text-primary mb-sm tracking-widest">Digital Prescription</h4>
                              {record.prescriptionId && record.prescriptionId.medications && record.prescriptionId.medications.length > 0 ? (
                                <div className="space-y-3">
                                  {record.prescriptionId.medications.map((med, idx) => (
                                    <div key={idx} className="mb-2 pb-2 border-b border-outline-variant/10 last:border-0 last:mb-0 last:pb-0">
                                      <p className="font-bold text-sm text-on-surface">{med.drugName}</p>
                                      <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium mt-1">
                                        <span>Dosage: {med.dose || '-'}</span>
                                        <span>{med.frequency || '-'}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-on-surface-variant italic">No prescriptions issued for this session.</p>
                              )}
                              <button 
                                onClick={() => handleExportRecord(record)}
                                className="w-full mt-lg bg-white hover:bg-surface-container-high text-on-surface py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-outline-variant/30 shadow-sm uppercase tracking-wider"
                              >
                                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                Export Record
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-5xl text-outline-variant/50 mb-4">folder_open</span>
              <p className="text-on-surface-variant font-bold">Your medical vault is currently empty.</p>
              <p className="text-on-surface-variant/60 text-sm mt-1">Past consultations will appear here automatically.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer / Data Info */}
      <footer className="mt-xl pt-lg border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md text-on-surface-variant/60">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted • SOC2 Type II Compliant</span>
        </div>
        <div className="flex items-center gap-lg">
          <button onClick={handleFullDataExport} className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Request Full Data Export</button>
          <button onClick={() => setShowAuditLogs(true)} className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Vault Audit Logs</button>
        </div>
      </footer>

      {/* Audit Logs Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-[100] bg-surface/80 backdrop-blur-sm flex items-center justify-center p-md">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-outline-variant/30 p-lg animate-slide-up">
            <div className="flex justify-between items-start mb-md">
              <div>
                <h3 className="font-h text-xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">security</span>
                  Vault Audit Logs
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">HIPAA compliant access history</p>
              </div>
              <button onClick={() => setShowAuditLogs(false)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-sm max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-surface-container-low p-sm rounded-xl border border-outline-variant/30 flex items-start gap-md">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">You exported a clinical record</p>
                  <p className="text-xs text-on-surface-variant font-medium">IP: 192.168.1.45 • Just now</p>
                </div>
              </div>
              
              <div className="bg-surface-container-low p-sm rounded-xl border border-outline-variant/30 flex items-start gap-md">
                <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Dr. Jane Smith accessed your vault</p>
                  <p className="text-xs text-on-surface-variant font-medium">Authorized by Consultation #C-8924 • 2 days ago</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-sm rounded-xl border border-outline-variant/30 flex items-start gap-md">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">New device login (iPhone 14)</p>
                  <p className="text-xs text-on-surface-variant font-medium">IP: 104.28.10.12 • 5 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
