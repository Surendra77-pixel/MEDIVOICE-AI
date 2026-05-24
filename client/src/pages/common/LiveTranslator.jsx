import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateText } from '../../services/translateService';
import { toast } from 'react-hot-toast';
import CustomSelect from '../../components/common/CustomSelect';

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'bn-IN', label: 'Bengali' }
];

const getLangLabel = (code) => SUPPORTED_LANGUAGES.find(l => l.code === code)?.label || code;

// ── Animated Sound Wave ──────────────────────────────────────────────────────
const SoundWave = ({ active, color = 'indigo' }) => (
  <div className="flex items-center gap-[3px] h-8">
    {[1,2,3,4,5,4,3].map((h, i) => (
      <motion.div
        key={i}
        className={`w-[3px] rounded-full ${active ? `bg-${color}-400` : 'bg-white/10'}`}
        animate={active ? {
          height: [8, h * 8, 8],
          opacity: [0.4, 1, 0.4]
        } : { height: 8, opacity: 0.3 }}
        transition={active ? {
          duration: 0.6 + i * 0.08,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {}}
        style={{ height: 8 }}
      />
    ))}
  </div>
);

// ── Mic Orb Button ───────────────────────────────────────────────────────────
const MicOrb = ({ active, onClick, colorClass, glowColor }) => (
  <div className="relative">
    {/* Outer pulse rings */}
    {active && (
      <>
        <motion.div
          className={`absolute inset-0 rounded-full ${colorClass}`}
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className={`absolute inset-0 rounded-full ${colorClass}`}
          animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
      </>
    )}
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
        active
          ? `${colorClass} shadow-[0_0_40px_${glowColor}]`
          : 'bg-white/5 border-2 border-white/10 hover:border-white/30 hover:bg-white/10'
      }`}
    >
      <span
        className={`material-symbols-outlined text-3xl ${active ? 'text-white' : 'text-white/60'}`}
        style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
      >
        {active ? 'mic' : 'mic_none'}
      </span>
    </motion.button>
  </div>
);


const LiveTranslator = () => {
  const [lang1, setLang1] = useState('en-US');
  const [lang2, setLang2] = useState('ta-IN');
  const [activeMic, setActiveMic] = useState(null);
  const [isTTSActive, setIsTTSActive] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [interimText, setInterimText] = useState("");

  const [patientInfo, setPatientInfo] = useState({ name: '', age: '', gender: 'Male', notes: '' });
  const [isSavingReport, setIsSavingReport] = useState(false);

  // Report viewer state
  const [showReportsList, setShowReportsList] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [activeReportName, setActiveReportName] = useState(null);
  const [activeReportContent, setActiveReportContent] = useState(null);

  const [useNeuralFallback, setUseNeuralFallback] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // ── Auto scroll transcript ──────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [transcript]);

  // ── Cleanup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── Pre-load TTS voices ─────────────────────────────────────────────────
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ── Save Report ─────────────────────────────────────────────────────────
  const handleSaveReport = async () => {
    if (transcript.length === 0) return toast.error("Cannot save empty transcript.");
    if (!patientInfo.name.trim()) return toast.error("Please enter patient name first.");
    setIsSavingReport(true);
    try {
      const payload = {
        guestPatientName: patientInfo.name,
        guestAge: patientInfo.age,
        guestGender: patientInfo.gender,
        transcript: transcript.map(t => ({
          speaker: t.speaker === 'person1' ? 'Patient' : 'Doctor',
          originalText: t.original,
          translatedText: t.translated,
          originalLang: t.sourceLang,
          targetLang: t.targetLang
        })),
        soapNote: {
          subjective: { chiefComplaint: patientInfo.notes }
        }
      };

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/v1/doctor/consultation/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming we need token, or wait, it uses interceptors or cookies?
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) toast.success(`Saved to Clinical Notes!`);
      else toast.error("Failed: " + (data.message || "Unknown error"));
    } catch (err) { toast.error("Network error: " + err.message); }
    finally { setIsSavingReport(false); }
  };

  // ── Fetch Reports ───────────────────────────────────────────────────────
  const fetchReportsList = async () => {
    setIsLoadingReports(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/v1/ai/reports`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) setReports(data.data);
      else toast.error("Failed: " + (data.message || "Unknown"));
    } catch (err) { toast.error("Failed: " + err.message); }
    finally { setIsLoadingReports(false); }
  };

  const fetchReportContent = async (filename) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/v1/ai/reports/${filename}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) { setActiveReportName(filename); setActiveReportContent(data.data.content); }
      else toast.error("Failed: " + (data.message || "Unknown"));
    } catch (err) { toast.error("Failed: " + err.message); }
  };

  // ── Translation + TTS ──────────────────────────────────────────────────
  const handleTranslateFinal = async (text, speaker) => {
    const sourceLang = speaker === 'person1' ? lang1 : lang2;
    const targetLang = speaker === 'person1' ? lang2 : lang1;
    const newMsgId = Date.now();
    setTranscript(prev => [...prev, { id: newMsgId, original: text, translated: 'Translating...', sourceLang, targetLang, speaker }]);
    try {
      let translatedText = await translateText(text, sourceLang, targetLang);
      setTranscript(prev => prev.map(msg => msg.id === newMsgId ? { ...msg, translated: translatedText } : msg));
      if (isTTSActive && translatedText) {
        try {
          const ttsLang = targetLang.split('-')[0];
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const ttsRes = await fetch(`${baseUrl}/api/v1/ai/tts?text=${encodeURIComponent(translatedText)}&lang=${ttsLang}`, { credentials: 'include' });
          if (!ttsRes.ok) throw new Error("TTS proxy failed");
          const audioBlob = await ttsRes.blob();
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.onerror = () => { const u = new SpeechSynthesisUtterance(translatedText); u.lang = targetLang; window.speechSynthesis.speak(u); };
          audio.play().catch(() => { const u = new SpeechSynthesisUtterance(translatedText); u.lang = targetLang; window.speechSynthesis.speak(u); });
        } catch { try { const u = new SpeechSynthesisUtterance(translatedText); u.lang = targetLang; window.speechSynthesis.speak(u); } catch {} }
      }
    } catch { setTranscript(prev => prev.map(msg => msg.id === newMsgId ? { ...msg, translated: "Translation failed" } : msg)); }
  };

  // ── Neural fallback recording ───────────────────────────────────────────
  const startNeuralRecording = async (person) => {
    try {
      if (isTTSActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      if (!navigator.mediaDevices?.getUserMedia) { alert("Audio recording blocked."); return; }
      setErrorMsg("Click 'Allow' for mic permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const langCode = person === 'person1' ? lang1.split('-')[0] : lang2.split('-')[0];
        try {
          setErrorMsg("Processing...");
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/v1/ai/transcribe?lang=${langCode}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/octet-stream' }, body: audioBlob });
          const data = await res.json();
          if (data.success && data.data.text) { handleTranslateFinal(data.data.text.trim(), person); setErrorMsg(null); }
          else setErrorMsg("Neural STT Failed: " + (data.message || 'Unknown'));
        } catch (err) { setErrorMsg("Server unreachable: " + err.message); }
        finally { setActiveMic(null); stream.getTracks().forEach(t => t.stop()); }
      };
      mediaRecorder.start();
      setActiveMic(person);
      setErrorMsg(null);
    } catch (err) { alert("Mic Error: " + err.message); setErrorMsg("Mic denied: " + err.message); setActiveMic(null); }
  };

  const stopNeuralRecording = () => { if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop(); };

  // ── Browser STT ─────────────────────────────────────────────────────────
  const startListening = async (person) => {
    if (activeMic === person) {
      if (useNeuralFallback) stopNeuralRecording();
      else if (recognitionRef.current) { recognitionRef.current.stop(); setActiveMic(null); }
      return;
    }
    if (useNeuralFallback) { startNeuralRecording(person); return; }
    setErrorMsg(null);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setErrorMsg("Speech Recognition not supported. Use Chrome."); return; }
    if (recognitionRef.current) recognitionRef.current.stop();
    setActiveMic(person); setInterimText("");
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = true; recognition.interimResults = true;
    recognition.lang = person === 'person1' ? lang1 : lang2;
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) { const t = event.results[i][0].transcript.trim(); if (t) handleTranslateFinal(t, person); }
        else interim += event.results[i][0].transcript;
      }
      setInterimText(interim);
    };
    recognition.onerror = (event) => {
      if (event.error === 'no-speech') setErrorMsg("No sound detected! Speak louder.");
      else if (event.error === 'not-allowed') setErrorMsg("Mic access blocked.");
      else if (event.error === 'network') { setErrorMsg("Network error → Neural Override active."); setUseNeuralFallback(true); setActiveMic(null); }
      else { setErrorMsg(`Error: ${event.error}`); setActiveMic(null); }
      if (activeMic === person && event.error !== 'network') try { recognition.start(); } catch {}
    };
    try { recognition.start(); } catch { setErrorMsg("Could not start mic."); setActiveMic(null); }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full flex flex-col gap-5 relative">
      {/* Ambient */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-60 h-60 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="font-h text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>g_translate</span>
            </div>
            Live Translator
          </h1>
          <p className="text-white/40 mt-1 text-sm">Real-time multilingual medical translation — Neural Engine powered</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowReportsList(true); fetchReportsList(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
            Saved Reports
          </button>
          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
            <span className="material-symbols-outlined text-white/40 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>volume_up</span>
            <span className="font-bold text-xs text-white/40">Audio</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isTTSActive} onChange={() => setIsTTSActive(!isTTSActive)} />
              <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
            </label>
          </div>
        </div>
      </motion.div>

      {/* ── Patient Demographics ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl p-5"
      >
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>patient_list</span>
          Patient Consultation Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { key: 'name', label: 'Patient Name', placeholder: 'e.g. Surendra', type: 'text' },
            { key: 'age', label: 'Age', placeholder: 'e.g. 28', type: 'number' },
          ].map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{f.label}</label>
              <input
                type={f.type}
                value={patientInfo[f.key]}
                onChange={e => setPatientInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Gender</label>
            <CustomSelect
              value={patientInfo.gender}
              onChange={val => setPatientInfo(prev => ({ ...prev, gender: val }))}
              options={[
                { code: 'Male', label: 'Male' },
                { code: 'Female', label: 'Female' },
                { code: 'Other', label: 'Other' }
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Symptoms / Notes</label>
            <input
              type="text"
              value={patientInfo.notes}
              onChange={e => setPatientInfo(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Cold and fever"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Voice Control Panel ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Speaker 1: Patient */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Patient (Speaker 1)</span>
            </div>
            <CustomSelect value={lang1} onChange={setLang1} options={SUPPORTED_LANGUAGES} className="max-w-[180px]" />
            <MicOrb
              active={activeMic === 'person1'}
              onClick={() => startListening('person1')}
              colorClass="bg-indigo-600"
              glowColor="rgba(99,102,241,0.5)"
            />
            <SoundWave active={activeMic === 'person1'} color="indigo" />
            {activeMic === 'person1' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest"
              >
                ● LISTENING...
              </motion.p>
            )}
          </div>

          {/* Center Swap */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => { setLang1(lang2); setLang2(lang1); }}
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">swap_horiz</span>
            </motion.button>
            <div className="flex items-center gap-2 text-[9px] text-white/20 font-bold uppercase tracking-widest">
              <span>{getLangLabel(lang1)}</span>
              <span>⇄</span>
              <span>{getLangLabel(lang2)}</span>
            </div>
          </div>

          {/* Speaker 2: Doctor */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Doctor (Speaker 2)</span>
            </div>
            <CustomSelect value={lang2} onChange={setLang2} options={SUPPORTED_LANGUAGES} className="max-w-[180px]" />
            <MicOrb
              active={activeMic === 'person2'}
              onClick={() => startListening('person2')}
              colorClass="bg-cyan-600"
              glowColor="rgba(34,211,238,0.5)"
            />
            <SoundWave active={activeMic === 'person2'} color="cyan" />
            {activeMic === 'person2' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest"
              >
                ● LISTENING...
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Error / Neural Fallback Panel ───────────────────────────────── */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 overflow-hidden"
          >
            <p className="text-sm text-rose-300 font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">warning</span>
              {useNeuralFallback ? "Neural STT Override Active! Tap mic to record, or type below:" : "Mic offline — type instead:"}
            </p>
            <p className="text-xs text-rose-400/70 mb-3 ml-6 italic">{errorMsg}</p>
            <div className="flex gap-2">
              <input
                type="text"
                id="fallback-input"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Type your message..."
                onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { handleTranslateFinal(e.target.value.trim(), 'person1'); e.target.value = ''; } }}
              />
              <button
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                onClick={() => { if (isTTSActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); const i = document.getElementById('fallback-input'); if (i?.value.trim()) { handleTranslateFinal(i.value.trim(), 'person1'); i.value = ''; } }}
              >
                P1
              </button>
              <button
                className="px-4 py-2.5 bg-cyan-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                onClick={() => { if (isTTSActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); const i = document.getElementById('fallback-input'); if (i?.value.trim()) { handleTranslateFinal(i.value.trim(), 'person2'); i.value = ''; } }}
              >
                P2
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Transcript Panel ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex-1 bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl flex flex-col min-h-[350px] overflow-hidden"
      >
        {/* Transcript header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Conversation Transcript</h2>
            {transcript.length > 0 && (
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-white/30">
                {transcript.length} msg{transcript.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveReport}
            disabled={isSavingReport || transcript.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              transcript.length === 0
                ? 'bg-white/3 text-white/15 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:brightness-110'
            }`}
          >
            {isSavingReport ? (
              <><span className="material-symbols-outlined text-sm animate-spin">sync</span>Saving...</>
            ) : (
              <><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>Save Report</>
            )}
          </motion.button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4">
          {transcript.length === 0 && !activeMic && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-10">
              <div className="w-20 h-20 rounded-3xl bg-white/3 border border-white/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-white/15">forum</span>
              </div>
              <p className="text-white/30 font-bold text-sm">No messages yet</p>
              <p className="text-white/15 text-xs max-w-xs">Tap a microphone button above to start a voice translation session</p>
            </div>
          )}

          <AnimatePresence>
            {transcript.map(msg => {
              const isP1 = msg.speaker === 'person1';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: isP1 ? -30 : 30, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`max-w-[85%] ${isP1 ? 'mr-auto' : 'ml-auto'}`}
                >
                  <div className={`rounded-2xl p-4 border backdrop-blur-md ${
                    isP1
                      ? 'bg-indigo-600/10 border-indigo-500/20'
                      : 'bg-cyan-600/10 border-cyan-500/20'
                  }`}>
                    {/* Speaker label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black text-white ${isP1 ? 'bg-indigo-600' : 'bg-cyan-600'}`}>
                        {isP1 ? 'P' : 'D'}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isP1 ? 'text-indigo-400/70' : 'text-cyan-400/70'}`}>
                        {isP1 ? 'Patient' : 'Doctor'} • {getLangLabel(msg.sourceLang)}
                      </span>
                    </div>
                    {/* Original text */}
                    <p className="text-white font-medium text-base leading-relaxed">{msg.original}</p>
                    {/* Translation */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">translate</span>
                        {getLangLabel(msg.targetLang)}
                      </span>
                      <p className={`font-bold mt-1 ${
                        msg.translated === 'Translating...'
                          ? 'text-white/30 animate-pulse'
                          : msg.translated === 'Translation failed'
                          ? 'text-rose-400'
                          : isP1 ? 'text-indigo-300' : 'text-cyan-300'
                      }`}>
                        {msg.translated}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Interim text */}
          {activeMic && interimText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`max-w-[75%] px-4 py-3 rounded-2xl bg-white/5 border border-white/10 ${
                activeMic === 'person1' ? 'mr-auto' : 'ml-auto'
              }`}
            >
              <p className="text-white/40 italic text-sm">{interimText}...</p>
            </motion.div>
          )}

          <div ref={scrollRef} />
        </div>
      </motion.div>

      {/* ── Reports Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showReportsList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => { setShowReportsList(false); setActiveReportName(null); setActiveReportContent(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-5 border-b border-white/5 shrink-0">
                <h2 className="text-lg font-black text-white flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
                  </div>
                  Saved Consultation Reports
                </h2>
                <button
                  onClick={() => { setShowReportsList(false); setActiveReportName(null); setActiveReportContent(null); }}
                  className="p-2 hover:bg-white/5 rounded-xl text-white/30 hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden min-h-[400px]">
                {/* Reports sidebar */}
                <div className="w-1/3 border-r border-white/5 p-3 overflow-y-auto custom-scrollbar space-y-2 bg-black/20">
                  {isLoadingReports ? (
                    <div className="flex items-center justify-center py-16">
                      <span className="material-symbols-outlined animate-spin text-2xl text-indigo-400">sync</span>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <span className="material-symbols-outlined text-3xl text-white/15 mb-2">folder_open</span>
                      <p className="text-xs font-bold text-white/25">No reports saved yet</p>
                    </div>
                  ) : reports.map(rep => (
                    <button
                      key={rep.filename}
                      onClick={() => fetchReportContent(rep.filename)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        activeReportName === rep.filename
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                          : 'bg-white/3 border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block truncate">{rep.filename.replace('Report_', '').replace('.txt', '')}</span>
                      <span className="text-[10px] text-white/25 mt-1 block">{new Date(rep.createdAt).toLocaleString()}</span>
                    </button>
                  ))}
                </div>

                {/* Report content viewer */}
                <div className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col">
                  {activeReportContent ? (
                    <>
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                        <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">Report</span>
                        <span className="text-[10px] font-mono text-white/25">{activeReportName}</span>
                      </div>
                      <pre className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-5 text-xs font-mono text-emerald-300 overflow-auto max-h-[400px] custom-scrollbar whitespace-pre-wrap leading-relaxed">
                        {activeReportContent}
                      </pre>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-white/10">description</span>
                      <p className="text-sm font-bold text-white/20">Select a report to view</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTranslator;
