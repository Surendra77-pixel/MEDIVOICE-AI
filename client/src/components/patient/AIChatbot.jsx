import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, Sparkles, AlertCircle, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am your MediVoice AI assistant. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI logic
    setTimeout(() => {
      let botResponse = '';
      let isEmergency = false;

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('chest pain') || lowerInput.includes('breathing')) {
        botResponse = "CRITICAL: You mentioned symptoms that could be an emergency. Please use the SOS button or contact emergency services immediately!";
        isEmergency = true;
      } else if (lowerInput.includes('fever') || lowerInput.includes('cold')) {
        botResponse = "I understand you have a fever/cold. I recommend consulting a General Physician. Would you like to view available doctors?";
      } else if (lowerInput.includes('headache')) {
        botResponse = "For frequent headaches, a Neurologist might be able to help. You can book an appointment with our specialists.";
      } else {
        botResponse = "I've noted your symptoms. Based on my analysis, you should consult a specialist for a detailed checkup.";
      }

      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: botResponse, 
        time: new Date().toLocaleTimeString(),
        isEmergency,
        suggestion: botResponse.includes('Physician') || botResponse.includes('Neurologist') ? 'Book Appointment' : null
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-900 rotate-90' : 'bg-patient hover:scale-110'}`}
      >
        {isOpen ? <X className="h-8 w-8 text-white" /> : <Bot className="h-8 w-8 text-white" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="bg-patient p-6 text-white flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">MediVoice Assistant</h3>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest opacity-80">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                AI Agent Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.type === 'user' 
                  ? 'bg-patient text-white rounded-tr-none' 
                  : msg.isEmergency 
                    ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none font-bold'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.isEmergency && <AlertCircle className="h-5 w-5 mb-2" />}
                  {msg.text}
                  {msg.suggestion && (
                    <Link to={ROUTES.PATIENT.BOOKING} className="block mt-3 bg-patient-light text-patient px-4 py-2 rounded-xl text-xs font-bold text-center hover:bg-patient hover:text-white transition-all">
                      {msg.suggestion}
                    </Link>
                  )}
                  <p className={`text-[10px] mt-1 opacity-50 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-50">
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-patient focus-within:bg-white transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
              />
              <button 
                onClick={handleSend}
                className="bg-patient text-white p-2 rounded-xl hover:bg-patient-dark transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 flex justify-center items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
               <Sparkles className="h-3 w-3" /> Powered by MediVoice AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
