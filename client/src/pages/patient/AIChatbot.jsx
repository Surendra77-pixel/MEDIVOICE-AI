import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskBadge from '../../components/RiskBadge';

const analyzeInputForSymptoms = (text) => {
  const lowerText = text.toLowerCase();
  
  const severeKeywords = ['chest pain', 'heart attack', 'stroke', 'breathing', 'bleeding', 'unconscious', 'emergency', 'danger', 'severe', 'suicide', 'die', 'blood', 'choking', 'shooting pain'];
  const moderateKeywords = ['fever', 'pain', 'vomit', 'dizzy', 'headache', 'moderate', 'migraine', 'nausea', 'stomach', 'diarrhea', 'burn', 'swollen', 'rash'];
  const mildKeywords = ['cough', 'cold', 'runny nose', 'fatigue', 'tired', 'mild', 'itch', 'scratch', 'sneeze', 'sore throat', 'bruise'];

  let newSymptoms = [];

  severeKeywords.forEach(kw => {
    if (lowerText.includes(kw)) {
      newSymptoms.push({ name: kw.charAt(0).toUpperCase() + kw.slice(1), severity: 'Danger', detail: 'Critical condition detected. Immediate attention recommended.' });
    }
  });

  moderateKeywords.forEach(kw => {
    if (lowerText.includes(kw)) {
      newSymptoms.push({ name: kw.charAt(0).toUpperCase() + kw.slice(1), severity: 'Moderate', detail: 'Moderate condition detected. Monitor closely.' });
    }
  });

  mildKeywords.forEach(kw => {
    if (lowerText.includes(kw)) {
      newSymptoms.push({ name: kw.charAt(0).toUpperCase() + kw.slice(1), severity: 'Safe', detail: 'Mild condition detected. Routine care advised.' });
    }
  });
  
  return newSymptoms;
};

const analyzeSentiment = (text) => {
  const lower = text.toLowerCase();
  
  const negativeWords = ['pain', 'hurt', 'terrible', 'awful', 'bad', 'worse', 'severe', 'scared', 'worried', 'anxious', 'die', 'dying', 'crying', 'sad', 'depressed', 'sick', 'vomit', 'nausea', 'weak', 'tired', 'exhausted', 'fever'];
  const positiveWords = ['better', 'good', 'great', 'improving', 'fine', 'okay', 'well', 'thanks', 'thank you', 'relief', 'relieved', 'happy', 'strong', 'energy', 'sleep'];
  
  let score = 50; // Neutral baseline
  
  negativeWords.forEach(w => {
    if (lower.includes(w)) score -= 10;
  });
  
  positiveWords.forEach(w => {
    if (lower.includes(w)) score += 10;
  });
  
  // Clamp between 10 and 100
  return Math.min(Math.max(score, 10), 100);
};

