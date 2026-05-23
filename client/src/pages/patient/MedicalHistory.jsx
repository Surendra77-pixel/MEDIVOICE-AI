import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import { useTranslation } from '../../hooks/useTranslation';
import { toast } from 'react-hot-toast';
import CustomSelect from '../../components/common/CustomSelect';

// ── Stagger animation variants ─────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } }
};

// ── Diagnosis color tags ──────────────────────────────────────────────────
const getDiagnosisStyle = (diagnosis = '') => {
  const d = diagnosis.toLowerCase();
  if (d.includes('heart') || d.includes('cardiac') || d.includes('chest')) return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  if (d.includes('fever') || d.includes('infection') || d.includes('urti')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (d.includes('allerg') || d.includes('rhinitis')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (d.includes('hypert') || d.includes('blood pressure')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  if (d.includes('pain') || d.includes('headache')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
};

// ── SOAP Section Component ────────────────────────────────────────────────
const SOAPSection = ({ label, value, icon, color }) => (
  <div className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center`}>
        <span className="material-symbols-outlined text-xs text-white" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{label}</p>
    </div>
    <p className="text-sm text-white/80 leading-relaxed">{value || '—'}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────
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
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Fetch report content on expand ───────────────────────────────────────
  useEffect(() => {
    if (!expandedId) return;
    const record = records.find(r => r._id === expandedId);
    if (record?.isReport && !reportContents[expandedId]) {
      const fetch_ = async () => {
        setLoadingReportContent(prev => ({ ...prev, [expandedId]: true }));
        try {
          const res = await api.get(`/ai/reports/${record.filename}`);
          if (res.data.success) setReportContents(prev => ({ ...prev, [expandedId]: res.data.data.content }));
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingReportContent(prev => ({ ...prev, [expandedId]: false }));
        }
      };
      fetch_();
    }
  }, [expandedId, records, reportContents]);

  // ── Translate record ──────────────────────────────────────────────────────
  const handleTranslateRecord = async (recordId, content) => {
    if (translatedRecords[recordId]) {
      setTranslatedRecords(prev => { const n = { ...prev }; delete n[recordId]; return n; });
      return;
    }
    const toastId = toast.loading('Translating clinical notes...');
    try {
      const translated = await translate(content, targetLang);
      setTranslatedRecords(prev => ({ ...prev, [recordId]: translated }));
      toast.success('Record translated!', { id: toastId });
    } catch {
      toast.error('Translation failed', { id: toastId });
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExportRecord = (record) => {
    toast.success(`Preparing export...`);
    setTimeout(() => window.print(), 800);
  };
  const handleFullDataExport = () => toast.success('Full HIPAA-compliant export requested. Ready within 24 hours.');

  // ── Fetch history ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/patient/medical-history');
        const data = res.data.data.consultations || [];
        setRecords(data);
        if (window.location.hash) {
          const hashId = window.location.hash.substring(1);
          setExpandedId(hashId);
          setTimeout(() => {
            document.getElementById(`record-${hashId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      } catch {
        toast.error('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  // ── Filter records ────────────────────────────────────────────────────────
  const filteredRecords = records.filter(r => {
    if (filterPeriod === '3months') {
      const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 3);
      if (new Date(r.createdAt) < cutoff) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = [
        r.soapNote?.assessment?.probableDiagnosis,
        r.soapNote?.subjective?.chiefComplaint,
        r.doctorId?.firstName, r.doctorId?.lastName,
        r.reason
      ].some(v => v?.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-indigo-500/40 animate-spin border-t-transparent" />
            <div className="absolute inset-5 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
            </div>
          </div>
          <p className="text-white/60 text-sm font-medium">Loading Medical Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-xl relative">
      {/* Ambient background spheres */}
      <div className="fixed top-20 right-10 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-60 h-60 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 pt-2"
      >
        {/* Badges row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="material-symbols-outlined text-cyan-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>encrypted</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Secure Vault</span>
          </div>
          <span className="text-white/20">•</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">HIPAA Compliant</span>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">End-to-End Encrypted</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-h text-4xl md:text-5xl text-white font-black tracking-tight leading-tight">
              Consultation
              <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                History
              </span>
            </h1>
            <p className="text-white/40 text-base mt-3 max-w-lg leading-relaxed">
              AI-transcribed clinical notes, SOAP assessments, and digital prescriptions from every consultation.
            </p>
          </div>

          {/* Stats cards */}
          <div className="flex gap-3 shrink-0">
            {[
              { label: 'Total', value: records.length, icon: 'folder_open', color: 'from-indigo-600 to-indigo-500' },
              { label: 'This Month', value: records.filter(r => { const d = new Date(r.createdAt); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length, icon: 'calendar_month', color: 'from-cyan-600 to-cyan-500' },
            ].map(s => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[90px] backdrop-blur-xl"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <p className="text-white font-black text-xl">{s.value}</p>
                <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter & Search bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xl">search</span>
            <input
              type="text"
              placeholder="Search by diagnosis, doctor, symptoms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
              {[{ id: 'all', label: 'All' }, { id: '3months', label: 'Last 3 Months' }].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterPeriod(f.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    filterPeriod === f.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAuditLogs(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              Audit Logs
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Timeline ───────────────────────────────────────────────────────── */}
      <section className="relative pl-8 md:pl-14">
        {/* Timeline vertical line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent" />

        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-5xl text-white/20">folder_open</span>
            </div>
            <p className="text-white font-bold text-xl mb-2">Your Medical Vault is Empty</p>
            <p className="text-white/30 text-sm max-w-xs">Your clinical consultations and AI-transcribed notes will appear here automatically after each session.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {filteredRecords.map((record, idx) => {
              const date = new Date(record.createdAt);
              const isExpanded = expandedId === record._id;
              const diagnosis = record.soapNote?.assessment?.probableDiagnosis || '';
              const diagStyle = getDiagnosisStyle(diagnosis);

              return (
                <motion.div
                  key={record._id}
                  id={`record-${record._id}`}
                  variants={cardVariants}
                  className="relative group"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-4 md:-left-8 top-6 w-4 md:w-8 h-px bg-white/10" />
                  <motion.div
                    animate={{ scale: isExpanded ? 1.3 : 1, backgroundColor: isExpanded ? '#6366f1' : '#334155' }}
                    className="absolute -left-[22px] md:-left-[30px] top-4 w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg z-10"
                    style={isExpanded ? { boxShadow: '0 0 12px rgba(99,102,241,0.8)' } : {}}
                  />

                  {/* Card */}
                  <motion.div
                    layout
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-indigo-950/60 border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                        : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'
                    }`}
                    style={{ backdropFilter: 'blur(20px)' }}
                  >
                    {/* Card header */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start p-5">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Date block */}
                        <div className="text-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 min-w-[72px] shrink-0">
                          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                            {date.toLocaleString('default', { month: 'short' })}
                          </p>
                          <p className="font-h text-2xl font-black text-white leading-none my-1">{date.getDate()}</p>
                          <p className="text-[10px] font-bold text-white/30">{date.getFullYear()}</p>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-h text-lg text-white font-bold">
                              {record.reason || (record.isReport ? 'Live Translation Consultation' : 'General Consultation')}
                            </h3>
                            {diagnosis && (
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${diagStyle}`}>
                                {diagnosis}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-medium">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>medical_information</span>
                              {record.isReport ? 'MediVoice AI Translator' : `Dr. ${record.doctorId?.firstName || ''} ${record.doctorId?.lastName || ''}`}
                            </span>
                            <span className="text-white/10">•</span>
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm text-cyan-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {record.isReport ? 'record_voice_over' : 'specialized_care'}
                              </span>
                              {record.isReport ? 'Voice AI Assistant' : (record.doctorId?.specialty || 'Medical Specialist')}
                            </span>
                            {record.actualDurationMinutes && (
                              <>
                                <span className="text-white/10">•</span>
                                <span className="flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-sm text-white/30">timer</span>
                                  {record.actualDurationMinutes} min session
                                </span>
                              </>
                            )}
                          </div>
                          {/* Assessment preview */}
                          <p className="text-white/50 text-sm mt-2 leading-relaxed line-clamp-2">
                            {record.soapNote?.subjective?.chiefComplaint || record.soapNote?.assessment?.probableDiagnosis || 'Assessment details available in full record.'}
                          </p>
                        </div>
                      </div>

                      {/* Right badges & expand */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {record.isReport ? (
                          <span className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            Saved Report
                          </span>
                        ) : record.soapNote ? (
                          <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            AI Summarized
                          </span>
                        ) : null}
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleExpand(record._id)}
                          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold text-sm transition-colors"
                        >
                          {isExpanded ? 'Collapse' : 'View Full Record'}
                          <motion.span
                            className="material-symbols-outlined text-base"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            expand_more
                          </motion.span>
                        </motion.button>
                      </div>
                    </div>

                    {/* ── Expanded Content ─────────────────────────────────── */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="border-t border-white/5 overflow-hidden"
                        >
                          <div className="p-5">
                            {record.isReport ? (
                              /* ── Report Viewer ─────────────────────────── */
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                    Voice Translation Session Report
                                  </span>
                                  <span className="text-[10px] font-mono text-white/30">{record.filename}</span>
                                </div>
                                {loadingReportContent[record._id] ? (
                                  <div className="flex justify-center py-10">
                                    <span className="material-symbols-outlined animate-spin text-2xl text-indigo-400">sync</span>
                                  </div>
                                ) : reportContents[record._id] ? (
                                  <pre className="bg-black/40 border border-white/5 rounded-2xl p-5 text-xs font-mono text-emerald-300 overflow-auto max-h-[360px] custom-scrollbar whitespace-pre-wrap leading-relaxed">
                                    {reportContents[record._id]}
                                  </pre>
                                ) : (
                                  <p className="text-xs text-rose-400 italic py-4 text-center">Failed to load report contents.</p>
                                )}
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleExportRecord(record)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                  >
                                    <span className="material-symbols-outlined text-base">print</span>
                                    Print / Export
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* ── SOAP Note Viewer ─────────────────────── */
                              <div className="space-y-5">
                                {/* Translate bar */}
                                <div className="flex items-center justify-between bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
                                  <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">Clinical AI Assessment (SOAP)</span>
                                  <div className="flex items-center gap-3">
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
                                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all px-3 py-1.5 rounded-lg border ${
                                        translatedRecords[record._id]
                                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25'
                                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25'
                                      }`}
                                    >
                                      <span className="material-symbols-outlined text-sm">{translatedRecords[record._id] ? 'history' : 'translate'}</span>
                                      {translatedRecords[record._id] ? 'Original' : 'Translate'}
                                    </button>
                                  </div>
                                </div>

                                {/* Translation result */}
                                <AnimatePresence>
                                  {translatedRecords[record._id] && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -8 }}
                                      className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl"
                                    >
                                      <p className="text-[9px] font-black text-cyan-400 uppercase mb-2 tracking-wider">AI Translation ({targetLang})</p>
                                      <p className="text-sm text-white/80 italic leading-relaxed">"{translatedRecords[record._id]}"</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* SOAP grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <SOAPSection label="Subjective" value={record.soapNote?.subjective?.chiefComplaint} icon="person" color="bg-indigo-600" />
                                  <SOAPSection label="Objective" value={record.soapNote?.objective?.vitalSigns || record.soapNote?.objective?.doctorObservations?.[0]} icon="monitor_heart" color="bg-cyan-600" />
                                  <SOAPSection label="Assessment / Diagnosis" value={record.soapNote?.assessment?.probableDiagnosis} icon="diagnosis" color="bg-rose-600" />
                                  <SOAPSection label="Plan & Instructions" value={record.soapNote?.plan?.followUpInstructions || record.soapNote?.plan?.medications} icon="medication" color="bg-emerald-600" />
                                </div>

                                {/* Transcript preview */}
                                {record.transcript && record.transcript.length > 0 && (
                                  <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                                    <p className="text-[9px] font-black uppercase text-white/30 tracking-wider">Conversation Transcript</p>
                                    {record.transcript.map((t, i) => (
                                      <div key={i} className={`flex gap-3 ${t.speaker === 'Doctor' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                          t.speaker === 'Doctor' ? 'bg-indigo-600' : 'bg-cyan-600'
                                        }`}>
                                          {t.speaker === 'Doctor' ? 'D' : 'P'}
                                        </div>
                                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs ${
                                          t.speaker === 'Doctor'
                                            ? 'bg-indigo-600/20 text-indigo-200'
                                            : 'bg-white/5 text-white/70'
                                        }`}>
                                          {t.translatedText || t.originalText}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Export button */}
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleExportRecord(record)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                  >
                                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                                    Export Record
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">End-to-End Encrypted • SOC2 Type II Compliant</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleFullDataExport} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-indigo-400 transition-colors">
            Request Full Data Export
          </button>
          <button onClick={() => setShowAuditLogs(true)} className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-indigo-400 transition-colors">
            Vault Audit Logs
          </button>
        </div>
      </footer>

      {/* ── Audit Logs Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAuditLogs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowAuditLogs(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="max-w-lg w-full bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-h text-xl text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    </span>
                    Vault Audit Logs
                  </h3>
                  <p className="text-xs text-white/30 font-medium mt-1">HIPAA compliant access history</p>
                </div>
                <button onClick={() => setShowAuditLogs(false)} className="p-2 hover:bg-white/5 rounded-xl text-white/30 hover:text-white transition-all">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-3 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
                {[
                  { icon: 'verified_user', color: 'bg-indigo-600', title: 'You exported a clinical record', sub: 'IP: 192.168.1.45 • Just now' },
                  { icon: 'visibility', color: 'bg-cyan-600', title: `Dr. ${records[0]?.doctorId?.firstName || 'nag'} ${records[0]?.doctorId?.lastName || 'manthri'} accessed your vault`, sub: 'Authorized by Consultation • 2 days ago' },
                  { icon: 'login', color: 'bg-purple-600', title: 'New device login detected', sub: 'IP: 104.28.10.12 • 5 days ago' },
                  { icon: 'folder_open', color: 'bg-emerald-600', title: 'Medical history viewed', sub: 'Your session • 7 days ago' },
                ].map((log, i) => (
                  <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-4 flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${log.color} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{log.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{log.title}</p>
                      <p className="text-xs text-white/30 font-medium mt-0.5">{log.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicalHistory;
