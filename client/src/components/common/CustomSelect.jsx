import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  className = "", 
  placeholder = "Select Option",
  dropdownClassName = "",
  direction = "down" // "down" or "up"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Accept both 'code' and 'value' for options to be compatible with existing code
  const getOptValue = (opt) => opt.code !== undefined ? opt.code : opt.value;
  
  const selectedOption = options.find(opt => getOptValue(opt) === value);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border border-outline-variant/30 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-left flex justify-between items-center text-on-surface dark:text-white hover:border-primary dark:hover:border-sky-400 transition-all outline-none shadow-sm"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary dark:text-sky-400' : 'text-on-surface-variant dark:text-gray-400'}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className={`absolute left-0 right-0 ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-white/10 rounded-2xl shadow-xl py-2 z-[9999] max-h-60 overflow-y-auto custom-scrollbar ${dropdownClassName}`}>
          {options.map((opt, idx) => {
            const optVal = getOptValue(opt);
            const isSelected = optVal === value;
            return (
              <button
                type="button"
                key={optVal || idx}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${
                  isSelected 
                    ? 'bg-primary/10 text-primary dark:text-sky-400' 
                    : 'text-on-surface-variant dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-sm text-primary dark:text-sky-400 font-bold">check</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
