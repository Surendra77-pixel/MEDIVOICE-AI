import React from 'react';
import { PhoneCall } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SOSButton = () => {
  const handleSOS = () => {
    const confirmSOS = window.confirm('Are you in an emergency? This will call 108 emergency services.');
    if (confirmSOS) {
      window.location.href = 'tel:108';
      toast.error('Emergency call initiated!', {
        duration: 10000,
        icon: '🚨',
      });
    }
  };

  return (
    <button
      onClick={handleSOS}
      className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-pulse"
      aria-label="Emergency SOS"
    >
      <PhoneCall className="h-6 w-6 mb-0.5" />
      <span className="text-[10px] font-bold uppercase tracking-wider">SOS</span>
      
      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 bg-gray-900 text-white text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Emergency Call (108)
      </div>
    </button>
  );
};

export default SOSButton;
