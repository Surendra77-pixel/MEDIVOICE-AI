const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────────────
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },

    // ── Medication Details ─────────────────────────────────────────────────
    drugName: {
      type: String,
      required: [true, 'Drug name is required'],
      trim: true,
    },
    dose: {
      type: String,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
    },

    // ── Schedule ───────────────────────────────────────────────────────────
    scheduledTime: {
      type: String,
      required: [true, 'Scheduled time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be HH:MM format'],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    daysTotal: {
      type: Number,
      min: 1,
    },

    // ── Status ─────────────────────────────────────────────────────────────
    active: {
      type: Boolean,
      default: true,
    },
    customizedTime: {
      type: Boolean,
      default: false,
    },

    // ── Notification Payload ───────────────────────────────────────────────
    notificationTitle: {
      type: String,
    },
    notificationBody: {
      type: String,
    },

    // ── Acknowledgement ────────────────────────────────────────────────────
    lastAcknowledgedAt: {
      type: Date,
    },
    totalAcknowledgements: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
ReminderSchema.index({ patientId: 1, active: 1 });
ReminderSchema.index({ patientId: 1, scheduledTime: 1 });
ReminderSchema.index({ prescriptionId: 1 });
ReminderSchema.index({ endDate: 1, active: 1 });

module.exports = mongoose.model('Reminder', ReminderSchema);
