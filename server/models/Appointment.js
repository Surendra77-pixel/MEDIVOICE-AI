const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    // ── Participants ───────────────────────────────────────────────────────
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor reference is required'],
      index: true,
    },

    // ── Timing ─────────────────────────────────────────────────────────────
    scheduledAt: {
      type: Date,
      required: [true, 'Appointment date/time is required'],
      validate: {
        validator: (date) => !date || date > new Date(),
        message: 'Appointment must be scheduled in the future',
      },
    },
    durationMinutes: {
      type: Number,
      default: 30,
      enum: {
        values: [15, 20, 30, 45, 60],
        message: 'Duration must match doctor slot duration setting',
      },
    },
    endAt: {
      type: Date,
    },

    // ── Status Lifecycle ───────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'confirmed',
          'in_progress',
          'completed',
          'cancelled',
          'no_show',
          'rescheduled',
        ],
        message: 'Invalid appointment status',
      },
      default: 'confirmed',
    },

    // ── Clinical Context ───────────────────────────────────────────────────
    chiefComplaint: {
      type: String,
      trim: true,
      maxlength: [500, 'Chief complaint cannot exceed 500 characters'],
    },
    patientRiskLevel: {
      type: String,
      enum: ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN',
    },
    riskCondition: {
      type: String,
    },
    triageData: {
      symptoms: [String],
      analysis: String,
      riskLevel: String
    },

    // ── Cancellation / Reschedule ──────────────────────────────────────────
    cancelReason: {
      type: String,
      trim: true,
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'system'],
    },
    cancelledAt: {
      type: Date,
    },
    rescheduleHistory: [
      {
        previousTime: { type: Date, required: true },
        newTime: { type: Date, required: true },
        changedBy: {
          type: String,
          enum: ['patient', 'doctor'],
        },
        reason: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Notification Tracking ──────────────────────────────────────────────
    reminderSent24h: {
      type: Boolean,
      default: false,
    },
    reminderSent1h: {
      type: Boolean,
      default: false,
    },
    confirmationSent: {
      type: Boolean,
      default: false,
    },

    // ── Linked Consultation ────────────────────────────────────────────────
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultation',
    },
  },
  {
    timestamps: true,
  }
);

// ── Pre-save: Compute endAt ────────────────────────────────────────────────
AppointmentSchema.pre('save', function (next) {
  if (this.scheduledAt && this.durationMinutes) {
    const end = new Date(this.scheduledAt);
    end.setMinutes(end.getMinutes() + this.durationMinutes);
    this.endAt = end;
  }
  if (typeof next === 'function') {
    next();
  }
});

// ── Compound Indexes ───────────────────────────────────────────────────────
AppointmentSchema.index({ patientId: 1, scheduledAt: -1 });
AppointmentSchema.index({ doctorId: 1, scheduledAt: 1 });
AppointmentSchema.index({ doctorId: 1, status: 1 });
AppointmentSchema.index({ scheduledAt: 1, status: 1 });
AppointmentSchema.index({ patientRiskLevel: 1, doctorId: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
