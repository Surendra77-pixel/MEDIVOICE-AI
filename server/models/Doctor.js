const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    // ── Link to User ───────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },

    // ── Professional Identity ──────────────────────────────────────────────
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      enum: {
        values: [
          'General Physician', 'Cardiologist', 'Neurologist',
          'Orthopedist', 'Dermatologist', 'Gastroenterologist',
          'Pulmonologist', 'Endocrinologist', 'Pediatrician',
          'Gynecologist', 'Ophthalmologist', 'ENT Specialist',
          'Psychiatrist', 'Urologist', 'Oncologist',
          'Rheumatologist', 'Nephrologist', 'Dentist',
          'Radiologist', 'Pathologist',
        ],
        message: 'Invalid specialty',
      },
    },
    subSpecialty: {
      type: String,
      trim: true,
    },
    qualifications: {
      type: [String],
      required: [true, 'At least one qualification is required'],
    },
    experienceYears: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      max: [60, 'Experience seems unusually high'],
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },

    // ── Practice Details ───────────────────────────────────────────────────
    clinicName: {
      type: String,
      trim: true,
      maxlength: [100, 'Clinic name too long'],
    },
    clinicAddress: {
      type: String,
      trim: true,
      maxlength: [200, 'Clinic address too long'],
    },
    city: {
      type: String,
      required: [true, 'City is required for doctor profiles'],
      enum: {
        values: [
          'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
          'Hyderabad', 'Delhi', 'Goa', 'Puducherry',
        ],
      },
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative'],
    },

    // ── Languages ──────────────────────────────────────────────────────────
    languagesSpoken: {
      type: [String],
      default: ['hi'],
      enum: {
        values: ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'en'],
        message: 'Unsupported language code',
      },
    },

    // ── Availability Configuration ─────────────────────────────────────────
    availability: {
      workingDays: {
        type: [String],
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        enum: {
          values: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          message: 'Invalid day',
        },
      },
      startTime: {
        type: String,
        default: '09:00',
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
      },
      endTime: {
        type: String,
        default: '17:00',
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
      },
      slotDurationMinutes: {
        type: Number,
        default: 30,
        enum: {
          values: [15, 20, 30, 45, 60],
          message: 'Slot duration must be 15, 20, 30, 45, or 60 minutes',
        },
      },
      maxDailySlots: {
        type: Number,
        default: 16,
        min: [1, 'Must have at least 1 slot'],
        max: [50, 'Cannot exceed 50 slots per day'],
      },
      blockedDates: {
        type: [Date],
        default: [],
      },
      breakTimes: [{
        startTime: {
          type: String,
          match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
        },
        endTime: {
          type: String,
          match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
        },
        label: { type: String, default: 'Break' },
      }],
    },

    // ── Platform Stats ─────────────────────────────────────────────────────
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPatientsServed: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalConsultations: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Platform Status ────────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'on_leave', 'offline'],
      default: 'offline',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: displayName for search results ────────────────────────────────
DoctorSchema.virtual('displayTitle').get(function () {
  const quals = this.qualifications.slice(0, 2).join(', ');
  return `${this.specialty} · ${quals}`;
});

// ── Compound Indexes for Search ────────────────────────────────────────────
DoctorSchema.index({ specialty: 1, city: 1, isVerified: 1 });
DoctorSchema.index({ city: 1, rating: -1 });
DoctorSchema.index({ languagesSpoken: 1, city: 1 });
DoctorSchema.index({ userId: 1 });
DoctorSchema.index({ status: 1, city: 1 });

module.exports = mongoose.model('Doctor', DoctorSchema);
