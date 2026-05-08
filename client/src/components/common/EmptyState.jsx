import React from 'react';
import { Ghost, Search, Plus } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Ghost, 
  title = 'No records found', 
  message = 'It looks like there is nothing here yet.', 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-8">{message}</p>
      
      {actionLabel && (
        <button 
          onClick={onAction}
          className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
