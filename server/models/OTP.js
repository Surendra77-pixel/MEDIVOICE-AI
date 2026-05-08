const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema(
  {
    // ── Target ─────────────────────────────────────────────────────────────
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // ── Code ───────────────────────────────────────────────────────────────
    code: {
      type: String,
      required: [true, 'OTP code is required'],
      select: false,
    },

    // ── Type ───────────────────────────────────────────────────────────────
    type: {
      type: String,
      required: [true, 'OTP type is required'],
      enum: {
        values: ['email_verify', 'password_reset'],
        message: 'OTP type must be email_verify or password_reset',
      },
    },

    // ── Usage Tracking ─────────────────────────────────────────────────────
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },

    // ── TTL ─────────────────────────────────────────────────────────────────
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
  },
  {
    timestamps: false,
  }
);

// ── TTL Index ─────────────────────────────────────────────────────────────
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ── Lookup Indexes ─────────────────────────────────────────────────────────
OTPSchema.index({ email: 1, type: 1, isUsed: 1 });

module.exports = mongoose.model('OTP', OTPSchema);
