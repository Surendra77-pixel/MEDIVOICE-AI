import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const SOAPNotePanel = ({ transcript, soapNote, setSoapNote }) => {
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reading, setReading] = useState(false);
  const [summary, setSummary] = useState('');

  const generateSOAP = async () => {
    if (!transcript || transcript.length === 0) {
      toast.error("No transcript available to generate SOAP note.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/analyze', { transcript });
      if (res.data?.data?.soap) {
        setSoapNote(res.data.data.soap);
        toast.success("SOAP note generated successfully.");
      }
    } catch (err) {
      toast.error("Failed to generate SOAP note.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadNote = async () => {
    if (!soapNote) return;
    setReading(true);
    try {
      // Create a simplified text block to summarize and read aloud
      const textBlock = `Subjective: ${soapNote.subjective}. Objective: ${soapNote.objective}. Assessment: ${soapNote.assessment}. Plan: ${soapNote.plan}`;
      // Here we could call summarizeSOAPNote if we wanted, but we can also just use the raw text for TTS
      const utterance = new SpeechSynthesisUtterance("Here is the clinical summary. " + textBlock);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setReading(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(err);
      setReading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!soapNote) return;
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('MediVoice AI — Clinical Note', 20, 20);
      doc.setFontSize(11);
      const content = `Subjective:\n${soapNote.subjective || ''}\n\nObjective:\n${soapNote.objective || ''}\n\nAssessment:\n${soapNote.assessment || ''}\n\nPlan:\n${soapNote.plan || ''}`;
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, 35);
      doc.save('SOAP_Note.pdf');
    });
  };

  const handleSpeech = () => {
    if (!soapNote) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = `
      Subjective: ${soapNote.subjective || 'None'}
      Objective: ${soapNote.objective || 'None'}
      Assessment: ${soapNote.assessment || 'None'}
      Plan: ${soapNote.plan || 'None'}
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-outline-variant/30 dark:border-white/10 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-on-surface dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">description</span>
            AI Clinical SOAP Note
          </h2>
          <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">Automatically structured from Live Audio</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateSOAP}
            disabled={loading || (transcript && transcript.length === 0)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : <span className="material-symbols-outlined text-sm">auto_awesome</span>}
            {loading ? 'Generating...' : 'Generate SOAP'}
          </button>
          
          {soapNote && (
            <>
              <button 
                onClick={handleReadNote}
                disabled={reading}
                className={`px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  reading ? 'bg-red-500 text-white' : 'bg-secondary/20 text-secondary dark:text-sky-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{reading ? 'stop_circle' : 'volume_up'}</span>
                {reading ? 'Reading...' : 'Listen'}
              </button>
              
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Download PDF
              </button>
            </>
          )}
        </div>
      </div>

      {soapNote && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {['subjective', 'objective', 'assessment', 'plan'].map(field => (
            <div key={field} className="bg-black/20 p-4 rounded-xl border border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">{field}</h3>
              <textarea
                className="w-full bg-transparent border border-white/5 focus:border-primary/50 focus:ring-0 text-sm text-on-surface dark:text-gray-300 rounded-lg p-3 min-h-[80px]"
                value={soapNote[field] || ''}
                onChange={(e) => setSoapNote({ ...soapNote, [field]: e.target.value })}
                placeholder={`AI will generate ${field} here...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SOAPNotePanel;
