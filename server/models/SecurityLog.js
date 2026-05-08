const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema(
  {
    // ── Actor ──────────────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
    },

    // ── Event ──────────────────────────────────────────────────────────────
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: [
          'login_success',
          'login_failed',
          'account_locked',
          'account_unlocked',
          'password_reset_req',
          'password_reset_done',
          'otp_requested',
          'otp_verified',
          'otp_failed',
          'otp_expired',
          'signup_success',
          'suspicious_ip',
          'session_invalidated',
          'force_logout',
          'account_deactivated',
          'account_banned',
          'account_reactivated',
        ],
        message: 'Invalid event type',
      },
    },

    // ── Context ────────────────────────────────────────────────────────────
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    details: {
      type: String,
    },

    // ── Severity ───────────────────────────────────────────────────────────
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
    },

    // ── TTL ─────────────────────────────────────────────────────────────────
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// ── TTL Index ─────────────────────────────────────────────────────────────
// Auto-delete logs older than 90 days (7,776,000 seconds)
SecurityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// ── Query Indexes ──────────────────────────────────────────────────────────
SecurityLogSchema.index({ userId: 1, createdAt: -1 });
SecurityLogSchema.index({ severity: 1, createdAt: -1 });
SecurityLogSchema.index({ eventType: 1, createdAt: -1 });
SecurityLogSchema.index({ ipAddress: 1, createdAt: -1 });

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
