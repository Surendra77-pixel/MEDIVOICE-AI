const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');

// ─── Get Doctor Profile ──────────────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  let doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) {
    // Auto-create for backward compatibility with old users
    doctor = await Doctor.create({ 
      userId: req.user._id,
      specialty: 'General Practice',
      experience: 0,
      consultationFee: 500
    });
  }
  const user = await User.findById(req.user._id);
  return apiResponse.success(res, { ...doctor.toJSON(), user }, 'Doctor profile fetched');
});

// ─── Update Doctor Profile ───────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['clinicName', 'clinicAddress', 'consultationFee', 'languagesSpoken', 'availability', 'subSpecialty'];
  const updates = {};
  allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const doctor = await Doctor.findOneAndUpdate(
    { userId: req.user._id }, updates,
    { new: true, runValidators: true }
  );
  if (!doctor) return apiResponse.error(res, 'Doctor profile not found', 404);
  return apiResponse.success(res, doctor, 'Profile updated');
});

// ─── Get Patient Queue (Today's appointments) ───────────────────────────────
const getPatientQueue = asyncHandler(async (req, res) => {
  const day = req.query.day || 'today';
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  if (day === 'tomorrow') {
    startDate.setDate(startDate.getDate() + 1);
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const appointments = await Appointment.find({
    doctorId: req.user._id,
    scheduledAt: { $gte: startDate, $lt: endDate },
    status: { $in: ['confirmed', 'in_progress'] }
  })
    .populate('patientId', 'firstName lastName email')
    .sort({ patientRiskLevel: -1, scheduledAt: 1 });

  // Enrich with patient profile data
  const enriched = await Promise.all(appointments.map(async (apt) => {
    const patient = await Patient.findOne({ userId: apt.patientId._id });
    const prescriptionCount = await Prescription.countDocuments({ patientId: apt.patientId._id, isActive: true });
    return {
      ...apt.toJSON(),
      patientProfile: patient ? {
        riskLevel: patient.currentRiskLevel,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions,
        prescriptionCount
      } : { prescriptionCount }
    };
  }));

  return apiResponse.success(res, enriched, 'Patient queue fetched');
});

// ─── Start Consultation ──────────────────────────────────────────────────────
const startConsultation = asyncHandler(async (req, res) => {
  const { appointmentId, patientLanguage, doctorLanguage } = req.body;
  if (!appointmentId) return apiResponse.error(res, 'appointmentId is required', 400);

  const appointment = await Appointment.findOne({ _id: appointmentId, doctorId: req.user._id });
  if (!appointment) return apiResponse.error(res, 'Appointment not found', 404);
  if (appointment.status === 'completed') return apiResponse.error(res, 'Appointment already completed', 400);

  // Check for existing consultation
  let consultation = await Consultation.findOne({ appointmentId });
  if (consultation) {
    return apiResponse.success(res, consultation, 'Consultation already exists');
  }

  consultation = await Consultation.create({
    appointmentId,
    patientId: appointment.patientId,
    doctorId: req.user._id,
    patientLanguage: patientLanguage || 'hi',
    doctorLanguage: doctorLanguage || 'en',
    status: 'active',
    startedAt: new Date()
  });

  appointment.status = 'in_progress';
  appointment.consultationId = consultation._id;
  await appointment.save();

  return apiResponse.success(res, consultation, 'Consultation started', 201);
});

// ─── Add Transcript Line ─────────────────────────────────────────────────────
const addTranscriptLine = asyncHandler(async (req, res) => {
  const { consultationId, speaker, originalText, translatedText, originalLang, targetLang } = req.body;

  const consultation = await Consultation.findOne({ 
    $or: [{ _id: consultationId }, { appointmentId: consultationId }],
    doctorId: req.user._id 
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

// ─── Save SOAP Note ──────────────────────────────────────────────────────────
const saveSoapNote = asyncHandler(async (req, res) => {
  const { consultationId, soapNote } = req.body;

  const consultation = await Consultation.findOne({ _id: consultationId, doctorId: req.user._id });
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);

  consultation.soapNote = { ...soapNote, doctorConfirmed: true, confirmedAt: new Date() };
  await consultation.save();

  return apiResponse.success(res, consultation.soapNote, 'SOAP note saved');
});

// ─── Save Manual Note (Standalone) ───────────────────────────────────────────
const saveManualNote = asyncHandler(async (req, res) => {
  const { guestPatientName, guestAge, guestGender, soapNote, transcript } = req.body;

  const consultation = await Consultation.create({
    doctorId: req.user._id,
    guestPatientName: guestPatientName || 'Unknown Patient',
    guestAge,
    guestGender,
    soapNote: { ...soapNote, aiGenerated: false, doctorConfirmed: true, confirmedAt: new Date() },
    transcript: transcript || [],
    status: 'completed',
    startedAt: new Date(),
    completedAt: new Date(),
    actualDurationMinutes: 15
  });

  // Update doctor stats
  await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    { $inc: { totalConsultations: 1, totalPatientsServed: 1 } }
  );

  return apiResponse.success(res, consultation, 'Manual note saved successfully', 201);
});

// ─── Update Consultation Language ─────────────────────────────────────────────
const updateConsultationLanguage = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;
  const { doctorLanguage } = req.body;

  const consultation = await Consultation.findOne({ _id: consultationId, doctorId: req.user._id });
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);

  if (doctorLanguage) {
    consultation.doctorLanguage = doctorLanguage;
    await consultation.save();
  }

  return apiResponse.success(res, { doctorLanguage: consultation.doctorLanguage }, 'Language updated');
});

