import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { ClipboardList, Search, Filter, FileText, Calendar, ChevronRight } from 'lucide-react';

const ClinicalNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/doctor/consultations');
        if (res.data.success) {
          setNotes(res.data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load clinical notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const patientName = `${note.patientId?.firstName} ${note.patientId?.lastName}`.toLowerCase();
    const diagnosis = note.soapNote?.assessment?.probableDiagnosis?.toLowerCase() || '';
    return patientName.includes(searchTerm.toLowerCase()) || diagnosis.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Clinical Notes Archive</h1>
        <p className="text-gray-500">Access and manage all SOAP notes and patient consultation records.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search notes by patient name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-doctor focus:border-doctor outline-none text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
          <Filter className="h-4 w-4" /> Filter by Date
        </button>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-gray-400">
            <ClipboardList className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-700">No notes found</h3>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-doctor group-hover:text-white transition-colors">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  {note.patientId?.firstName} {note.patientId?.lastName}
                </h4>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(note.completedAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[300px]">
                    <FileText className="h-3 w-3" /> {note.soapNote?.assessment?.probableDiagnosis || 'No diagnosis recorded'}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-300 hover:text-doctor group-hover:bg-blue-50 rounded-lg transition-all">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClinicalNotes;
