const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    // ── Link to User ───────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true, // 1-to-1: one patient profile per user
    },

    // ── Demographics ───────────────────────────────────────────────────────
    dateOfBirth: {
      type: Date,
      validate: {
        validator: (dob) => !dob || dob < new Date(),
        message: 'Date of birth must be in the past',
      },
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other', 'prefer_not_to_say'],
        message: 'Invalid gender value',
      },
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        message: 'Invalid blood group',
      },
    },
    address: {
      street: { type: String, trim: true },
      area: { type: String, trim: true },
      pincode: { type: String, match: [/^\d{6}$/, 'Pincode must be 6 digits'] },
    },

    // ── Medical Background ─────────────────────────────────────────────────
    allergies: {
      type: [String],
      default: [],
    },
    chronicConditions: {
      type: [String],
      default: [],
    },
    currentMedications: {
      type: [String],
      default: [],
    },

    // ── Emergency Contact ──────────────────────────────────────────────────
    emergencyContact: {
      name: { type: String, trim: true },
      phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Invalid emergency contact number'],
      },
      relation: {
        type: String,
        enum: ['spouse', 'parent', 'sibling', 'child', 'friend', 'other'],
      },
    },

    // ── AI Risk State ──────────────────────────────────────────────────────
    currentRiskLevel: {
      type: String,
      enum: ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN',
    },
    riskCondition: {
      type: String,
    },
    lastRiskAssessedAt: {
      type: Date,
    },

    // ── Statistics ─────────────────────────────────────────────────────────
    totalConsultations: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAppointments: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: Age computed from dateOfBirth ─────────────────────────────────
PatientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// ── Indexes ────────────────────────────────────────────────────────────────
PatientSchema.index({ userId: 1 });
PatientSchema.index({ currentRiskLevel: 1 });
PatientSchema.index({ 'emergencyContact.phone': 1 });

module.exports = mongoose.model('Patient', PatientSchema);
