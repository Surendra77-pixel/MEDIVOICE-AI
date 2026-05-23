import React, { useState, useEffect, useRef } from 'react';
import { translateText } from '../../services/translateService';
import { toast } from 'react-hot-toast';

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'bn-IN', label: 'Bengali' }
];

import CustomSelect from '../../components/common/CustomSelect';

const LiveTranslator = () => {
  const [lang1, setLang1] = useState('en-US');
  const [lang2, setLang2] = useState('ta-IN');
  const [activeMic, setActiveMic] = useState(null); 
  const [isTTSActive, setIsTTSActive] = useState(true);
  const [transcript, setTranscript] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [interimText, setInterimText] = useState("");
  
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: 'Male',
    notes: ''
  });
  const [isSavingReport, setIsSavingReport] = useState(false);

  const handleSaveReport = async () => {
    if (transcript.length === 0) {
      toast.error("Cannot save empty transcript report.");
      return;
    }
    if (!patientInfo.name.trim()) {
      toast.error("Please enter the Patient's Name first.");
      return;
    }

    setIsSavingReport(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/ai/save-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          patientInfo,
          transcript
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Report saved locally to backend reports folder: ${data.data.filename}`);
      } else {
        toast.error("Failed to save report: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Network error: Failed to reach backend: " + err.message);
    } finally {
      setIsSavingReport(false);
    }
  };

  const [showReportsList, setShowReportsList] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [activeReportName, setActiveReportName] = useState(null);
  const [activeReportContent, setActiveReportContent] = useState(null);

  const fetchReportsList = async () => {
    setIsLoadingReports(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/ai/reports', {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.data);
      } else {
        toast.error("Failed to load reports: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Failed to load reports list: " + err.message);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const fetchReportContent = async (filename) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/ai/reports/${filename}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveReportName(filename);
        setActiveReportContent(data.data.content);
      } else {
        toast.error("Failed to load report content: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Failed to load report content: " + err.message);
    }
  };

  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Pre-load voices to ensure remote Google voices (Tamil/Telugu) are available
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getDemoTranslation = (text, speaker) => {
    const lower = text.toLowerCase();
    
    // Person 1 speaks English, translating to Tamil
    if (speaker === 'person1') {
      if (lower.includes('problem') || lower.includes('hello')) return "வணக்கம், இன்று என்ன பிரச்சனை என்று சொல்லுங்கள்?";
      if (lower.includes('how long')) return "காய்ச்சல் எவ்வளவு நாட்களாக உள்ளது?";
      if (lower.includes('prescribe') || lower.includes('paracetamol') || lower.includes('medicine')) return "நான் சில பாராசிட்டமால் மாத்திரைகளை பரிந்துரைக்கிறேன். சாப்பிட்ட பிறகு ஒரு நாளைக்கு இரண்டு முறை எடுத்துக் கொள்ளுங்கள்.";
    }
    
    // Person 2 speaks Tamil, translating to English
    if (speaker === 'person2') {
      if (lower.includes('fever') || lower.includes('dizzy') || lower.includes('காய்ச்சல்')) return "I have been feeling very dizzy and I have a slight fever.";
      if (lower.includes('three') || lower.includes('days') || lower.includes('நாட்களாக')) return "For the past three days.";
      if (lower.includes('thank') || lower.includes('நன்றி')) return "Thank you, doctor.";
    }
    
    // Fallback if they say something completely different
    return `[Demo] Translated: ${text}`;
  };

  const handleTranslateFinal = async (text, speaker) => {
    const sourceLang = speaker === 'person1' ? lang1 : lang2;
    const targetLang = speaker === 'person1' ? lang2 : lang1;
    const newMsgId = Date.now();

    setTranscript(prev => [...prev, {
      id: newMsgId,
      original: text,
      translated: 'Translating...',
      sourceLang,
      targetLang,
      speaker
    }]);

    try {
      // Use the actual Google Translate API endpoint configured in translateService
      let translatedText = await translateText(text, sourceLang, targetLang);
      
      setTranscript(prev => prev.map(msg => 
        msg.id === newMsgId ? { ...msg, translated: translatedText } : msg
      ));

      if (isTTSActive && translatedText) {
        try {
          const ttsLang = targetLang.split('-')[0];
          // Fetch from the backend proxy route passing user credentials for authentication
          const ttsRes = await fetch(`http://localhost:3000/api/v1/ai/tts?text=${encodeURIComponent(translatedText)}&lang=${ttsLang}`, {
            credentials: 'include'
          });
          
          if (!ttsRes.ok) throw new Error("TTS proxy failed");
          
          const audioBlob = await ttsRes.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.onerror = (e) => {
            console.error("Proxy TTS failed, falling back to browser TTS", e);
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = targetLang;
            window.speechSynthesis.speak(utterance);
          };
          
          audio.play().catch(e => {
            console.error("Audio play blocked, falling back to browser TTS:", e);
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = targetLang;
            window.speechSynthesis.speak(utterance);
          });
        } catch (err) {
          console.error("TTS Proxy System Error, falling back to browser TTS:", err);
          try {
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = targetLang;
            window.speechSynthesis.speak(utterance);
          } catch(e) {}
        }
      }
    } catch (err) {
      console.error("Translation Error:", err);
      setTranscript(prev => prev.map(msg => 
        msg.id === newMsgId ? { ...msg, translated: "Translation failed" } : msg
      ));
    }
  };

  const [useNeuralFallback, setUseNeuralFallback] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startNeuralRecording = async (person) => {
    try {
      // Prime TTS engine to bypass browser autoplay restrictions
      if (isTTSActive) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser blocks audio recording on this page. Please use Chrome and ensure you are on localhost or HTTPS.");
        setErrorMsg("Browser Audio API blocked.");
        return;
      }
      
      // Notify the user to look for the browser prompt
      setErrorMsg("Please click 'Allow' in your browser's microphone permission prompt...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const langCode = person === 'person1' ? lang1.split('-')[0] : lang2.split('-')[0];

        try {
          setErrorMsg("Processing translation...");
          const res = await fetch(`http://localhost:3000/api/v1/ai/transcribe?lang=${langCode}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/octet-stream'
            },
            body: audioBlob
          });

          const data = await res.json();
          if (data.success && data.data.text) {
            handleTranslateFinal(data.data.text.trim(), person);
            setErrorMsg(null);
          } else {
            setErrorMsg("Neural STT Failed: " + (data.message || 'Unknown error'));
          }
        } catch (err) {
          setErrorMsg("Failed to reach Neural Server: " + err.message);
        } finally {
          setActiveMic(null);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setActiveMic(person);
      setErrorMsg(null);

    } catch (err) {
      alert("Microphone Error: " + err.message + "\n\nPlease check your Windows Microphone Privacy Settings and ensure your browser has permission.");
      setErrorMsg("Microphone permission denied: " + err.message);
      setActiveMic(null);
    }
  };

  const stopNeuralRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const startListening = async (person) => {
    if (activeMic === person) {
      if (useNeuralFallback) {
        stopNeuralRecording();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
        setActiveMic(null);
      }
      return;
    }

    if (useNeuralFallback) {
      startNeuralRecording(person);
      return;
    }

    setErrorMsg(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setErrorMsg("Your browser does not support Real-Time Speech Recognition. Please use Google Chrome.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setActiveMic(person);
    setInterimText("");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = person === 'person1' ? lang1 : lang2;

    recognition.onresult = (event) => {
      let currentInterim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalText = event.results[i][0].transcript.trim();
          if (finalText) {
            handleTranslateFinal(finalText, person);
          }
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }
      setInterimText(currentInterim);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === 'no-speech') {
        setErrorMsg("No sound detected! Please check your Windows microphone settings. Speak louder into the mic!");
      } else if (event.error === 'not-allowed') {
        setErrorMsg("Microphone access blocked. Please allow mic permissions in your browser.");
      } else if (event.error === 'network') {
        setErrorMsg("Network error. Switching to Neural Engine Override! Tap the mic again to record.");
        setUseNeuralFallback(true);
        setActiveMic(null); // Stop the mic so it doesn't loop
      } else {
        setErrorMsg(`Microphone Error: ${event.error}`);
        setActiveMic(null);
      }
      // Only restart if it's a transient error and we haven't failed over
      if (activeMic === person && event.error !== 'network') {
        try { recognition.start(); } catch(e){}
      }
    };

    try {
      recognition.start();
    } catch (err) {
      setErrorMsg("Could not start microphone. Please try again.");
      setActiveMic(null);
    }
  };

  return (
    <div className="h-full flex flex-col gap-lg animate-fade-in text-on-surface dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-h text-3xl font-bold text-primary dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl">g_translate</span>
            Live Translator
          </h1>
          <p className="text-on-surface-variant dark:text-gray-400 mt-1">
            Real-time medical translation using Neural Engine.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowReportsList(true);
              fetchReportsList();
            }}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-sky-400 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">folder_open</span>
            View Saved Reports
          </button>

          <div className="flex items-center gap-2 bg-surface-container-high dark:bg-white/10 px-4 py-2 rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant">volume_up</span>
            <span className="font-bold text-sm mr-2 text-on-surface-variant">Audio Feedback</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isTTSActive} 
                onChange={() => setIsTTSActive(!isTTSActive)} 
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Patient Profile Form */}
      <div className="bg-surface-container-low dark:bg-white/5 rounded-3xl p-lg border border-outline-variant/30 shadow-sm flex flex-col gap-6 animate-slide-up">
        <h3 className="text-sm font-bold text-primary dark:text-sky-400 uppercase tracking-widest flex items-center gap-2 border-b border-outline-variant/20 pb-2">
          <span className="material-symbols-outlined text-xl">patient_list</span>
          Patient Consultation Demographics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant dark:text-gray-400 uppercase">Patient Name</label>
            <input 
              type="text"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Surendra"
              className="bg-white dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary dark:focus:border-sky-400 outline-none transition-all dark:text-white"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant dark:text-gray-400 uppercase">Age</label>
            <input 
              type="number"
              value={patientInfo.age}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
              placeholder="e.g. 28"
              className="bg-white dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary dark:focus:border-sky-400 outline-none transition-all dark:text-white"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant dark:text-gray-400 uppercase">Gender</label>
            <CustomSelect
              value={patientInfo.gender}
              onChange={(val) => setPatientInfo(prev => ({ ...prev, gender: val }))}
              options={[
                { code: 'Male', label: 'Male' },
                { code: 'Female', label: 'Female' },
                { code: 'Other', label: 'Other' }
              ]}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant dark:text-gray-400 uppercase">Symptoms / Notes</label>
            <input 
              type="text"
              value={patientInfo.notes}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Cold and fever"
              className="bg-white dark:bg-black/20 border border-outline-variant dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary dark:focus:border-sky-400 outline-none transition-all dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-surface-container-low dark:bg-white/5 rounded-3xl p-lg border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-8">
        
        {/* Person 1 Input */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <label className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Patient (Speaker 1)</label>
          <CustomSelect 
            value={lang1} 
            onChange={setLang1} 
            options={SUPPORTED_LANGUAGES}
            className="max-w-[200px]"
          />
          
          <button 
            onClick={() => startListening('person1')} 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              activeMic === 'person1' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-3xl">{activeMic === 'person1' ? 'mic' : 'mic_none'}</span>
          </button>
        </div>

        {/* Separator / Swap */}
        <div className="flex items-center justify-center">
          <button 
            onClick={() => {
              const temp = lang1;
              setLang1(lang2);
              setLang2(temp);
            }}
            className="w-12 h-12 rounded-full bg-surface-container-high dark:bg-white/10 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">swap_horiz</span>
          </button>
        </div>

        {/* Person 2 Input */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <label className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Doctor (Speaker 2)</label>
          <CustomSelect 
            value={lang2} 
            onChange={setLang2} 
            options={SUPPORTED_LANGUAGES}
            className="max-w-[200px]"
          />
          
          <button 
            onClick={() => startListening('person2')} 
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              activeMic === 'person2' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
            }`}
          >
            <span className="material-symbols-outlined text-3xl">{activeMic === 'person2' ? 'mic' : 'mic_none'}</span>
          </button>
        </div>

      </div>

      {/* Manual Input Fallback */}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl">
          <p className="text-sm text-red-700 dark:text-red-400 font-bold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            {useNeuralFallback ? "Neural STT Override Active! Tap the microphone again to record, or type below:" : "Microphone offline or blocked. You can type instead:"}
          </p>
          <p className="text-xs text-red-600 dark:text-red-300 mb-3 ml-6 font-medium italic">
            Status: {errorMsg}
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              id="fallback-input"
              className="flex-1 bg-white dark:bg-black/20 border border-outline-variant rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleTranslateFinal(e.target.value.trim(), 'person1');
                  e.target.value = '';
                }
              }}
            />
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs uppercase"
              onClick={() => {
                if (isTTSActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
                const input = document.getElementById('fallback-input');
                if (input && input.value.trim()) {
                  handleTranslateFinal(input.value.trim(), 'person1');
                  input.value = '';
                }
              }}
            >
              P1 Speak
            </button>
            <button 
              className="bg-secondary text-white px-4 py-2 rounded-lg font-bold text-xs uppercase"
              onClick={() => {
                if (isTTSActive) window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
                const input = document.getElementById('fallback-input');
                if (input && input.value.trim()) {
                  handleTranslateFinal(input.value.trim(), 'person2');
                  input.value = '';
                }
              }}
            >
              P2 Speak
            </button>
          </div>
        </div>
      )}

      {/* Transcript Panel */}
      <div className="flex-1 bg-surface-container-low dark:bg-white/5 rounded-3xl p-lg border border-outline-variant/30 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant/20 pb-2">
          <h2 className="text-sm font-bold text-on-surface-variant dark:text-gray-300 uppercase tracking-wider">
            Conversation Transcript
          </h2>
          
          <button
            onClick={handleSaveReport}
            disabled={isSavingReport || transcript.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 ${
              transcript.length === 0 
                ? 'bg-gray-300 dark:bg-white/5 text-gray-500 dark:text-white/20 cursor-not-allowed'
                : 'bg-primary text-white hover:brightness-110 shadow-md shadow-primary/20 active:scale-95'
            }`}
          >
            {isSavingReport ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">save</span>
                Save Report to Disk
              </>
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {transcript.length === 0 && !activeMic && (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50">
              <span className="material-symbols-outlined text-6xl mb-2">forum</span>
              <p className="font-bold">No messages yet. Tap a microphone to start speaking.</p>
            </div>
          )}

          {transcript.map(msg => (
            <div key={msg.id} className={`p-4 rounded-2xl max-w-[85%] ${
              msg.speaker === 'person1' ? 'bg-primary/5 border border-primary/20 mr-auto' : 'bg-secondary/5 border border-secondary/20 ml-auto'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.speaker === 'person1' ? 'text-primary' : 'text-secondary'}`}>
                  Speaker {msg.speaker === 'person1' ? '1' : '2'} • {msg.sourceLang}
                </span>
              </div>
              <p className="text-on-surface dark:text-white font-medium text-lg">{msg.original}</p>
              
              <div className="mt-3 pt-3 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-gray-400 mb-1 block">
                  Translation • {msg.targetLang}
                </span>
                <p className={`font-bold ${msg.translated === 'Translating...' ? 'text-on-surface-variant dark:text-gray-400 animate-pulse' : 'text-primary'}`}>
                  {msg.translated}
                </p>
              </div>
            </div>
          ))}

          {/* Interim Results Placeholder */}
          {activeMic && interimText && (
            <div className={`p-4 rounded-2xl max-w-[85%] bg-surface-container-high animate-pulse ${
              activeMic === 'person1' ? 'mr-auto' : 'ml-auto'
            }`}>
              <p className="text-on-surface-variant italic">{interimText}...</p>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Saved Reports List Overlay/Modal */}
      {showReportsList && (
        <div className="fixed top-16 bottom-0 right-0 left-0 md:left-64 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up text-on-surface dark:text-white">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/20 bg-surface-container-high dark:bg-slate-800">
              <h2 className="text-xl font-bold font-h flex items-center gap-2 text-primary dark:text-sky-400">
                <span className="material-symbols-outlined text-2xl">folder</span>
                Saved Consultation Reports
              </h2>
              <button 
                onClick={() => {
                  setShowReportsList(false);
                  setActiveReportName(null);
                  setActiveReportContent(null);
                }}
                className="w-10 h-10 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-[450px]">
              
              {/* Reports List Sidebar */}
              <div className="w-1/3 border-r border-outline-variant/20 p-4 overflow-y-auto space-y-2 bg-surface-container-low dark:bg-slate-950/40">
                {isLoadingReports ? (
                  <div className="h-full flex items-center justify-center py-10">
                    <span className="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-on-surface-variant/50 text-center">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
                    <p className="text-xs font-bold">No reports saved yet.</p>
                  </div>
                ) : (
                  reports.map(rep => (
                    <button
                      key={rep.filename}
                      onClick={() => fetchReportContent(rep.filename)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                        activeReportName === rep.filename
                          ? 'bg-primary/10 border-primary text-primary dark:border-sky-400 dark:text-sky-400'
                          : 'bg-white dark:bg-white/5 border-outline-variant/50 hover:bg-black/5 dark:hover:bg-white/5 text-on-surface dark:text-gray-200'
                      }`}
                    >
                      <span className="text-xs font-bold truncate block">{rep.filename.replace('Report_', '').replace('.txt', '')}</span>
                      <span className="text-[10px] text-on-surface-variant dark:text-gray-400">
                        {new Date(rep.createdAt).toLocaleString()}
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Report Viewer Main Area */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col bg-white dark:bg-slate-950/20">
                {activeReportContent ? (
                  <div className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/10">
                      <span className="text-xs font-black uppercase text-primary dark:text-sky-400 tracking-wider">
                        Report Text File
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant dark:text-gray-400 font-mono">
                        {activeReportName}
                      </span>
                    </div>
                    <pre className="flex-1 bg-black/5 dark:bg-black/35 border border-outline-variant/10 rounded-2xl p-4 text-xs font-mono overflow-auto dark:text-green-400 text-slate-800 leading-relaxed max-h-[360px] custom-scrollbar whitespace-pre-wrap">
                      {activeReportContent}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50 py-10">
                    <span className="material-symbols-outlined text-6xl mb-2">description</span>
                    <p className="font-bold">Select a report from the list to view its contents.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTranslator;
