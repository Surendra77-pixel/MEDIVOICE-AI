const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');
const fs = require('fs');
const path = require('path');

// ─── Get or Create Patient Profile ──────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  let patient = await Patient.findOne({ userId: req.user._id });
  if (!patient) {
    patient = await Patient.create({ userId: req.user._id });
  }
  const user = await User.findById(req.user._id);
  return apiResponse.success(res, { ...patient.toJSON(), user }, 'Patient profile fetched');
});

// ─── Update Patient Profile ──────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { dateOfBirth, gender, bloodGroup, address, allergies, chronicConditions, currentMedications, emergencyContact } = req.body;

  let patient = await Patient.findOneAndUpdate(
    { userId: req.user._id },
    { dateOfBirth, gender, bloodGroup, address, allergies, chronicConditions, currentMedications, emergencyContact },
    { new: true, upsert: true, runValidators: true }
  );

  return apiResponse.success(res, patient, 'Profile updated successfully');
});

// ─── Book Appointment ────────────────────────────────────────────────────────
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, scheduledAt, chiefComplaint, durationMinutes, triageData } = req.body;

  if (!doctorId || !scheduledAt || !chiefComplaint) {
    return apiResponse.error(res, 'doctorId, scheduledAt, and chiefComplaint are required', 400);
  }

  const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
  if (!doctor) return apiResponse.error(res, 'Doctor not found', 404);

  // Check for conflicts
  const conflict = await Appointment.findOne({
    doctorId,
    scheduledAt: new Date(scheduledAt),
    status: { $in: ['confirmed', 'in_progress'] }
  });
  if (conflict) return apiResponse.error(res, 'This time slot is already booked', 409);

  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId,
    scheduledAt: new Date(scheduledAt),
    chiefComplaint,
    durationMinutes: durationMinutes || 30,
    triageData,
    status: 'confirmed'
  });

  await Patient.findOneAndUpdate(
    { userId: req.user._id },
    { $inc: { totalAppointments: 1 } },
    { upsert: true }
  );

  return apiResponse.success(res, appointment, 'Appointment booked successfully', 201);
});

// ─── Get Patient Appointments ────────────────────────────────────────────────
const getAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { patientId: req.user._id };
  if (status) query.status = status;

  const appointments = await Appointment.find(query)
    .populate('doctorId', 'firstName lastName email')
    .sort({ scheduledAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Appointment.countDocuments(query);
  return apiResponse.success(res, { appointments, total, page: parseInt(page) }, 'Appointments fetched');
});

// ─── Cancel Appointment ──────────────────────────────────────────────────────
const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const appointment = await Appointment.findOne({ _id: id, patientId: req.user._id });
  if (!appointment) return apiResponse.error(res, 'Appointment not found', 404);
  if (['completed', 'cancelled'].includes(appointment.status)) {
    return apiResponse.error(res, 'Cannot cancel this appointment', 400);
  }

  appointment.status = 'cancelled';
  appointment.cancelReason = reason || 'Patient cancelled';
  appointment.cancelledBy = 'patient';
  appointment.cancelledAt = new Date();
  await appointment.save();

  return apiResponse.success(res, appointment, 'Appointment cancelled');
});

// Helper to load locally saved translator reports from server disk for a specific patient
const getSavedReportsForUser = (firstName) => {
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) return [];
  
  try {
    const files = fs.readdirSync(reportsDir);
    const userFirstName = (firstName || '').toLowerCase();
    
    return files
      .filter(file => {
        if (!file.startsWith('Report_') || !file.endsWith('.txt')) return false;
        const parts = file.split('_');
        const nameInFile = (parts[1] || '').toLowerCase();
        return nameInFile.includes(userFirstName) || userFirstName.includes(nameInFile);
      })
      .map(file => {
        const filePath = path.join(reportsDir, file);
        const stats = fs.statSync(filePath);
        const parts = file.split('_');
        const patientName = parts[1] || 'Patient';
        
        return {
          _id: file, // Use filename as _id
          filename: file,
          isReport: true,
          createdAt: stats.birthtime,
          reason: `Live Translation Consultation`,
          doctorId: {
            firstName: 'MediVoice',
            lastName: 'AI'
          },
          soapNote: {
            subjective: {
              chiefComplaint: `Voice session saved to disk.`
            },
            assessment: {
              probableDiagnosis: `Live translation consultation saved locally.`
            },
            plan: {
              followUpInstructions: `Patient Name: ${patientName}`
            }
          }
        };
      });
  } catch (err) {
    console.error("Error reading saved reports:", err);
    return [];
  }
};

// ─── Get Medical History (Consultations) ────────────────────────────────────
const getMedicalHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const dbConsultations = await Consultation.find({ patientId: req.user._id })
    .populate('doctorId', 'firstName lastName')
    .populate('prescriptionId')
    .sort({ createdAt: -1 });

  const user = await User.findById(req.user._id);
  const savedReports = getSavedReportsForUser(user?.firstName || '');

  // Merge database consultations and locally saved reports
  let merged = [...dbConsultations, ...savedReports];
  // Sort by createdAt descending
  merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = merged.length;
  // Apply pagination
  const paginated = merged.slice((page - 1) * limit, page * limit);

  return apiResponse.success(res, { consultations: paginated, total, page: parseInt(page) }, 'Medical history fetched');
});

// ─── Get Patient Prescriptions ──────────────────────────────────────────────
const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({ patientId: req.user._id })
    .populate('doctorId', 'firstName lastName')
    .sort({ issuedAt: -1 });
  return apiResponse.success(res, prescriptions, 'Prescriptions fetched');
});

