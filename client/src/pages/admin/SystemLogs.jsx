import React from 'react';
import { ScrollText, Terminal, Clock, Search, Download, Filter } from 'lucide-react';

const SystemLogs = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">System Audit Logs</h1>
          <p className="text-gray-500 font-medium text-sm">Full traceability of every action performed on the MediVoice platform.</p>
        </div>
        <button className="bg-admin text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-admin-dark transition-all shadow-xl">
           <Download className="h-4 w-4 inline mr-2" /> Download Log History
        </button>
      </div>

      <div className="bg-admin-dark rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-100 flex flex-col h-[600px]">
        <div className="bg-black/20 p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">root@medivoice-ai: ~/audit-logs</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-admin-light opacity-60" />
            <span className="text-[10px] font-black text-admin-light opacity-60 uppercase tracking-widest">Live Stream Active</span>
          </div>
        </div>

        <div className="flex-1 p-8 font-mono text-sm overflow-y-auto space-y-3 bg-gray-900">
           {[
             { time: '17:42:01', level: 'INFO', event: 'Connection established to MongoDB Atlas Cluster0' },
             { time: '17:42:05', level: 'AUTH', event: 'JWT Token issued for user ID 65af...' },
             { time: '17:43:12', level: 'WARN', event: 'Rate limit threshold reached for IP 185.12.3.4' },
             { time: '17:44:00', level: 'INFO', event: 'Daily TTL index cleanup task completed: 142 records removed' },
             { time: '17:45:15', level: 'ADMIN', event: 'Doctor verification status changed: ID 9928 → VERIFIED' },
             { time: '17:46:02', level: 'ERROR', event: 'Failed to send OTP to email: user@wrongdomain.com' },
             { time: '17:47:10', level: 'INFO', event: 'System health check: All services operational' },
           ].map((log, i) => (
             <div key={i} className="flex gap-4 group">
               <span className="text-gray-500 shrink-0">[{log.time}]</span>
               <span className={`font-black shrink-0 ${
                 log.level === 'INFO' ? 'text-blue-400' : 
                 log.level === 'WARN' ? 'text-yellow-400' :
                 log.level === 'ERROR' ? 'text-red-400' : 'text-purple-400'
               }`}>{log.level}</span>
               <span className="text-gray-300 group-hover:text-white transition-colors">{log.event}</span>
             </div>
           ))}
           <div className="animate-pulse flex gap-2 items-center">
             <div className="w-2 h-4 bg-admin"></div>
             <span className="text-admin-light opacity-40">Listening for new events...</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
