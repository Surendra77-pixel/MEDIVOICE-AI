const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema(
  {
    drugName: {
      type: String,
      required: [true, 'Drug name is required'],
      trim: true,
      maxlength: [100, 'Drug name too long'],
    },
    dose: {
      type: String,
      trim: true,
    },
    frequency: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    route: {
      type: String,
      enum: ['oral', 'topical', 'injection', 'inhaled', 'sublingual', 'other'],
      default: 'oral',
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Instructions too long'],
    },
    aiPrefilled: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────────────
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation',
      required: [true, 'Consultation reference is required'],
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

    // ── Clinical Content ───────────────────────────────────────────────────
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
      maxlength: [300, 'Diagnosis too long'],
    },
    medications: {
      type: [MedicationSchema],
      required: [true, 'At least one medication is required'],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'Prescription must have at least one medication',
      },
    },
    generalInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Instructions too long'],
    },
    followUpDate: {
      type: Date,
      validate: {
        validator: (date) => !date || date > new Date(),
        message: 'Follow-up date must be in the future',
      },
    },

    // ── Immutable Snapshots ────────────────────────────────────────────────
    doctorSnapshot: {
      name: { type: String, required: true },
      specialty: { type: String, required: true },
      qualifications: { type: [String] },
      registrationNumber: { type: String },
      clinicName: { type: String },
      clinicAddress: { type: String },
      city: { type: String },
      phone: { type: String },
    },
    patientSnapshot: {
      name: { type: String, required: true },
      age: { type: Number },
      gender: { type: String },
      dateOfBirth: { type: Date },
      allergies: { type: [String] },
    },

    // ── Status ─────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },

    // ── Audit ──────────────────────────────────────────────────────────────
    aiPrefillConfidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    doctorReviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
PrescriptionSchema.index({ patientId: 1, issuedAt: -1 });
PrescriptionSchema.index({ doctorId: 1, issuedAt: -1 });
PrescriptionSchema.index({ consultationId: 1 });
PrescriptionSchema.index({ status: 1, followUpDate: 1 });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
