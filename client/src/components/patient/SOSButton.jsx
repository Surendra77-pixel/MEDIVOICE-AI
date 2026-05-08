import React, { useState } from 'react';
import { AlertCircle, Phone, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleSOS = () => {
    setStatus('sending');
    // Simulate emergency signal
    setTimeout(() => {
      setStatus('success');
      // In a real app, this would call an API and notify nearby hospitals
    }, 2000);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-pulse"
      >
        <AlertCircle className="text-white w-8 h-8" />
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setIsOpen(false);
                  setStatus('idle');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency SOS</h2>
                <p className="text-gray-600 mb-8">
                  Click the button below to send your location and medical profile to the nearest emergency services.
                </p>

                {status === 'idle' && (
                  <button
                    onClick={handleSOS}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    SEND EMERGENCY SIGNAL
                  </button>
                )}

                {status === 'sending' && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-red-600 font-semibold">Broadcasting Location...</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-2">
                      <MapPin className="w-5 h-5" />
                      SIGNAL RECEIVED
                    </div>
                    <p className="text-sm text-green-600">
                      Ambulance dispatched from City General Hospital. ETA: 8 minutes.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
