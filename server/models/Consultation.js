const mongoose = require('mongoose');

const TranscriptLineSchema = new mongoose.Schema(
  {
    speaker: { type: String, enum: ['Patient', 'Doctor'], required: true },
    originalText: { type: String, required: true },
    translatedText: { type: String },
    originalLang: { type: String }, // BCP-47: 'hi-IN'
    targetLang: { type: String }, // BCP-47: 'ta-IN'
    isRisky: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const RiskEventSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['RED', 'YELLOW'], required: true },
    condition: { type: String },
    triggerText: { type: String },
    timestamp: { type: Date, default: Date.now },
    acknowledgedByDoctor: { type: Boolean, default: false },
  },
  { _id: false }
);

const SOAPNoteSchema = new mongoose.Schema(
  {
    subjective: {
      chiefComplaint: { type: String },
      reportedSymptoms: { type: [String], default: [] },
      symptomDuration: { type: String },
      currentMedications: { type: [String], default: [] },
      relevantHistory: { type: [String], default: [] },
      patientStatements: { type: [String], default: [] },
    },
    objective: {
      doctorObservations: { type: [String], default: [] },
      examinationFindings: { type: [String], default: [] },
      vitalsDiscussed: { type: [String], default: [] },
      investigationsOrdered: { type: [String], default: [] },
    },
    assessment: {
      probableDiagnosis: { type: String },
      differentialDiagnoses: { type: [String], default: [] },
      severity: { type: String },
    },
    plan: {
      prescribedMedications: { type: [String], default: [] },
      investigationsOrdered: { type: [String], default: [] },
      followUpInstructions: { type: String },
      lifestyleAdvice: { type: [String], default: [] },
      referrals: { type: [String], default: [] },
    },
    aiGenerated: { type: Boolean, default: true },
    doctorConfirmed: { type: Boolean, default: false },
    confirmedAt: { type: Date },
    doctorEdited: { type: Boolean, default: false },
  },
  { _id: false }
);

const ConsultationSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────────────
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment reference is required'],
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor reference is required'],
    },

    // ── Languages Used ─────────────────────────────────────────────────────
    patientLanguage: {
      type: String,
      default: 'hi',
      enum: ['en', 'hi', 'ta', 'te', 'ml', 'kn', 'bn'],
    },
    doctorLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'ta', 'te', 'ml', 'kn', 'bn'],
    },

    // ── Patient Consent (required before STT begins) ───────────────────────
    patientConsentGiven: {
      type: Boolean,
      default: false,
    },
    consentTimestamp: {
      type: Date,
    },

    // ── Live Transcript (embedded array) ──────────────────────────────────
    transcript: {
      type: [TranscriptLineSchema],
      default: [],
    },

    // ── AI-Generated SOAP Note (embedded) ─────────────────────────────────
    soapNote: {
      type: SOAPNoteSchema,
      default: () => ({}),
    },

    // ── Risk Events (embedded) ─────────────────────────────────────────────
    riskEvents: {
      type: [RiskEventSchema],
      default: [],
    },

    // ── Consultation Status ────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    actualDurationMinutes: {
      type: Number,
    },

    // ── Linked Output ──────────────────────────────────────────────────────
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound Indexes ───────────────────────────────────────────────────────
ConsultationSchema.index({ patientId: 1, createdAt: -1 });
ConsultationSchema.index({ doctorId: 1, createdAt: -1 });
ConsultationSchema.index({ doctorId: 1, 'soapNote.assessment.probableDiagnosis': 1 });
ConsultationSchema.index({ patientId: 1, status: 1 });

module.exports = mongoose.model('Consultation', ConsultationSchema);