// ─── Search Doctors ──────────────────────────────────────────────────────────
const searchDoctors = asyncHandler(async (req, res) => {
  const { city, specialty, page = 1, limit = 12 } = req.query;
  const query = { isVerified: true };
  if (city) query.city = city;
  if (specialty) query.specialty = { $regex: specialty, $options: 'i' };

  const doctors = await Doctor.find(query)
    .populate('userId', 'firstName lastName email')
    .sort({ rating: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Doctor.countDocuments(query);
  return apiResponse.success(res, { doctors, total, page: parseInt(page) }, 'Doctors fetched');
});

// ─── Get Dashboard Stats ─────────────────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const patientId = req.user._id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUpcoming, upcomingAppointmentsRaw, completedConsultationsRaw, patient] = await Promise.all([
    Appointment.countDocuments({ patientId, status: 'confirmed', scheduledAt: { $gte: today } }),
    Appointment.find({ patientId, status: 'confirmed', scheduledAt: { $gte: today } })
      .populate('doctorId', 'firstName lastName')
      .sort({ scheduledAt: 1 })
      .limit(10),
    Consultation.find({ patientId, status: 'completed' })
      .populate('doctorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5),
    Patient.findOne({ userId: patientId })
  ]);

  // Fetch Doctor profiles for upcoming appointments to get specialty and city
  const upcomingDoctorIds = upcomingAppointmentsRaw.map(app => app.doctorId?._id).filter(Boolean);
  const upcomingDoctorProfiles = await Doctor.find({ userId: { $in: upcomingDoctorIds } });
  
  const upcomingAppointments = upcomingAppointmentsRaw.map(app => {
    const appObj = app.toJSON();
    const profile = upcomingDoctorProfiles.find(p => p.userId.toString() === app.doctorId?._id?.toString());
    if (appObj.doctorId) {
      appObj.doctorId.specialty = profile?.specialty || 'General Physician';
      appObj.doctorId.city = profile?.city || '';
    }
    return appObj;
  });

  // Fetch Doctor profiles for completed consultations
  const completedDoctorIds = completedConsultationsRaw.map(c => c.doctorId?._id).filter(Boolean);
  const completedDoctorProfiles = await Doctor.find({ userId: { $in: completedDoctorIds } });
  
  const recentConsultations = completedConsultationsRaw.map(c => {
    const cObj = c.toJSON();
    const profile = completedDoctorProfiles.find(p => p.userId.toString() === c.doctorId?._id?.toString());
    if (cObj.doctorId) {
      cObj.doctorId.specialty = profile?.specialty || 'General Physician';
      cObj.doctorId.city = profile?.city || '';
    }
    return cObj;
  });

  // Load and merge local reports
  const user = await User.findById(patientId);
  const savedReports = getSavedReportsForUser(user?.firstName || '');
  let mergedConsultations = [...recentConsultations, ...savedReports];
  mergedConsultations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  mergedConsultations = mergedConsultations.slice(0, 5);

  return apiResponse.success(res, {
    totalAppointments: totalUpcoming,
    upcomingAppointments,
    recentConsultations: mergedConsultations,
    completedConsultations: completedConsultationsRaw.length + savedReports.length,
    currentRiskLevel: patient?.currentRiskLevel || 'GREEN'
  }, 'Dashboard stats fetched');
});

// ─── Get Consultation Details (For Patients) ───────────────────────────────
const getConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findOne({ 
    $or: [{ _id: req.params.id }, { appointmentId: req.params.id }],
    patientId: req.user._id 
  })
    .populate('patientId', 'firstName lastName email')
    .populate('doctorId', 'firstName lastName email');
  
  if (!consultation) {
    const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user._id })
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName email');
    
    if (appointment) {
      return apiResponse.success(res, {
        _id: 'waiting',
        appointmentId: appointment._id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        status: 'waiting',
        transcript: [],
        soapNote: {}
      }, 'Waiting for doctor to start consultation');
    }
    return apiResponse.error(res, 'Consultation not found', 404);
  }
  return apiResponse.success(res, consultation, 'Consultation fetched');
});

// ─── Add Transcript Line (For Patients) ──────────────────────────────────────
const addTranscriptLine = asyncHandler(async (req, res) => {
  const { consultationId, speaker, originalText, translatedText, originalLang, targetLang } = req.body;

  const consultation = await Consultation.findOne({ 
    $or: [{ _id: consultationId }, { appointmentId: consultationId }],
    patientId: req.user._id 
  });
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);

  const newLine = {
    speaker, originalText, translatedText, originalLang, targetLang,
    timestamp: new Date()
  };
  consultation.transcript.push(newLine);
  await consultation.save();

  // Emit to socket room
  notificationService.broadcastToRoom(`consultation_${consultation._id}`, 'new_transcript', newLine);

  return apiResponse.success(res, { lineCount: consultation.transcript.length }, 'Transcript line added');
});

// ─── Update Consultation Language ─────────────────────────────────────────────
const updateConsultationLanguage = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { patientLanguage } = req.body;

  const consultation = await Consultation.findOne({ 
    $or: [{ _id: consultationId }, { appointmentId: consultationId }],
    patientId: req.user._id 
  });
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);

  if (patientLanguage) {
    consultation.patientLanguage = patientLanguage;
    await consultation.save();
  }

  return apiResponse.success(res, { patientLanguage: consultation.patientLanguage }, 'Language updated');
});

module.exports = {
  getProfile,
  updateProfile,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getMedicalHistory,
  getPrescriptions,
  searchDoctors,
  getDashboardStats,
  getConsultation,
  addTranscriptLine,
  updateConsultationLanguage
};
