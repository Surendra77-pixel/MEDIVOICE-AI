import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { toast } from 'react-hot-toast';
import { 
  UserCheck, 
  UserX, 
  ExternalLink, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';

const DoctorVerification = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors/unverified');
      if (res.data.success) {
        setPendingDoctors(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load pending doctor verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleVerify = async (doctorId, approved) => {
    try {
      const res = await api.patch(`/admin/doctors/${doctorId}/verify`, { approved });
      
      if (res.data.success) {
        toast.success(approved ? 'Doctor approved successfully' : 'Doctor application rejected');
        fetchPendingDoctors();
      }
    } catch (err) {
      toast.error('Failed to update doctor verification status');
    }
  };

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Doctor Verification Queue</h1>
          <p className="text-gray-500 font-medium text-sm">Review medical registrations and verify credentials before platform onboarding.</p>
        </div>
        <div className="bg-admin-dark text-white px-6 py-4 rounded-3xl flex items-center gap-4 shadow-2xl">
          <AlertCircle className="h-6 w-6 text-admin-light" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Action Required</p>
            <p className="text-sm font-black">{pendingDoctors.length} Doctors Pending</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-gray-100">
          <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">All Caught Up!</h3>
          <p className="text-gray-500 mt-2">There are no pending doctor verifications at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {pendingDoctors.map((doctor) => {
            const user = doctor.userId || {};
            const fullName = `Dr. ${user.firstName || 'Unknown'} ${user.lastName || ''}`;
            const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

            return (
              <div key={doctor._id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center font-black text-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{fullName}</h3>
                        <p className="text-sm font-bold text-blue-600 flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" /> {doctor.specialization || 'General Practitioner'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Registration</p>
                        <p className="text-sm font-black text-gray-800 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" /> {doctor.medicalLicenseNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                        <p className="text-sm font-black text-gray-800 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-400" /> {doctor.experienceYears || 0} Years
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consultation Fee</p>
                        <p className="text-sm font-black text-gray-800 flex items-center gap-2">
                          <span className="font-mono text-gray-400">$</span> {doctor.consultationFee || 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Status</p>
                        <p className="text-sm font-black text-orange-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Awaiting Review
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-gray-50 pt-8">
                    <button 
                      onClick={() => handleVerify(doctor._id, true)}
                      className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                    >
                      <UserCheck className="h-5 w-5" /> Approve & Verify
                    </button>
                    <button 
                      onClick={() => handleVerify(doctor._id, false)}
                      className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <UserX className="h-5 w-5" /> Reject Application
                    </button>
                  </div>
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-700 blur-2xl pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Policy Reminder */}
      <div className="bg-admin-light p-8 rounded-[32px] border border-admin border-opacity-10 flex items-start gap-6">
         <ShieldCheck className="h-8 w-8 text-admin shrink-0" />
         <div>
           <h4 className="font-black text-admin-dark mb-1">Verification Standards</h4>
           <p className="text-sm text-admin-dark opacity-70 leading-relaxed font-medium">Please ensure medical registration numbers are cross-referenced with the NMC/MCI database. Verifying a doctor grants them prescription-writing privileges on the platform. All actions in this queue are recorded in the Root Admin Audit Trail.</p>
         </div>
      </div>
    </div>
  );
};

export default DoctorVerification;
