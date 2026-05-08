const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Reminder = require('../models/Reminder');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Create Prescription (Doctor Only) ───────────────────────────────────────
const createPrescription = asyncHandler(async (req, res) => {
  const { consultationId, diagnosis, medications, generalInstructions, followUpDate } = req.body;

  if (!consultationId || !diagnosis || !medications?.length) {
    return apiResponse.error(res, 'consultationId, diagnosis, and medications are required', 400);
  }

  const consultation = await Consultation.findOne({ _id: consultationId, doctorId: req.user._id });
  if (!consultation) return apiResponse.error(res, 'Consultation not found', 404);

  // Build doctor snapshot
  const doctorUser = await User.findById(req.user._id);
  const doctorProfile = await Doctor.findOne({ userId: req.user._id });
  const patientUser = await User.findById(consultation.patientId);
  const patientProfile = await Patient.findOne({ userId: consultation.patientId });

  const prescription = await Prescription.create({
    consultationId,
    patientId: consultation.patientId,
    doctorId: req.user._id,
    diagnosis,
    medications,
    generalInstructions,
    followUpDate: followUpDate ? new Date(followUpDate) : undefined,
    doctorSnapshot: {
      name: `${doctorUser.firstName} ${doctorUser.lastName}`,
      specialty: doctorProfile?.specialty || 'General',
      qualifications: doctorProfile?.qualifications || [],
      registrationNumber: doctorProfile?.registrationNumber || '',
      clinicName: doctorProfile?.clinicName || '',
      clinicAddress: doctorProfile?.clinicAddress || '',
      city: doctorProfile?.city || '',
      phone: doctorUser.phone || ''
    },
    patientSnapshot: {
      name: `${patientUser.firstName} ${patientUser.lastName}`,
      age: patientProfile?.age || null,
      gender: patientProfile?.gender || '',
      dateOfBirth: patientProfile?.dateOfBirth || null,
      allergies: patientProfile?.allergies || []
    },
    doctorReviewedAt: new Date()
  });

  // Link prescription to consultation
  consultation.prescriptionId = prescription._id;
  await consultation.save();

  return apiResponse.success(res, prescription, 'Prescription created', 201);
});

// ─── Get Prescription by ID ──────────────────────────────────────────────────
const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patientId', 'firstName lastName email')
    .populate('doctorId', 'firstName lastName email');
  if (!prescription) return apiResponse.error(res, 'Prescription not found', 404);

  // Ensure user has access (patient, doctor, or admin)
  const isOwner = prescription.patientId._id.toString() === req.user._id.toString()
    || prescription.doctorId._id.toString() === req.user._id.toString()
    || req.user.role === 'admin';
  if (!isOwner) return apiResponse.error(res, 'Access denied', 403);

  return apiResponse.success(res, prescription, 'Prescription fetched');
});

// ─── Get Patient Prescriptions ───────────────────────────────────────────────
const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const prescriptions = await Prescription.find({ patientId: req.user._id })
    .populate('doctorId', 'firstName lastName')
    .sort({ issuedAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Prescription.countDocuments({ patientId: req.user._id });
  return apiResponse.success(res, { prescriptions, total, page: parseInt(page) }, 'Prescriptions fetched');
});

// ─── Get Doctor's Issued Prescriptions ───────────────────────────────────────
const getDoctorPrescriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const prescriptions = await Prescription.find({ doctorId: req.user._id })
    .populate('patientId', 'firstName lastName')
    .sort({ issuedAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Prescription.countDocuments({ doctorId: req.user._id });
  return apiResponse.success(res, { prescriptions, total, page: parseInt(page) }, 'Prescriptions fetched');
});

module.exports = {
  createPrescription, getPrescription,
  getPatientPrescriptions, getDoctorPrescriptions
};
