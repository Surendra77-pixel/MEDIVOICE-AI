import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { 
  Video, 
  Clock, 
  MoreVertical, 
  AlertCircle, 
  User, 
  Search, 
  Filter,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const PatientQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await api.get('/doctor/queue');
        if (res.data.success) {
          setQueue(res.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load patient queue');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const sortedQueue = [...queue]
    .filter(apt => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const patientName = `${apt.patientId?.firstName} ${apt.patientId?.lastName}`.toLowerCase();
      return patientName.includes(term);
    })
    .sort((a, b) => {
      const riskOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const riskA = a.patientRiskLevel || 'low';
      const riskB = b.patientRiskLevel || 'low';
      return (riskOrder[riskA] ?? 3) - (riskOrder[riskB] ?? 3);
    });

  const handleStartConsultation = async (appointmentId) => {
    try {
      const res = await api.post(
        '/doctor/consultation/start',
        { appointmentId }
      );
      if (res.data.success) {
        toast.success('Consultation started');
        navigate(ROUTES.DOCTOR.CONSULTATION.replace(':id', res.data.data._id));
      } else {
        toast.error(res.data.message || 'Failed to start consultation');
      }
    } catch (error) {
      if (error.response?.data?.message === 'Consultation already exists') {
        navigate(ROUTES.DOCTOR.CONSULTATION.replace(':id', error.response.data.data._id));
      } else {
        toast.error('Failed to start consultation');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Live Patient Queue</h1>
          <p className="text-gray-500">Manage your daily appointments and prioritize by risk level.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-gray-100 flex shadow-sm">
          <button className="px-4 py-2 bg-doctor text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200">Today</button>
          <button className="px-4 py-2 text-gray-400 hover:text-gray-600 rounded-xl text-sm font-bold">Tomorrow</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search patient in queue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-doctor focus:border-doctor outline-none text-sm"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
            <Filter className="h-4 w-4" /> Filter by Risk
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">
            <Calendar className="h-4 w-4" /> Go to Date
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
          </div>
        ) : sortedQueue.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-gray-400">
            <User className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-700">Queue is Empty</h3>
            <p className="text-sm">You have no appointments scheduled for today.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Patient</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Risk Level</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Slot Time</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedQueue.map((apt) => {
                const patientName = apt.patientId ? `${apt.patientId.firstName} ${apt.patientId.lastName}` : 'Unknown Patient';
                const initial = patientName.charAt(0);
                const statusStr = apt.status === 'in_progress' ? 'Ready' : 'Waiting';
                const riskLevel = (apt.patientRiskLevel || 'low').toLowerCase();

                return (
                  <tr key={apt._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-doctor-light flex items-center justify-center font-bold text-doctor uppercase">
                          {initial}
                        </div>
                        <Link to={`/doctor/patient/${apt.patientId?._id}`} className="hover:text-doctor hover:underline cursor-pointer block">
                          <h4 className="font-bold text-gray-900">{patientName}</h4>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{apt.notes || 'Routine Checkup'}</p>
                        </Link>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${
                          statusStr === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusStr === 'Ready' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                          {statusStr}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg ${
                          riskLevel === 'high' ? 'bg-red-100 text-red-600' : 
                          riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {riskLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-gray-900">
                        {new Date(apt.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-doctor transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleStartConsultation(apt._id)}
                          className="bg-doctor text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-doctor-dark transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
                        >
                          <Video className="h-4 w-4" /> Start Call
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex items-center gap-4">
        <AlertCircle className="h-6 w-6 text-orange-600 shrink-0" />
        <p className="text-sm text-orange-800">
          <span className="font-bold">Prioritization Tip:</span> The queue is automatically sorted by Risk Level to ensure patients requiring urgent care are seen first, regardless of their slot time.
        </p>
      </div>
    </div>
  );
};

export default PatientQueue;
