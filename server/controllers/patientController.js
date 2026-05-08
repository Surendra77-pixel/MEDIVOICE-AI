const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

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
  const { doctorId, scheduledAt, chiefComplaint, durationMinutes } = req.body;

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

// ─── Get Medical History (Consultations) ────────────────────────────────────
const getMedicalHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const consultations = await Consultation.find({ patientId: req.user._id })
    .populate('doctorId', 'firstName lastName')
    .populate('prescriptionId')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Consultation.countDocuments({ patientId: req.user._id });
  return apiResponse.success(res, { consultations, total, page: parseInt(page) }, 'Medical history fetched');
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

  const [totalAppointments, upcomingAppointments, completedConsultations, patient] = await Promise.all([
    Appointment.countDocuments({ patientId }),
    Appointment.find({ patientId, status: 'confirmed', scheduledAt: { $gte: new Date() } })
      .populate('doctorId', 'firstName lastName')
      .sort({ scheduledAt: 1 })
      .limit(3),
    Consultation.find({ patientId, status: 'completed' })
      .populate('doctorId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5),
    Patient.findOne({ userId: patientId })
  ]);

  return apiResponse.success(res, {
    totalAppointments,
    upcomingAppointments,
    recentConsultations: completedConsultations,
    completedConsultations: completedConsultations.length,
    currentRiskLevel: patient?.currentRiskLevel || 'GREEN'
  }, 'Dashboard stats fetched');
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
  getDashboardStats
};
