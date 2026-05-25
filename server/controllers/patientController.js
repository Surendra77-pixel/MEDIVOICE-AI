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
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// ─── AI Prescription Analysis (Gemini Vision) ──────────────────────────────
const analyzePrescription = asyncHandler(async (req, res) => {
  if (!req.file) {
    return apiResponse.error(res, 'No prescription image uploaded', 400);
  }

  // Force-reload .env to ensure the key is always fresh
  require('dotenv').config({ override: true });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return apiResponse.error(res, 'Gemini API key not configured on server', 500);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Convert uploaded buffer to base64 inline part
  const base64Image = req.file.buffer.toString('base64');
  let mimeType = req.file.mimetype || 'image/jpeg';
  const supportedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];
  if (!supportedTypes.includes(mimeType)) {
    mimeType = 'image/jpeg'; // Force unsupported image mimetypes to jpeg so Gemini doesn't reject them
  }

  const prompt = `You are a medical AI assistant. Analyze this prescription image carefully.

Extract ALL of the following information and return ONLY valid JSON (no markdown, no code fences, no extra text):

{
  "doctorName": "Full name of the prescribing doctor (or 'Unknown' if not visible)",
  "doctorSpecialty": "Specialty if visible (or 'General Physician')",
  "patientName": "Patient name if visible (or 'Not specified')",
  "date": "Date on the prescription if visible (or today's date)",
  "medications": [
    {
      "drugName": "Full medication name with strength (e.g., 'Amoxicillin 500mg')",
      "dose": "Dosage per intake (e.g., '1 tablet', '5ml')",
      "frequency": "How often (e.g., 'Twice daily', 'Every 8 hours')",
      "duration": "For how long (e.g., '7 days', '1 month')"
    }
  ],
  "diagnosis": "The condition or diagnosis if mentioned (or 'Not specified')",
  "notes": "Any additional instructions or notes from the doctor"
}

Be thorough. Extract every single medication listed. If the handwriting is unclear, make your best medical interpretation.`;

  // Fallback model chain — tries each model in order until one succeeds
  const MODEL_CHAIN = [
    'gemini-2.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001'
  ];

  let lastError = null;
  for (const modelName of MODEL_CHAIN) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        { inlineData: { mimeType, data: base64Image } }
      ]);

      let rawText = result.response.text();

      // Clean up any markdown code fences the model might add
      rawText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (parseErr) {
        console.error(`Model ${modelName} response was not valid JSON:`, rawText);
        // Try next model
        lastError = new Error('AI could not parse the prescription clearly.');
        continue;
      }

      console.log(`Success with model: ${modelName}`);

      // ── Save to Database so it persists across logins ──────────────
      const Prescription = require('../models/Prescription');
      
      const newPrescription = new Prescription({
        patientId: req.user._id,
        diagnosis: parsed.diagnosis || 'General Checkup',
        doctorSnapshot: {
          name: parsed.doctorName || 'Unknown Doctor',
          specialty: parsed.doctorSpecialty || 'General Physician',
        },
        medications: (parsed.medications || []).map(m => ({
          drugName: m.drugName,
          dose: m.dose,
          frequency: m.frequency,
          duration: m.duration,
          aiPrefilled: true
        })),
        generalInstructions: parsed.notes || '',
        status: 'active'
      });

      const savedPrescription = await newPrescription.save();

      // Return both the raw parsed data and the DB record ID
      return apiResponse.success(res, { 
        ...parsed, 
        _dbId: savedPrescription._id 
      }, 'Prescription analyzed and saved successfully');

    } catch (err) {
      const status = err?.status || (err?.message?.includes('503') ? 503 : 0);
      console.warn(`Model ${modelName} failed (${status}): ${err.message}`);
      lastError = err;
      // Try next model on ANY error, including 404 (model not found), 503, 429, etc.
      // Small delay before next model
      await new Promise(r => setTimeout(r, 800));
    }
  }

  const errMsg = lastError?.message?.includes('parse') 
    ? 'AI could not parse the prescription. Please upload a clearer image.'
    : 'All AI models are currently busy. Please try again in 30 seconds.';
  return apiResponse.error(res, errMsg, 503);
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
  updateConsultationLanguage,
  analyzePrescription
};
