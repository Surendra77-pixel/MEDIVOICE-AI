import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { Bot, Send, Sparkles, Brain, Zap, Activity, Pill, Search, ClipboardList } from 'lucide-react';

const DoctorAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Welcome to your Clinical AI Co-Pilot. I can help you with drug interactions, clinical research summaries, and ICD-10 coding suggestions. What can I help you with today?",
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', { 
        message: `Doctor Query: ${currentInput}. (Provide professional clinical research or diagnostic guidance)`,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      
      if (res.data.success) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: res.data.data.response,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
      }
    } catch (err) {
      toast.error('AI Co-Pilot is currently offline');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden max-w-5xl mx-auto">
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-8 bg-slate-900 text-white">
        <div className="flex items-center gap-sm">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Clinical Co-Pilot</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Diagnostic Intelligence Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold border border-white/5">ICD-10 READY</span>
            <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold border border-white/5">NLP ENGINE v2</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="flex-1 overflow-y-auto p-8 space-y-lg custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-md max-w-2xl animate-slide-up ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'ai' ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-800 text-white shadow-slate-900/20'}`}>
                  {msg.role === 'ai' ? <Sparkles className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`flex flex-col gap-xs ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-5 rounded-3xl shadow-sm border leading-relaxed ${msg.role === 'ai' ? 'bg-white border-outline-variant/30 text-on-surface rounded-tl-xs' : 'bg-slate-900 text-white border-slate-800 rounded-tr-xs'}`}>
                    <p className="text-sm font-medium">{msg.content}</p>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-tighter">
                    {msg.role === 'ai' ? 'CO-PILOT' : 'DR. SURGEON'} • {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-md max-w-2xl">
                <div className="w-10 h-10 rounded-2xl bg-primary flex-shrink-0 flex items-center justify-center text-white">
                  <Activity className="h-5 w-5 animate-pulse" />
                </div>
                <div className="flex flex-col gap-xs w-full">
                  <div className="p-4 rounded-3xl rounded-tl-xs bg-white border border-outline-variant/30">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-8 bg-white border-t border-outline-variant/20">
            <div className="relative flex items-center gap-3">
              <input 
                type="text" 
                className="flex-1 bg-surface-container rounded-2xl px-6 py-4 text-sm font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all placeholder:text-on-surface-variant/40"
                placeholder="Ask about drug interactions, ICD-10 codes, or research..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tools Sidebar */}
        <aside className="w-80 bg-white border-l border-outline-variant/30 p-6 space-y-lg hidden lg:block">
          <h4 className="font-black text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">Quick Diagnostic Tools</h4>
          
          <div className="space-y-3">
            <button className="w-full p-4 bg-slate-50 border border-outline-variant/30 rounded-2xl flex items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all group">
              <div className="bg-white p-2 rounded-xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Search className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-on-surface">ICD-10 Lookup</div>
                <div className="text-[10px] text-on-surface-variant">Global Code Registry</div>
              </div>
            </button>

            <button className="w-full p-4 bg-slate-50 border border-outline-variant/30 rounded-2xl flex items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all group">
              <div className="bg-white p-2 rounded-xl shadow-sm text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                <Pill className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-on-surface">Interaction Check</div>
                <div className="text-[10px] text-on-surface-variant">Pharmacology Database</div>
              </div>
            </button>

            <button className="w-full p-4 bg-slate-50 border border-outline-variant/30 rounded-2xl flex items-center gap-4 hover:bg-primary/5 hover:border-primary/20 transition-all group">
              <div className="bg-white p-2 rounded-xl shadow-sm text-error group-hover:bg-error group-hover:text-white transition-all">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-on-surface">Trial Abstracts</div>
                <div className="text-[10px] text-on-surface-variant">PubMed AI Summary</div>
              </div>
            </button>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-[32px]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <h5 className="text-[10px] font-black text-primary uppercase tracking-widest">Co-Pilot Tip</h5>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Try asking: "What are the common contraindications for Lisinopril and NSAIDs?"
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DoctorAssistant;
