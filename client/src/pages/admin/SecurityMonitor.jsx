import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Lock, Globe, Terminal, AlertTriangle } from 'lucide-react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';

const SecurityMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/security-logs');
        if (res.data.success) {
          setLogs(res.data.data.logs || []);
        }
      } catch (err) {
        toast.error('Failed to load security logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getRiskDetails = (eventType) => {
    switch(eventType) {
      case 'FAILED_LOGIN':
      case 'ACCOUNT_LOCKED':
        return { risk: 'High', color: 'bg-red-100 text-red-600', badge: 'bg-red-600 text-white shadow-lg' };
      case 'PASSWORD_CHANGE':
      case 'ROLE_CHANGE':
        return { risk: 'Medium', color: 'bg-yellow-100 text-yellow-600', badge: 'bg-yellow-500 text-white shadow-md' };
      default:
        return { risk: 'Low', color: 'bg-blue-100 text-blue-600', badge: 'bg-gray-200 text-gray-500' };
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-fade-in w-full">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Security Command Center</h1>
        <p className="text-gray-500 font-medium text-sm">Live threat monitoring and system integrity dashboard.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Live Map Placeholder */}
          <div className="bg-admin-dark h-[400px] rounded-[40px] shadow-2xl relative overflow-hidden flex items-center justify-center border-8 border-white">
            <Globe className="h-40 w-40 text-admin opacity-20 animate-pulse" />
            <div className="absolute top-8 left-8">
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Global Firewall: Active</span>
              </div>
            </div>
            <p className="text-admin-light opacity-40 font-black uppercase tracking-widest text-xs">Live Traffic Visualization</p>
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Activity className="h-6 w-6 text-admin" /> Real-time Security Events
            </h3>
            <div className="space-y-6">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Scanning network...</div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No recent security events detected.</div>
              ) : (
                logs.slice(0, 10).map((log, i) => {
                  const details = getRiskDetails(log.eventType);
                  return (
                    <div key={log._id || i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${details.color}`}>
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{log.eventType.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-400 font-bold">{log.ipAddress || 'Unknown IP'} • {new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${details.badge}`}>
                        {details.risk} Risk
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
             <h3 className="font-black text-gray-900 mb-6">Security Actions</h3>
             <div className="space-y-4">
               <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3">
                 <Lock className="h-5 w-5" /> Force Logout All
               </button>
               <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-100">
                 <AlertTriangle className="h-5 w-5" /> Put System in Maintenance
               </button>
             </div>
           </div>

           <div className="bg-admin-light p-8 rounded-[40px] border border-admin border-opacity-10">
              <Terminal className="h-8 w-8 text-admin mb-4" />
              <h4 className="font-black text-admin-dark mb-2">Automated Rules</h4>
              <ul className="space-y-3">
                {['IP Blacklisting: Active', 'Rate Limiting: 100/15m', 'HSTS Enforced: Yes', 'XSS Filtering: Active'].map(rule => (
                  <li key={rule} className="flex items-center gap-2 text-xs font-bold text-admin-dark opacity-70">
                    <ShieldCheck className="h-4 w-4" /> {rule}
                  </li>
                ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitor;
