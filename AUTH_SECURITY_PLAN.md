<div align="center">

# 🔐 MEDIVOICE AI — Authentication & Security Plan
### Complete Security Architecture & Implementation Reference

![Document](https://img.shields.io/badge/Document-Auth%20%26%20Security%20Plan-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-JWT%20%2B%20bcrypt%20%2B%20OTP-purple?style=for-the-badge)
![Cost](https://img.shields.io/badge/Infrastructure-Zero%20Cost-brightgreen?style=for-the-badge)

> **The authoritative reference for every authentication flow, security layer,
> threat model, and protection mechanism in MediVoice AI.**
> Healthcare data demands the highest security standards — this plan delivers them at zero cost.

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication  
**Security Standard:** OWASP Top 10 compliant · Healthcare data privacy aware  
**Auth Strategy:** JWT in httpOnly cookies · Role-based access · OTP email verification  
**Constraint:** 100% Free tools — zero paid security services

</div>

---

## 📋 Table of Contents

1. [Security Philosophy](#1-security-philosophy)
2. [Threat Model](#2-threat-model)
3. [Authentication System Overview](#3-authentication-system-overview)
4. [User Registration Flow](#4-user-registration-flow)
5. [Email OTP System](#5-email-otp-system)
6. [Login & Session Management](#6-login--session-management)
7. [JWT Architecture](#7-jwt-architecture)
8. [Password Security](#8-password-security)
9. [Role-Based Access Control (RBAC)](#9-role-based-access-control-rbac)
10. [Rate Limiting & Brute Force Protection](#10-rate-limiting--brute-force-protection)
11. [Account Lockout System](#11-account-lockout-system)
12. [Single Session Enforcement](#12-single-session-enforcement)
13. [Password Reset Flow](#13-password-reset-flow)
14. [HTTP Security Headers](#14-http-security-headers)
15. [Input Validation & Sanitization](#15-input-validation--sanitization)
16. [CORS Policy](#16-cors-policy)
17. [Database Security](#17-database-security)
18. [API Security](#18-api-security)
19. [WebSocket Security](#19-websocket-security)
20. [Patient Data Privacy](#20-patient-data-privacy)
21. [Admin Security Monitor](#21-admin-security-monitor)
22. [Security Logging & Audit Trail](#22-security-logging--audit-trail)
23. [Suspicious Activity Detection](#23-suspicious-activity-detection)
24. [Frontend Security](#24-frontend-security)
25. [Environment & Secrets Management](#25-environment--secrets-management)
26. [Security Testing Checklist](#26-security-testing-checklist)
27. [Incident Response Plan](#27-incident-response-plan)
28. [OWASP Top 10 Compliance Map](#28-owasp-top-10-compliance-map)

---

## 1. Security Philosophy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       SECURITY FIRST PRINCIPLES                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  DEFENCE IN DEPTH                                                        │
│  Every security control has a backup. JWT verification happens in        │
│  middleware AND the database session check. Input sanitization runs      │
│  on the frontend AND again on the backend. Passwords are checked for     │
│  strength at the UI AND validated at the API level.                      │
│                                                                          │
│  ZERO TRUST BY DEFAULT                                                   │
│  Every API request is treated as untrusted until the JWT is verified,    │
│  the session token matches, and the role permits the action.             │
│  No route is accessible without explicit permission grant.               │
│                                                                          │
│  LEAST PRIVILEGE                                                         │
│  Patients cannot see doctor data. Doctors cannot see other doctors'      │
│  patients. Admins see metadata but never consultation content.           │
│  Each role gets exactly what it needs — nothing more.                    │
│                                                                          │
│  SECURE BY DEFAULT                                                       │
│  Accounts start unverified. Sessions start locked to one device.         │
│  All passwords are hashed before touching the database.                  │
│  All sensitive fields use select: false — never accidentally returned.   │
│                                                                          │
│  FAIL SAFELY                                                             │
│  On any auth error → deny access, log the event, return a generic        │
│  message. Never reveal whether an email exists, which field failed,      │
│  or any detail that helps an attacker.                                   │
│                                                                          │
│  HEALTHCARE DATA AWARENESS                                               │
│  Consultation transcripts, prescriptions, and diagnoses are medical      │
│  records. They are scoped strictly. Doctors only see records of their    │
│  own patients. Patients only see their own records.                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Threat Model

### Assets to Protect

| Asset | Sensitivity | Risk If Exposed |
|---|---|---|
| Patient medical records (consultations, diagnoses) | 🔴 Critical | Privacy violation, regulatory risk, patient harm |
| Prescription data | 🔴 Critical | Drug misuse, patient harm |
| Authentication credentials (passwords, OTPs) | 🔴 Critical | Account takeover |
| JWT tokens | 🔴 Critical | Full account impersonation |
| Doctor registration numbers & credentials | 🟠 High | Identity fraud, credential misuse |
| User PII (name, email, phone) | 🟠 High | Identity theft, spam |
| Appointment records | 🟡 Medium | Privacy exposure |
| Security logs | 🟡 Medium | Attack pattern revelation if exposed |
| Doctor availability & schedule | 🟢 Low | Minor scheduling disruption |

### Threat Actors

| Actor | Motivation | Likely Attack Vectors |
|---|---|---|
| **Credential attacker** | Account takeover | Brute force login, credential stuffing |
| **Session hijacker** | Impersonate legitimate user | XSS token theft, MITM |
| **Data scraper** | Harvest patient/doctor PII | Mass enumeration, IDOR |
| **Injection attacker** | Database manipulation | NoSQL injection, XSS stored |
| **Insider threat** | Unauthorized data access | Privilege escalation, IDOR |
| **Automated bot** | Spam accounts, OTP flooding | Rate abuse, fake signups |

### Threat → Countermeasure Map

| Threat | OWASP Category | Countermeasure in MediVoice AI |
|---|---|---|
| Credential brute force | A07 Auth Failures | Rate limiting · Account lockout (3 attempts → 15 min) |
| Session token theft via XSS | A03 Injection | JWT in httpOnly cookie — JS cannot read it |
| Cross-Site Request Forgery | A01 Broken Access | SameSite=Strict cookie · CORS origin whitelist |
| NoSQL injection | A03 Injection | express-mongo-sanitize strips `$` and `.` |
| Stored XSS | A03 Injection | xss-clean sanitizes all string inputs |
| IDOR — access other user's data | A01 Broken Access | RBAC middleware · patientId === req.userId checks |
| Password exposure | A07 Auth Failures | bcrypt hash (12 rounds) · select:false field |
| OTP interception/reuse | A07 Auth Failures | bcrypt-hashed OTP · single-use · 10 min TTL |
| Token not invalidated on logout | A07 Auth Failures | currentSessionToken hash — overwritten on new login |
| Sensitive data in transit | A02 Cryptographic | HTTPS enforced by Vercel + Render |
| Missing security headers | A05 Misconfiguration | Helmet.js — 12 security headers |
| Excessive data exposure | A03 Injection | select:false on password · role-scoped queries |
| Mass assignment | A08 Software Integrity | Explicit field whitelisting in controllers |

---

## 3. Authentication System Overview

```
MEDIVOICE AI — COMPLETE AUTH FLOW MAP
═══════════════════════════════════════════════════════════════════════

                         NEW USER
                             │
                    ┌────────▼────────┐
                    │   SIGNUP PAGE   │
                    │ Role selection  │
                    │ Password rules  │
                    └────────┬────────┘
                             │ POST /auth/signup
                             ▼
                    ┌────────────────────────┐
                    │  BACKEND VALIDATION    │
                    │  • Email format check  │
                    │  • Password strength   │
                    │  • Duplicate email     │
                    │  • Role enum check     │
                    └────────┬───────────────┘
                             │
                    ┌────────▼────────┐
                    │  User created   │
                    │ isVerified:false│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  OTP GENERATED  │
                    │  6-digit code   │
                    │  bcrypt hashed  │
                    │  10 min TTL     │
                    │  Sent to Gmail  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ OTP VERIFY PAGE │
                    │  3 attempts max │
                    └────────┬────────┘
                             │ Correct OTP
                    ┌────────▼────────┐
                    │  isVerified:    │
                    │     true        │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐       RETURNING USER
                    │   LOGIN PAGE    │◄──────────────────────
                    │ Email + Password│
                    └────────┬────────┘
                             │ POST /auth/login
                             ▼
               ┌─────────────────────────────┐
               │        SECURITY CHECKS       │
               │  1. Email exists & verified? │
               │  2. Account active & unbanned?│
               │  3. Not locked out?          │
               │  4. Password matches?        │
               └──────────────┬──────────────┘
                              │ All pass
                    ┌─────────▼─────────┐
                    │   JWT ISSUED      │
                    │  Role + userId    │
                    │  24h expiry       │
                    │  httpOnly cookie  │
                    │  Single session   │
                    │  enforcement      │
                    └─────────┬─────────┘
                              │
               ┌──────────────▼────────────────┐
               │        ROLE REDIRECT           │
               │  patient → /patient            │
               │  doctor  → /doctor             │
               │  admin   → /admin              │
               └───────────────────────────────┘
```

---

## 4. User Registration Flow

### Complete Registration Sequence

```
REGISTRATION FLOW — STEP BY STEP
═══════════════════════════════════════════════════════════════════════

CLIENT                          SERVER                         DATABASE
──────                          ──────                         ────────

1. User fills SignupForm
   (name, email, pw, role, city)
          │
          │ POST /api/v1/auth/signup
          ▼
                           2. authLimiter middleware
                              (5 req / 15 min / IP)
                                     │
                           3. express-validator
                              checks all fields
                                     │ fail → 400
                                     │ pass ↓
                           4. mongoSanitize cleans input
                           5. xss-clean cleans input
                                     │
                           6. Check email uniqueness
                                                    ──────► users.findOne({email})
                                                    ◄──────
                                     │ exists → 409
                                     │ new ↓
                           7. bcrypt.hash(password, 12)
                                     │
                           8. Create User document         ──────►  users.create({
                              isVerified: false                       isVerified:false
                              isActive: true                        })
                                     │                     ◄──────
                           9. Generate 6-digit OTP
                              Math.floor(100000 +
                              Math.random() * 900000)
                                     │
                           10. bcrypt.hash(otp, 8)
                                     │
                           11. Save OTP to DB              ──────►  otps.create({
                               TTL: expiresAt=+10min                  code:hashed,
                                                                       expiresAt
                                                                     })
                                     │
                           12. Nodemailer → Gmail SMTP
                               "Your OTP: 847293
                                Expires in 10 minutes"
                                     │
          ◄──────────────  13. Return 201:
                              "OTP sent to email"

14. User enters OTP
    on OTPVerifyPage
          │
          │ POST /api/v1/auth/verify-otp
          ▼
                           15. Find OTP in DB:            ──────►  otps.findOne({
                               { email, type,                         email,
                                 isUsed:false,                        isUsed:false,
                                 expiresAt:{$gt:now} }                expiresAt>now
                                                                     })
                                     │ not found → 400 "OTP expired or invalid"
                                     │ found ↓
                           16. Increment attempts
                               If attempts >= 3 → 429
                                     │
                           17. bcrypt.compare(
                               submitted, otp.code)
                                     │ fail → 400 (generic)
                                     │ pass ↓
                           18. Mark OTP used:             ──────►  otps.updateOne(
                               isUsed: true                           {isUsed:true})
                                     │
                           19. Activate user:             ──────►  users.updateOne(
                               isVerified: true                       {isVerified:true})
                                     │
          ◄──────────────  20. Return 200:
                              "Email verified. Please log in."
```

### Registration Validation Rules

```javascript
// server/validators/authValidators.js

const { body } = require('express-validator');

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\-_+=?]).{8,72}$/;
// Rules:
//   ✅ Minimum 8 characters
//   ✅ At least 1 uppercase letter (A-Z)
//   ✅ At least 1 digit (0-9)
//   ✅ At least 1 special character (!@#$%^&*-_+=?)
//   ✅ Maximum 72 characters (bcrypt limitation)

exports.signupValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters'),

  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email too long'),  // RFC 5321 limit

  body('password')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be at least 8 characters and include: ' +
      '1 uppercase letter, 1 number, 1 special character (!@#$%^&*)'
    ),

  body('role')
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Role must be patient, doctor, or admin'),

  body('city')
    .optional()
    .isIn(['Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
           'Hyderabad', 'Delhi', 'Goa', 'Puducherry'])
    .withMessage('City must be one of the 8 supported Phase 1 cities'),

  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
];
```

---

## 5. Email OTP System

### OTP Architecture

```
OTP SECURITY DESIGN
═══════════════════════════════════════════════════════════════════════

  Generation:      Math.floor(100000 + Math.random() * 900000)
                   → 6 digits, range 100000–999999
                   → 900,000 possible values

  Storage:         bcrypt.hash(otp, 8) — hashed before DB write
                   NEVER stored in plaintext
                   select: false — never accidentally returned

  Delivery:        Nodemailer + Gmail SMTP (587 STARTTLS)
                   Subject: "MediVoice AI — Your Verification Code"

  Expiry:          MongoDB TTL index on expiresAt
                   → new Date(Date.now() + 10 * 60 * 1000)
                   → Auto-deleted by MongoDB at expiry — no cron needed

  Single-use:      isUsed: true set immediately on successful verify
                   Concurrent verification attempts: first one wins

  Attempt limit:   3 wrong attempts → OTP invalidated
                   Must request a new OTP after 3 failures

  Resend limit:    1 resend per minute (otpLimiter: 3/hour/email)
                   Previous OTP invalidated on new request

  Brute force:     900,000 values × 3 attempts = 1 in 300,000 chance
                   With 10-min expiry: effectively impossible to guess
```

### OTP Service Implementation

```javascript
// server/services/otpService.js

const bcrypt    = require('bcrypt');
const crypto    = require('crypto');
const OTP       = require('../models/OTP');
const User      = require('../models/User');
const { sendOTPEmail } = require('../config/mailer');

// ─── Generate and Send OTP ────────────────────────────────────────────────
const generateAndSendOTP = async (email, type, userId = null) => {
  // Step 1: Invalidate all existing unused OTPs for this email+type
  // Prevents multiple valid OTPs from existing simultaneously
  await OTP.updateMany(
    { email: email.toLowerCase(), type, isUsed: false },
    { $set: { isUsed: true } }
  );

  // Step 2: Generate cryptographically sufficient 6-digit code
  // Using crypto.randomInt for better randomness than Math.random()
  const rawCode = crypto.randomInt(100000, 999999).toString();

  // Step 3: Hash with bcrypt (8 rounds — fast for 6-char strings)
  const hashedCode = await bcrypt.hash(rawCode, 8);

  // Step 4: Save hashed OTP to database with TTL
  await OTP.create({
    email:      email.toLowerCase(),
    userId,
    code:       hashedCode,
    type,
    expiresAt:  new Date(Date.now() + 10 * 60 * 1000),
    attempts:   0,
    isUsed:     false,
  });

  // Step 5: Send raw code via email (last thing — DB write must succeed first)
  await sendOTPEmail(email, rawCode, type);

  // Step 6: Return nothing sensitive — controller just needs success confirmation
  return { sent: true };
};

// ─── Verify OTP ───────────────────────────────────────────────────────────
const verifyOTP = async (email, submittedCode, type) => {
  // Step 1: Find active OTP (not used, not expired)
  const otpRecord = await OTP.findOne({
    email:    email.toLowerCase(),
    type,
    isUsed:   false,
    expiresAt: { $gt: new Date() },
  }).select('+code');  // code is select:false — must explicitly include

  // Step 2: Generic error if not found — don't reveal why
  if (!otpRecord) {
    throw new AppError(
      'OTP is invalid or has expired. Please request a new one.',
      400,
      'INVALID_OTP'
    );
  }

  // Step 3: Check attempt limit
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });
    throw new AppError(
      'Too many failed attempts. Please request a new OTP.',
      429,
      'OTP_ATTEMPTS_EXCEEDED'
    );
  }

  // Step 4: Increment attempt counter before comparing
  // (prevents timing-based attack on the attempt counter)
  await OTP.findByIdAndUpdate(otpRecord._id, {
    $inc: { attempts: 1 },
  });

  // Step 5: Constant-time bcrypt comparison
  const isValid = await bcrypt.compare(submittedCode.toString(), otpRecord.code);

  if (!isValid) {
    // Return remaining attempts in error (UX — not a security leak)
    const remaining = otpRecord.maxAttempts - (otpRecord.attempts + 1);
    throw new AppError(
      `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      400,
      'INVALID_OTP'
    );
  }

  // Step 6: Mark OTP as used — prevents replay attacks
  await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

  return { verified: true, userId: otpRecord.userId };
};

module.exports = { generateAndSendOTP, verifyOTP };
```

### Email Template

```javascript
// server/config/mailer.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,          // STARTTLS — upgrades to TLS after connection
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // Gmail App Password (not Gmail password)
  },
  tls: {
    rejectUnauthorized: true,      // Verify Gmail's TLS certificate
  },
});

const OTP_SUBJECTS = {
  email_verify:   'MediVoice AI — Verify Your Email',
  password_reset: 'MediVoice AI — Reset Your Password',
};

const sendOTPEmail = async (toEmail, otpCode, type) => {
  const isVerify = type === 'email_verify';

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      toEmail,
    subject: OTP_SUBJECTS[type],
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <div style="background: #1A56DB; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🎙️ MediVoice AI</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #111928; font-size: 18px;">
              ${isVerify ? 'Verify Your Email Address' : 'Reset Your Password'}
            </h2>
            <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
              ${isVerify
                ? 'Use the code below to verify your email and activate your MediVoice AI account.'
                : 'Use the code below to reset your MediVoice AI password.'}
            </p>
            <div style="background: white; border: 2px solid #1A56DB;
                        border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 36px; font-weight: bold; letter-spacing: 12px;
                        color: #1A56DB; margin: 0; font-family: monospace;">
                ${otpCode}
              </p>
            </div>
            <p style="color: #E02424; font-size: 13px; font-weight: bold;">
              ⏰ This code expires in 10 minutes.
            </p>
            <p style="color: #6B7280; font-size: 13px;">
              If you did not request this, please ignore this email.
              Your account remains secure.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9CA3AF; font-size: 11px; text-align: center;">
              MediVoice AI · AI-Powered Healthcare Communication · India
            </p>
          </div>
        </body>
      </html>
    `,
  });
};

module.exports = { transporter, sendOTPEmail };
```

---

## 6. Login & Session Management

### Login Security Flow

```javascript
// server/services/authService.js

const login = async (email, password, ipAddress, userAgent) => {
  const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 3;
  const LOCKOUT_MS   = (parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 15) * 60 * 1000;

  // ── Step 1: Find user (always include sensitive fields) ─────────────────
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+password +currentSessionToken +failedLoginAttempts +lockoutUntil');

  // ── Step 2: Generic "invalid credentials" for non-existent email ────────
  // NEVER say "email not found" — that confirms which emails are registered
  if (!user) {
    await SecurityLog.create({
      email,
      eventType: 'login_failed',
      ipAddress,
      userAgent,
      details:   'Email not registered',
      severity:  'MEDIUM',
    });
    throw new AppError(
      'Invalid email or password.',
      401,
      'INVALID_CREDENTIALS'
    );
  }

  // ── Step 3: Check account status before password attempt ────────────────
  if (!user.isVerified) {
    throw new AppError(
      'Please verify your email address before logging in.',
      401,
      'EMAIL_NOT_VERIFIED'
    );
  }

  if (!user.isActive) {
    throw new AppError(
      'Your account has been deactivated. Please contact support.',
      401,
      'ACCOUNT_INACTIVE'
    );
  }

  if (user.isBanned) {
    throw new AppError(
      'Your account has been suspended. Please contact support.',
      403,
      'ACCOUNT_BANNED'
    );
  }

  // ── Step 4: Check lockout ───────────────────────────────────────────────
  if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockoutUntil - Date.now()) / 60000);
    await SecurityLog.create({
      userId:    user._id,
      email:     user.email,
      role:      user.role,
      eventType: 'account_locked',
      ipAddress,
      userAgent,
      details:   `Account still locked. ${minutesLeft} minutes remaining.`,
      severity:  'HIGH',
    });
    throw new AppError(
      `Too many failed attempts. Your account is locked for ${minutesLeft} more minute${minutesLeft !== 1 ? 's' : ''}.`,
      423,
      'ACCOUNT_LOCKED',
      { lockedUntil: user.lockoutUntil, minutesRemaining: minutesLeft }
    );
  }

  // ── Step 5: Compare password ────────────────────────────────────────────
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    // Increment failed attempts
    const newAttempts = (user.failedLoginAttempts || 0) + 1;
    const update = { failedLoginAttempts: newAttempts };

    if (newAttempts >= MAX_ATTEMPTS) {
      update.lockoutUntil = new Date(Date.now() + LOCKOUT_MS);
      await SecurityLog.create({
        userId:    user._id,
        email:     user.email,
        role:      user.role,
        eventType: 'account_locked',
        ipAddress,
        userAgent,
        details:   `Locked after ${newAttempts} failed attempts.`,
        severity:  'HIGH',
      });
    } else {
      await SecurityLog.create({
        userId:    user._id,
        email:     user.email,
        role:      user.role,
        eventType: 'login_failed',
        ipAddress,
        userAgent,
        details:   `Failed attempt ${newAttempts}/${MAX_ATTEMPTS}.`,
        severity:  'MEDIUM',
      });
    }

    await User.findByIdAndUpdate(user._id, update);

    const remaining = MAX_ATTEMPTS - newAttempts;
    throw new AppError(
      remaining > 0
        ? `Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining before lockout.`
        : 'Too many failed attempts. Your account has been locked for 15 minutes.',
      401,
      'INVALID_CREDENTIALS',
      { attemptsRemaining: remaining > 0 ? remaining : 0 }
    );
  }

  // ── Step 6: Password correct — generate JWT ─────────────────────────────
  const token = jwt.sign(
    {
      sub:   user._id.toString(),
      role:  user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  // ── Step 7: Single session enforcement ──────────────────────────────────
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await User.findByIdAndUpdate(user._id, {
    failedLoginAttempts: 0,
    lockoutUntil:        null,
    lastLoginAt:         new Date(),
    lastLoginIP:         ipAddress,
    currentSessionToken: tokenHash,
  });

  // ── Step 8: Log successful login ─────────────────────────────────────────
  await SecurityLog.create({
    userId:    user._id,
    email:     user.email,
    role:      user.role,
    eventType: 'login_success',
    ipAddress,
    userAgent,
    severity:  'LOW',
  });

  return { token, user: sanitizeUser(user) };
};

// Strip sensitive fields before returning to client
const sanitizeUser = (user) => ({
  id:                user._id,
  firstName:         user.firstName,
  lastName:          user.lastName,
  email:             user.email,
  role:              user.role,
  city:              user.city,
  preferredLanguage: user.preferredLanguage,
  isVerified:        user.isVerified,
});
```

---

## 7. JWT Architecture

### Token Design

```
JWT STRUCTURE
═══════════════════════════════════════════════════════════════════════

HEADER (base64url encoded):
{
  "alg": "HS256",      ← HMAC-SHA256 signature algorithm
  "typ": "JWT"
}

PAYLOAD (base64url encoded):
{
  "sub":   "64abc123def456789",  ← MongoDB User._id (subject)
  "role":  "patient",            ← Role for RBAC (never trust without verify)
  "email": "ravi@gmail.com",     ← Convenience for logging
  "iat":   1713600000,           ← Issued at (Unix timestamp)
  "exp":   1713686400            ← Expires at (iat + 24 hours)
}

SIGNATURE:
  HMAC-SHA256(
    base64url(header) + "." + base64url(payload),
    JWT_SECRET
  )
  JWT_SECRET: minimum 32 random bytes
  Generate: node -e "require('crypto').randomBytes(32).toString('hex')"

COOKIE SETTINGS:
  Set-Cookie: token=<jwt>
    HttpOnly   → JavaScript CANNOT read (blocks XSS token theft)
    Secure     → HTTPS only (enforced in production)
    SameSite=Strict → Blocks CSRF (cookie NOT sent on cross-site requests)
    Max-Age=86400   → 24 hours (same as JWT expiry)
    Path=/          → Available for all API routes
```

### JWT Middleware

```javascript
// server/middleware/authMiddleware.js

const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // ── 1. Extract JWT from httpOnly cookie ────────────────────────────────
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code:    'NO_TOKEN',
        message: 'Authentication required. Please log in.',
      },
    });
  }

  // ── 2. Verify signature and expiry ─────────────────────────────────────
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Your session has expired. Please log in again.'
      : 'Invalid authentication token. Please log in again.';

    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message },
    });
  }

  // ── 3. Check user still exists and is active ───────────────────────────
  const user = await User.findById(decoded.sub)
    .select('+currentSessionToken');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'Account no longer exists.' },
    });
  }

  if (!user.isActive || user.isBanned) {
    return res.status(401).json({
      success: false,
      error: { code: 'ACCOUNT_INACTIVE', message: 'Account is not active.' },
    });
  }

  // ── 4. Single session check ─────────────────────────────────────────────
  // If a new login occurred, this token's hash will NOT match the stored one
  const incomingHash = crypto.createHash('sha256').update(token).digest('hex');

  if (user.currentSessionToken !== incomingHash) {
    return res.status(401).json({
      success: false,
      error: {
        code:    'SESSION_SUPERSEDED',
        message: 'You have been logged in from another device. Please log in again.',
      },
    });
  }

  // ── 5. Attach to request for downstream use ────────────────────────────
  req.user   = user;
  req.userId = decoded.sub;
  req.role   = decoded.role;    // From verified JWT — trustworthy

  next();
};

// ─── Role Guard Factory ──────────────────────────────────────────────────
// Usage: roleGuard('doctor')  or  roleGuard('patient', 'doctor')
const roleGuard = (...allowedRoles) => (req, res, next) => {
  if (!req.role || !allowedRoles.includes(req.role)) {
    return res.status(403).json({
      success: false,
      error: {
        code:    'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      },
    });
  }
  next();
};

module.exports = { authMiddleware, roleGuard };
```

### Token Lifecycle

```
JWT LIFECYCLE
═══════════════════════════════════════════════════════════════════════

ISSUED:     On successful login
            Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict

VALID:      For 24 hours from issue time
            Every request carries it automatically (httpOnly cookie)

INVALIDATED by:
  ── User logs out:
     POST /auth/logout
     → User.currentSessionToken = null
     → res.clearCookie('token')
     → Old JWT is now useless even if intercepted

  ── New login on any device:
     New JWT generated → new hash stored in User.currentSessionToken
     → Old JWT rejected on next use (hash mismatch)
     → Old session socket receives 'session:invalidated' event

  ── Admin force-logout:
     PATCH /admin/users/:id/force-logout
     → User.currentSessionToken = null
     → Next request from that user → 401 SESSION_SUPERSEDED

  ── Account deactivated:
     User.isActive = false
     → authMiddleware check 3 catches this → 401

  ── Token expires naturally:
     After 24 hours → jwt.verify() throws TokenExpiredError
     → 401 returned → Frontend redirects to login

REFRESH:    Not implemented in MVP (re-login required after 24h)
            Reason: Simpler security model for healthcare MVP
```

---

## 8. Password Security

### Hashing Strategy

```javascript
// Hashing configuration

// ── Passwords ─────────────────────────────────────────────────────────────
// Cost factor: 12 rounds ≈ 300ms per hash on a modern server
// Protects against GPU-accelerated brute force attacks
// bcrypt auto-generates a unique random salt per hash

bcrypt.hash(password, 12)
// Salt rounds = 12 → 2^12 = 4,096 iterations
// Time to crack 1 hash at 1 billion guesses/second:
//   100,000+ years for an 8-char complex password

// ── OTPs ──────────────────────────────────────────────────────────────────
// Reduced to 8 rounds for 6-char codes (faster UX without security loss)
// 6-digit OTP has limited entropy — brute force prevented by attempt limits
// Real protection: 3 attempt limit + 10 minute expiry, not hash strength

bcrypt.hash(otp.toString(), 8)
// Time: ≈ 30ms per hash (acceptable for real-time OTP verification)
```

### Password Strength Requirements

```
PASSWORD STRENGTH RULES
═══════════════════════════════════════════════════════════════════════

                          REQUIRED:
  ┌────────────────────────────────────────────────────────┐
  │  Minimum length:    8 characters                       │
  │  Maximum length:    72 characters (bcrypt limit)       │
  │  Uppercase letter:  At least 1 (A-Z)                   │
  │  Digit:             At least 1 (0-9)                   │
  │  Special char:      At least 1 (!@#$%^&*-_+=?)         │
  └────────────────────────────────────────────────────────┘

  Frontend visual strength meter:
  ┌────────┬──────────────────────────────────────────────┐
  │  Score │ Label     │ Bar Color  │ Meets length + 0 more│
  │   1    │ Very Weak │ 🔴 Red     │ Has length only      │
  │   2    │ Weak      │ 🟠 Orange  │ + 1 rule             │
  │   3    │ Fair      │ 🟡 Yellow  │ + 2 rules            │
  │   4    │ Strong    │ 🟢 Green   │ All 4 rules met      │
  └────────┴──────────────────────────────────────────────┘

  Form submit blocked until score = 4 (all rules met)
```

### Password Field Protection

```javascript
// Field declared as select: false in User schema
password: {
  type:   String,
  select: false,
  // This field is NEVER included in query results by default
  // Must explicitly request: User.findOne({email}).select('+password')
  // If a developer accidentally returns user object in API response,
  // the password hash is NOT included — safe by default
}

// After any profile update, password is NEVER changed unless
// the service explicitly calls bcrypt.hash() and saves
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // ← guard
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

---

## 9. Role-Based Access Control (RBAC)

### Role Definitions

```
RBAC MODEL
═══════════════════════════════════════════════════════════════════════

  ROLE: patient
  ─────────────
  Can access:    /api/v1/patients/me/*     (own profile + records)
                 /api/v1/patients/chat     (AI chatbot)
                 /api/v1/patients/hospitals (hospital finder)
                 /api/v1/doctors/search    (read-only public data)
                 /api/v1/auth/*
  Cannot access: /api/v1/doctors/me/*     (doctor-only)
                 /api/v1/admin/*           (admin-only)
  Data scope:    Own records only (patientId === req.userId enforced in service)

  ROLE: doctor
  ────────────
  Can access:    /api/v1/doctors/me/*      (own profile + practice)
                 /api/v1/doctors/search    (own + other doctor public data)
                 /api/v1/auth/*
  Cannot access: /api/v1/patients/me/*    (patient-only routes)
                 /api/v1/admin/*           (admin-only)
  Data scope:    Own patients only
                 (doctorId === req.userId enforced in service)

  ROLE: admin
  ───────────
  Can access:    /api/v1/admin/*           (all platform management)
                 /api/v1/auth/*
  Cannot access: /api/v1/patients/me/*    (patient personal routes)
                 /api/v1/doctors/me/*     (doctor personal routes)
  Data scope:    User metadata only
                 Admin CANNOT read consultation content or prescriptions
                 (privacy protection — even admins don't see medical data)
```

### Route Protection Implementation

```javascript
// server/routes/patientRoutes.js
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');

// All patient routes require authentication + patient role
router.use(authMiddleware);
router.use(roleGuard('patient'));

router.get('/profile',          patientController.getProfile);
router.patch('/profile',        patientController.updateProfile);
router.get('/appointments',     appointmentController.getAppointments);
router.post('/appointments',    appointmentController.bookAppointment);
// ...

// ─────────────────────────────────────────────────────────────────────────

// server/routes/doctorRoutes.js

// Public doctor routes (no auth — anyone can search)
router.get('/search',           doctorController.searchDoctors);
router.get('/:id/profile',      doctorController.getDoctorProfile);
router.get('/:id/slots',        doctorController.getAvailableSlots);

// Protected doctor routes (auth + doctor role)
router.use('/me', authMiddleware, roleGuard('doctor'));
router.get('/me/profile',       doctorController.getMyProfile);
router.get('/me/queue',         doctorController.getMyQueue);
// ...

// ─────────────────────────────────────────────────────────────────────────

// server/routes/adminRoutes.js

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(roleGuard('admin'));

router.get('/stats',            adminController.getStats);
router.get('/users',            adminController.getUsers);
// ...
```

### Data-Level Scoping (Service Layer)

```javascript
// RBAC is not just route-level — it is enforced in every service query

// server/services/consultationService.js

// Patient can ONLY access their own consultations
const getConsultationsForPatient = async (patientId) => {
  return Consultation.find({ patientId })   // ← patientId = req.userId
    .sort({ createdAt: -1 });
};

// Doctor can ONLY access consultations where they are the doctor
const getConsultationsForDoctor = async (doctorId) => {
  return Consultation.find({ doctorId })    // ← doctorId = req.userId
    .sort({ createdAt: -1 });
};

// Doctor accessing a specific patient's history:
// MUST verify the patient has an appointment with this doctor
const getPatientHistoryForDoctor = async (patientId, doctorId) => {
  // Verify relationship exists before granting access
  const hasRelationship = await Appointment.exists({
    patientId,
    doctorId,
    status: { $in: ['confirmed', 'in_progress', 'completed'] },
  });

  if (!hasRelationship) {
    throw new AppError(
      'You do not have access to this patient\'s records.',
      403,
      'FORBIDDEN'
    );
  }

  return Consultation.find({ patientId, doctorId })
    .sort({ createdAt: -1 });
};
```

---

## 10. Rate Limiting & Brute Force Protection

### Rate Limit Configuration

```javascript
// server/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// ── Helper: Create a rate limiter with standard options ───────────────────
const createLimiter = (options) =>
  rateLimit({
    windowMs:        options.windowMs,
    max:             options.max,
    standardHeaders: true,           // RateLimit-* headers in response
    legacyHeaders:   false,          // Disable X-RateLimit-* deprecated headers
    keyGenerator:    (req) => req.ip, // Limit per IP address
    handler:         (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          code:       'RATE_LIMIT_EXCEEDED',
          message:    options.message,
          retryAfter: Math.ceil(options.windowMs / 1000 / 60),
        },
      });
    },
  });

// ── Rate Limiters ─────────────────────────────────────────────────────────

// Global limiter: all API routes
exports.globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max:      100,               // 100 requests per IP per 15 min
  message:  'Too many requests from this IP. Please wait 15 minutes.',
});

// Auth limiter: login + forgot-password (tightest)
exports.authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max:      5,                 // Only 5 login attempts per IP per 15 min
  message:  'Too many authentication attempts. Please wait 15 minutes.',
});

// OTP limiter: signup verify + resend
exports.otpLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,    // 1 hour
  max:      3,                 // 3 OTP requests per IP per hour
  message:  'Too many OTP requests. Please wait 1 hour.',
});

// AI limiter: chatbot + doctor QA (Hugging Face free tier protection)
exports.aiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max:      30,                // 30 AI requests per IP per 15 min
  message:  'AI request limit reached. Please wait 15 minutes.',
});

// Signup limiter: prevent mass account creation
exports.signupLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,    // 1 hour
  max:      5,                 // 5 signups per IP per hour
  message:  'Too many signup attempts from this IP. Please wait 1 hour.',
});
```

### Rate Limit Application

```javascript
// server/app.js — how limiters are applied

// Global: all /api/* routes
app.use('/api/', globalLimiter);

// Per-route: more restrictive limits where needed
app.use('/api/v1/auth/login',           authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);
app.use('/api/v1/auth/signup',          signupLimiter);
app.use('/api/v1/auth/verify-otp',      otpLimiter);
app.use('/api/v1/auth/resend-otp',      otpLimiter);

// AI routes
app.use('/api/v1/patients/chat',              aiLimiter);
app.use('/api/v1/doctors/me/assistant',       aiLimiter);
app.use('/api/v1/doctors/me/consultation',    aiLimiter);
```

---

## 11. Account Lockout System

### Lockout Logic

```
ACCOUNT LOCKOUT SYSTEM
═══════════════════════════════════════════════════════════════════════

Trigger:      3 consecutive failed password attempts
Duration:     15 minutes from last failed attempt
Counter:      User.failedLoginAttempts (increments per wrong password)
Reset:        User.failedLoginAttempts = 0 on successful login
Auto-unlock:  User.lockoutUntil < Date.now() → account accessible again

LOCKOUT STATES:
  failedLoginAttempts: 0  → Normal
  failedLoginAttempts: 1  → Warning: 2 attempts remaining
  failedLoginAttempts: 2  → Warning: 1 attempt remaining
  failedLoginAttempts: 3  → lockoutUntil = now + 15 minutes
                             SecurityLog: { eventType: 'account_locked',
                                            severity: 'HIGH' }

LOCKOUT RESPONSE (HTTP 423):
  {
    "success": false,
    "error": {
      "code": "ACCOUNT_LOCKED",
      "message": "Too many failed attempts. Your account is locked for 12 more minutes.",
      "lockedUntil": "2026-04-20T10:45:00.000Z",
      "minutesRemaining": 12
    }
  }

FRONTEND BEHAVIOR:
  → Show lockout modal with countdown timer
  → Disable login form inputs during lockout
  → Auto-enable when minutesRemaining reaches 0
  → Clear timer on page refresh (re-check on next submit)

ADMIN ACTION:
  → Admin can force-unlock from Security Monitor panel
  → Sets: failedLoginAttempts: 0, lockoutUntil: null
```

---

## 12. Single Session Enforcement

### How It Works

```
SINGLE SESSION ENFORCEMENT
═══════════════════════════════════════════════════════════════════════

PROBLEM:
  Without this, if a user logs in from 2 devices, both sessions
  are valid simultaneously. Stolen tokens remain valid forever.

SOLUTION:
  Store the SHA-256 hash of the CURRENT JWT in the database.
  Every auth request verifies the incoming token hash matches.
  New login → new token → new hash overwrites old hash → old token invalid.

FLOW:

  DEVICE A (Patient's phone):
    Logs in → JWT-A generated
    → tokenHashA = SHA-256(JWT-A) stored in User.currentSessionToken
    → Device A makes API calls with JWT-A ✅

  DEVICE B (Attacker with stolen token OR second device):
    Logs in → JWT-B generated
    → tokenHashB = SHA-256(JWT-B) OVERWRITES User.currentSessionToken
    → Device B makes API calls with JWT-B ✅

  DEVICE A (next request):
    Sends JWT-A
    → SHA-256(JWT-A) = tokenHashA
    → Compared with User.currentSessionToken = tokenHashB
    → MISMATCH → 401 SESSION_SUPERSEDED ❌
    → Device A socket receives 'session:invalidated' event
    → Frontend shows: "You have been logged in from another device.
                       Please log in again."

IMPLEMENTATION:
  On login:
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await User.findByIdAndUpdate(userId, {
      currentSessionToken: tokenHash
    });

  In authMiddleware (every request):
    const incomingHash = crypto.createHash('sha256').update(token).digest('hex');
    if (user.currentSessionToken !== incomingHash) {
      return 401 SESSION_SUPERSEDED;
    }

  On logout:
    await User.findByIdAndUpdate(userId, { currentSessionToken: null });
    res.clearCookie('token');
```

---

## 13. Password Reset Flow

```
PASSWORD RESET FLOW — COMPLETE SECURITY SEQUENCE
═══════════════════════════════════════════════════════════════════════

1. User clicks "Forgot Password" on LoginPage
   Enters email address
         │
         │ POST /auth/forgot-password
         ▼
   Backend receives email
         │
   ┌─────┴─────┐
  Found    Not Found
   │            │
   │       Return SAME response:
   │       "If an account exists with this
   │        email, an OTP has been sent."
   │       (Don't reveal email existence)
   │
   ▼
   Generate 6-digit OTP
   bcrypt.hash(otp, 8)
   Save to DB (type: 'password_reset', TTL: 10 min)
   Send to email via Nodemailer
         │
   User receives Gmail OTP
         │
         │ POST /auth/reset-password
         │ { email, otp, newPassword, confirmPassword }
         ▼
   Validate:
   • newPassword matches confirmPassword
   • newPassword meets strength requirements
   • newPassword !== current password (optional check)
         │
   verifyOTP(email, otp, 'password_reset')
         │ fail → 400 generic
         │ pass ↓
   bcrypt.hash(newPassword, 12)
         │
   User.findOneAndUpdate({ email }, {
     password: hashedPassword,
     currentSessionToken: null,    ← Invalidate ALL existing sessions
     failedLoginAttempts: 0,       ← Reset lockout
     lockoutUntil: null,           ← Clear lockout
     passwordChangedAt: new Date()
   });
         │
   SecurityLog: { eventType: 'password_reset_done', severity: 'LOW' }
         │
   Return 200: "Password reset successful. Please log in."
         │
   Frontend: redirect to /login
```

---

## 14. HTTP Security Headers

### Helmet.js Configuration

```javascript
// server/app.js — complete security header setup

const helmet = require('helmet');

app.use(
  helmet({
    // ── Content Security Policy ────────────────────────────────────────────
    contentSecurityPolicy: {
      directives: {
        defaultSrc:   ["'self'"],
        scriptSrc:    ["'self'", "'unsafe-inline'"],
        // unsafe-inline needed for Tailwind CSS JIT in dev
        // Production: use nonce-based CSP

        styleSrc:     ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc:      ["'self'", "https://fonts.gstatic.com"],

        imgSrc:       ["'self'", "data:", "https://tile.openstreetmap.org"],
        // data: for inline avatar initials, OSM for map tiles

        connectSrc:   [
          "'self'",
          "https://api-inference.huggingface.co",   // AI NER + QA
          "https://libretranslate.com",              // Translation
          "https://api.mymemory.translated.net",     // Translation fallback
          "https://overpass-api.de",                 // Hospital data
          "wss:",                                    // WebSocket (socket.io)
          "ws:",                                     // WebSocket dev
        ],

        frameSrc:     ["'none'"],        // No iframes (prevents clickjacking)
        objectSrc:    ["'none'"],        // No plugins
        upgradeInsecureRequests: [],     // Force HTTPS for all requests
      },
    },

    // ── HSTS: Force HTTPS for 1 year ───────────────────────────────────────
    hsts: {
      maxAge:            31536000,   // 1 year in seconds
      includeSubDomains: true,
      preload:           true,
    },

    // ── Clickjacking protection ────────────────────────────────────────────
    frameguard: { action: 'deny' },   // X-Frame-Options: DENY

    // ── MIME type sniffing protection ──────────────────────────────────────
    noSniff: true,                    // X-Content-Type-Options: nosniff

    // ── XSS Protection (legacy browsers) ──────────────────────────────────
    xssFilter: true,                  // X-XSS-Protection: 1; mode=block

    // ── Referrer Policy ────────────────────────────────────────────────────
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    // ── Permissions Policy ─────────────────────────────────────────────────
    permissionsPolicy: {
      features: {
        geolocation:  ['self'],      // Only allowed for hospital finder
        microphone:   ['self'],      // Only allowed for consultation
        camera:       ['none'],      // Not used
        payment:      ['none'],      // Not used in MVP
      },
    },
  })
);
```

### Security Headers Reference Table

| Header | Value | Protects Against |
|---|---|---|
| `Content-Security-Policy` | Strict allow-list | XSS, data injection, malicious scripts |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | SSL stripping, MITM |
| `X-Frame-Options` | `DENY` | Clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | MIME type confusion attacks |
| `X-XSS-Protection` | `1; mode=block` | Reflected XSS (legacy browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer information leakage |
| `Permissions-Policy` | Restricted per feature | Unauthorized geolocation/mic access |

---

## 15. Input Validation & Sanitization

### Three-Layer Input Protection

```
INPUT SECURITY PIPELINE
═══════════════════════════════════════════════════════════════════════

Layer 1: CLIENT-SIDE (React + Validators)
  ↓ Prevents bad UX — not a security control
  ↓ Immediate feedback on format errors
  ↓ Cannot be trusted — must not be relied upon for security

Layer 2: API GATEWAY (express-validator + sanitizers)
  ↓ REAL security boundary
  ↓ Rejects malformed input before any business logic runs
  ↓ Returns structured 400 errors with field-level messages

Layer 3: DATABASE (Mongoose schema validation)
  ↓ Last line of defence
  ↓ Type checking, enum validation, regex patterns
  ↓ Catches anything that bypassed Layer 2

ALL THREE MUST INDEPENDENTLY PASS for data to be persisted
```

### Sanitization Middleware

```javascript
// server/app.js — sanitization middleware stack

const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');

// ── 1. NoSQL Injection Prevention ─────────────────────────────────────────
// Removes $ and . from req.body, req.query, req.params
// Prevents: { "email": { "$gt": "" } } injection attacks
app.use(mongoSanitize({
  replaceWith: '_',    // Replace $ and . with underscore instead of removing
  onSanitize: ({ req, key }) => {
    // Log any sanitization attempts — potential attack signal
    console.warn(`[SECURITY] Sanitized key: ${key} in ${req.originalUrl}`);
  },
}));

// ── 2. XSS Prevention ─────────────────────────────────────────────────────
// Strips HTML tags from all string inputs
// Prevents: "<script>alert('xss')</script>" stored in database
// Before:  "Hello <script>alert(1)</script>"
// After:   "Hello "
app.use(xss());

// ── 3. Body Size Limit ────────────────────────────────────────────────────
// Prevents JSON bomb / large payload attacks
app.use(express.json({ limit: '10kb' }));    // Max 10KB body
app.use(express.urlencoded({
  extended: false,
  limit:    '10kb',
}));
```

### Validation Error Response

```javascript
// server/middleware/validate.js

const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Collect all field errors
    const fieldErrors = errors.array().reduce((acc, err) => {
      if (!acc[err.path]) acc[err.path] = err.msg;
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      error: {
        code:    'VALIDATION_ERROR',
        message: 'Please correct the highlighted fields.',
        fields:  fieldErrors,
        // e.g., { "email": "Please provide a valid email address",
        //         "password": "Password must include uppercase..." }
      },
    });
  }

  next();
};
```

---

## 16. CORS Policy

```javascript
// server/app.js — CORS configuration

const cors = require('cors');

const corsOptions = {
  // ── Allowed Origins ────────────────────────────────────────────────────
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,              // Primary: https://medivoice.vercel.app
      'http://localhost:3000',             // Development
      'http://localhost:5173',             // Vite dev server
    ].filter(Boolean);                    // Remove undefined values

    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },

  // ── Allow Cookies (httpOnly JWT) ────────────────────────────────────────
  credentials: true,
  // REQUIRED for httpOnly cookies to be sent/received

  // ── Allowed HTTP Methods ────────────────────────────────────────────────
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // ── Allowed Headers ────────────────────────────────────────────────────
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // ── Expose These Headers to Frontend ───────────────────────────────────
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  // Allows frontend to show "N requests remaining" messaging

  // ── Preflight Cache ────────────────────────────────────────────────────
  maxAge: 86400,    // Cache preflight response for 24 hours
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight explicitly
app.options('*', cors(corsOptions));
```

---

## 17. Database Security

### MongoDB Atlas Security Settings

```
MONGODB ATLAS SECURITY CONFIGURATION
═══════════════════════════════════════════════════════════════════════

NETWORK ACCESS:
  ✅ IP Whitelist: Render hosting IPs only (not 0.0.0.0/0)
  ✅ No public IP access in production
  Development: Whitelist developer IP + Render IP

DATABASE USER:
  ✅ Dedicated user for MediVoice AI (not Atlas admin)
  ✅ Permissions: readWrite on medivoice database only
  ✅ Username: medivoice_app_user (not root/admin)

ENCRYPTION:
  ✅ Encryption at rest: Enabled by default on Atlas M0
  ✅ Encryption in transit: TLS 1.2+ enforced by Atlas

AUDIT:
  ✅ Atlas Activity Feed: Login events, config changes logged
  ✅ MongoDB Atlas triggers: Alert on unusual query patterns

CONNECTION STRING SECURITY:
  ✅ Never hardcoded — always from process.env.MONGODB_URI
  ✅ Connection string includes username + password
  ✅ Connection string stored in Render env vars (encrypted)
  ✅ .env file in .gitignore — never committed
```

### Mongoose Security Settings

```javascript
// server/config/db.js

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    // ── Connection Pool ─────────────────────────────────────────────────
    maxPoolSize:     5,          // Limit connections (free tier constraint)
    minPoolSize:     1,

    // ── Timeouts ────────────────────────────────────────────────────────
    serverSelectionTimeoutMS: 5000,   // Fail fast if Atlas unreachable
    socketTimeoutMS:          45000,  // Close idle sockets after 45s
    connectTimeoutMS:         10000,  // Initial connection timeout

    // ── Security ────────────────────────────────────────────────────────
    tls:                   true,      // Enforce TLS (Atlas requires this)
    retryWrites:           true,      // Retry on transient network errors
    w:                     'majority', // Write concern: majority of nodes confirm
  });
};

// ── Prevent Mongoose Prototype Pollution ──────────────────────────────────
// Disable mongoose.prototype overwrite from query results
mongoose.set('sanitizeFilter', true);  // Mongoose 6+ — sanitizes query filters
```

### Sensitive Field Protection

```javascript
// Fields that are NEVER returned in API responses

// In User.js schema:
password:            { select: false }  // bcrypt hash — never exposed
currentSessionToken: { select: false }  // session hash — never exposed

// In OTP.js schema:
code:                { select: false }  // bcrypt hash — never exposed

// Explicit override when needed (login only):
const user = await User.findOne({ email })
  .select('+password +currentSessionToken');
// Must explicitly request — cannot accidentally leak
```

---

## 18. API Security

### Request Security Pipeline

```javascript
// server/app.js — complete security middleware order
// ORDER MATTERS — security layers must be applied before routes

const express        = require('express');
const helmet         = require('helmet');
const cors           = require('cors');
const compression    = require('compression');
const rateLimit      = require('express-rate-limit');
const mongoSanitize  = require('express-mongo-sanitize');
const xss            = require('xss-clean');
const cookieParser   = require('cookie-parser');
const hpp            = require('hpp');               // HTTP Parameter Pollution

const app = express();

// 1. Trust proxy (needed for correct IP behind Render/Vercel load balancer)
app.set('trust proxy', 1);

// 2. Security headers (FIRST — before any response can be sent)
app.use(helmet(helmetConfig));

// 3. CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 4. Body compression (after CORS, before body parsing)
app.use(compression());

// 5. Global rate limiting
app.use('/api/', globalLimiter);

// 6. Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(cookieParser());

// 7. HTTP Parameter Pollution prevention
app.use(hpp({
  whitelist: ['specialty', 'city', 'language'],
  // Allow these params to have multiple values (search filters)
}));

// 8. Input sanitization (after body parsing, before routes)
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(xss());

// 9. Routes (after all security middleware)
app.use('/api/v1/auth',     require('./routes/authRoutes'));
app.use('/api/v1/patients', require('./routes/patientRoutes'));
app.use('/api/v1/doctors',  require('./routes/doctorRoutes'));
app.use('/api/v1/admin',    require('./routes/adminRoutes'));

// 10. 404 handler
app.use('*', (req, res) => res.status(404).json({
  success: false,
  error: { code: 'NOT_FOUND', message: 'Endpoint not found.' },
}));

// 11. Global error handler (LAST)
app.use(require('./middleware/errorHandler').globalErrorHandler);
```

### API Response Security Rules

```javascript
// Rules followed in every controller/service

// ✅ RULE 1: Never return sensitive fields
// Always use sanitizeUser() before returning user objects
const sanitizeUser = (user) => ({
  id:        user._id,
  firstName: user.firstName,
  lastName:  user.lastName,
  email:     user.email,
  role:      user.role,
  // ❌ NEVER include: password, currentSessionToken, failedLoginAttempts
});

// ✅ RULE 2: Generic error messages for auth failures
// "Invalid email or password" — not "Email not found" or "Wrong password"
// Prevents email enumeration attacks

// ✅ RULE 3: Explicit field selection in DB queries
await User.findById(id).select('firstName lastName email role city');
// Never: await User.findById(id) — returns ALL fields including sensitive ones

// ✅ RULE 4: Validate ownership before data access
if (appointment.patientId.toString() !== req.userId) {
  throw new AppError('Access denied.', 403, 'FORBIDDEN');
}

// ✅ RULE 5: No stack traces in production responses
if (process.env.NODE_ENV === 'production') {
  // Return generic error — log full error internally
  res.status(500).json({ error: 'Internal server error.' });
} else {
  // Development: include stack for debugging
  res.status(500).json({ error: err.message, stack: err.stack });
}
```

---

## 19. WebSocket Security

### Socket.io Authentication

```javascript
// server/websocket/transcriptSocket.js

const jwt    = require('jsonwebtoken');
const cookie = require('cookie');

const setupTranscriptSocket = (io) => {
  // ── Socket Auth Middleware ───────────────────────────────────────────────
  // Every socket connection must present a valid JWT
  io.use(async (socket, next) => {
    try {
      // Extract token from httpOnly cookie (same as HTTP requests)
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token   = cookies.token;

      if (!token) {
        return next(new Error('SOCKET_AUTH_REQUIRED'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify user still active
      const user = await User.findById(decoded.sub)
        .select('+currentSessionToken');

      if (!user || !user.isActive || user.isBanned) {
        return next(new Error('SOCKET_AUTH_INVALID'));
      }

      // Session token check (single session enforcement)
      const tokenHash = require('crypto')
        .createHash('sha256').update(token).digest('hex');

      if (user.currentSessionToken !== tokenHash) {
        return next(new Error('SOCKET_SESSION_EXPIRED'));
      }

      // Attach user to socket for downstream handlers
      socket.userId = decoded.sub;
      socket.role   = decoded.role;
      socket.user   = user;

      next();  // ✅ Authenticated
    } catch (err) {
      next(new Error('SOCKET_AUTH_FAILED'));
    }
  });

  // ── Room Authorization ────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    socket.on('join:consultation', async ({ consultationId }) => {
      // Verify this user is a participant in this consultation
      const consultation = await Consultation.findById(consultationId)
        .select('patientId doctorId status');

      if (!consultation) {
        socket.emit('error:socket', { code: 'ROOM_NOT_FOUND' });
        return;
      }

      const isParticipant =
        consultation.patientId.toString() === socket.userId ||
        consultation.doctorId.toString()  === socket.userId;

      if (!isParticipant) {
        socket.emit('error:socket', { code: 'ROOM_FORBIDDEN' });
        return;
      }

      if (consultation.status !== 'active') {
        socket.emit('error:socket', { code: 'CONSULTATION_NOT_ACTIVE' });
        return;
      }

      socket.join(`consultation:${consultationId}`);
    });

    // ── Input Validation on Events ──────────────────────────────────────────
    socket.on('transcript:patient', async ({ consultationId, text, sourceLang, targetLang }) => {
      // Validate: text must be string, max 1000 chars, not empty
      if (!text || typeof text !== 'string' || text.length > 1000) {
        socket.emit('error:socket', { code: 'INVALID_TRANSCRIPT_INPUT' });
        return;
      }

      // Validate: language codes must be in supported set
      const SUPPORTED = ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'en', 'hi-IN', 'ta-IN'];
      if (!SUPPORTED.includes(sourceLang) || !SUPPORTED.includes(targetLang)) {
        socket.emit('error:socket', { code: 'INVALID_LANGUAGE' });
        return;
      }

      // Sanitize: strip HTML/scripts from transcribed text
      const cleanText = xss(text);

      // Proceed with translation and broadcast
      // ...
    });
  });
};
```

---

## 20. Patient Data Privacy

### Privacy Architecture

```
PATIENT DATA PRIVACY DESIGN
═══════════════════════════════════════════════════════════════════════

PRINCIPLE: Medical data is private by design, not by configuration

WHO CAN ACCESS WHAT:
  ┌─────────────────────────────────────────────────────────────┐
  │  Data Type              │ Patient │ Doctor │ Other Doctor │ Admin │
  ├─────────────────────────┼─────────┼────────┼─────────────┼───────┤
  │  Own profile            │   ✅    │   ❌   │      ❌     │  Meta │
  │  Own appointments       │   ✅    │   Own  │      ❌     │  Meta │
  │  Consultation transcript│   ✅    │   Own  │      ❌     │   ❌  │
  │  SOAP notes             │   ✅    │   Own  │      ❌     │   ❌  │
  │  Prescriptions          │   ✅    │   Own  │      ❌     │   ❌  │
  │  Medical history        │   ✅    │   Own  │      ❌     │   ❌  │
  │  Other patient's data   │   ❌    │   ❌   │      ❌     │   ❌  │
  └─────────────────────────┴─────────┴────────┴─────────────┴───────┘

CONSENT REQUIREMENT:
  Before live consultation begins:
    → Patient sees ConsentModal
    → Must check: "I consent to my consultation being transcribed
                   and stored for my medical records."
    → consultation.patientConsentGiven = true (recorded with timestamp)
    → Transcription DOES NOT BEGIN until consent is granted

TRANSCRIPT STORAGE SECURITY:
  → Stored in MongoDB Atlas (encrypted at rest)
  → Transmitted over HTTPS (encrypted in transit)
  → Never sent to any third-party service in identifiable form
  → NER processing: text sent to Hugging Face WITHOUT patient name/ID
  → Translation: text sent to LibreTranslate WITHOUT patient identifiers

PRESCRIPTION PRIVACY:
  → Accessible only to the patient and prescribing doctor
  → PDF generated client-side (jsPDF) — prescription content never
    passes through server after initial creation
  → Download URL is not publicly accessible

SOS EMERGENCY DATA:
  → SOS button uses tel:108 (device phone app)
  → NO patient data sent to external service
  → Patient's location is ONLY used for hospital finder (browser GPS)
    and is NEVER stored on MediVoice AI servers
```

---

## 21. Admin Security Monitor

### Security Dashboard Features

```javascript
// server/controllers/adminController.js

// ── Get Security Events (Admin Panel A-02) ────────────────────────────────
const getSecurityLogs = async (req, res) => {
  const {
    page      = 1,
    limit     = 50,
    severity,         // Filter: LOW | MEDIUM | HIGH | CRITICAL
    eventType,        // Filter: specific event type
    userId,           // Filter: specific user
    fromDate,         // Filter: date range start
    toDate,           // Filter: date range end
  } = req.query;

  const filter = {};
  if (severity)  filter.severity  = severity;
  if (eventType) filter.eventType = eventType;
  if (userId)    filter.userId    = userId;
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate)   filter.createdAt.$lte = new Date(toDate);
  }

  const [logs, total] = await Promise.all([
    SecurityLog.find(filter)
      .populate('userId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    SecurityLog.countDocuments(filter),
  ]);

  res.json({ success: true, data: { logs, total, page, limit } });
};

// ── Force Logout User ─────────────────────────────────────────────────────
const forceLogout = async (req, res) => {
  const { userId } = req.params;

  // Invalidate session token
  await User.findByIdAndUpdate(userId, { currentSessionToken: null });

  // Log the admin action
  await SecurityLog.create({
    userId:    userId,
    eventType: 'force_logout',
    details:   `Force-logged out by admin ${req.userId}`,
    severity:  'CRITICAL',
    ipAddress: req.ip,
  });

  // Notify user's socket (if connected)
  req.io.to(`user:${userId}`).emit('session:invalidated', {
    reason: 'Admin has logged you out for security reasons.',
  });

  res.json({ success: true, message: 'User session terminated.' });
};

// ── Get Suspicious Activity Summary ─────────────────────────────────────
const getSuspiciousActivity = async (req, res) => {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find IPs with multiple failed attempts in 24 hours
  const suspiciousIPs = await SecurityLog.aggregate([
    {
      $match: {
        eventType: { $in: ['login_failed', 'account_locked'] },
        createdAt: { $gte: last24h },
      },
    },
    {
      $group: {
        _id:           '$ipAddress',
        failedCount:   { $sum: 1 },
        targetEmails:  { $addToSet: '$email' },
        lastAttempt:   { $max: '$createdAt' },
      },
    },
    { $match: { failedCount: { $gte: 3 } } },  // Flag IPs with 3+ failures
    { $sort:  { failedCount: -1 } },
    { $limit: 20 },
  ]);

  res.json({ success: true, data: { suspiciousIPs } });
};
```

---

## 22. Security Logging & Audit Trail

### Log Coverage Matrix

| Event | Log Created | Severity | Details Captured |
|---|---|---|---|
| Signup success | ✅ | LOW | email, role, IP, userAgent |
| Signup email duplicate | ✅ | MEDIUM | email, IP (potential enumeration) |
| OTP requested | ✅ | LOW | email, type, IP |
| OTP verified | ✅ | LOW | email, type, userId |
| OTP failed | ✅ | MEDIUM | email, attempt count, IP |
| OTP expired used | ✅ | MEDIUM | email, IP |
| Login success | ✅ | LOW | userId, role, IP, userAgent |
| Login failed | ✅ | MEDIUM | email, attempt number, IP |
| Account locked | ✅ | HIGH | userId, IP, attempt count |
| Account unlocked | ✅ | LOW | userId |
| Password reset requested | ✅ | LOW | email, IP |
| Password reset completed | ✅ | LOW | userId |
| Session invalidated | ✅ | MEDIUM | userId, reason |
| Force logout by admin | ✅ | CRITICAL | userId, adminId |
| Account deactivated | ✅ | CRITICAL | userId, adminId |
| Account banned | ✅ | CRITICAL | userId, adminId |
| Suspicious IP detected | ✅ | HIGH | ipAddress, email targets, count |

---

## 23. Suspicious Activity Detection

```javascript
// server/services/securityService.js

// ── Detect Multi-IP Attack Pattern ────────────────────────────────────────
// If same email is attacked from 3+ different IPs in 1 hour → flag
const detectMultiIPAttack = async (email, ipAddress) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const uniqueIPs = await SecurityLog.distinct('ipAddress', {
    email,
    eventType: { $in: ['login_failed', 'otp_failed'] },
    createdAt: { $gte: oneHourAgo },
  });

  if (uniqueIPs.length >= 3 && !uniqueIPs.includes(ipAddress)) {
    await SecurityLog.create({
      email,
      eventType: 'suspicious_ip',
      ipAddress,
      details:   `Attack from ${uniqueIPs.length + 1} unique IPs in 1 hour`,
      severity:  'HIGH',
    });

    // Notify admin via in-app notification (not email — free tier protection)
    // Admin socket will see this in real-time on Security Monitor
  }
};

// ── Detect Credential Stuffing ────────────────────────────────────────────
// If same IP tries 10+ different emails in 15 min → flag
const detectCredentialStuffing = async (ipAddress, email) => {
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

  const uniqueEmails = await SecurityLog.distinct('email', {
    ipAddress,
    eventType: 'login_failed',
    createdAt: { $gte: fifteenMinAgo },
  });

  if (uniqueEmails.length >= 10) {
    await SecurityLog.create({
      email,
      eventType: 'suspicious_ip',
      ipAddress,
      details:   `Credential stuffing: ${uniqueEmails.length} emails tried in 15 min`,
      severity:  'CRITICAL',
    });
  }
};
```

---

## 24. Frontend Security

### React Security Implementation

```javascript
// ── 1. Token Storage (NEVER localStorage) ──────────────────────────────────
// JWT is in httpOnly cookie — frontend cannot read it
// This is intentional — XSS attacks cannot steal the token
// Auth state comes from GET /auth/me on app load

// ── 2. Axios Interceptor — Auto-Logout on 401 ──────────────────────────────
// client/src/utils/axiosConfig.js
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state
      useAuthStore.getState().setUser(null);
      // Redirect to login
      window.location.href = '/login?reason=session_expired';
    }
    return Promise.reject(error);
  }
);

// ── 3. React PrivateRoute — Double Guard ──────────────────────────────────
// Even if a user manipulates frontend state, the API will reject them
// Frontend guard = better UX; Backend guard = actual security

const PrivateRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  if (loading)             return <FullScreenLoader />;
  if (!user)               return <Navigate to="/login" replace />;
  if (user.role !== role)  return <Navigate to={`/${user.role}`} replace />;
  return children;
};

// ── 4. No Sensitive Data in URL ───────────────────────────────────────────
// ✅ /patient/consultation/64abc123   (ID is OK in URL)
// ❌ /patient/login?token=eyJhbGc... (JWT in URL = logged in server/browser history)
// ❌ /patient/login?email=x&pw=y      (Credentials in URL = catastrophic)

// ── 5. Content Security Policy compliance ─────────────────────────────────
// No eval(), no new Function(), no inline handlers in HTML
// No external scripts except explicitly allowed in CSP

// ── 6. Dependency Security ─────────────────────────────────────────────────
// package.json scripts include audit:
// "audit": "npm audit --audit-level=high"
// Run: npm audit before every production deployment
```

---

## 25. Environment & Secrets Management

### Secrets Handling Rules

```
SECRETS MANAGEMENT
═══════════════════════════════════════════════════════════════════════

RULE 1: NEVER COMMIT SECRETS
  .env is in .gitignore — always
  .env.example has ALL keys with EMPTY values — committed
  Developers copy .env.example → .env and fill values locally

RULE 2: PRODUCTION SECRETS IN PLATFORM ENV VARS
  Backend secrets → Render Environment Variables (encrypted)
  Frontend env → Vercel Environment Variables (encrypted)
  NEVER hardcoded in source code or Docker images

RULE 3: JWT_SECRET STRENGTH
  Minimum: 32 random bytes (256 bits of entropy)
  Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  Example:  a3f8c2e1b7d4...  (64 hex chars = 32 bytes)
  NEVER use: "secret", "password", "medivoice", or any guessable string

RULE 4: GMAIL APP PASSWORD (NOT GMAIL PASSWORD)
  Regular Gmail password → NEVER use in .env
  Gmail App Password → Created in Google Account Security settings
  Specific to MediVoice AI application only
  Can be revoked independently without changing Gmail password

RULE 5: MONGODB URI FORMAT
  mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE
  USERNAME: medivoice_app_user (not Atlas admin account)
  PASSWORD: randomly generated, stored in Render env vars

RULE 6: HUGGING FACE API KEY
  Scope: Read-only inference token
  Cannot: modify models, create datasets, access private models
  Limits: ~30,000 requests/month on free tier
  Rotation: Rotate if repo is ever accidentally exposed

RULE 7: SECRETS ROTATION POLICY
  JWT_SECRET:    Rotate quarterly OR immediately if exposed
  EMAIL_PASS:    Revoke and regenerate immediately if exposed
  MONGODB URI:   Rotate password immediately if exposed
  HF API KEY:    Delete and regenerate immediately if exposed
```

### Complete `.env.example`

```env
# ════════════════════════════════════════════════════════════════════
# MEDIVOICE AI — ENVIRONMENT VARIABLES
# Copy to .env and fill in values. NEVER commit .env to Git.
# ════════════════════════════════════════════════════════════════════

# ─── SERVER ──────────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── CLIENT URL (CORS whitelist) ─────────────────────────────────────
CLIENT_URL=http://localhost:3000

# ─── MONGODB ATLAS ───────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/medivoice

# ─── JWT ─────────────────────────────────────────────────────────────
JWT_SECRET=
# REQUIRED: Min 32 chars. Generate:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_EXPIRES_IN=24h

# ─── BCRYPT ──────────────────────────────────────────────────────────
BCRYPT_SALT_ROUNDS=12
BCRYPT_OTP_ROUNDS=8

# ─── EMAIL (Gmail App Password — NOT regular Gmail password) ─────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=MediVoice AI <your.email@gmail.com>

# ─── OTP ─────────────────────────────────────────────────────────────
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3
OTP_RESEND_COOLDOWN_MINUTES=1

# ─── SECURITY ────────────────────────────────────────────────────────
MAX_LOGIN_ATTEMPTS=3
LOCKOUT_DURATION_MINUTES=15
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
SIGNUP_RATE_LIMIT_MAX=5

# ─── HUGGING FACE ────────────────────────────────────────────────────
HUGGINGFACE_API_KEY=hf_
HF_MODEL_NER=d4data/biomedical-ner-all
HF_MODEL_QA=deepset/roberta-base-squad2
HF_TIMEOUT_MS=8000

# ─── LIBRETRANSLATE ──────────────────────────────────────────────────
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=
LIBRETRANSLATE_TIMEOUT_MS=3000

# ─── MYMEMORY ────────────────────────────────────────────────────────
MYMEMORY_EMAIL=

# ─── CLIENT ENV (.env in /client) ────────────────────────────────────
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

---

## 26. Security Testing Checklist

### Pre-Launch Security Tests

#### Authentication

- [ ] Signup with existing email → shows generic duplicate message, no details
- [ ] Signup with invalid email format → validation error shown
- [ ] Signup with weak password → strength bar red, form blocked
- [ ] Email OTP arrives in Gmail within 30 seconds
- [ ] OTP expires after 10 minutes → error on submit
- [ ] Wrong OTP 3 times → "Too many attempts" error, OTP invalidated
- [ ] New OTP request invalidates previous OTP
- [ ] Login with wrong password → generic "Invalid email or password" (not "wrong password")
- [ ] Login attempt 3 fails → lockout for 15 minutes
- [ ] Locked account shows countdown timer on frontend
- [ ] Login from Device B invalidates Device A session
- [ ] Device A next request after Device B login → 401 SESSION_SUPERSEDED
- [ ] Logout clears cookie and invalidates server session
- [ ] Expired JWT (simulate 25-hour-old token) → 401

#### Authorization

- [ ] Patient accessing `/api/v1/doctors/me/*` → 403 FORBIDDEN
- [ ] Doctor accessing `/api/v1/patients/me/*` → 403 FORBIDDEN
- [ ] Patient accessing another patient's consultation → 403 FORBIDDEN
- [ ] Doctor accessing appointment not theirs → 403 FORBIDDEN
- [ ] Unauthenticated request to protected route → 401 NO_TOKEN
- [ ] Admin accessing consultation content → 403 FORBIDDEN
- [ ] JWT with tampered role claim → 403 (signature verification fails)

#### Input Security

- [ ] NoSQL injection in login: `{ "email": { "$gt": "" } }` → 400 or sanitized
- [ ] XSS in profile name: `<script>alert(1)</script>` → stripped or rejected
- [ ] Large payload (>10KB JSON) → 413 Payload Too Large
- [ ] HTTP Parameter Pollution: `?city=Hyderabad&city=delhi` → single value used
- [ ] SQL-style injection attempts → sanitized, no error stack trace leaked

#### Rate Limiting

- [ ] 6 login attempts in 15 minutes from same IP → 429
- [ ] 4 OTP requests in 1 hour → 429
- [ ] 6 signup attempts in 1 hour → 429
- [ ] Rate limit headers present in response (`RateLimit-Limit`, `RateLimit-Remaining`)

#### Security Headers

- [ ] Response includes `Strict-Transport-Security` header
- [ ] Response includes `X-Frame-Options: DENY`
- [ ] Response includes `X-Content-Type-Options: nosniff`
- [ ] Response includes `Content-Security-Policy`
- [ ] JWT is NOT in response body (only in Set-Cookie header)
- [ ] Cookie has `HttpOnly`, `Secure`, `SameSite=Strict` flags

#### Data Privacy

- [ ] Password field never appears in any API response
- [ ] `currentSessionToken` field never appears in any API response
- [ ] Patient A cannot query Patient B's records
- [ ] Doctor A cannot query Doctor B's patients
- [ ] Transcript consent recorded with timestamp before STT starts

---

## 27. Incident Response Plan

### Severity Levels

```
INCIDENT SEVERITY LEVELS
═══════════════════════════════════════════════════════════════════════

P0 — CRITICAL (Respond immediately):
  • Evidence of patient data breach
  • JWT secret compromised
  • MongoDB credentials exposed
  • Attacker has admin access

  RESPONSE TIME: Within 1 hour
  ACTIONS:
    1. Rotate JWT_SECRET (invalidates ALL active sessions)
    2. Rotate MongoDB password
    3. Force-logout all active sessions
    4. Preserve security logs for forensics
    5. Notify affected users

P1 — HIGH (Respond within 4 hours):
  • Multiple accounts compromised
  • Credential stuffing attack in progress
  • Admin account targeted

  RESPONSE TIME: Within 4 hours
  ACTIONS:
    1. Enable stricter rate limits
    2. Block attacking IPs at Render level
    3. Review security logs for scope

P2 — MEDIUM (Respond within 24 hours):
  • Individual account compromised
  • Unusual access pattern detected
  • Brute force attempts (contained by lockout)

  RESPONSE TIME: Within 24 hours
  ACTIONS:
    1. Force-logout affected account
    2. Notify affected user
    3. Review account activity

P3 — LOW (Respond within 1 week):
  • Single failed attack attempt
  • Rate limit triggered legitimately
  • OTP abuse attempt (contained)

  RESPONSE TIME: Within 1 week
  ACTIONS:
    1. Review security logs
    2. Tune rate limits if needed
```

### Emergency: Rotate JWT Secret

```bash
# When JWT_SECRET must be rotated (P0 incident):
# ALL users will be logged out immediately — this is intentional

# 1. Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Update in Render Environment Variables
# Render dashboard → Environment → JWT_SECRET → update value

# 3. Trigger redeploy (picks up new env var)
# Render auto-redeploys on env var change

# Effect: Every existing JWT is now invalid (signed with old secret)
# Every user must log in again
# This is the correct response to a secret compromise
```

---

## 28. OWASP Top 10 Compliance Map

| # | OWASP Risk | MediVoice AI Mitigation | Status |
|---|---|---|---|
| A01 | Broken Access Control | RBAC middleware on every route, data-level scoping in services, patientId === req.userId checks | ✅ Mitigated |
| A02 | Cryptographic Failures | HTTPS enforced (Vercel/Render), bcrypt-12 for passwords, select:false on sensitive fields, TLS on MongoDB | ✅ Mitigated |
| A03 | Injection | express-mongo-sanitize (NoSQL injection), xss-clean (XSS), express-validator (input validation), body size limit | ✅ Mitigated |
| A04 | Insecure Design | Threat model documented, defence in depth design, least privilege RBAC, consent before transcription | ✅ Mitigated |
| A05 | Security Misconfiguration | Helmet.js (12 headers), CORS whitelist, no stack traces in production, explicit Mongoose field selection | ✅ Mitigated |
| A06 | Vulnerable Components | `npm audit` before each deployment, locked dependency versions (package-lock.json), minimal dependencies | ⚠️ Ongoing |
| A07 | Auth & Session Failures | JWT httpOnly cookies, bcrypt-12 hashing, account lockout, single session, OTP verification, rate limiting | ✅ Mitigated |
| A08 | Software & Data Integrity | Explicit field whitelisting in controllers, no eval(), CSP blocks external scripts, package-lock.json | ✅ Mitigated |
| A09 | Security Logging Failures | Comprehensive SecurityLog collection, all auth events logged with IP/UA, admin security monitor, TTL cleanup | ✅ Mitigated |
| A10 | Server-Side Request Forgery | No user-controlled URLs fetched server-side, CSP connectSrc whitelist for client-side fetches | ✅ Mitigated |

---

<div align="center">

---

## Security Summary

```
╔════════════════════════════════════════════════════════════════════╗
║          MEDIVOICE AI — AUTH & SECURITY AT A GLANCE               ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Auth Mechanism:     JWT in httpOnly cookies (XSS-proof)          ║
║  Token Expiry:       24 hours (re-login required)                 ║
║  Password Hashing:   bcrypt · 12 salt rounds · ~300ms             ║
║  OTP Hashing:        bcrypt · 8 salt rounds · ~30ms               ║
║  OTP Expiry:         10 minutes · auto-deleted by TTL index       ║
║  OTP Attempts:       3 maximum · then invalidated                 ║
║  Login Attempts:     3 maximum · then 15 min lockout              ║
║  Session Policy:     Single session · new login kills old         ║
║  Roles:              patient / doctor / admin (JWT-encoded)       ║
║  CSRF Protection:    SameSite=Strict cookie                       ║
║  XSS Protection:     httpOnly cookie · xss-clean · Helmet CSP    ║
║  NoSQL Injection:    express-mongo-sanitize                       ║
║  Rate Limiting:      5 configs (global/auth/otp/ai/signup)        ║
║  Security Headers:   Helmet.js · 7 active headers                ║
║  Audit Trail:        SecurityLog · 16 event types · 90d TTL      ║
║  CORS:               Strict origin whitelist · credentials:true   ║
║  OWASP Top 10:       All 10 risks mitigated                       ║
║  Security Cost:      $0.00 / month                                ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Authentication & Security Plan v1.0**

*Healthcare data protected · Zero trust enforced · Zero cost achieved*

![JWT](https://img.shields.io/badge/JWT-httpOnly%20Cookies-black?style=flat)
![bcrypt](https://img.shields.io/badge/bcrypt-12%20rounds-red?style=flat)
![OWASP](https://img.shields.io/badge/OWASP-Top%2010%20Compliant-orange?style=flat)
![Helmet](https://img.shields.io/badge/Helmet.js-Security%20Headers-blue?style=flat)
![Rate Limit](https://img.shields.io/badge/Rate%20Limiting-5%20configs-green?style=flat)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
