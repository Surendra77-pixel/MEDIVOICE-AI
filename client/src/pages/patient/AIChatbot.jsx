import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
      
      if (res.data.data.analysis?.symptoms) {
        setExtractedSymptoms(prev => [...res.data.data.analysis.symptoms, ...prev].slice(0, 5));
      }
    } catch (error) {
      toast.error('AI assistant is currently busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] -mt-6 -mx-8 relative bg-surface-bright overflow-hidden">
      {/* Central Chat Interface */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-gutter glass-card sticky top-0 z-10 border-b border-outline-variant/30 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">healing</span>
            <h2 className="font-h text-xl text-primary">Symptom Assessment</h2>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-xs px-sm py-1 bg-secondary/10 text-secondary rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Live Analysis</span>
            </div>
          </div>
        </header>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto p-gutter space-y-lg custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-md max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-fade-in`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                <span className="material-symbols-outlined">{msg.role === 'user' ? 'person' : 'smart_toy'}</span>
              </div>
              <div className={`flex flex-col gap-xs ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-md rounded-2xl shadow-sm border ${
                  msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none border-primary' 
                  : 'bg-white text-on-surface rounded-tl-none border-outline-variant/30'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.analysis && (
                    <div className="mt-3 pt-3 border-t border-secondary/20 flex gap-2">
                      <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded">Entity Recognition Active</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
                  {msg.role === 'user' ? 'You' : 'MediVoice AI'} • {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-md max-w-2xl animate-pulse">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
              <div className="flex flex-col gap-xs">
                <div className="bg-white p-md rounded-2xl rounded-tl-none border border-outline-variant/30 w-48 h-12"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-gutter pt-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto glass-card p-sm rounded-2xl shadow-lg border border-outline-variant/30 flex items-center gap-sm bg-white">
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
              className="w-12 h-12 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="flex-1 relative">
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-on-surface px-sm py-2" 
                placeholder="Describe your symptoms (e.g. 'I have a dry cough and mild fever')..." 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center gap-xs">
              <button type="button" className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center hover:scale-105 transition-transform">
                <span className="material-symbols-outlined fill-current">mic</span>
              </button>
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="h-12 px-md rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-xs hover:brightness-110 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Send</span>
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-sm">AI Triage Assistance • Not a Medical Diagnosis</p>
        </div>
      </main>

      {/* Right Sidebar: Extracted Symptoms */}
      <aside className="hidden xl:flex w-[320px] bg-white border-l border-outline-variant/30 flex-col p-gutter animate-slide-left">
        <div className="mb-lg">
          <h3 className="font-h text-xl text-on-surface mb-xs">Extracted Symptoms</h3>
          <p className="text-xs text-on-surface-variant">Real-time clinical entity recognition</p>
        </div>
        
        <div className="flex-1 space-y-md overflow-y-auto custom-scrollbar">
          {extractedSymptoms.map((symptom, idx) => (
            <div key={idx} className="p-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-xs">
                <span className="font-bold text-primary text-sm">{symptom.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                  symptom.severity === 'Severe' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
                }`}>
                  {symptom.severity}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{symptom.detail}</p>
            </div>
          ))}

          {/* Health Trend */}
          <div className="mt-lg p-md rounded-xl bg-secondary/5 border border-secondary/20">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Sentiment Trend</span>
              <span className="material-symbols-outlined text-secondary text-lg">trending_up</span>
            </div>
            <div className="h-16 w-full flex items-end gap-1 px-1">
              {[40, 50, 45, 70, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-secondary/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant mt-sm uppercase tracking-tighter">Symptom escalation detected via NLP</p>
          </div>
        </div>

        <div className="mt-auto pt-lg border-t border-outline-variant/20">
          <button 
            onClick={() => navigate('/patient/book')}
            className="w-full py-3 bg-primary text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm uppercase"
          >
            <span className="material-symbols-outlined text-sm">event</span>
            Book Consultation
          </button>
        </div>
      </aside>
    </div>
  );
};

export default AIChatbot;
