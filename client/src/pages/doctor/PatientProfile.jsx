import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  User, Activity, FileText, Pill, Calendar, 
  ArrowLeft, Phone, Mail, Droplet, Weight, Ruler, ChevronRight 
} from 'lucide-react';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await api.get(`/doctor/patient/${id}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load patient profile');
        navigate('/doctor/queue');
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-doctor"></div>
      </div>
    );
  }

  if (!data) return null;

  const { user, profile, pastConsultations, prescriptions } = data;

  const riskColors = {
    GREEN: 'bg-green-100 text-green-700 border-green-200',
    YELLOW: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    RED: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-doctor transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Queue
        </button>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${riskColors[profile?.currentRiskLevel || 'GREEN']}`}>
          {profile?.currentRiskLevel || 'Standard'} Risk
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographics & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-doctor/5 rounded-bl-full -z-10"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-50 text-doctor rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                  <span className="px-3 py-1 bg-doctor text-white text-[10px] font-black rounded-full shadow-lg shadow-blue-100 flex items-center gap-1">
                    <Pill className="h-3 w-3" /> {prescriptions?.length || 0} TOTAL RX
                  </span>
                </div>
                <p className="text-gray-500">Patient ID: #{user?._id?.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" /> {user?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" /> {user?.phoneNumber || 'Not provided'}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                <Droplet className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Blood Group</p>
                  <p className="font-bold text-gray-900">{profile?.bloodGroup || 'O+'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">DOB</p>
                  <p className="font-bold text-gray-900">{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-doctor" /> Clinical Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Chronic Conditions</p>
                {profile?.chronicConditions?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.chronicConditions.map(cond => (
                      <span key={cond} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                        {cond}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No reported chronic conditions</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Allergies</p>
                {profile?.allergies?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map(allergy => (
                      <span key={allergy} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No known allergies</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History & Meds */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-doctor" /> Past Consultations
              </h3>
            </div>
            
            <div className="space-y-3">
              {pastConsultations?.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No past consultations found.</div>
              ) : (
                pastConsultations?.slice(0, 3).map(consult => (
                  <div key={consult._id} className="p-4 rounded-xl border border-gray-100 hover:border-doctor/20 hover:bg-blue-50/20 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-gray-900">
                        {consult.soapNote?.assessment?.probableDiagnosis || 'Routine Consultation'}
                      </p>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {consult.completedAt ? new Date(consult.completedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {consult.soapNote?.subjective?.chiefComplaint || 'Follow-up visit regarding previous symptoms.'}
                    </p>
                    <button 
                      onClick={() => setSelectedNote(consult)}
                      className="text-[10px] font-black text-doctor uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Clinical Summary <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Pill className="h-5 w-5 text-doctor" /> Active Prescriptions
              </h3>
              <div className="space-y-3">
               {prescriptions?.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No active prescriptions.</div>
              ) : (
                <div className="space-y-4">
                  {prescriptions?.map(rx => (
                    <div key={rx._id} className="space-y-2">
                      {rx.medications?.map((med, idx) => (
                        <div key={`${rx._id}-${idx}`} className="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-white hover:border-doctor/20 transition-colors">
                          <div>
                            <div className="font-bold text-gray-900">{med.drugName}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {med.dose} • {med.frequency} • {med.duration}
                            </div>
                            {med.instructions && (
                              <p className="text-[10px] text-doctor font-bold mt-1 uppercase tracking-wider italic">
                                Note: {med.instructions}
                              </p>
                            )}
                          </div>
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-black border border-green-100 uppercase">
                            {med.route}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-doctor text-white">
              <div>
                <h3 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm opacity-80">Consultation Date: {selectedNote.completedAt ? new Date(selectedNote.completedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <button 
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <ChevronRight className="h-6 w-6 rotate-90" />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {[
                { label: 'Subjective', data: selectedNote.soapNote?.subjective?.chiefComplaint },
                { label: 'Objective', data: selectedNote.soapNote?.objective?.doctorObservations?.[0] },
                { label: 'Assessment', data: selectedNote.soapNote?.assessment?.probableDiagnosis },
                { label: 'Plan', data: selectedNote.soapNote?.plan?.followUpInstructions }
              ].map(section => (
                <div key={section.label} className="space-y-2">
                  <h5 className="text-xs font-black uppercase tracking-widest text-doctor">{section.label}</h5>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                    {section.data || 'No data recorded for this section.'}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedNote(null)}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95"
              >
                Close Profile Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