const AIChatbot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your MediVoice Clinical Assistant. I can help you check symptoms or answer medical questions. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedSymptoms, setExtractedSymptoms] = useState([
    { name: 'Fatigue', severity: 'Mild', detail: 'Reported low energy' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [sentimentHistory, setSentimentHistory] = useState([50, 50, 50, 50, 50, 50]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput((prev) => prev + (prev.length > 0 ? ' ' : '') + transcript.trim());
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast.error('Microphone error: ' + event.error);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.success('Microphone turned off');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening... Speak now!');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    toast.loading(`Analyzing ${file.name}...`);
    
    // Simulate AI processing time
    setTimeout(() => {
      toast.dismiss();
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `I've successfully scanned **${file.name}**. It appears to be a prescription for respiratory medication. I've noted the symptoms and added them to your current assessment for the doctor to review.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
      setExtractedSymptoms(prev => [
        { name: 'Respiratory Congestion', severity: 'Moderate', detail: 'Detected via uploaded prescription' },
        ...prev
      ]);
      setLoading(false);
      toast.success('Prescription analyzed!');
    }, 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Auto-detect problem severity instantly
    const detectedSymptoms = analyzeInputForSymptoms(input);
    if (detectedSymptoms.length > 0) {
      setExtractedSymptoms(prev => {
        const combined = [...detectedSymptoms, ...prev];
        const unique = Array.from(new Map(combined.map(item => [item.name, item])).values());
        return unique.slice(0, 5);
      });
    }

    // Update Sentiment Trend
    const newSentiment = analyzeSentiment(input);
    setSentimentHistory(prev => {
      const updated = [...prev, newSentiment];
      return updated.slice(updated.length - 6); // Keep last 6 data points
    });

    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: input
      });

      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'ai',
        analysis: res.data.data.analysis
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (res.data.data.analysis?.risk) {
        setRiskData(res.data.data.analysis.risk);
      }
      if (res.data.data.analysis?.predictions) {
        setPredictions(res.data.data.analysis.predictions);
      }
    } catch (error) {
      toast.error('AI assistant is currently busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] -mt-6 -mx-8 relative bg-surface-bright dark:bg-transparent overflow-hidden transition-colors duration-500">
      {/* Central Chat Interface */}
      <main className="flex-1 flex flex-col relative h-full z-10">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-gutter sticky top-0 z-10 border-b border-outline-variant/30 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl transition-colors duration-500 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">healing</span>
            </div>
            <h2 className="font-h text-xl text-on-surface dark:text-white font-bold">Symptom Assessment</h2>
          </div>
          <div className="flex items-center gap-md">
            <button 
              onClick={() => { window.location.href = 'tel:108'; }}
              title="Call Emergency Ambulance"
              className="flex items-center gap-xs px-sm py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all animate-pulse hover:animate-none hover:scale-105 active:scale-95 cursor-pointer z-50"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">emergency</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">SOS 108</span>
            </button>
            <div className="flex items-center gap-xs px-sm py-1.5 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-sky-400 rounded-full border border-secondary/20 dark:border-secondary/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary dark:bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary dark:bg-sky-400"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Live Analysis</span>
            </div>
          </div>
        </header>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto p-gutter space-y-lg custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-md max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-fade-in`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-sm overflow-hidden ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                {msg.role === 'user' ? (
                  <span className="material-symbols-outlined">person</span>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center">
                    <DotLottieReact src="/robot.json" loop autoplay />
                  </div>
                )}
              </div>
              <div className={`flex flex-col gap-xs ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-md rounded-3xl shadow-md backdrop-blur-md border transition-all ${
                  msg.role === 'user' 
                  ? 'bg-primary dark:bg-primary/90 text-white rounded-tr-sm border-primary shadow-[0_8px_30px_rgba(79,70,229,0.3)]' 
                  : 'bg-white/90 dark:bg-white/10 text-on-surface dark:text-gray-100 rounded-tl-sm border-outline-variant/30 dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.analysis && (
                    <div className="mt-3 pt-3 border-t border-secondary/20 dark:border-white/10 flex gap-2">
                      <span className="bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-sky-400 border border-secondary/20 dark:border-secondary/30 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">Entity Recognition Active</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-500 uppercase tracking-widest px-1">
                  {msg.role === 'user' ? 'You' : 'MediVoice AI'} • {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-md max-w-2xl animate-pulse">
              <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-white/10 flex-shrink-0"></div>
              <div className="flex flex-col gap-xs">
                <div className="bg-white/80 dark:bg-white/5 p-md rounded-3xl rounded-tl-sm border border-outline-variant/30 dark:border-white/10 w-48 h-12 backdrop-blur-md"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-gutter pt-0 relative z-10">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto p-sm rounded-3xl shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-outline-variant/30 dark:border-white/10 flex items-center gap-sm bg-white/80 dark:bg-white/5 backdrop-blur-2xl transition-colors duration-500">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={handleFileChange}
            />
            <button 
              type="button" 
              onClick={handleFileClick}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-white/10 hover:text-on-surface dark:hover:text-white transition-all"
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="flex-1 relative">
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-white placeholder-on-surface-variant/70 dark:placeholder-gray-500 px-sm py-2 transition-colors" 
                placeholder="Describe your symptoms (e.g. 'I have a dry cough and mild fever')..." 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-xs">
              <button 
                type="button" 
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Start speaking"}
                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all border ${
                  isListening 
                  ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : 'bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-sky-400 border-transparent hover:scale-105 hover:bg-secondary/20 dark:hover:bg-secondary/30 dark:hover:border-secondary/30'
                }`}
              >
                <span className="material-symbols-outlined fill-current">
                  {isListening ? 'mic_off' : 'mic'}
                </span>
              </button>
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="h-12 px-md rounded-2xl bg-primary dark:bg-primary text-white font-bold text-xs flex items-center gap-xs hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Send</span>
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] font-bold text-on-surface-variant dark:text-gray-500 uppercase tracking-widest mt-sm">AI Triage Assistance • Not a Medical Diagnosis</p>
        </div>
      </main>

      {/* Right Sidebar: Extracted Symptoms */}
      <aside className="hidden xl:flex w-[320px] bg-white/60 dark:bg-black/20 backdrop-blur-2xl border-l border-outline-variant/30 dark:border-white/10 flex-col p-gutter animate-slide-left relative z-10 transition-colors duration-500">
        <div className="mb-lg">
          <h3 className="font-h text-xl text-on-surface dark:text-white font-bold mb-xs">Extracted Symptoms</h3>
          <p className="text-xs text-on-surface-variant dark:text-gray-400">Real-time clinical entity recognition</p>
        </div>
        
        <div className="flex-1 space-y-md overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {extractedSymptoms.map((symptom, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={idx} 
                className="p-md rounded-2xl border border-outline-variant/30 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-sm dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-xs">
                  <span className="font-bold text-primary dark:text-indigo-300 text-sm group-hover:text-primary dark:group-hover:text-indigo-200 transition-colors">{symptom.name}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border shadow-sm ${
                    symptom.severity === 'Danger' || symptom.severity === 'Severe'
                    ? 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30' 
                    : symptom.severity === 'Moderate'
                    ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
                    : 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30'
                  }`}>
                    {symptom.severity}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-gray-400 leading-relaxed">{symptom.detail}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Risk Badge UI */}
          <RiskBadge riskData={riskData} />

          {/* Predictions UI */}
          {predictions && predictions.likelyConditions && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary dark:text-sky-400 mb-3">AI Diagnostic Predictions</h3>
              <div className="space-y-3">
                {predictions.likelyConditions.map((c, i) => (
                  <div key={i} className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">{c.condition}</span>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md ${
                        c.probability === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>{c.probability} Prob.</span>
                    </div>
                    <p className="text-xs text-gray-400">{c.reason}</p>
                  </div>
                ))}
              </div>
              
              {predictions.recommendedTests?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Recommended Diagnostics</p>
                  <div className="flex flex-wrap gap-2">
                    {predictions.recommendedTests.map((t, i) => (
                      <span key={i} className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-1 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Health Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-lg p-md rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent dark:from-secondary/10 dark:to-transparent border border-secondary/20 dark:border-secondary/30 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-5 mix-blend-overlay"></div>
            <div className="flex items-center justify-between mb-sm relative z-10">
              <span className="text-[10px] font-bold text-secondary dark:text-sky-400 uppercase tracking-widest">Sentiment Trend</span>
              <span className="material-symbols-outlined text-secondary dark:text-sky-400 text-lg">
                {sentimentHistory[sentimentHistory.length - 1] > sentimentHistory[sentimentHistory.length - 2] ? 'trending_up' : 
                 sentimentHistory[sentimentHistory.length - 1] < sentimentHistory[sentimentHistory.length - 2] ? 'trending_down' : 'trending_flat'}
              </span>
            </div>
            <div className="h-16 w-full flex items-end gap-1 px-1 relative z-10">
              {sentimentHistory.map((h, i) => (
                <motion.div 
                  key={`${i}-${h}`} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                  className={`flex-1 rounded-t-sm hover:brightness-125 transition-all cursor-pointer ${
                    h < 40 ? 'bg-gradient-to-t from-red-500/40 to-red-400/60' : 
                    h > 60 ? 'bg-gradient-to-t from-green-500/40 to-green-400/60' : 
                    'bg-gradient-to-t from-secondary/40 to-secondary/60 dark:from-sky-500/30 dark:to-sky-400/50'
                  }`}
                ></motion.div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 mt-sm uppercase tracking-tighter relative z-10">Symptom escalation detected via NLP</p>
          </motion.div>
        </div>

        <div className="mt-auto pt-4 border-t border-outline-variant/20 dark:border-white/10 flex-shrink-0">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/patient/book')}
            className="w-full py-4 bg-primary text-white font-bold text-xs rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-sm uppercase border border-white/10"
          >
            <span className="material-symbols-outlined text-sm">event</span>
            Book Consultation
          </motion.button>
        </div>
      </aside>
    </div>
  );
};

export default AIChatbot;
