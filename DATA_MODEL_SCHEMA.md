<div align="center">

# 🗄️ MEDIVOICE AI — Data Model & Schema
### Complete Database Design Reference

![Document](https://img.shields.io/badge/Document-Data%20Model%20%26%20Schema-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen?style=for-the-badge)
![ODM](https://img.shields.io/badge/ODM-Mongoose%208.x-red?style=for-the-badge)

> **The authoritative reference for every collection, field, data type, relationship,
> index, and constraint in MediVoice AI's MongoDB database.**
> Every design decision is documented. Every field has a purpose.

---

**Database:** MongoDB Atlas M0 Free Tier (512MB)  
**ODM:** Mongoose 8.x  
**Region:** Mumbai (ap-south-1) — closest to all 8 Phase 1 Indian cities  
**Strategy:** Hybrid embedding + referencing — embed what's always read together, reference what's shared  
**Platform:** MediVoice AI — AI-Powered Healthcare Communication

</div>

---

## 📋 Table of Contents

1. [Database Design Philosophy](#1-database-design-philosophy)
2. [Collection Overview](#2-collection-overview)
3. [Entity Relationship Diagram](#3-entity-relationship-diagram)
4. [Collection 01 — Users](#4-collection-01--users)
5. [Collection 02 — Patients](#5-collection-02--patients)
6. [Collection 03 — Doctors](#6-collection-03--doctors)
7. [Collection 04 — Appointments](#7-collection-04--appointments)
8. [Collection 05 — Consultations](#8-collection-05--consultations)
9. [Collection 06 — Prescriptions](#9-collection-06--prescriptions)
10. [Collection 07 — Reminders](#10-collection-07--reminders)
11. [Collection 08 — OTPs](#11-collection-08--otps)
12. [Collection 09 — SecurityLogs](#12-collection-09--securitylogs)
13. [Embedded Sub-Documents Reference](#13-embedded-sub-documents-reference)
14. [Index Strategy](#14-index-strategy)
15. [Data Relationships Map](#15-data-relationships-map)
16. [Data Lifecycle & TTL Policies](#16-data-lifecycle--ttl-policies)
17. [Field Validation Rules](#17-field-validation-rules)
18. [Data Access Patterns](#18-data-access-patterns)
19. [Storage Estimation](#19-storage-estimation)
20. [Seed Data Reference](#20-seed-data-reference)

---

## 1. Database Design Philosophy

```
┌──────────────────────────────────────────────────────────────────────┐
│                   DATA MODELLING PRINCIPLES                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  EMBED WHEN:                                                         │
│  • Data is always read with the parent document                      │
│  • Data has a 1-to-few relationship (< 20 items)                    │
│  • Data is owned exclusively by the parent                           │
│  Examples: transcript lines in Consultation,                        │
│            medications array in Prescription,                        │
│            SOAP sections in Consultation                             │
│                                                                      │
│  REFERENCE WHEN:                                                     │
│  • Data is shared across multiple documents                          │
│  • Data has a 1-to-many relationship (> 20 items)                   │
│  • Data is queried independently                                     │
│  Examples: Doctor referenced in Appointment,                        │
│            Patient referenced in Consultation                        │
│                                                                      │
│  SNAPSHOT WHEN:                                                      │
│  • Source data can change but the record must be immutable          │
│  • Doctor's name/clinic should stay on prescription even if         │
│    their profile is updated later                                    │
│  Examples: doctorSnapshot in Prescription,                          │
│            patientSnapshot in Prescription                           │
│                                                                      │
│  ENUM OVER FREE TEXT WHEN:                                           │
│  • A field has a bounded set of valid values                        │
│  • Used for filtering, indexing, or UI display                      │
│  Examples: role, status, language, city, riskLevel                  │
│                                                                      │
│  SEPARATE COLLECTION FOR:                                            │
│  • Security-sensitive data (OTPs, SecurityLogs)                     │
│  • High-volume auto-deleted data (TTL collections)                  │
│  • Data with independent lifecycle (Reminders)                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Collection Overview

| # | Collection | Documents | Strategy | TTL | Purpose |
|---|---|---|---|---|---|
| 01 | `users` | 1 per user | Base identity | None | Authentication + core profile for all roles |
| 02 | `patients` | 1 per patient | Extends User | None | Patient medical profile + demographics |
| 03 | `doctors` | 1 per doctor | Extends User | None | Doctor professional profile + availability |
| 04 | `appointments` | 1 per appointment | References | None | Booking records, scheduling, status lifecycle |
| 05 | `consultations` | 1 per consultation | Hybrid embed + ref | None | Transcript, SOAP note, risk events (central record) |
| 06 | `prescriptions` | 1 per prescription | Hybrid embed + ref | None | Medications, snapshots, diagnosis |
| 07 | `reminders` | 1 per drug per patient | References | None | Medication reminder schedules |
| 08 | `otps` | 1 per OTP request | Lightweight | **10 min** | Email verification + password reset codes |
| 09 | `securitylogs` | 1 per auth event | Append-only | **90 days** | Auth audit trail for admin security panel |

---

## 3. Entity Relationship Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MEDIVOICE AI — ENTITY RELATIONSHIP DIAGRAM               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║                          ┌─────────────┐                                    ║
║                          │    USERS    │ (base identity)                    ║
║                          │  _id, email │                                    ║
║                          │  password   │                                    ║
║                          │  role       │                                    ║
║                          └──────┬──────┘                                    ║
║                                 │ 1                                         ║
║               ┌─────────────────┼─────────────────┐                        ║
║               │ 1               │ 1               │ 1                      ║
║               ▼                 ▼                 ▼                        ║
║        ┌──────────┐      ┌──────────┐      ┌──────────┐                   ║
║        │ PATIENTS │      │ DOCTORS  │      │  ADMINS  │                   ║
║        │ (extends)│      │ (extends)│      │ (no ext) │                   ║
║        └────┬─────┘      └────┬─────┘      └──────────┘                   ║
║             │ 1               │ 1                                           ║
║             │                 │                                             ║
║             └────────┬────────┘                                             ║
║                      │ many                                                 ║
║                      ▼                                                      ║
║              ┌───────────────┐                                              ║
║              │ APPOINTMENTS  │                                              ║
║              │ patientId (→) │                                              ║
║              │ doctorId  (→) │                                              ║
║              │ status        │                                              ║
║              └───────┬───────┘                                              ║
║                      │ 0..1 (created when consultation starts)              ║
║                      ▼                                                      ║
║              ┌───────────────┐                                              ║
║              │ CONSULTATIONS │                                              ║
║              │ appointmentId │                                              ║
║              │ transcript [] ← embedded                                    ║
║              │ soapNote   {} ← embedded                                    ║
║              │ riskEvents [] ← embedded                                    ║
║              └───────┬───────┘                                              ║
║                      │ 0..1                                                 ║
║                      ▼                                                      ║
║              ┌───────────────┐                                              ║
║              │ PRESCRIPTIONS │                                              ║
║              │ medications[] ← embedded                                    ║
║              │ doctorSnapshot← embedded (immutable copy)                   ║
║              │ patientSnapshot←embedded (immutable copy)                   ║
║              └───────┬───────┘                                              ║
║                      │ 1:many                                               ║
║                      ▼                                                      ║
║              ┌───────────────┐                                              ║
║              │   REMINDERS   │                                              ║
║              │ prescriptionId│                                              ║
║              │ patientId     │                                              ║
║              │ scheduledTime │                                              ║
║              └───────────────┘                                              ║
║                                                                              ║
║   SEPARATE (not linked to above chain):                                     ║
║   ┌──────────┐      ┌─────────────────┐                                    ║
║   │   OTPS   │      │  SECURITY LOGS  │                                    ║
║   │ TTL 10m  │      │  TTL 90 days    │                                    ║
║   └──────────┘      └─────────────────┘                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Collection 01 — Users

**Purpose:** The base identity document for all three roles. Every person who signs up gets exactly one User document. Patient and Doctor profiles extend this via a `userId` reference in their own collections.

### Schema

```javascript
// server/models/User.js

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const crypto   = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    // ── Identity ───────────────────────────────────────────────────────────
    firstName: {
      type:     String,
      required: [true, 'First name is required'],
      trim:     true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type:     String,
      required: [true, 'Last name is required'],
      trim:     true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:    false,   // Never returned in queries unless explicitly requested
    },
    phone: {
      type:  String,
      trim:  true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },

    // ── Role & Status ──────────────────────────────────────────────────────
    role: {
      type:     String,
      required: [true, 'Role is required'],
      enum: {
        values:  ['patient', 'doctor', 'admin'],
        message: 'Role must be patient, doctor, or admin',
      },
    },
    isVerified: {
      type:    Boolean,
      default: false,
      // Set to true after email OTP is confirmed at signup
    },
    isActive: {
      type:    Boolean,
      default: true,
      // Set to false by admin to deactivate without deletion
    },
    isBanned: {
      type:    Boolean,
      default: false,
      // Set to true by admin — permanent block, cannot be reversed by user
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
      type:    String,
      default: 'hi',
      enum: {
        values:  ['hi', 'ta', 'te', 'ml', 'kn', 'bn'],
        message: 'Language must be one of the 6 supported Indian languages',
      },
    },

    // ── Security ───────────────────────────────────────────────────────────
    failedLoginAttempts: {
      type:    Number,
      default: 0,
      min:     0,
      max:     10,
    },
    lockoutUntil: {
      type:    Date,
      default: null,
      // Set to future date when failedLoginAttempts reaches MAX_LOGIN_ATTEMPTS
    },
    lastLoginAt: {
      type: Date,
      // Updated on every successful login
    },
    lastLoginIP: {
      type: String,
      // Stored for suspicious activity detection in admin panel
    },
    currentSessionToken: {
      type:   String,
      select: false,
      // SHA-256 hash of the current JWT — used for single session enforcement
      // When new login occurs, this is overwritten, invalidating old sessions
    },
    passwordChangedAt: {
      type: Date,
      // Updated whenever password is reset — used to invalidate old JWTs
    },
  },
  {
    timestamps: true,
    // Adds: createdAt (signup date), updatedAt (last profile update)

    toJSON:   { virtuals: true },
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
UserSchema.pre('save', async function (next) {
  // Only hash if password was actually modified (not on profile update)
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  next();
});

// ── Instance Methods ───────────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.hashSessionToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// ── Indexes ────────────────────────────────────────────────────────────────
UserSchema.index({ email: 1 });                      // Login, signup duplicate check
UserSchema.index({ role: 1, isActive: 1 });          // Admin user listing by role
UserSchema.index({ role: 1, city: 1 });              // City-based user queries
UserSchema.index({ createdAt: -1 });                 // Admin: sort by join date

module.exports = mongoose.model('User', UserSchema);
```

### Field Reference Table

| Field | Type | Required | Default | Validation | Notes |
|---|---|---|---|---|---|
| `firstName` | String | ✅ | — | 2–50 chars, trimmed | Stored as-is (case preserved) |
| `lastName` | String | ✅ | — | 2–50 chars, trimmed | |
| `email` | String | ✅ | — | Valid format, unique, lowercase | Primary identifier for login |
| `password` | String | ✅ | — | Min 8 chars | bcrypt hashed · `select: false` |
| `phone` | String | ❌ | — | Indian 10-digit (6-9XXXXXXXXX) | Optional at signup |
| `role` | String (enum) | ✅ | — | patient / doctor / admin | Encoded in JWT |
| `isVerified` | Boolean | — | `false` | — | Must be `true` to login |
| `isActive` | Boolean | — | `true` | — | `false` = admin deactivated |
| `isBanned` | Boolean | — | `false` | — | `true` = permanent block |
| `city` | String (enum) | ❌ | — | 8 Phase 1 cities only | Required for patients at booking |
| `preferredLanguage` | String (enum) | — | `'hi'` | hi/ta/te/ml/kn/bn | Used for UI + consultation |
| `failedLoginAttempts` | Number | — | `0` | 0–10 | Reset to 0 on successful login |
| `lockoutUntil` | Date | — | `null` | — | `null` = not locked |
| `lastLoginAt` | Date | — | — | — | Set on every login success |
| `lastLoginIP` | String | — | — | — | Stored for admin security panel |
| `currentSessionToken` | String | — | — | SHA-256 hash | `select: false` · Single session |
| `passwordChangedAt` | Date | — | — | — | Set on every password reset |
| `createdAt` | Date | — | auto | — | Mongoose timestamp |
| `updatedAt` | Date | — | auto | — | Mongoose timestamp |

---

## 5. Collection 02 — Patients

**Purpose:** Extended profile for users with role `patient`. Created immediately after User document on signup. Linked via `userId`.

### Schema

```javascript
// server/models/Patient.js

const PatientSchema = new mongoose.Schema(
  {
    // ── Link to User ───────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User reference is required'],
      unique:   true,    // 1-to-1: one patient profile per user
    },

    // ── Demographics ───────────────────────────────────────────────────────
    dateOfBirth: {
      type:     Date,
      validate: {
        validator: (dob) => dob < new Date(),
        message:  'Date of birth must be in the past',
      },
    },
    gender: {
      type: String,
      enum: {
        values:  ['male', 'female', 'other', 'prefer_not_to_say'],
        message: 'Invalid gender value',
      },
    },
    bloodGroup: {
      type: String,
      enum: {
        values:  ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        message: 'Invalid blood group',
      },
    },
    address: {
      street:   { type: String, trim: true },
      area:     { type: String, trim: true },
      pincode:  { type: String, match: [/^\d{6}$/, 'Pincode must be 6 digits'] },
    },

    // ── Medical Background ─────────────────────────────────────────────────
    allergies: {
      type:    [String],
      default: [],
      // e.g., ['Penicillin', 'Aspirin', 'Shellfish']
    },
    chronicConditions: {
      type:    [String],
      default: [],
      // e.g., ['Type 2 Diabetes', 'Hypertension']
    },
    currentMedications: {
      type:    [String],
      default: [],
      // Ongoing medications not from a MediVoice consultation
    },

    // ── Emergency Contact ──────────────────────────────────────────────────
    emergencyContact: {
      name:     { type: String, trim: true },
      phone:    {
        type:  String,
        match: [/^[6-9]\d{9}$/, 'Invalid emergency contact number'],
      },
      relation: {
        type: String,
        enum: ['spouse', 'parent', 'sibling', 'child', 'friend', 'other'],
      },
    },

    // ── AI Risk State ──────────────────────────────────────────────────────
    currentRiskLevel: {
      type:    String,
      enum:    ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN',
      // Updated by AI-11 (riskClassifierService) after each chatbot message
    },
    riskCondition: {
      type: String,
      // The specific condition that triggered the risk level
      // e.g., 'Possible cardiac event — chest pain reported'
    },
    lastRiskAssessedAt: {
      type: Date,
      // Timestamp of last AI risk assessment
    },

    // ── Statistics ─────────────────────────────────────────────────────────
    totalConsultations: {
      type:    Number,
      default: 0,
      min:     0,
    },
    totalAppointments: {
      type:    Number,
      default: 0,
      min:     0,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
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
PatientSchema.index({ userId: 1 });                      // Profile lookup by userId
PatientSchema.index({ currentRiskLevel: 1 });            // Doctor queue risk filtering
PatientSchema.index({ 'emergencyContact.phone': 1 });    // Emergency lookup

module.exports = mongoose.model('Patient', PatientSchema);
```

### Field Reference Table

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userId` | ObjectId (ref: User) | ✅ | — | Unique · 1-to-1 with User |
| `dateOfBirth` | Date | ❌ | — | Must be in the past |
| `gender` | String (enum) | ❌ | — | male / female / other / prefer_not_to_say |
| `bloodGroup` | String (enum) | ❌ | — | A+/A-/B+/B-/O+/O-/AB+/AB- |
| `address.street` | String | ❌ | — | |
| `address.area` | String | ❌ | — | Locality / neighbourhood |
| `address.pincode` | String | ❌ | — | Must be exactly 6 digits |
| `allergies` | [String] | — | `[]` | Drug/food allergies list |
| `chronicConditions` | [String] | — | `[]` | Long-term medical conditions |
| `currentMedications` | [String] | — | `[]` | Medications from outside platform |
| `emergencyContact.name` | String | ❌ | — | |
| `emergencyContact.phone` | String | ❌ | — | Indian 10-digit |
| `emergencyContact.relation` | String (enum) | ❌ | — | spouse / parent / sibling / child / friend / other |
| `currentRiskLevel` | String (enum) | — | `'GREEN'` | Updated by AI-11 |
| `riskCondition` | String | ❌ | — | Reason for current risk level |
| `lastRiskAssessedAt` | Date | ❌ | — | Last AI assessment timestamp |
| `totalConsultations` | Number | — | `0` | Counter — incremented by consultationService |
| `totalAppointments` | Number | — | `0` | Counter — incremented by appointmentService |
| `createdAt` | Date | — | auto | |
| `updatedAt` | Date | — | auto | |
| `age` | Number | Virtual | — | Computed from dateOfBirth |

---

## 6. Collection 03 — Doctors

**Purpose:** Extended profile for users with role `doctor`. Contains professional information, availability configuration, specialty, ratings, and platform status.

### Schema

```javascript
// server/models/Doctor.js

const DoctorSchema = new mongoose.Schema(
  {
    // ── Link to User ───────────────────────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User reference is required'],
      unique:   true,
    },

    // ── Professional Identity ──────────────────────────────────────────────
    specialty: {
      type:     String,
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
      // e.g., 'Interventional Cardiology', 'Spine Surgery'
    },
    qualifications: {
      type:     [String],
      required: [true, 'At least one qualification is required'],
      // e.g., ['MBBS', 'MD - General Medicine', 'DM - Cardiology']
    },
    experienceYears: {
      type: Number,
      min:  [0, 'Experience cannot be negative'],
      max:  [60, 'Experience seems unusually high'],
    },
    registrationNumber: {
      type:   String,
      unique: true,
      sparse: true,    // Allows multiple null values (before admin verification)
      // Medical Council of India registration number
    },

    // ── Practice Details ───────────────────────────────────────────────────
    clinicName: {
      type:      String,
      trim:      true,
      maxlength: [100, 'Clinic name too long'],
    },
    clinicAddress: {
      type:      String,
      trim:      true,
      maxlength: [200, 'Clinic address too long'],
    },
    city: {
      type:     String,
      required: [true, 'City is required for doctor profiles'],
      enum: {
        values: [
          'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
          'Hyderabad', 'Delhi', 'Goa', 'Puducherry',
        ],
      },
    },
    consultationFee: {
      type:    Number,
      default: 0,
      min:     [0, 'Fee cannot be negative'],
      // 0 = free. Platform is free-first for MVP
    },

    // ── Languages ──────────────────────────────────────────────────────────
    languagesSpoken: {
      type:    [String],
      default: ['hi'],
      enum: {
        values:  ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'en'],
        message: 'Unsupported language code',
      },
      // Used for search filter: "Find doctors who speak Tamil"
    },

    // ── Availability Configuration ─────────────────────────────────────────
    availability: {
      workingDays: {
        type:    [String],
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        enum:    {
          values:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          message: 'Invalid day',
        },
      },
      startTime: {
        type:    String,
        default: '09:00',
        match:   [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
      },
      endTime: {
        type:    String,
        default: '17:00',
        match:   [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
      },
      slotDurationMinutes: {
        type:    Number,
        default: 30,
        enum:    {
          values:  [15, 20, 30, 45, 60],
          message: 'Slot duration must be 15, 20, 30, 45, or 60 minutes',
        },
      },
      maxDailySlots: {
        type:    Number,
        default: 16,
        min:     [1,  'Must have at least 1 slot'],
        max:     [50, 'Cannot exceed 50 slots per day'],
      },
      blockedDates: {
        type:    [Date],
        default: [],
        // Dates blocked for leave, holidays, or personal reasons
      },
      breakTimes: [{
        startTime: {
          type:  String,
          match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
        },
        endTime: {
          type:  String,
          match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time format must be HH:MM'],
        },
        label: { type: String, default: 'Break' },
        // e.g., { startTime: '13:00', endTime: '14:00', label: 'Lunch' }
      }],
    },

    // ── Platform Stats ─────────────────────────────────────────────────────
    rating: {
      type:    Number,
      default: 0,
      min:     [0, 'Rating cannot be below 0'],
      max:     [5, 'Rating cannot exceed 5'],
    },
    totalRatings: {
      type:    Number,
      default: 0,
      min:     0,
      // Total number of ratings received (denominator for average)
    },
    totalPatientsServed: {
      type:    Number,
      default: 0,
      min:     0,
    },
    totalConsultations: {
      type:    Number,
      default: 0,
      min:     0,
    },

    // ── Platform Status ────────────────────────────────────────────────────
    isVerified: {
      type:    Boolean,
      default: false,
      // Set to true by Admin after credential verification
      // Verified badge shown on doctor's public profile
    },
    status: {
      type:    String,
      enum:    ['available', 'busy', 'on_leave', 'offline'],
      default: 'offline',
      // Doctor sets this manually from their dashboard
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: displayName for search results ────────────────────────────────
DoctorSchema.virtual('displayTitle').get(function () {
  const quals = this.qualifications.slice(0, 2).join(', ');
  return `${this.specialty} · ${quals}`;
});

// ── Compound Indexes for Search ────────────────────────────────────────────
DoctorSchema.index({ specialty: 1, city: 1, isVerified: 1 });   // Core search
DoctorSchema.index({ city: 1, rating: -1 });                     // Best-rated in city
DoctorSchema.index({ languagesSpoken: 1, city: 1 });             // Language filter
DoctorSchema.index({ userId: 1 });                               // Own profile lookup
DoctorSchema.index({ status: 1, city: 1 });                      // Available doctors

module.exports = mongoose.model('Doctor', DoctorSchema);
```

### Field Reference Table

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userId` | ObjectId (ref: User) | ✅ | — | Unique · 1-to-1 with User |
| `specialty` | String (enum) | ✅ | — | 20 specialties enumerated |
| `subSpecialty` | String | ❌ | — | Free text |
| `qualifications` | [String] | ✅ | — | At least one required |
| `experienceYears` | Number | ❌ | — | 0–60 years |
| `registrationNumber` | String | ❌ | — | Unique, sparse (MCI number) |
| `clinicName` | String | ❌ | — | Max 100 chars |
| `clinicAddress` | String | ❌ | — | Max 200 chars |
| `city` | String (enum) | ✅ | — | 8 Phase 1 cities |
| `consultationFee` | Number | — | `0` | 0 = free |
| `languagesSpoken` | [String] | — | `['hi']` | hi/ta/te/ml/kn/bn/en |
| `availability.workingDays` | [String] | — | Mon–Fri | Mon/Tue/Wed/Thu/Fri/Sat/Sun |
| `availability.startTime` | String | — | `'09:00'` | HH:MM format |
| `availability.endTime` | String | — | `'17:00'` | HH:MM format |
| `availability.slotDurationMinutes` | Number (enum) | — | `30` | 15/20/30/45/60 |
| `availability.maxDailySlots` | Number | — | `16` | 1–50 |
| `availability.blockedDates` | [Date] | — | `[]` | Leaves and holidays |
| `availability.breakTimes` | [Object] | — | `[]` | startTime, endTime, label |
| `rating` | Number | — | `0` | 0.0–5.0 |
| `totalRatings` | Number | — | `0` | Count of reviews |
| `totalPatientsServed` | Number | — | `0` | Career counter |
| `totalConsultations` | Number | — | `0` | Platform counter |
| `isVerified` | Boolean | — | `false` | Admin-granted verification |
| `status` | String (enum) | — | `'offline'` | available/busy/on_leave/offline |

---

## 7. Collection 04 — Appointments

**Purpose:** Records every booking between a patient and a doctor. Manages the full lifecycle from pending → confirmed → in_progress → completed. Links to a Consultation when the meeting starts.

### Schema

```javascript
// server/models/Appointment.js

const AppointmentSchema = new mongoose.Schema(
  {
    // ── Participants ───────────────────────────────────────────────────────
    patientId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Patient reference is required'],
      index:    true,
    },
    doctorId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Doctor reference is required'],
      index:    true,
    },

    // ── Timing ─────────────────────────────────────────────────────────────
    scheduledAt: {
      type:     Date,
      required: [true, 'Appointment date/time is required'],
      validate: {
        validator: (date) => date > new Date(),
        message:  'Appointment must be scheduled in the future',
      },
    },
    durationMinutes: {
      type:    Number,
      default: 30,
      enum:    {
        values:  [15, 20, 30, 45, 60],
        message: 'Duration must match doctor slot duration setting',
      },
    },
    endAt: {
      type: Date,
      // Computed: scheduledAt + durationMinutes — set by pre-save hook
    },

    // ── Status Lifecycle ───────────────────────────────────────────────────
    status: {
      type:    String,
      enum: {
        values: [
          'pending',       // Just booked — awaiting doctor confirmation
          'confirmed',     // Doctor confirmed / auto-confirmed
          'in_progress',   // Consultation actively running
          'completed',     // Consultation marked done by doctor
          'cancelled',     // Cancelled by patient or doctor
          'no_show',       // Patient didn't show up
          'rescheduled',   // Moved to new time (original record kept)
        ],
        message: 'Invalid appointment status',
      },
      default: 'confirmed',  // Auto-confirm on booking for MVP
    },

    // ── Clinical Context ───────────────────────────────────────────────────
    chiefComplaint: {
      type:      String,
      trim:      true,
      maxlength: [500, 'Chief complaint cannot exceed 500 characters'],
      // Patient's stated reason for booking — feeds into AI risk assessment
    },
    patientRiskLevel: {
      type:    String,
      enum:    ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN',
      // Set by AI-11 (riskClassifierService) based on chiefComplaint
    },
    riskCondition: {
      type: String,
      // Text description of detected risk, e.g., 'Reported chest pain'
    },

    // ── Cancellation / Reschedule ──────────────────────────────────────────
    cancelReason: {
      type: String,
      trim: true,
      // Required if status → 'cancelled'
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
        newTime:      { type: Date, required: true },
        changedBy:    {
          type: String,
          enum: ['patient', 'doctor'],
        },
        reason:    { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Notification Tracking ──────────────────────────────────────────────
    reminderSent24h: {
      type:    Boolean,
      default: false,
      // Set to true after 24-hour reminder push is sent
    },
    reminderSent1h: {
      type:    Boolean,
      default: false,
      // Set to true after 1-hour reminder push is sent
    },
    confirmationSent: {
      type:    Boolean,
      default: false,
    },

    // ── Linked Consultation ────────────────────────────────────────────────
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Consultation',
      // Populated when the consultation is started (status → 'in_progress')
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
  next();
});

// ── Compound Indexes ───────────────────────────────────────────────────────
AppointmentSchema.index({ patientId: 1, scheduledAt: -1 });     // Patient history (most recent first)
AppointmentSchema.index({ doctorId: 1, scheduledAt: 1 });       // Doctor queue (ascending time)
AppointmentSchema.index({ doctorId: 1, status: 1 });            // Status filtering in queue
AppointmentSchema.index({ scheduledAt: 1, status: 1 });         // Reminder cron job queries
AppointmentSchema.index({ patientRiskLevel: 1, doctorId: 1 });  // Risk-sorted queue

module.exports = mongoose.model('Appointment', AppointmentSchema);
```

### Status Lifecycle

```
APPOINTMENT STATUS FLOW
══════════════════════════════════════════════════════════════

              BOOKED
                │
                ▼
           [confirmed] ◄──── default on booking (MVP: auto-confirm)
                │
         ┌──────┴──────┐
         │             │
         ▼             ▼
   [in_progress]   [cancelled] ◄── patient/doctor cancels
         │
         ├──────────────────────► [no_show] ◄── doctor marks
         │
         ▼
     [completed] ◄── doctor ends consultation

   At any point:   [rescheduled] ← creates new appointment,
                                    original kept for history
```

---

## 8. Collection 05 — Consultations

**Purpose:** The most important collection in MediVoice AI. Records the complete consultation event — live transcript lines (embedded), AI-generated SOAP note (embedded), risk events (embedded), and links to the prescription created. This is the core research innovation from ICSADL-2025.

### Schema

```javascript
// server/models/Consultation.js

const TranscriptLineSchema = new mongoose.Schema(
  {
    speaker:        { type: String, enum: ['Patient', 'Doctor'], required: true },
    originalText:   { type: String, required: true },
    translatedText: { type: String },
    originalLang:   { type: String },   // BCP-47: 'hi-IN'
    targetLang:     { type: String },   // BCP-47: 'ta-IN'
    isRisky:        { type: Boolean, default: false },
    timestamp:      { type: Date, default: Date.now },
  },
  { _id: false }  // No separate _id for each line — part of parent doc
);

const RiskEventSchema = new mongoose.Schema(
  {
    level:     { type: String, enum: ['RED', 'YELLOW'], required: true },
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
      chiefComplaint:     { type: String },
      reportedSymptoms:   { type: [String], default: [] },
      symptomDuration:    { type: String },
      currentMedications: { type: [String], default: [] },
      relevantHistory:    { type: [String], default: [] },
      patientStatements:  { type: [String], default: [] },
    },
    objective: {
      doctorObservations:  { type: [String], default: [] },
      examinationFindings: { type: [String], default: [] },
      vitalsDiscussed:     { type: [String], default: [] },
      investigationsOrdered: { type: [String], default: [] },
    },
    assessment: {
      probableDiagnosis:     { type: String },
      differentialDiagnoses: { type: [String], default: [] },
      severity:              { type: String },
    },
    plan: {
      prescribedMedications: { type: [String], default: [] },
      investigationsOrdered: { type: [String], default: [] },
      followUpInstructions:  { type: String },
      lifestyleAdvice:       { type: [String], default: [] },
      referrals:             { type: [String], default: [] },
    },
    aiGenerated:      { type: Boolean, default: true },
    doctorConfirmed:  { type: Boolean, default: false },
    confirmedAt:      { type: Date },
    doctorEdited:     { type: Boolean, default: false },
    // True if doctor made changes to AI draft before confirming
  },
  { _id: false }
);

const ConsultationSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────────────
    appointmentId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Appointment',
      required: [true, 'Appointment reference is required'],
      unique:   true,   // 1:1 — one consultation per appointment
    },
    patientId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Patient reference is required'],
    },
    doctorId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Doctor reference is required'],
    },

    // ── Languages Used ─────────────────────────────────────────────────────
    patientLanguage: {
      type:    String,
      default: 'hi',
      enum:    ['hi', 'ta', 'te', 'ml', 'kn', 'bn'],
    },
    doctorLanguage: {
      type:    String,
      default: 'hi',
      enum:    ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'en'],
    },

    // ── Patient Consent (required before STT begins) ───────────────────────
    patientConsentGiven: {
      type:    Boolean,
      default: false,
      // Patient must check consent modal before live transcription starts
    },
    consentTimestamp: {
      type: Date,
      // Recorded for legal/compliance purposes
    },

    // ── Live Transcript (embedded array) ──────────────────────────────────
    transcript: {
      type:    [TranscriptLineSchema],
      default: [],
      // Each line added in real-time via WebSocket during consultation
      // Embedded because always read with parent consultation
    },

    // ── AI-Generated SOAP Note (embedded) ─────────────────────────────────
    soapNote: {
      type:    SOAPNoteSchema,
      default: {},
      // Populated by AI-07 (soapService) after consultation ends
      // Doctor reviews, edits, and confirms before it becomes official
    },

    // ── Risk Events (embedded) ─────────────────────────────────────────────
    riskEvents: {
      type:    [RiskEventSchema],
      default: [],
      // Logged when AI-06 detects risk during transcript monitoring
    },

    // ── Consultation Status ────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    startedAt:   { type: Date },
    completedAt: { type: Date },
    actualDurationMinutes: {
      type: Number,
      // Computed: completedAt - startedAt in minutes
    },

    // ── Linked Output ──────────────────────────────────────────────────────
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Prescription',
      // Populated after doctor saves the prescription
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound Indexes ───────────────────────────────────────────────────────
ConsultationSchema.index({ patientId: 1, createdAt: -1 });
ConsultationSchema.index({ doctorId:  1, createdAt: -1 });
ConsultationSchema.index({ doctorId:  1, 'soapNote.assessment.probableDiagnosis': 1 });
ConsultationSchema.index({ patientId: 1, status: 1 });

module.exports = mongoose.model('Consultation', ConsultationSchema);
```

### Embedded Sub-Document Details

#### TranscriptLine Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `speaker` | String (enum) | ✅ | Patient / Doctor |
| `originalText` | String | ✅ | Raw ASR output in speaker's language |
| `translatedText` | String | ❌ | LibreTranslate output to other party's language |
| `originalLang` | String | ❌ | BCP-47 code (e.g., `hi-IN`) |
| `targetLang` | String | ❌ | BCP-47 code (e.g., `ta-IN`) |
| `isRisky` | Boolean | — | `true` if this line triggered a risk alert |
| `timestamp` | Date | — | Auto-set to server receive time |

#### SOAPNote Fields — S (Subjective)

| Field | Type | Source |
|---|---|---|
| `chiefComplaint` | String | AI-extracted from patient's first statements |
| `reportedSymptoms` | [String] | AI-04 NER on patient speech |
| `symptomDuration` | String | Regex extraction from patient text |
| `currentMedications` | [String] | AI-04 NER — medication entities in patient speech |
| `relevantHistory` | [String] | Pattern match on "history of", "had", "diagnosed with" |

#### SOAPNote Fields — O (Objective)

| Field | Type | Source |
|---|---|---|
| `doctorObservations` | [String] | Doctor lines containing "look", "appear", "examine" |
| `examinationFindings` | [String] | AI-04 NER — procedure entities in doctor speech |
| `vitalsDiscussed` | [String] | Regex for BP, pulse, temperature, SpO2 |
| `investigationsOrdered` | [String] | Pattern match on "order", "test", "ECG", "blood" |

#### SOAPNote Fields — A (Assessment) & P (Plan)

| Field | Type | Source |
|---|---|---|
| `probableDiagnosis` | String | Doctor lines with "diagnosed", "this is", "you have" |
| `differentialDiagnoses` | [String] | NER diagnoses from doctor speech |
| `prescribedMedications` | [String] | NER medication entities from doctor speech |
| `followUpInstructions` | String | Pattern match on "follow up", "come back", "review" |
| `lifestyleAdvice` | [String] | Pattern match on "avoid", "exercise", "diet", "reduce" |

---

## 9. Collection 06 — Prescriptions

**Purpose:** Structured prescription created by the doctor after consultation. Contains AI pre-filled medication rows (from AI-09), doctor and patient snapshots for immutability, and the final output that the patient downloads as PDF.

### Schema

```javascript
// server/models/Prescription.js

const MedicationSchema = new mongoose.Schema(
  {
    drugName:     {
      type:     String,
      required: [true, 'Drug name is required'],
      trim:     true,
      maxlength: [100, 'Drug name too long'],
    },
    dose: {
      type:    String,
      trim:    true,
      // e.g., '500mg', '10mg/5ml', '2 tablets'
    },
    frequency: {
      type:    String,
      trim:    true,
      // e.g., 'Twice daily', 'Once at night', 'Every 8 hours'
    },
    duration: {
      type:    String,
      trim:    true,
      // e.g., '5 days', '3 weeks', '1 month'
    },
    route: {
      type:    String,
      enum:    ['oral', 'topical', 'injection', 'inhaled', 'sublingual', 'other'],
      default: 'oral',
    },
    instructions: {
      type:    String,
      trim:    true,
      maxlength: [200, 'Instructions too long'],
      // e.g., 'Take with food', 'Avoid direct sunlight', 'Do not crush'
    },
    aiPrefilled: {
      type:    Boolean,
      default: false,
      // true = auto-filled by AI-09 from SOAP note (doctor must verify)
    },
  },
  { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────────────
    consultationId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Consultation',
      required: [true, 'Consultation reference is required'],
      unique:   true,   // 1:1 per consultation
    },
    patientId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Patient reference is required'],
    },
    doctorId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Doctor reference is required'],
    },

    // ── Clinical Content ───────────────────────────────────────────────────
    diagnosis: {
      type:     String,
      required: [true, 'Diagnosis is required'],
      trim:     true,
      maxlength: [300, 'Diagnosis too long'],
    },
    medications: {
      type:     [MedicationSchema],
      required: [true, 'At least one medication is required'],
      validate: {
        validator: (arr) => arr.length >= 1,
        message:  'Prescription must have at least one medication',
      },
    },
    generalInstructions: {
      type:      String,
      trim:      true,
      maxlength: [500, 'Instructions too long'],
      // Overall guidance, e.g., 'Rest for 3 days. Drink plenty of fluids.'
    },
    followUpDate: {
      type: Date,
      validate: {
        validator: (date) => !date || date > new Date(),
        message:  'Follow-up date must be in the future',
      },
    },

    // ── Immutable Snapshots ────────────────────────────────────────────────
    // These snapshot the doctor and patient state AT TIME OF PRESCRIPTION
    // If doctor changes their clinic address later, this record is unaffected
    doctorSnapshot: {
      name:               { type: String, required: true },
      specialty:          { type: String, required: true },
      qualifications:     { type: [String] },
      registrationNumber: { type: String },
      clinicName:         { type: String },
      clinicAddress:      { type: String },
      city:               { type: String },
      phone:              { type: String },
    },
    patientSnapshot: {
      name:        { type: String, required: true },
      age:         { type: Number },
      gender:      { type: String },
      dateOfBirth: { type: Date },
      allergies:   { type: [String] },
    },

    // ── Status ─────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    issuedAt: {
      type:    Date,
      default: Date.now,
    },

    // ── Audit ──────────────────────────────────────────────────────────────
    aiPrefillConfidence: {
      type: Number,
      min:  0,
      max:  100,
      // % of fields successfully pre-filled by AI-09
    },
    doctorReviewedAt: {
      type: Date,
      // Timestamp when doctor reviewed and saved the prescription
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
PrescriptionSchema.index({ patientId: 1, issuedAt: -1 });    // Patient prescription history
PrescriptionSchema.index({ doctorId:  1, issuedAt: -1 });    // Doctor's issued prescriptions
PrescriptionSchema.index({ consultationId: 1 });             // Consultation → Prescription lookup
PrescriptionSchema.index({ status: 1, followUpDate: 1 });    // Follow-up reminders

module.exports = mongoose.model('Prescription', PrescriptionSchema);
```

### Medication Object Reference

| Field | Type | Required | Examples |
|---|---|---|---|
| `drugName` | String | ✅ | "Metformin", "Amoxicillin 500mg Capsule" |
| `dose` | String | ❌ | "500mg", "1 tablet", "10mg/5ml (2 tsp)" |
| `frequency` | String | ❌ | "Twice daily", "Once at night", "Every 8 hours" |
| `duration` | String | ❌ | "5 days", "1 month", "Ongoing" |
| `route` | String (enum) | — | oral / topical / injection / inhaled / sublingual / other |
| `instructions` | String | ❌ | "Take with food", "Avoid in pregnancy" |
| `aiPrefilled` | Boolean | — | `true` = needs doctor review |

---

## 10. Collection 07 — Reminders

**Purpose:** Stores individual medication reminder schedules generated by AI-10 (reminderService) after a prescription is saved. One document per medication per time-of-day slot.

### Schema

```javascript
// server/models/Reminder.js

const ReminderSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────────────────
    patientId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Patient reference is required'],
    },
    prescriptionId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Prescription',
      required: [true, 'Prescription reference is required'],
    },

    // ── Medication Details ─────────────────────────────────────────────────
    drugName: {
      type:     String,
      required: [true, 'Drug name is required'],
      trim:     true,
    },
    dose: {
      type: String,
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
      // e.g., 'Take with food'
    },

    // ── Schedule ───────────────────────────────────────────────────────────
    scheduledTime: {
      type:     String,
      required: [true, 'Scheduled time is required'],
      match:    [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be HH:MM format'],
      // e.g., '08:00', '14:00', '21:00'
    },
    startDate: {
      type:    Date,
      default: Date.now,
      // When reminders begin (prescription start date)
    },
    endDate: {
      type:     Date,
      required: [true, 'End date is required'],
      // Computed from prescription duration (startDate + duration days)
    },
    daysTotal: {
      type:    Number,
      min:     1,
      // Total days of the prescription course
    },

    // ── Status ─────────────────────────────────────────────────────────────
    active: {
      type:    Boolean,
      default: true,
      // Set to false after endDate passes or patient disables
    },
    customizedTime: {
      type:    Boolean,
      default: false,
      // true = patient manually changed the default time
    },

    // ── Notification Payload ───────────────────────────────────────────────
    notificationTitle: {
      type: String,
      // e.g., '💊 Medication Reminder — Metformin'
    },
    notificationBody: {
      type: String,
      // e.g., 'Time to take Metformin 500mg. Take with food.'
    },

    // ── Acknowledgement ────────────────────────────────────────────────────
    lastAcknowledgedAt: {
      type: Date,
      // When patient last tapped "Taken" — optional tracking feature
    },
    totalAcknowledgements: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────────────────
ReminderSchema.index({ patientId: 1, active: 1 });               // Active reminders for patient
ReminderSchema.index({ patientId: 1, scheduledTime: 1 });        // Reminders by time
ReminderSchema.index({ prescriptionId: 1 });                     // All reminders for a prescription
ReminderSchema.index({ endDate: 1, active: 1 });                 // Cron: deactivate expired

module.exports = mongoose.model('Reminder', ReminderSchema);
```

---

## 11. Collection 08 — OTPs

**Purpose:** Stores one-time passwords for email verification (signup) and password reset. Uses MongoDB TTL index to auto-delete after 10 minutes — no manual cleanup needed.

### Schema

```javascript
// server/models/OTP.js

const OTPSchema = new mongoose.Schema(
  {
    // ── Target ─────────────────────────────────────────────────────────────
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      lowercase: true,
      trim:      true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      // Null for pre-signup OTPs (user not yet created)
    },

    // ── Code ───────────────────────────────────────────────────────────────
    code: {
      type:     String,
      required: [true, 'OTP code is required'],
      select:   false,
      // Stored as bcrypt hash (8 rounds) — NOT plaintext
      // Never returned in queries
    },

    // ── Type ───────────────────────────────────────────────────────────────
    type: {
      type:     String,
      required: [true, 'OTP type is required'],
      enum: {
        values:  ['email_verify', 'password_reset'],
        message: 'OTP type must be email_verify or password_reset',
      },
    },

    // ── Usage Tracking ─────────────────────────────────────────────────────
    attempts: {
      type:    Number,
      default: 0,
      min:     0,
      // Incremented each time a wrong OTP is submitted
    },
    maxAttempts: {
      type:    Number,
      default: 3,
      // After 3 failed attempts, OTP is invalidated
    },
    isUsed: {
      type:    Boolean,
      default: false,
      // Set to true once successfully verified — cannot be reused
    },

    // ── TTL ─────────────────────────────────────────────────────────────────
    expiresAt: {
      type:     Date,
      required: [true, 'Expiry date is required'],
      // Set to: new Date(Date.now() + 10 * 60 * 1000) → 10 minutes from now
    },
  },
  {
    timestamps: false,
    // No updatedAt needed — OTPs are created once, verified once, then deleted
  }
);

// ── TTL Index ─────────────────────────────────────────────────────────────
// MongoDB automatically deletes the document when expiresAt is reached
// No manual cleanup job needed
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ── Lookup Indexes ─────────────────────────────────────────────────────────
OTPSchema.index({ email: 1, type: 1, isUsed: 1 });
// Used in: db.otps.findOne({ email, type, isUsed: false, expiresAt: { $gt: now } })

module.exports = mongoose.model('OTP', OTPSchema);
```

### OTP Generation Logic

```javascript
// How OTPs are created in otpService.js

const generateOTP = async (email, type, userId = null) => {
  // 1. Invalidate any existing unused OTPs of the same type for this email
  await OTP.updateMany(
    { email, type, isUsed: false },
    { $set: { isUsed: true } }
  );

  // 2. Generate 6-digit code
  const rawCode = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Hash (bcrypt, 8 rounds — faster for 6-digit strings)
  const hashedCode = await bcrypt.hash(rawCode, 8);

  // 4. Save to DB
  await OTP.create({
    email,
    userId,
    code:       hashedCode,
    type,
    expiresAt:  new Date(Date.now() + 10 * 60 * 1000),
  });

  // 5. Return raw code for email delivery (never stored raw)
  return rawCode;
};
```

---

## 12. Collection 09 — SecurityLogs

**Purpose:** Append-only audit trail of all authentication events. Used by the Admin security panel (A-02) to detect suspicious activity. TTL index auto-deletes records after 90 days.

### Schema

```javascript
// server/models/SecurityLog.js

const SecurityLogSchema = new mongoose.Schema(
  {
    // ── Actor ──────────────────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      // Nullable: null for failed attempts where account doesn't exist
    },
    email: {
      type: String,
      // Stored even if userId is null (attempted email)
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      // Stored for filtering in admin panel
    },

    // ── Event ──────────────────────────────────────────────────────────────
    eventType: {
      type:     String,
      required: [true, 'Event type is required'],
      enum: {
        values: [
          'login_success',        // Successful login
          'login_failed',         // Wrong password (before lockout)
          'account_locked',       // Lockout triggered
          'account_unlocked',     // Lockout period expired
          'password_reset_req',   // Forgot password initiated
          'password_reset_done',  // Password successfully changed
          'otp_requested',        // OTP email sent
          'otp_verified',         // OTP successfully verified
          'otp_failed',           // Wrong OTP submitted
          'otp_expired',          // OTP used after expiry
          'signup_success',       // New account created
          'suspicious_ip',        // Multiple IPs detected
          'session_invalidated',  // Old session killed by new login
          'force_logout',         // Admin force-logged user out
          'account_deactivated',  // Admin deactivated account
          'account_banned',       // Admin banned account
          'account_reactivated',  // Admin reactivated account
        ],
        message: 'Invalid event type',
      },
    },

    // ── Context ────────────────────────────────────────────────────────────
    ipAddress: {
      type: String,
      // IPv4 or IPv6
    },
    userAgent: {
      type: String,
      // Browser/device info
    },
    details: {
      type: String,
      // Human-readable description of the event
    },

    // ── Severity ───────────────────────────────────────────────────────────
    severity: {
      type:    String,
      enum:    ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      // LOW:      Normal activity (login_success, otp_verified)
      // MEDIUM:   Warning (login_failed, otp_failed)
      // HIGH:     Concern (account_locked, suspicious_ip)
      // CRITICAL: Action needed (account_banned, force_logout)
    },

    // ── TTL ─────────────────────────────────────────────────────────────────
    createdAt: {
      type:    Date,
      default: Date.now,
      // Used by TTL index — auto-delete after 90 days
    },
  },
  {
    timestamps: false,
    // Only createdAt — no updatedAt (append-only, never modified)
  }
);

// ── TTL Index ─────────────────────────────────────────────────────────────
// Auto-delete logs older than 90 days (7,776,000 seconds)
SecurityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// ── Query Indexes ──────────────────────────────────────────────────────────
SecurityLogSchema.index({ userId: 1, createdAt: -1 });         // User's event history
SecurityLogSchema.index({ severity: 1, createdAt: -1 });       // Admin: filter by severity
SecurityLogSchema.index({ eventType: 1, createdAt: -1 });      // Admin: filter by type
SecurityLogSchema.index({ ipAddress: 1, createdAt: -1 });      // IP pattern detection

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
```

### Severity Classification

| Severity | Event Types | Admin Action |
|---|---|---|
| `LOW` | login_success, otp_verified, signup_success, account_unlocked | No action needed |
| `MEDIUM` | login_failed, otp_failed, otp_expired, password_reset_req | Monitor |
| `HIGH` | account_locked, suspicious_ip, session_invalidated | Review + possible action |
| `CRITICAL` | account_banned, force_logout, account_deactivated | Logged action |

---

## 13. Embedded Sub-Documents Reference

Summary of all objects embedded within parent documents (not separate collections):

| Sub-Document | Embedded In | Fields | Why Embedded |
|---|---|---|---|
| `TranscriptLine` | `Consultation.transcript[]` | speaker, originalText, translatedText, langs, isRisky, timestamp | Always read with consultation. Max ~200 lines per session. |
| `SOAPNote` | `Consultation.soapNote` | S/O/A/P sections with arrays | Single object, always read with consultation. Doctor review flow. |
| `RiskEvent` | `Consultation.riskEvents[]` | level, condition, triggerText, timestamp | Part of consultation record. Always viewed together. |
| `Medication` | `Prescription.medications[]` | drugName, dose, frequency, duration, route, instructions, aiPrefilled | Part of prescription. Always viewed/printed together. |
| `DoctorSnapshot` | `Prescription.doctorSnapshot` | name, specialty, qualifications, regNo, clinic, city, phone | Immutable at time of issue. Doctor profile may change. |
| `PatientSnapshot` | `Prescription.patientSnapshot` | name, age, gender, dob, allergies | Immutable at time of issue. Patient profile may change. |
| `Address` | `Patient.address` | street, area, pincode | Simple 3-field object. Never queried independently. |
| `EmergencyContact` | `Patient.emergencyContact` | name, phone, relation | Simple 3-field object. |
| `Availability` | `Doctor.availability` | workingDays, startTime, endTime, slotDuration, blockedDates, breakTimes | Always read with doctor profile. Tightly coupled. |
| `RescheduleHistory` | `Appointment.rescheduleHistory[]` | previousTime, newTime, changedBy, reason | Audit trail. Max ~5 entries. |

---

## 14. Index Strategy

### All Indexes Consolidated

```javascript
// Run this once on database initialization
// server/config/db.js or a separate indexing script

// ── USERS ──────────────────────────────────────────────────────────────────
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, isActive: 1 });
db.users.createIndex({ role: 1, city: 1 });
db.users.createIndex({ createdAt: -1 });

// ── PATIENTS ───────────────────────────────────────────────────────────────
db.patients.createIndex({ userId: 1 }, { unique: true });
db.patients.createIndex({ currentRiskLevel: 1 });
db.patients.createIndex({ 'emergencyContact.phone': 1 });

// ── DOCTORS ────────────────────────────────────────────────────────────────
db.doctors.createIndex({ userId: 1 }, { unique: true });
db.doctors.createIndex({ specialty: 1, city: 1, isVerified: 1 });     // Core search
db.doctors.createIndex({ city: 1, rating: -1 });                      // Best rated
db.doctors.createIndex({ languagesSpoken: 1, city: 1 });              // Language filter
db.doctors.createIndex({ status: 1, city: 1 });                       // Available now

// ── APPOINTMENTS ───────────────────────────────────────────────────────────
db.appointments.createIndex({ patientId: 1, scheduledAt: -1 });       // Patient history
db.appointments.createIndex({ doctorId:  1, scheduledAt: 1  });       // Doctor queue
db.appointments.createIndex({ doctorId:  1, status: 1 });             // Queue filter
db.appointments.createIndex({ scheduledAt: 1, status: 1 });           // Reminder cron
db.appointments.createIndex({ patientRiskLevel: 1, doctorId: 1 });    // Risk sort

// ── CONSULTATIONS ──────────────────────────────────────────────────────────
db.consultations.createIndex({ appointmentId: 1 }, { unique: true });
db.consultations.createIndex({ patientId: 1, createdAt: -1 });
db.consultations.createIndex({ doctorId:  1, createdAt: -1 });
db.consultations.createIndex({ doctorId: 1, 'soapNote.assessment.probableDiagnosis': 1 });
db.consultations.createIndex({ patientId: 1, status: 1 });

// ── PRESCRIPTIONS ──────────────────────────────────────────────────────────
db.prescriptions.createIndex({ consultationId: 1 }, { unique: true });
db.prescriptions.createIndex({ patientId: 1, issuedAt: -1 });
db.prescriptions.createIndex({ doctorId:  1, issuedAt: -1 });
db.prescriptions.createIndex({ status: 1, followUpDate: 1 });

// ── REMINDERS ──────────────────────────────────────────────────────────────
db.reminders.createIndex({ patientId: 1, active: 1 });
db.reminders.createIndex({ patientId: 1, scheduledTime: 1 });
db.reminders.createIndex({ prescriptionId: 1 });
db.reminders.createIndex({ endDate: 1, active: 1 });                  // Cron deactivation

// ── OTPS (TTL) ─────────────────────────────────────────────────────────────
db.otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });     // Auto-delete at expiry
db.otps.createIndex({ email: 1, type: 1, isUsed: 1 });                // Lookup

// ── SECURITY LOGS (TTL) ────────────────────────────────────────────────────
db.securitylogs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
db.securitylogs.createIndex({ userId: 1, createdAt: -1 });
db.securitylogs.createIndex({ severity: 1, createdAt: -1 });
db.securitylogs.createIndex({ eventType: 1, createdAt: -1 });
db.securitylogs.createIndex({ ipAddress: 1, createdAt: -1 });
```

### Index Performance Impact

| Query Pattern | Index Used | Without Index | With Index |
|---|---|---|---|
| Login by email | `users.email` | Full collection scan | Single key lookup |
| Search doctors by specialty + city | `doctors.specialty+city+isVerified` | Scan all doctors | Direct index range |
| Patient's appointment history | `appointments.patientId+scheduledAt` | Scan all appointments | Scoped index range |
| Doctor's daily queue | `appointments.doctorId+scheduledAt` | Scan all appointments | Scoped index range |
| Medical history timeline | `consultations.patientId+createdAt` | Scan all consultations | Fast sorted range |
| Top diagnoses (analytics) | `consultations.doctorId+probableDiagnosis` | Full aggregation scan | Covered index |
| Active reminders | `reminders.patientId+active` | Scan all reminders | Narrow filter |
| Security log severity filter | `securitylogs.severity+createdAt` | Full log scan | Direct range |

---

## 15. Data Relationships Map

```
REFERENCE (→) vs EMBED ({}) KEY:
══════════════════════════════════════════════════════════════

users._id        →  patients.userId           (1:1)
users._id        →  doctors.userId            (1:1)

users._id        →  appointments.patientId    (1:many)
users._id        →  appointments.doctorId     (1:many)

appointments._id →  consultations.appointmentId  (1:1)
users._id        →  consultations.patientId   (1:many)
users._id        →  consultations.doctorId    (1:many)

consultations._id→  prescriptions.consultationId (1:1)
users._id        →  prescriptions.patientId   (1:many)
users._id        →  prescriptions.doctorId    (1:many)

prescriptions._id→  reminders.prescriptionId  (1:many)
users._id        →  reminders.patientId       (1:many)

users._id        →  securitylogs.userId       (1:many)
users._id        →  otps.userId               (1:many)

consultations.soapNote        {} EMBEDDED
consultations.transcript[]    {} EMBEDDED
consultations.riskEvents[]    {} EMBEDDED
prescriptions.medications[]   {} EMBEDDED
prescriptions.doctorSnapshot  {} EMBEDDED (immutable copy)
prescriptions.patientSnapshot {} EMBEDDED (immutable copy)
doctors.availability          {} EMBEDDED
patients.emergencyContact     {} EMBEDDED
appointments.rescheduleHistory[] {} EMBEDDED
```

---

## 16. Data Lifecycle & TTL Policies

```
DOCUMENT LIFECYCLE BY COLLECTION
══════════════════════════════════════════════════════════════

USERS:
  Created:  Signup → isVerified: false
  Active:   After OTP verification → isVerified: true
  Soft-deleted: Admin deactivate → isActive: false
  Banned:   Admin ban → isBanned: true
  Deleted:  Only by admin (hard delete) — rare

PATIENTS / DOCTORS:
  Created:  Auto-created with User document on signup
  Updated:  Profile updates, AI risk assessment updates
  Never deleted independently — deleted if User deleted

APPOINTMENTS:
  Created:  Booking
  Active:   confirmed → in_progress → completed
  Archived: cancelled / no_show — kept for history
  Never hard-deleted — full history preserved

CONSULTATIONS:
  Created:  When doctor starts consultation
  Updated:  Transcript lines added in real-time
  Completed: Doctor ends consultation → status: completed
  Never deleted — permanent medical record

PRESCRIPTIONS:
  Created:  Doctor saves prescription after consultation
  Status:   active → completed (when follow-up done)
  Never deleted — permanent medical record

REMINDERS:
  Created:  AI-10 generates from prescription on save
  Active:   Until endDate reached or patient disables
  Deactivated: Cron job sets active: false when endDate passed
  May be deleted: Patient manually removes

OTPS (TTL = 10 MINUTES):
  Created:  When user requests OTP (signup or password reset)
  Invalidated: After first use → isUsed: true
  Auto-deleted: MongoDB TTL index — 10 minutes after expiresAt
  Max per email: Old OTPs invalidated when new one generated

SECURITY LOGS (TTL = 90 DAYS):
  Created:  On every auth event
  Never modified (append-only)
  Auto-deleted: MongoDB TTL index — 90 days after createdAt
```

---

## 17. Field Validation Rules

### Shared Validators

```javascript
// Validation rules used across multiple schemas

const PHONE_REGEX     = /^[6-9]\d{9}$/;           // Indian mobile: starts 6-9, 10 digits
const PINCODE_REGEX   = /^\d{6}$/;                 // Indian 6-digit pincode
const TIME_REGEX      = /^([01]\d|2[0-3]):([0-5]\d)$/;  // HH:MM 24-hour format
const EMAIL_REGEX     = /^\S+@\S+\.\S+$/;          // Basic email format

// Password rules (enforced at validator level + frontend strength bar)
const PASSWORD_RULES = {
  minLength:     8,
  requireUpper:  true,   // At least 1 uppercase letter
  requireNumber: true,   // At least 1 digit
  requireSpecial: true,  // At least 1 of: !@#$%^&*
};

// City enum (all schemas that use city)
const PHASE1_CITIES = [
  'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
  'Hyderabad', 'Delhi', 'Goa', 'Puducherry',
];

// Language enum (all schemas that use language codes)
const SUPPORTED_LANGUAGES = ['hi', 'ta', 'te', 'ml', 'kn', 'bn'];

// Risk level enum
const RISK_LEVELS = ['GREEN', 'YELLOW', 'RED'];
```

### Validation Failures

| Scenario | HTTP Code | Error Code | Message |
|---|---|---|---|
| Missing required field | 400 | `VALIDATION_ERROR` | "Field [name] is required" |
| Email already exists | 409 | `EMAIL_EXISTS` | "An account with this email already exists. Please log in instead." |
| Invalid email format | 400 | `VALIDATION_ERROR` | "Please provide a valid email address" |
| Weak password | 400 | `VALIDATION_ERROR` | "Password must be 8+ characters with uppercase, number, and special character" |
| Invalid role | 400 | `VALIDATION_ERROR` | "Role must be patient, doctor, or admin" |
| City not in Phase 1 | 400 | `VALIDATION_ERROR` | "City must be one of the 8 supported Phase 1 cities" |
| Past appointment date | 400 | `VALIDATION_ERROR` | "Appointment must be scheduled in the future" |
| Slot conflict | 409 | `SLOT_UNAVAILABLE` | "This time slot is no longer available. Please choose another." |
| Invalid OTP | 400 | `INVALID_OTP` | "Invalid or expired OTP. Please try again." |
| OTP too many attempts | 429 | `OTP_ATTEMPTS_EXCEEDED` | "Too many failed attempts. Please request a new OTP." |

---

## 18. Data Access Patterns

The most frequent database operations and their optimized query forms:

### Pattern 1 — Patient Login

```javascript
// Query: find user by email, include hashed password
const user = await User.findOne({ email })
  .select('+password +currentSessionToken');
// Index: users.email (unique)
```

### Pattern 2 — Doctor Search

```javascript
// Query: search available doctors by specialty + city
const doctors = await Doctor.find({
  specialty: 'Cardiologist',
  city:      'Hyderabad',
  isVerified: true,
  status:    'available',
})
.populate('userId', 'firstName lastName preferredLanguage')
.sort({ rating: -1 })
.limit(10);
// Index: doctors.specialty+city+isVerified
```

### Pattern 3 — Doctor's Daily Queue

```javascript
// Query: today's appointments for a doctor, ordered by time
const today = new Date(); today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

const queue = await Appointment.find({
  doctorId:   doctorId,
  scheduledAt: { $gte: today, $lt: tomorrow },
  status:     { $in: ['confirmed', 'in_progress'] },
})
.populate('patientId', 'firstName lastName')
.sort({ scheduledAt: 1 });
// Index: appointments.doctorId+scheduledAt
```

### Pattern 4 — Patient Medical History

```javascript
// Query: paginated consultation history for a patient
const { page = 1, limit = 10 } = req.query;
const consultations = await Consultation.find({ patientId })
  .select('createdAt status soapNote.assessment.probableDiagnosis prescriptionId')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(Number(limit))
  .populate('prescriptionId', 'issuedAt medications');
// Index: consultations.patientId+createdAt
```

### Pattern 5 — Doctor Analytics (Top Diagnoses)

```javascript
// Aggregation: top 5 diagnoses in last 30 days
const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const topDiagnoses = await Consultation.aggregate([
  {
    $match: {
      doctorId:  mongoose.Types.ObjectId(doctorId),
      createdAt: { $gte: monthAgo },
      'soapNote.doctorConfirmed': true,
      'soapNote.assessment.probableDiagnosis': { $exists: true, $ne: '' },
    },
  },
  {
    $group: {
      _id:   '$soapNote.assessment.probableDiagnosis',
      count: { $sum: 1 },
    },
  },
  { $sort:  { count: -1 } },
  { $limit: 5 },
]);
// Index: consultations.doctorId+probableDiagnosis
```

### Pattern 6 — Reminder Cron Job

```javascript
// Cron: deactivate expired reminders (runs daily at midnight)
const result = await Reminder.updateMany(
  { endDate: { $lte: new Date() }, active: true },
  { $set: { active: false } }
);
// Index: reminders.endDate+active
```

### Pattern 7 — Security Log Query (Admin Panel)

```javascript
// Query: high-severity security events, paginated
const logs = await SecurityLog.find({
  severity: { $in: ['HIGH', 'CRITICAL'] },
})
.sort({ createdAt: -1 })
.limit(50)
.populate('userId', 'firstName lastName email role');
// Index: securitylogs.severity+createdAt
```

---

## 19. Storage Estimation

MongoDB Atlas M0 Free Tier provides 512MB. Below is the estimated storage usage at different scales:

### Per-Document Size Estimates

| Collection | Avg Document Size | Notes |
|---|---|---|
| `users` | ~500 bytes | Core fields, no large arrays |
| `patients` | ~300 bytes | Small arrays (allergies, conditions) |
| `doctors` | ~800 bytes | Availability object, arrays |
| `appointments` | ~400 bytes | Dates, status, reschedule history |
| `consultations` | ~15 KB | 50 transcript lines × ~200 bytes each + SOAP note |
| `prescriptions` | ~1 KB | 3-5 medications + snapshots |
| `reminders` | ~200 bytes | Simple schedule document |
| `otps` | ~150 bytes | Short TTL — self-cleaning |
| `securitylogs` | ~300 bytes | TTL 90 days — self-cleaning |

### Storage at Scale

```
500 ACTIVE USERS (MVP Target):
══════════════════════════════════════════════════════════════

Collection          Docs       Size/doc    Total
───────────────────────────────────────────────────
users               500        500B        250 KB
patients            400        300B        120 KB
doctors             100        800B        80 KB
appointments        2,000      400B        800 KB
consultations       1,500      15 KB       22.5 MB
prescriptions       1,500      1 KB        1.5 MB
reminders           4,500      200B        900 KB
otps                <50        150B        < 8 KB (TTL)
securitylogs        5,000      300B        1.5 MB
───────────────────────────────────────────────────
TOTAL                                     ~28 MB
Free tier capacity:                       512 MB
Headroom remaining:                       484 MB
Estimated users at 512MB limit:           ~9,100 users

5,000 ACTIVE USERS (Phase 2):
══════════════════════════════════════════════════════════════

Estimated total:                          ~280 MB
Still within M0 free tier:               ✅ Yes

Upgrade trigger:                          ~9,000 users
Next tier: Atlas M2 ($9/month = 2GB)     → 90,000 users
```

---

## 20. Seed Data Reference

### Doctor Seed Structure

40 doctors seeded across 8 cities × 5 specialties for MVP:

```javascript
// server/seed/doctorSeed.js — data template

const SEED_SPECIALTIES = [
  'General Physician',
  'Cardiologist',
  'Neurologist',
  'Orthopedist',
  'Dermatologist',
];

const SEED_CITIES = [
  'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
  'Hyderabad', 'Delhi', 'Goa', 'Puducherry',
];

// One doctor per specialty per city = 8 cities × 5 specialties = 40 doctors
// Each gets:
//   User:   { firstName, lastName, email, password: "Doctor@2026",
//             role: 'doctor', city, isVerified: true }
//   Doctor: { specialty, qualifications: ['MBBS', 'MD'],
//             experienceYears: 8-15 (random),
//             rating: 3.8-4.9 (random), isVerified: true,
//             status: 'available', languagesSpoken: [city_language, 'hi'],
//             availability: { workingDays: ['Mon','Tue','Wed','Thu','Fri'],
//                             startTime: '09:00', endTime: '17:00',
//                             slotDurationMinutes: 30, maxDailySlots: 16 } }

// Sample generated doctor:
{
  email:     'dr.priya.sharma.cardio.hyderabad@medivoice.dev',
  firstName: 'Priya',
  lastName:  'Sharma',
  role:      'doctor',
  city:      'Hyderabad',
  specialty: 'Cardiologist',
  qualifications: ['MBBS', 'MD - Internal Medicine', 'DM - Cardiology'],
  experienceYears: 12,
  rating:    4.7,
  languagesSpoken: ['te', 'hi', 'en'],
  registrationNumber: 'MCI-HYD-CARD-001',
}
```

### Admin Seed

```javascript
// server/seed/adminSeed.js

// Creates one admin account for the platform
// CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN IN PRODUCTION

{
  email:     'admin@medivoice.ai',
  password:  'Admin@MediVoice2026',  // Change on first login
  firstName: 'Platform',
  lastName:  'Admin',
  role:      'admin',
  isVerified: true,
  isActive:   true,
}
```

---

<div align="center">

---

## Schema Summary

```
╔══════════════════════════════════════════════════════════════════╗
║            MEDIVOICE AI — DATA MODEL AT A GLANCE                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Collections:       9                                           ║
║  TTL Collections:   2 (OTPs: 10min · SecurityLogs: 90days)     ║
║  Embedded Docs:     10 sub-document types                       ║
║  Snapshot Docs:     2 (doctorSnapshot · patientSnapshot)        ║
║  Total Indexes:     32 across all collections                   ║
║  Compound Indexes:  12                                          ║
║  TTL Indexes:       2                                           ║
║  Unique Indexes:    6                                           ║
║                                                                  ║
║  Design Strategy:   Hybrid Embed + Reference                    ║
║  Atlas Tier:        M0 Free (512MB)                             ║
║  Capacity at M0:    ~9,000 active users                         ║
║  Region:            Mumbai (ap-south-1)                         ║
║  ODM:               Mongoose 8.x                                ║
║                                                                  ║
║  Collections by Role:                                           ║
║    Patient-facing:  users, patients, appointments,              ║
║                     consultations, prescriptions, reminders     ║
║    Doctor-facing:   users, doctors, appointments,               ║
║                     consultations, prescriptions                ║
║    Admin-facing:    users, securitylogs                         ║
║    Auth:            users, otps, securitylogs                   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Data Model & Schema v1.0**

*Every field has a purpose. Every index has a query. Every collection has one job.*

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_M0-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red?style=flat)
![Node.js](https://img.shields.io/badge/Node.js-20_LTS-43853D?style=flat&logo=node.js&logoColor=white)
![Free](https://img.shields.io/badge/Infrastructure-Zero_Cost-brightgreen?style=flat)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
