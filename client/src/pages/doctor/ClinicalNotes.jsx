import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { ClipboardList, Search, Filter, FileText, Calendar, ChevronRight } from 'lucide-react';

const ClinicalNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    patientName: '', subjective: '', objective: '', assessment: '', plan: ''
  });
  const [savingNote, setSavingNote] = useState(false);

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

  const handleSaveManualNote = async () => {
    if (!newNote.patientName.trim()) return toast.error("Patient Name is required");
    setSavingNote(true);
    try {
      const payload = {
        guestPatientName: newNote.patientName,
        soapNote: {
          subjective: { chiefComplaint: newNote.subjective },
          objective: { doctorObservations: [newNote.objective] },
          assessment: { probableDiagnosis: newNote.assessment },
          plan: { followUpInstructions: newNote.plan }
        }
      };
      const res = await api.post('/doctor/consultation/manual', payload);
      if (res.data.success) {
        toast.success("Manual Note Saved!");
        setNotes([res.data.data, ...notes]);
        setIsAddingNote(false);
        setNewNote({ patientName: '', subjective: '', objective: '', assessment: '', plan: '' });
      }
    } catch (err) {
      toast.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const patientName = note.patientId ? `${note.patientId.firstName} ${note.patientId.lastName}`.toLowerCase() : (note.guestPatientName?.toLowerCase() || 'unknown patient');
    const diagnosis = note.soapNote?.assessment?.probableDiagnosis?.toLowerCase() || '';
    return patientName.includes(searchTerm.toLowerCase()) || diagnosis.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in relative z-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Clinical Notes Archive</h1>
        <p className="text-gray-500 dark:text-gray-400">Access and manage all SOAP notes and patient consultation records.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Search notes by patient name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl focus:ring-doctor focus:border-doctor outline-none text-sm dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
            <Filter className="h-4 w-4" /> Filter by Date
          </button>
          <button 
            onClick={() => setIsAddingNote(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-doctor text-white rounded-xl text-sm font-bold hover:brightness-110 shadow-lg shadow-doctor/30 transition-all"
          >
            <ClipboardList className="h-4 w-4" /> Add Clinical Note
          </button>
        </div>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[400px] text-gray-400 dark:text-gray-500">
            <ClipboardList className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No notes found</h3>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div 
              key={note._id} 
              onClick={() => setSelectedNote(note)}
              className="bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all flex items-center gap-6 group cursor-pointer active:scale-[0.99]"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-indigo-300 group-hover:bg-doctor group-hover:text-white transition-colors">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {note.patientId ? `${note.patientId.firstName} ${note.patientId.lastName}` : (note.guestPatientName || 'Unknown Patient')}
                </h4>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {note.completedAt ? new Date(note.completedAt).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate max-w-[300px]">
                    <FileText className="h-3 w-3" /> {note.soapNote?.assessment?.probableDiagnosis || 'No diagnosis recorded'}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-300 hover:text-doctor group-hover:bg-blue-50 dark:group-hover:bg-white/10 rounded-lg transition-all">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-transparent dark:border-white/10 overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-doctor text-white">
              <div>
                <h3 className="text-xl font-bold">{selectedNote.patientId ? `${selectedNote.patientId.firstName} ${selectedNote.patientId.lastName}` : selectedNote.guestPatientName}</h3>
                <p className="text-sm opacity-80">Consultation Date: {selectedNote.completedAt ? new Date(selectedNote.completedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <button 
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <ChevronRight className="h-6 w-6 rotate-90" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* SOAP Sections */}
              {[
                { label: 'Subjective', data: selectedNote.soapNote?.subjective?.chiefComplaint },
                { label: 'Objective', data: selectedNote.soapNote?.objective?.doctorObservations?.[0] },
                { label: 'Assessment', data: selectedNote.soapNote?.assessment?.probableDiagnosis },
                { label: 'Plan', data: selectedNote.soapNote?.plan?.followUpInstructions }
              ].map(section => (
                <div key={section.label} className="space-y-2">
                  <h5 className="text-xs font-black uppercase tracking-widest text-doctor dark:text-indigo-300">{section.label}</h5>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 leading-relaxed">
                    {section.data || 'No data recorded for this section.'}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end">
              <button 
                onClick={() => setSelectedNote(null)}
                className="px-6 py-2 bg-gray-900 dark:bg-white/10 text-white dark:text-gray-300 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-white/20 border border-transparent dark:border-white/10 transition-all active:scale-95"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isAddingNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-transparent dark:border-white/10 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-doctor text-white shrink-0">
              <h3 className="text-xl font-bold">New Clinical Note</h3>
              <button 
                onClick={() => setIsAddingNote(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <ChevronRight className="h-6 w-6 rotate-90" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-500 dark:text-gray-400">Patient Name *</label>
                <input 
                  type="text" 
                  value={newNote.patientName} 
                  onChange={e => setNewNote({...newNote, patientName: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-doctor transition-all"
                />
              </div>

              {[
                { label: 'Subjective', key: 'subjective', placeholder: 'Patient symptoms and complaints...' },
                { label: 'Objective', key: 'objective', placeholder: 'Doctor observations, vitals, lab results...' },
                { label: 'Assessment', key: 'assessment', placeholder: 'Probable diagnosis...' },
                { label: 'Plan', key: 'plan', placeholder: 'Prescriptions, advice, follow-up...' }
              ].map(section => (
                <div key={section.key} className="space-y-1">
                  <label className="text-xs font-black uppercase text-doctor dark:text-indigo-300">{section.label}</label>
                  <textarea 
                    value={newNote[section.key]} 
                    onChange={e => setNewNote({...newNote, [section.key]: e.target.value})}
                    placeholder={section.placeholder}
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-doctor transition-all resize-none custom-scrollbar"
                  />
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsAddingNote(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveManualNote}
                disabled={savingNote}
                className="px-6 py-2.5 bg-doctor text-white font-bold rounded-xl hover:brightness-110 shadow-lg shadow-doctor/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalNotes;