// ─── End Consultation ────────────────────────────────────────────────────────
const endConsultation = asyncHandler(async (req, res) => {
  const { consultationId } = req.params;

  const consultation = await Consultation.findOne({ _id: consultationId, doctorId: req.user._id });
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);

  consultation.status = 'completed';
  consultation.completedAt = new Date();
  if (consultation.startedAt) {
    consultation.actualDurationMinutes = Math.round((consultation.completedAt - consultation.startedAt) / 60000);
  }
  await consultation.save();

  // Update appointment status
  await Appointment.findByIdAndUpdate(consultation.appointmentId, { status: 'completed' });

  // Update doctor stats
  await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    { $inc: { totalConsultations: 1, totalPatientsServed: 1 } }
  );

  return apiResponse.success(res, consultation, 'Consultation completed');
});

// ─── Get Consultation Details ────────────────────────────────────────────────
const getConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findOne({ 
    $or: [{ _id: req.params.id }, { appointmentId: req.params.id }],
    doctorId: req.user._id 
  })
    .populate('patientId', 'firstName lastName email');
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);
  return apiResponse.success(res, consultation, 'Consultation fetched');
});

// ─── Get Doctor Dashboard Stats ──────────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayAppointments, totalPatients, totalConsultations, doctor, recentConsultations, urgentAlerts] = await Promise.all([
    Appointment.find({ 
      doctorId, 
      scheduledAt: { $gte: today, $lt: tomorrow }, 
      status: { $in: ['confirmed', 'in_progress'] } 
    }).populate('patientId', 'firstName lastName email'),
    Appointment.distinct('patientId', { doctorId }).then(ids => ids.length),
    Consultation.countDocuments({ doctorId, status: 'completed' }),
    Doctor.findOne({ userId: doctorId }),
    Consultation.find({ doctorId, status: 'completed' }).sort({ completedAt: -1 }).limit(5)
      .populate('patientId', 'firstName lastName'),
    Appointment.find({
      doctorId,
      patientRiskLevel: 'RED',
      status: { $in: ['confirmed', 'in_progress'] }
    }).populate('patientId', 'firstName lastName email').limit(3)
  ]);

  const enrichedAppointments = await Promise.all(todayAppointments.map(async (apt) => {
    const prescriptionCount = await Prescription.countDocuments({ patientId: apt.patientId._id, isActive: true });
    return {
      ...apt.toJSON(),
      prescriptionCount
    };
  }));

  return apiResponse.success(res, {
    todayAppointmentsCount: todayAppointments.length,
    todayAppointments: enrichedAppointments,
    totalPatients,
    completedConsultationsCount: totalConsultations,
    queueCount: todayAppointments.length,
    rating: doctor?.rating || 0,
    recentConsultations,
    urgentAlerts,
    aiInsights: [
      {
        id: 'opt_1',
        type: 'schedule_optimization',
        title: 'AI Smart Schedule',
        message: 'Based on predicted consultation durations, we recommend optimizing your afternoon slot for <b>Arthur Morgan</b>.',
        actionLabel: 'Optimize',
        patientName: 'Arthur Morgan'
      }
    ]
  }, 'Dashboard stats fetched');
});

// ─── Get Doctor Analytics ────────────────────────────────────────────────────
const getAnalytics = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const consultationsPerDay = await Consultation.aggregate([
    { $match: { doctorId: doctorId, completedAt: { $gte: thirtyDaysAgo }, status: 'completed' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const riskDistribution = await Appointment.aggregate([
    { $match: { doctorId } },
    { $group: { _id: '$patientRiskLevel', count: { $sum: 1 } } }
  ]);

  const doctor = await Doctor.findOne({ userId: doctorId });

  return apiResponse.success(res, {
    consultationsPerDay,
    riskDistribution,
    totalRevenue: (doctor?.totalConsultations || 0) * (doctor?.consultationFee || 0),
    averageRating: doctor?.rating || 0,
    consultationFee: doctor?.consultationFee || 800
  }, 'Analytics fetched');
});

// ─── Get All Completed Consultations ───────────────────────────────────────
const getAllConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({ 
    doctorId: req.user._id, 
    status: 'completed' 
  })
  .populate('patientId', 'firstName lastName email')
  .sort({ completedAt: -1 });

  return apiResponse.success(res, consultations, 'All consultations fetched');
});

// ─── Get Single Patient Details ──────────────────────────────────────────────
const getPatientDetails = asyncHandler(async (req, res) => {
  const patientId = req.params.patientId;
  const patientUser = await User.findById(patientId);
  if (!patientUser) return apiResponse.error(res, 'Patient not found', 404);

  const patientProfile = await Patient.findOne({ userId: patientId });
  const pastConsultations = await Consultation.find({ patientId: patientId, status: 'completed' })
    .populate('doctorId', 'firstName lastName')
    .sort({ completedAt: -1 });
  const prescriptions = await Prescription.find({ patientId: patientId, isActive: true })
    .populate('doctorId', 'firstName lastName');

  return apiResponse.success(res, {
    user: patientUser,
    profile: patientProfile,
    pastConsultations,
    prescriptions
  }, 'Patient details fetched');
});

module.exports = {
  getProfile, updateProfile, getPatientQueue,
  startConsultation, addTranscriptLine, saveSoapNote, updateConsultationLanguage,
  endConsultation, getConsultation, getDashboardStats, getAnalytics,
  getAllConsultations, getPatientDetails, saveManualNote
};
