const fs = require('fs');

try {
  let code = fs.readFileSync('client/src/pages/patient/AIChatbot.jsx', 'utf-8');

  // Strip layout elements
  code = code.replace(/<aside className="fixed left-0 top-0 bottom-0[\s\S]*?<\/aside>/i, '');
  code = code.replace(/<header className="h-16 flex items-center justify-between[\s\S]*?<\/header>/i, '');
  
  // Also strip the right side aside "Extracted Symptoms" since we're making it simple or we can keep it as part of the flex container.
  // Wait, if it's rendered inside the PatientLayout, we shouldn't have a fixed right aside either. 
  // Let's strip the right aside.
  code = code.replace(/<aside className="fixed right-0 top-0 bottom-0[\s\S]*?<\/aside>/i, '');

  const mainMatch = code.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) {
    console.log('Could not find main tag');
    process.exit(1);
  }
  let mainContent = mainMatch[1];

  const newCode = `import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello, I'm the MediVoice Clinical Assistant. How can I help you today? Please describe your symptoms.",
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

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = {
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I've noted your symptoms. Based on my analysis, this appears to be a case that requires clinical review. I have summarized this for your next doctor's appointment.",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-100px)] animate-fade-in bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-16 flex items-center justify-between px-8 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">healing</span>
          <h2 className="font-h3 text-h3 text-primary">Symptom Checker</h2>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs px-sm py-xs bg-secondary-container/20 text-secondary rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="font-label text-label">AI ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-lg">
        {messages.map((msg, idx) => (
          msg.role === 'ai' ? (
            <div key={idx} className="flex gap-md max-w-2xl">
              <div className="w-10 h-10 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div className="flex flex-col gap-xs w-full">
                <div className="glass-panel p-md rounded-xl rounded-tl-xs shadow-sm bg-surface-container-lowest border border-outline-variant/30">
                  <p className="font-body-md mb-sm">{msg.content}</p>
                </div>
                <span className="font-label text-label text-on-surface-variant ml-xs">MediVoice AI • {msg.time}</span>
              </div>
            </div>
          ) : (
            <div key={idx} className="flex gap-md max-w-2xl ml-auto flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex flex-col items-end gap-xs">
                <div className="bg-primary text-white p-md rounded-xl rounded-tr-xs shadow-md shadow-primary/10">
                  <p className="font-body-md">{msg.content}</p>
                </div>
                <span className="font-label text-label text-on-surface-variant mr-xs">You • {msg.time}</span>
              </div>
            </div>
          )
        ))}
        {isTyping && (
          <div className="flex gap-md max-w-2xl">
            <div className="w-10 h-10 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div className="flex flex-col gap-xs w-full">
              <div className="glass-panel p-md rounded-xl rounded-tl-xs shadow-sm bg-surface-container-lowest border border-outline-variant/30">
                <p className="font-body-md flex items-center gap-1">
                  <span className="animate-bounce inline-block w-2 h-2 bg-primary rounded-full"></span>
                  <span className="animate-bounce inline-block w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></span>
                  <span className="animate-bounce inline-block w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }}></span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 pt-0">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest p-sm rounded-2xl shadow-sm border border-outline-variant/30 flex items-center gap-sm">
          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <div className="flex-1 relative">
            <input 
              className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface px-sm py-base outline-none" 
              placeholder="Type or speak symptoms..." 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <div className="flex items-center gap-xs">
            <button className="h-12 w-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center hover:scale-105 transition-transform">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
            </button>
            <button 
              onClick={handleSend}
              className="h-12 px-md rounded-xl bg-primary text-white font-body-sm flex items-center gap-xs hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined">send</span>
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
        <p className="text-center font-label text-label text-on-surface-variant mt-sm">MediVoice AI provides triage assistance and is not a replacement for professional medical diagnosis.</p>
      </div>
    </div>
  );
};

export default AIChatbot;
`;

  fs.writeFileSync('client/src/pages/patient/AIChatbot.jsx', newCode);
  console.log('Successfully refactored AIChatbot.jsx');

} catch(e) {
  console.error(e);
}
