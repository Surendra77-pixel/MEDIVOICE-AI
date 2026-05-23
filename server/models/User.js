const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    // ── Identity ───────────────────────────────────────────────────────────
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries unless explicitly requested
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },

    // ── Role & Status ──────────────────────────────────────────────────────
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['patient', 'doctor', 'admin'],
        message: 'Role must be patient, doctor, or admin',
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },

    // ── Preferences ────────────────────────────────────────────────────────
    city: {
      type: String,
      enum: {
        values: [
          'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
          'Hyderabad', 'Delhi', 'Goa', 'Puducherry',
        ],
        message: 'City must be one of the 8 supported Phase 1 cities',
      },
    },
    preferredLanguage: {
      type: String,
      default: 'hi',
      enum: {
        values: ['hi', 'ta', 'te', 'ml', 'kn', 'bn'],
        message: 'Language must be one of the 6 supported Indian languages',
      },
    },
    pushSubscription: {
      type: Object,
      default: null,
    },

    // ── Security ───────────────────────────────────────────────────────────
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIP: {
      type: String,
    },
    currentSessionToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual Fields ─────────────────────────────────────────────────────────
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockoutUntil && this.lockoutUntil > Date.now());
});

// ── Pre-save Middleware ────────────────────────────────────────────────────
UserSchema.pre('save', async function () {
  // Only hash if password was actually modified (not on profile update)
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
});

// ── Instance Methods ───────────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.hashSessionToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// ── Indexes ────────────────────────────────────────────────────────────────
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ role: 1, city: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
