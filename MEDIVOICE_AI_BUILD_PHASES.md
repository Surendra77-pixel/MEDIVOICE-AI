# 🏥 MEDIVOICE AI — Complete Build Phases Document

> **AI-Powered Healthcare Communication Platform**  
> **Stack:** MERN (MongoDB Atlas · Express.js · React 18 · Node.js 20) + AI Services  
> **Cost:** $0.00 — 100% Free APIs · Free Hosting · Open-Source Only  
> **Research Basis:** ICSADL-2025 — Automated STT in Healthcare  
> **Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas M0 (Free)

---

## 📋 AGENT INSTRUCTIONS — READ BEFORE EVERY PHASE

> These rules are **non-negotiable** and apply to every single phase of the build.

```
╔══════════════════════════════════════════════════════════════════════╗
║                   AGENT STRICT BUILD RULES                          ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  1. ZERO COST RULE                                                   ║
║     Never introduce a paid API, paid library, or paid service.      ║
║     Every tool, API, and service must be permanently free.          ║
║     No "free trial" services — only permanently free tiers.         ║
║                                                                      ║
║  2. PHASE GATE RULE                                                  ║
║     Do NOT start Phase N+1 until Phase N is:                        ║
║       ✅ Fully coded with zero errors                               ║
║       ✅ All tests pass (unit + integration)                        ║
║       ✅ Verified running locally (npm run dev)                     ║
║       ✅ Agent explicitly reports "PHASE COMPLETE"                  ║
║                                                                      ║
║  3. FILE STRUCTURE RULE                                              ║
║     Every file must go EXACTLY where FOLDER_STRUCTURE.md defines.  ║
║     No new folders or files outside the defined structure.          ║
║     One file = one responsibility. Never mix concerns.              ║
║                                                                      ║
║  4. ENVIRONMENT RULE                                                 ║
║     ALL secrets live in .env files. Never hardcode API keys.        ║
║     Every new env var must also be added to .env.example.           ║
║                                                                      ║
║  5. ERROR RULE                                                       ║
║     If any error occurs — STOP. Fix it completely. Re-run tests.    ║
║     Never proceed with a known error or warning.                    ║
║     Console.error and unhandled rejections = BLOCKER.              ║
║                                                                      ║
║  6. RESPONSIVE RULE                                                  ║
║     Every UI component must work on:                                ║
║     Mobile (320px) · Tablet (768px) · Laptop (1024px) · Desktop    ║
║     Use Tailwind responsive prefixes: sm: md: lg: xl: 2xl:         ║
║                                                                      ║
║  7. ROLE SEPARATION RULE                                             ║
║     Patient / Doctor / Admin code is ALWAYS in separate folders.   ║
║     Never mix portal logic. Use RBAC middleware on every route.     ║
║                                                                      ║
║  8. AI FALLBACK RULE                                                 ║
║     Every AI feature must have a fallback (rule-based or cached).  ║
║     Platform must NOT crash if Hugging Face or LibreTranslate fail. ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🗂️ REFERENCE FILES (Always Keep Open)

| File | Purpose | When to Use |
|------|---------|-------------|
| `MEDIVOICE_AI_PRD.md` | Feature requirements, role definitions, feature matrix | Every phase |
| `FOLDER_STRUCTURE.md` | Exact location of every file/folder | Every phase |
| `DATA_MODEL_SCHEMA.md` | All 9 MongoDB collection schemas with fields | Phases 2, 3, 4, 5, 6, 7 |
| `SYSTEM_ARCHITECTURE.md` | Full API routes, WebSocket events, system layers | Phases 2, 3, 4, 5, 6, 7 |
| `FREE_API_DESIGN.md` | All 12 free APIs, rate limits, fallback chains | Phases 4, 5, 6, 7 |
| `AUTH_SECURITY_PLAN.md` | JWT flow, OTP flow, RBAC, security middleware | Phase 2 |
| `AI_INTEGRATION_PLAN.md` | AI pipeline, NER, ASR, translation, chatbot design | Phase 6 |
| `UX_FLOW_PAGEMAP.md` | All 24 pages, navigation flows, user journeys | Phases 3, 4, 5 |
| `ANALYTICS_PLAN.md` | Dashboard charts, metrics, doctor analytics | Phase 7 |
| `PERFORMANCE_PLAN.md` | Caching, lazy loading, code splitting | Phase 8 |
| `TESTING_STRATEGY.md` | Unit tests, integration tests, E2E tests | All phases |
| `README.md` | Project overview and quick start commands | All phases |

---

## 📊 PHASES OVERVIEW

```
PHASE 0  →  Project Foundation & Monorepo Setup          [Day 1]
PHASE 1  →  Database Models & Backend Foundation         [Day 1-2]
PHASE 2  →  Authentication System (All 3 Roles)          [Day 2-3]
PHASE 3  →  Patient Portal — Core UI                     [Day 3-4]
PHASE 4  →  Doctor Portal — Core UI                      [Day 4-5]
PHASE 5  →  Admin Portal — Core UI                       [Day 5]
PHASE 6  →  AI Features (ASR · NLP · Translation)        [Day 6-7]
PHASE 7  →  Analytics, PDF & Notifications               [Day 7-8]
PHASE 8  →  Performance, Security Hardening & SEO        [Day 8-9]
PHASE 9  →  Deployment (Vercel + Render + Atlas)         [Day 9-10]
PHASE 10 →  Final Testing & Bug Fixes                    [Day 10]
```

---

---

# ⚙️ PHASE 0 — Project Foundation & Monorepo Setup

> **Goal:** A working, clean monorepo that runs `npm run dev` and starts both client and server with no errors.

## Reference Files Required
- `FOLDER_STRUCTURE.md` — Top-Level Structure (Section 2) + Root package.json scripts
- `SYSTEM_ARCHITECTURE.md` — Technology Stack (Section 4)
- `README.md` — Project overview

## What to Build

### 0.1 — Monorepo Root Setup
```
medivoice-ai/
├── client/            ← React 18 + Vite + Tailwind
├── server/            ← Node.js 20 + Express.js
├── .env.example       ← All env vars documented (safe to commit)
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── .editorconfig
├── package.json       ← Workspace scripts (concurrently)
└── README.md
```

### 0.2 — Client Bootstrap
**Tool:** `npm create vite@latest client -- --template react`

Install these packages (all free):
```
react-router-dom@6     react-hot-toast        axios
tailwindcss@3          @tailwindcss/forms      autoprefixer
postcss                socket.io-client        lucide-react
```

Create Tailwind config with MediVoice AI color system:
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      patient: { primary: '#16a34a', light: '#dcfce7', dark: '#14532d' },   // Green
      doctor:  { primary: '#2563eb', light: '#dbeafe', dark: '#1e3a8a' },   // Blue
      admin:   { primary: '#7c3aed', light: '#ede9fe', dark: '#4c1d95' },   // Purple
    }
  }
}
```

Configure `vite.config.js` with `@` alias pointing to `src/`.

### 0.3 — Server Bootstrap
**Tool:** `npm init -y` in `/server`

Install these packages (all free):
```
express             mongoose            dotenv
bcryptjs            jsonwebtoken        cors
helmet              express-rate-limit  express-validator
nodemailer          socket.io           node-cache
morgan              winston             uuid
```

DevDependencies:
```
nodemon   jest   supertest   @jest/globals
```

### 0.4 — Create Folder Structure
Create ALL folders exactly as defined in `FOLDER_STRUCTURE.md`:

**Client folders to create:**
```
src/components/{common,patient,doctor,admin,auth,layout}
src/pages/{public,patient,doctor,admin,auth}
src/layouts/
src/hooks/
src/context/
src/services/
src/utils/
src/constants/
src/assets/{images,icons,fonts}
```

**Server folders to create:**
```
config/
controllers/
services/ai/
middleware/
models/
routes/
websocket/
seed/
validators/
utils/
logs/
```

### 0.5 — Environment Files
Create `.env.example` (root, client, server) with ALL variables:

**`/server/.env.example`:**
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/medivoice?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_64_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# Email (Gmail SMTP — Free)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=MediVoice AI <noreply@medivoice.ai>

# Hugging Face (Free Tier)
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxx

# LibreTranslate (Free public instance)
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
OTP_RATE_LIMIT_MAX=5

# OTP
OTP_EXPIRY_MINUTES=10
```

**`/client/.env.example`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 0.6 — Base Server Entry Point (`server/index.js`)
```js
// Loads dotenv, creates Express app, connects MongoDB, starts socket.io
// Registers all middleware: helmet, cors, morgan, express.json, rate-limit
// Mounts route files
// Starts HTTP server on PORT
```

### 0.7 — MongoDB Connection (`server/config/database.js`)
```js
// mongoose.connect with retry logic
// Log "MongoDB Connected" on success
// Log full error + process.exit(1) on failure
```

### 0.8 — Logger (`server/config/logger.js`)
```js
// Winston logger: info to console + error.log file + combined.log file
```

## Phase 0 — Completion Checklist
```
[x] npm run dev starts both client (port 5173) and server (port 5000)
[x] React app loads in browser — shows placeholder "MediVoice AI"
[x] Server responds to GET /health → { status: "ok", timestamp }
[x] MongoDB connection log shows "Connected" in server terminal
[x] No ESLint errors: npm run lint passes
[x] No TypeScript/Vite errors in client terminal
[x] .env.example contains ALL required variables
[x] .gitignore prevents .env and node_modules from being committed
[x] All folders from FOLDER_STRUCTURE.md exist (even if empty)
```

---

---

# 🗄️ PHASE 1 — Database Models & Backend Foundation

> **Goal:** All 9 MongoDB Mongoose models defined, validated, and tested. Seed scripts running.

## Reference Files Required
- `DATA_MODEL_SCHEMA.md` — All 9 collections (Sections 4-12)
- `FOLDER_STRUCTURE.md` — Section 4.7 (models/)
- `SYSTEM_ARCHITECTURE.md` — Section 5 (Database Architecture)

## What to Build

### 1.1 — Mongoose Models (9 total)
Create each file in `/server/models/` exactly per `DATA_MODEL_SCHEMA.md`:

**`User.js`** — Base auth document (all roles)
```
Fields: email, passwordHash, role (enum: patient|doctor|admin),
        isVerified, isActive, lastLoginAt, loginAttempts,
        lockUntil, createdAt, updatedAt
Pre-save hook: bcrypt hash password (salt 12)
Instance method: comparePassword()
Instance method: isLocked() → bool
Static method: findByEmail()
```

**`Patient.js`** — Patient profile (ref: User)
```
Fields: userId (ref), firstName, lastName, phone, dateOfBirth,
        gender, bloodGroup, city, languages[], emergencyContact{},
        medicalHistory[], allergies[], chronicConditions[],
        profilePhotoUrl, createdAt
```

**`Doctor.js`** — Doctor profile (ref: User)
```
Fields: userId (ref), firstName, lastName, phone, registrationNo,
        specialization, qualifications[], city, hospital, experience,
        languages[], consultationFee, availableSlots[],
        rating, totalConsultations, isVerifiedByAdmin, profilePhotoUrl
```

**`Appointment.js`** — Booking record
```
Fields: patientId (ref), doctorId (ref), scheduledAt, slotTime,
        status (enum: pending|confirmed|completed|cancelled|no-show),
        reason, notes, createdAt, updatedAt
Indexes: patientId+scheduledAt, doctorId+scheduledAt, status
```

**`Consultation.js`** — Live consultation session
```
Fields: appointmentId (ref), patientId (ref), doctorId (ref),
        startedAt, endedAt, durationMinutes,
        transcript[]{speaker, text, timestamp, language, translatedText},
        clinicalNotes{subjective, objective, assessment, plan},
        riskLevel (enum: low|medium|high|critical),
        detectedSymptoms[], languageUsed, status
```

**`Prescription.js`** — Doctor-issued prescription
```
Fields: consultationId (ref), doctorId (ref), patientId (ref),
        medications[]{name, dosage, frequency, duration, instructions},
        diagnosis, notes, issuedAt, pdfUrl
```

**`Reminder.js`** — Medication reminders
```
Fields: patientId (ref), prescriptionId (ref), medicationName,
        dosage, scheduledTimes[], isActive, nextReminderAt,
        lastSentAt, createdAt
TTL index: auto-delete after prescription duration ends
```

**`OTP.js`** — One-time passwords
```
Fields: email, otp (hashed), type (enum: signup|reset|login),
        expiresAt, isUsed, attempts, createdAt
TTL index: auto-delete after 15 minutes
```

**`SecurityLog.js`** — Audit/security events
```
Fields: userId (ref, optional), email, event (enum: login_success|
        login_failed|lockout|password_reset|suspicious_activity|
        force_logout|account_deactivated),
        ipAddress, userAgent, metadata{}, createdAt
TTL index: auto-delete after 90 days
```

### 1.2 — Database Indexes
Per `DATA_MODEL_SCHEMA.md` Section 14 — create all compound indexes:
```js
// In each model file, define indexes:
UserSchema.index({ email: 1 }, { unique: true });
AppointmentSchema.index({ doctorId: 1, scheduledAt: 1 });
AppointmentSchema.index({ patientId: 1, status: 1 });
ConsultationSchema.index({ patientId: 1, startedAt: -1 });
SecurityLogSchema.index({ event: 1, createdAt: -1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
```

### 1.3 — Validators (4 files in `server/validators/`)
```
authValidators.js      → signup, login, OTP verify, password reset
appointmentValidators.js → create, update, cancel
consultationValidators.js → start, end, update notes
prescriptionValidators.js → create prescription
```
Use `express-validator` chains. Export `validate` middleware wrapper.

### 1.4 — Server Utils (4 files in `server/utils/`)
```
apiResponse.js     → success(res, data, msg, status) / error(res, msg, status)
asyncHandler.js    → wraps async route handlers, auto-catches errors
errorHandler.js    → Express global error handler middleware
dateHelpers.js     → formatDate(), isSlotAvailable(), getTimeSlots()
```

### 1.5 — Seed Scripts (`server/seed/`)
**`doctorSeed.js`** — Seeds 40+ doctors across 8 cities:
```
Cities: Chennai, Bangalore, Mumbai, Vijayawada, Hyderabad, Delhi, Goa, Puducherry
Specialties: Cardiologist, Neurologist, Dermatologist, Pediatrician,
             General Physician, Orthopedist, ENT, Gynecologist, Psychiatrist
Each doctor: Full profile, 3 languages, available slots, rating 3.5-5.0
```

**`adminSeed.js`** — Seeds 1 super admin account:
```
Email: admin@medivoice.ai
Password: set via env var ADMIN_DEFAULT_PASSWORD
Role: admin, isVerified: true, isActive: true
```

Run command: `npm run seed`

### 1.6 — Base Route & Health Check
```
GET /health → { status: "ok", db: "connected", timestamp, uptime }
GET /api/v1/ → { message: "MediVoice AI API v1", version: "1.0.0" }
```

## Phase 1 — Completion Checklist
```
[x] All 9 Mongoose models created with correct fields per DATA_MODEL_SCHEMA.md
[x] All TTL indexes working (OTP expires in 15 min, SecurityLog in 90 days)
[x] npm run seed → Creates 40+ doctors + 1 admin, no errors
[x] MongoDB Atlas shows all 9 collections after seed
[x] GET /health → 200 OK with db: "connected"
[x] All 4 validator files exist with working validation chains
[x] asyncHandler and apiResponse utils used consistently
[x] No mongoose deprecation warnings
[x] Jest test: model schema validation passes for all 9 models
```

---

---

# 🔐 PHASE 2 — Authentication System (All 3 Roles)

> **Goal:** Complete auth flow for Patient, Doctor, Admin — OTP email, JWT tokens, RBAC, rate limiting.

## Reference Files Required
- `AUTH_SECURITY_PLAN.md` — Full auth design, OTP flow, JWT architecture
- `SYSTEM_ARCHITECTURE.md` — Section 7 (Auth Architecture), API routes Section 6.2
- `FREE_API_DESIGN.md` — API-09 (Gmail SMTP/Nodemailer)
- `DATA_MODEL_SCHEMA.md` — Collection 08 (OTPs), Collection 09 (SecurityLogs)

## What to Build

### 2.1 — Email Service (`server/config/emailConfig.js` + `server/services/emailService.js`)
```js
// emailConfig.js → Nodemailer transporter using Gmail SMTP (free)
// Gmail App Password authentication — no OAuth needed
// emailService.js:
//   sendOTPEmail(email, otp, type) — Beautiful HTML email template
//   sendWelcomeEmail(email, name, role)
//   sendPasswordResetEmail(email, otp)
```
OTP Email template must include:
- MediVoice AI branding
- 6-digit OTP code (large, bold)
- 10-minute expiry warning
- "Do not share" security notice

### 2.2 — Auth Middleware (`server/middleware/`)

**`authMiddleware.js`:**
```js
// verifyToken(req, res, next) — Validates JWT from httpOnly cookie OR Authorization header
// Attaches req.user = { id, email, role }
// Returns 401 if token missing/expired
```

**`roleMiddleware.js`:**
```js
// requireRole(...roles) → middleware factory
// Usage: requireRole('doctor', 'admin')
// Returns 403 if req.user.role not in allowed roles
```

**`rateLimitMiddleware.js`:**
```js
// generalLimiter    → 100 req/15min (all routes)
// authLimiter       → 10 req/15min (login, signup)
// otpLimiter        → 5 req/15min (OTP send)
// Using express-rate-limit (free)
```

**`securityMiddleware.js`:**
```js
// Helmet configuration (CSP, XSS, HSTS headers)
// CORS config: only CLIENT_URL origin allowed
// Log all auth events to SecurityLog collection
```

### 2.3 — Auth Service (`server/services/authService.js`)
```js
// All business logic — controllers call these:
generateOTP()               // Crypto-random 6-digit string
hashOTP(otp)               // bcrypt hash before saving to OTP collection
verifyOTP(email, otp, type) // Find + compare + check expiry + isUsed
generateTokenPair(userId, role) // {accessToken, refreshToken}
saveRefreshToken(userId, token)  // Store hashed refresh token in User
verifyRefreshToken(token)        // Validate + return payload
handleFailedLogin(email, ip)     // Increment attempts, lock if ≥ 5, log to SecurityLog
recordLoginSuccess(userId, ip)   // Reset attempts, update lastLoginAt, log
sendOTPAndSave(email, type)      // Generate → hash → save OTP → send email
```

### 2.4 — Auth Controller (`server/controllers/authController.js`)
Thin controllers that call authService:
```
POST /api/v1/auth/signup           → signupInitiate()
POST /api/v1/auth/signup/verify    → signupVerifyOTP()
POST /api/v1/auth/login            → login()
POST /api/v1/auth/logout           → logout()
POST /api/v1/auth/refresh          → refreshToken()
POST /api/v1/auth/forgot-password  → forgotPassword()
POST /api/v1/auth/reset-password   → resetPassword()
POST /api/v1/auth/resend-otp       → resendOTP()
GET  /api/v1/auth/me               → getMe()  [protected]
```

### 2.5 — Complete Auth Flow Logic

**Signup (Patient/Doctor):**
```
1. POST /signup → Validate fields → Check email not taken
2. Send OTP email (6-digit, 10-min TTL) → Save hashed OTP to OTPs collection
3. POST /signup/verify → Compare OTP → Create User + Patient/Doctor profile
4. Return JWT pair in httpOnly cookies + user data
```

**Login:**
```
1. POST /login → Find user by email → Check isActive
2. Check lockUntil → If locked → 429 with unlock time
3. comparePassword() → If fail → handleFailedLogin() → Return 401
4. If success → recordLoginSuccess() → generateTokenPair()
5. Set httpOnly cookies → Return user {id, role, name}
```

**Password Reset:**
```
1. POST /forgot-password → Find user → sendOTPAndSave(email, 'reset')
2. POST /reset-password → verifyOTP() → Hash new password → Update User
```

### 2.6 — Auth Routes (`server/routes/authRoutes.js`)
```js
// Mount: app.use('/api/v1/auth', authRoutes)
// Apply: authLimiter to login/signup, otpLimiter to OTP endpoints
// Apply: validate(validators) to every route
```

### 2.7 — Frontend Auth Pages (`client/src/pages/auth/`)

**Pages to create:**
```
LandingPage.jsx        → Hero page with 3 role cards (Patient/Doctor/Admin)
PatientLogin.jsx       → Email + password login form (Green theme)
PatientSignup.jsx      → 3-step form: Details → OTP → Complete (Green theme)
DoctorLogin.jsx        → Email + password login form (Blue theme)
DoctorSignup.jsx       → 3-step form with medical reg. number (Blue theme)
AdminLogin.jsx         → Email + password only — no public signup (Purple theme)
ForgotPassword.jsx     → Email input → OTP → New password (shared)
OTPVerifyPage.jsx      → 6-digit OTP entry with countdown + resend
```

**Auth Context (`client/src/context/AuthContext.jsx`):**
```js
// Provides: user, isAuthenticated, login(), logout(), refreshUser()
// Reads user from /api/v1/auth/me on app load
// Stores nothing in localStorage — httpOnly cookies handle auth
```

**Protected Route (`client/src/components/common/ProtectedRoute.jsx`):**
```js
// <ProtectedRoute role="patient"> → Redirects if not logged in or wrong role
```

### 2.8 — Security Logging
Every auth event logs to SecurityLog collection:
```
login_success     → userId, ip, userAgent, timestamp
login_failed      → email, ip, reason, attemptCount
lockout           → email, ip, lockUntil
password_reset    → userId, ip, timestamp
otp_resend        → email, ip, type
```

## Phase 2 — Completion Checklist
```
[x] Patient signup: email → OTP → account created → logged in
[x] Patient login: correct credentials → JWT cookie → /patient/dashboard redirect
[x] Patient login: wrong password → increment attempts → 5th attempt → account lock
[x] Locked account → 429 response with lockUntil timestamp
[x] Forgot password: OTP email received → reset works
[x] OTP: expires in 10 minutes → returns 410 if expired
[x] OTP: marked isUsed after use → replay attack rejected
[x] Doctor signup includes registrationNo field
[x] Admin login: no public signup route — returns 404 if attempted
[x] JWT stored ONLY in httpOnly cookie — not accessible from JS
[x] refreshToken works: returns new access token without re-login
[x] POST /auth/logout: clears cookies
[x] GET /auth/me: returns user data if valid token
[x] requireRole('patient') blocks doctor from patient routes → 403
[x] Gmail OTP email received in inbox (not spam) with correct branding
[x] Rate limit: 6th OTP request in 15min → 429
[x] SecurityLog collection populated with all events above
[x] All auth pages responsive on mobile (320px)
[x] Integration tests: all auth endpoints pass
```

---

---

# 🟢 PHASE 3 — Patient Portal (Core UI & Features)

> **Goal:** Complete, working patient portal — all 10 patient features (P-1 through P-10) minus AI features (those come in Phase 6).

## Reference Files Required
- `MEDIVOICE_AI_PRD.md` — Section 5 (Patient Portal Features P-1 to P-10)
- `UX_FLOW_PAGEMAP.md` — Patient portal pages and navigation flows
- `FOLDER_STRUCTURE.md` — Section 3.4 (src/pages/patient), Section 3.3 (components/patient)
- `FREE_API_DESIGN.md` — API-06 (OpenStreetMap), API-07 (Overpass API), API-10 (Push Notifications)
- `DATA_MODEL_SCHEMA.md` — Patient, Appointment, Prescription, Consultation schemas

## What to Build

### 3.1 — Patient Layout (`client/src/layouts/PatientLayout.jsx`)
```
- Green-themed sidebar (desktop) / bottom navigation (mobile)
- Nav items: Dashboard · Appointments · Find Doctors · My Records · Reminders
- Top header: Patient name, avatar, notifications bell, logout
- SOS button: Always-visible floating button (bottom-right, red, 108 call)
- Responsive: Sidebar on lg+, bottom nav on mobile/tablet
```

### 3.2 — Patient Dashboard Page (`client/src/pages/patient/DashboardPage.jsx`)
```
Cards to show:
  - Upcoming appointment (next scheduled with doctor name + time)
  - AI health tip of the day (static for now, AI-powered in Phase 6)
  - Medication reminder status (today's meds: taken/pending)
  - Quick action buttons: Book Appointment, Find Hospital, View Records
  - Recent consultation summary (last 3)
```

### 3.3 — Appointment Booking (`client/src/pages/patient/AppointmentPage.jsx`)
```
Step 1 — Search:
  Filters: Specialty (dropdown), City (8 cities), Language, Available Today
  Results: Doctor cards with photo, name, specialty, rating, fee, next slot

Step 2 — Doctor Profile Modal:
  Full profile: qualifications, hospital, languages, consultation fee
  Available time slots calendar (next 7 days)
  "Book This Slot" button

Step 3 — Confirmation:
  Summary: Doctor, Date, Time, Reason for visit (text input)
  Confirm → POST /api/v1/appointments
  Success → Confirmation with appointment ID

Backend routes:
  GET /api/v1/doctors?specialty=&city=&language= → Search doctors
  GET /api/v1/doctors/:id → Doctor profile
  GET /api/v1/doctors/:id/slots?date= → Available slots
  POST /api/v1/appointments → Book appointment
  GET /api/v1/appointments/patient → Patient's appointments
  PATCH /api/v1/appointments/:id/cancel → Cancel
```

### 3.4 — Hospital Finder (`client/src/pages/patient/HospitalFinderPage.jsx`)
```
Map: Leaflet.js + OpenStreetMap tiles (free — no API key needed)
Data: Overpass API query for hospitals near user's GPS location
      Fallback: Show hospitals in selected city (8 predefined cities)

Features:
  - "Use My Location" → GPS → nearest hospitals
  - Manual city selector → Show hospitals in that city
  - Map markers with popup: name, address, phone, type
  - List view alongside map
  - Filter: Government / Private / Clinic

Implementation:
  useHospitalFinder.js hook → Overpass API query + Leaflet integration
  components/patient/HospitalMap.jsx
  components/patient/HospitalCard.jsx
```

### 3.5 — Medical History Vault (`client/src/pages/patient/MedicalHistoryPage.jsx`)
```
Tabs:
  - Consultations: All past sessions with date, doctor, diagnosis, risk level badge
  - Prescriptions: All prescriptions with medications list + PDF download button
  - Reports: Upload space (Phase 2 feature — show placeholder)

Each consultation card:
  - Doctor name, date, duration
  - Diagnosis summary
  - Risk level badge (Green/Yellow/Red)
  - "View Full Transcript" → Modal with full consultation transcript
  - "Download Prescription" → jsPDF download

Backend routes:
  GET /api/v1/consultations/patient → All patient consultations
  GET /api/v1/consultations/:id → Single consultation with transcript
  GET /api/v1/prescriptions/patient → All patient prescriptions
```

### 3.6 — Prescription PDF Download
```
Component: PrescriptionPDFButton.jsx
Library: jsPDF + html2canvas (free)

PDF content:
  - MediVoice AI header + logo
  - Doctor name, registration number, hospital
  - Patient name, age, date
  - Medications table (name, dosage, frequency, duration)
  - Diagnosis
  - Doctor signature area
  - "This is an AI-assisted document. Always consult your doctor."

Download: Browser-native — no server cost
```

### 3.7 — Medication Reminders (`client/src/pages/patient/RemindersPage.jsx`)
```
Display active reminders (from Reminder collection)
Each reminder: Medication name, dosage, next dose time, frequency
Toggle: Pause/Resume reminder
"Mark as Taken" button → Updates lastSentAt

Push Notifications (Web Push API — free):
  useNotifications.js hook → requestPermission() → subscribe()
  SW registration: public/sw.js → self.addEventListener('push', ...)
  Backend: POST /api/v1/reminders/subscribe → Save push subscription
  Cron-like: setInterval on server → Check due reminders → Send push

Backend routes:
  GET /api/v1/reminders/patient → Active reminders
  POST /api/v1/reminders/:id/taken → Mark taken
  POST /api/v1/reminders/subscribe → Save push subscription
  PATCH /api/v1/reminders/:id/toggle → Pause/Resume
```

### 3.8 — Notifications Page (`client/src/pages/patient/NotificationsPage.jsx`)
```
In-app notification feed:
  - Appointment confirmed/reminder (24hr before)
  - Prescription issued by doctor
  - Medication due (based on reminders)
  - AI health tip

Notification bell in header: Shows unread count badge
"Mark all read" button

Backend:
  GET /api/v1/notifications/patient → All notifications (newest first)
  PATCH /api/v1/notifications/:id/read → Mark read
  PATCH /api/v1/notifications/read-all → Mark all read
```

### 3.9 — SOS Button (`client/src/components/common/SOSButton.jsx`)
```
Always visible: Fixed position, bottom-right corner, red gradient button
On Click: Confirm dialog → "Call 108 Ambulance?"
On Confirm: window.location.href = 'tel:108'
Mobile: Direct phone call
Desktop: Shows 108 prominently + "Open in Phone App" fallback
Pulse animation to draw attention
```

### 3.10 — Patient Profile Page (`client/src/pages/patient/ProfilePage.jsx`)
```
Editable fields: Name, phone, DOB, gender, blood group, city
Medical info: Allergies (tags), chronic conditions (tags), emergency contact
Language preferences: Multi-select (6 Indian languages)
Save → PATCH /api/v1/patients/profile
```

### 3.11 — Patient API Services (`client/src/services/`)
```
appointmentService.js  → All appointment API calls
doctorService.js       → Doctor search + profile
hospitalService.js     → Overpass API queries
consultationService.js → Consultation + transcript fetch
prescriptionService.js → Prescription fetch
reminderService.js     → Reminders CRUD
notificationService.js → Notifications fetch
patientService.js      → Profile update
```

### 3.12 — Backend Routes & Controllers
```
/server/routes/patientRoutes.js     → All patient CRUD
/server/routes/appointmentRoutes.js → Appointment CRUD
/server/controllers/patientController.js
/server/controllers/appointmentController.js
/server/services/appointmentService.js → Business logic
/server/services/patientService.js    → Business logic
```

## Phase 3 — Completion Checklist
```
[x] Patient dashboard loads with real data from database
[x] Doctor search: filter by specialty + city → returns correct doctors
[x] Appointment booking: 3-step flow works end-to-end
[x] Appointment shows in patient dashboard after booking
[x] Cancel appointment: status → cancelled, removed from patient view
[x] Hospital map: Leaflet map loads, OpenStreetMap tiles render
[x] "Use My Location" button works and shows nearby hospitals
[x] Medical history: Shows all past consultations + prescriptions
[x] Prescription PDF: Downloads valid PDF with correct content
[x] Medication reminders: List shows, mark-as-taken works
[x] Push notification permission prompt appears
[x] Notifications page shows all notifications, mark-read works
[x] SOS button: Visible on all pages, red, opens tel:108 after confirm
[x] Patient profile: Edit and save works
[x] All pages responsive on 320px, 768px, 1024px, 1440px
[x] API 401 if not authenticated, 403 if wrong role
[x] No patient can see another patient's data
```

---

---

# 🔵 PHASE 4 — Doctor Portal (Core UI & Features)

> **Goal:** Complete doctor portal — all 9 doctor features (D-1 through D-9) minus live AI transcription (Phase 6).

## Reference Files Required
- `MEDIVOICE_AI_PRD.md` — Section 6 (Doctor Portal Features D-1 to D-9)
- `UX_FLOW_PAGEMAP.md` — Doctor portal pages and navigation flows
- `FOLDER_STRUCTURE.md` — Section 3 (components/doctor, pages/doctor)
- `DATA_MODEL_SCHEMA.md` — Doctor, Consultation, Prescription schemas
- `FREE_API_DESIGN.md` — All internal REST API routes

## What to Build

### 4.1 — Doctor Layout (`client/src/layouts/DoctorLayout.jsx`)
```
Blue-themed sidebar (desktop) / bottom nav (mobile)
Nav items: Dashboard · Today's Queue · Patients · Consultations · Analytics · Profile
Header: Doctor name, specialty badge, notifications, logout
```

### 4.2 — Doctor Dashboard (`client/src/pages/doctor/DashboardPage.jsx`)
```
Today's Stats Cards:
  - Total appointments today
  - Completed consultations
  - Pending / upcoming
  - No-shows

Appointment Queue (today, ordered by time):
  - Each card: Patient name, age, time slot, reason for visit
  - Risk badge (Low/Medium/High/Critical)
  - Actions: Start Consultation, Mark No-Show, Reschedule

Quick stats: This week's totals
```

### 4.3 — Consultation Room (`client/src/pages/doctor/ConsultationRoomPage.jsx`)
```
This is the core doctor feature — placeholder UI for Phase 4,
AI transcription added in Phase 6.

Layout (2 columns on desktop, stacked on mobile):
  Left Panel:
    - Patient info header (name, age, blood group, allergies alert)
    - Risk Level Indicator (🟢 🟡 🔴) — manual for now, AI in Phase 6
    - Transcript Panel (scrollable, timestamps)
    - Translation language selector (dropdown — 6 Indian languages)

  Right Panel:
    - SOAP Notes editor (Subjective/Objective/Assessment/Plan fields)
    - Prescription Builder (medication form + add rows)
    - Action buttons: Save Notes, Generate PDF, Complete Consultation

Start/End Consultation:
  POST /api/v1/consultations/start → Creates Consultation record
  PATCH /api/v1/consultations/:id/end → Sets endedAt, calculates duration
```

### 4.4 — Prescription Builder (`client/src/components/doctor/PrescriptionBuilder.jsx`)
```
Form with dynamic medication rows:
  Row fields: Medication name, Dosage, Frequency, Duration, Instructions
  "Add Medication" button → New row
  "Remove" button per row
  Diagnosis field (text)
  Additional notes (textarea)
  
Actions:
  "Save Draft" → POST /api/v1/prescriptions (status: draft)
  "Issue Prescription" → Status: issued → Triggers reminder creation
  "Download PDF" → jsPDF with doctor letterhead

Auto-fill from AI notes (Phase 6 will populate from transcript)
```

### 4.5 — Patient Management (`client/src/pages/doctor/PatientsPage.jsx`)
```
List of all patients who have had appointments with this doctor
Search: by name, by date, by diagnosis

Patient Detail View:
  - Patient demographics
  - All past consultations with this doctor (with transcript links)
  - All prescriptions issued
  - Risk level history chart
```

### 4.6 — Scheduling / Calendar (`client/src/pages/doctor/SchedulePage.jsx`)
```
Weekly calendar view of appointments
Actions:
  - Block time slot (mark unavailable)
  - Reschedule appointment → Pick new slot
  - View appointment details on click

Manage Available Slots:
  Day selector → Set available hours → Save → Visible to patients

Backend:
  GET /api/v1/appointments/doctor → Doctor's appointments
  PATCH /api/v1/appointments/:id/reschedule → New scheduledAt
  POST /api/v1/doctors/slots → Update available slots
```

### 4.7 — Patient History Access (`client/src/pages/doctor/PatientHistoryPage.jsx`)
```
Full history for a specific patient:
  - All consultations with any doctor (filtered for this doctor's patients only)
  - Prescriptions, medications
  - Medical history (allergies, conditions from profile)
  - Consultation transcripts (each past session)
```

### 4.8 — Doctor Analytics Dashboard (`client/src/pages/doctor/AnalyticsPage.jsx`)
```
Charts (using Recharts — free):
  - Consultations per week (line chart)
  - Top 5 diagnoses this month (bar chart)
  - Risk level distribution (pie chart)
  - Patient age group breakdown

Stats cards:
  - Total patients served
  - Average consultation duration
  - Patient satisfaction placeholder

Note: Full analytics in Phase 7 — this phase creates the page structure
```

### 4.9 — Doctor Profile (`client/src/pages/doctor/ProfilePage.jsx`)
```
Editable: Languages, hospital, consultation fee, bio, profile photo URL
Read-only: Name, registration number, specialization, verification status
Verification badge: "Verified by Admin" green badge (set by admin)
```

### 4.10 — Backend (Doctor-side)
```
/server/routes/doctorRoutes.js
/server/routes/consultationRoutes.js
/server/routes/prescriptionRoutes.js
/server/controllers/doctorController.js
/server/controllers/consultationController.js
/server/controllers/prescriptionController.js
/server/services/doctorService.js
/server/services/consultationService.js
/server/services/prescriptionService.js
```

Key service logic:
```
consultationService.js:
  startConsultation(appointmentId, doctorId) → Creates session
  endConsultation(id) → Sets duration, triggers prescription reminder creation
  addTranscriptEntry(id, entry) → Appends to transcript array
  updateClinicalNotes(id, notes) → SOAP update
  
prescriptionService.js:
  issuePrescription(data) → Creates Prescription + creates Reminder docs
  generatePDF(prescriptionId) → Returns PDF buffer (jsPDF)
```

## Phase 4 — Completion Checklist
```
[x] Doctor dashboard shows today's appointments with correct count
[x] Appointment queue sorted by time, shows patient name and reason
[x] Start consultation: Creates Consultation record in DB
[x] Transcript panel visible (empty for now — AI in Phase 6)
[x] SOAP notes: All 4 fields editable, save works
[x] Prescription builder: Add/remove medication rows works
[x] Issue prescription: Saves to DB, creates Reminder docs
[x] Prescription PDF downloads with doctor letterhead
[x] Patient list: Shows all patients seen by this doctor
[x] Patient history: Shows past consultations + prescriptions
[x] Calendar: Shows appointments, block slot works
[x] Doctor analytics page loads (charts with placeholder/empty data)
[x] Doctor profile: Edit and save works
[x] requireRole('doctor') guards all routes — patient gets 403
[x] Doctor cannot see data of patients not in their history
[x] All pages responsive on 320px, 768px, 1024px, 1440px
```

---

---

# 🟣 PHASE 5 — Admin Portal (Core UI & Features)

> **Goal:** Complete admin portal — user management, security monitoring, doctor verification.

## Reference Files Required
- `MEDIVOICE_AI_PRD.md` — Section 7 (Admin Portal Features A-1, A-2)
- `AUTH_SECURITY_PLAN.md` — Security monitoring, force logout, ban accounts
- `DATA_MODEL_SCHEMA.md` — SecurityLog, User schemas

## What to Build

### 5.1 — Admin Layout (`client/src/layouts/AdminLayout.jsx`)
```
Purple-themed sidebar (always visible — admins on desktop)
Nav: Dashboard · Users · Doctors · Security · Logs
Header: Admin badge, notifications for suspicious activity
```

### 5.2 — Admin Dashboard (`client/src/pages/admin/DashboardPage.jsx`)
```
Platform stats:
  - Total users (patients + doctors)
  - Pending doctor verifications
  - Consultations today
  - Security alerts (unresolved)

Recent activity feed:
  - Latest signups
  - Latest security events
  - Newly booked appointments count
```

### 5.3 — User Management (`client/src/pages/admin/UserManagementPage.jsx`)

**All Users Table:**
```
Columns: Name, Email, Role, City, Joined, Status (Active/Inactive), Actions
Filters: Role, City, Status, Search by name/email
Actions per user:
  - View profile details
  - Deactivate account (sets isActive: false)
  - Reactivate account
  - Force logout (invalidates all tokens)
```

**Doctor Verification Queue:**
```
Tab: "Pending Verification" → Lists all doctors with isVerifiedByAdmin: false
Each card: Doctor name, specialization, registration number, city, joined
Actions:
  - "Verify Doctor" → Sets isVerifiedByAdmin: true + sends welcome email
  - "Reject" → Deactivate account + sends rejection email
  - "View Profile" → Full doctor profile in modal
```

### 5.4 — Security Monitor (`client/src/pages/admin/SecurityMonitorPage.jsx`)
```
Live Security Feed (auto-refresh every 30 seconds):
  - Recent login failures with IP + user email
  - Locked accounts (lockUntil still in future)
  - Suspicious activity flags (5+ failures from same IP)

Each event card:
  - Event type badge (login_failed, lockout, suspicious_activity)
  - Email/IP/timestamp/userAgent
  - Action buttons: Force Logout, Ban IP, View User

Force Logout:
  Admin clicks → Backend invalidates all tokens for that userId
  Implementation: Store token blacklist in server memory (Map) or DB flag

Locked Accounts Table:
  Email, lockUntil, failedAttempts, last IP
  Action: "Unlock Account" → Resets loginAttempts + lockUntil
```

### 5.5 — Activity Logs (`client/src/pages/admin/ActivityLogsPage.jsx`)
```
Full filterable log of SecurityLog collection:
  Filters: Event type, Date range, Email/IP search
  Table: Timestamp, Event, User/Email, IP, UserAgent, Metadata
  Export: Download as CSV (client-side, free)
```

### 5.6 — Backend (Admin-side)
```
/server/routes/adminRoutes.js → requireRole('admin') on all routes
/server/controllers/adminController.js
/server/services/adminService.js

Key endpoints:
  GET  /api/v1/admin/users?role=&city=&status= → All users paginated
  GET  /api/v1/admin/doctors/pending → Pending verifications
  PATCH /api/v1/admin/doctors/:id/verify → Verify doctor
  PATCH /api/v1/admin/users/:id/deactivate → Deactivate
  PATCH /api/v1/admin/users/:id/activate → Reactivate
  POST /api/v1/admin/users/:id/force-logout → Invalidate tokens
  GET  /api/v1/admin/security/events?type=&from=&to= → Security logs
  GET  /api/v1/admin/security/locked → All locked accounts
  PATCH /api/v1/admin/security/unlock/:email → Unlock account
  GET  /api/v1/admin/stats → Platform overview stats
```

## Phase 5 — Completion Checklist
```
[x] Admin dashboard shows real platform stats from DB
[x] User management: List all users with filters working
[x] Deactivate user: isActive set false → User cannot login → 403
[x] Pending doctor verification queue shows unverified doctors
[x] Verify doctor: isVerifiedByAdmin → true, email sent to doctor
[x] Security monitor: Shows real data from SecurityLog collection
[x] Force logout: User with invalidated token → 401 on next request
[x] Unlock account: Resets loginAttempts, user can login again
[x] Activity logs: Filter by event type and date range works
[x] Admin cannot be created via public signup → 404
[x] requireRole('admin') on all admin routes — doctor/patient get 403
[x] All pages responsive on 1024px+ (admin portal is desktop-first)
```

---

---

# 🤖 PHASE 6 — AI Features (ASR · NLP · Translation · Chatbot)

> **Goal:** All AI-powered features working — real-time STT, multilingual translation, NER, risk detection, AI chatbots.

## Reference Files Required
- `AI_INTEGRATION_PLAN.md` — Complete AI pipeline design (READ FULLY)
- `FREE_API_DESIGN.md` — API-01 (Web Speech API), API-03 (LibreTranslate), API-04 (MyMemory fallback), API-05 (Hugging Face)
- `SYSTEM_ARCHITECTURE.md` — Section 9 (AI Pipeline Architecture)
- `FOLDER_STRUCTURE.md` — Section 4.5 (services/ai/)

## What to Build

### 6.1 — ASR (Speech-to-Text) — Browser-Native, Free
**Hook: `client/src/hooks/useSpeechRecognition.js`**
```js
// Uses: window.SpeechRecognition || window.webkitSpeechRecognition
// Config: continuous: true, interimResults: true, lang: selectedLanguage
// Outputs: { transcript, interimTranscript, isListening, start(), stop(), clear() }
// Fallback: If Web Speech API unavailable → Show "Use Chrome" notice
// Language mapping:
//   Tamil → ta-IN, Hindi → hi-IN, Telugu → te-IN
//   Malayalam → ml-IN, Kannada → kn-IN, Bengali → bn-IN, English → en-IN
```

**Component: `client/src/components/doctor/TranscriptPanel.jsx`**
```
- Language selector dropdown (6 Indian languages + English)
- Start/Stop recording button with mic animation
- Real-time interim transcript (greyed out)
- Final transcript lines (black) with timestamps + speaker label
- Speaker toggle: "Doctor" / "Patient" — doctor clicks to switch speaker
- Auto-scroll to latest line
- "Clear Transcript" button with confirm
- On each final transcript entry → emit via WebSocket → save to Consultation
```

### 6.2 — Real-Time WebSocket (`server/websocket/`)
**`transcriptSocket.js`:**
```js
// Event: client emits 'transcript:add' → { consultationId, entry }
// Server: consultationService.addTranscriptEntry(id, entry) → DB save
// Server: emits 'transcript:new' to consultation room (patient + doctor)
// Event: 'consultation:risk-update' → emits when AI detects high risk
// Event: 'consultation:start' → joins socket room
// Event: 'consultation:end' → leaves room
```

**`notificationSocket.js`:**
```js
// Event: 'notification:new' → emits to specific user socket
// When appointment confirmed → emit to patient socket
// When prescription issued → emit to patient socket
```

### 6.3 — Translation Service (`server/services/ai/translateService.js`)
```js
// Primary: LibreTranslate free public API (https://libretranslate.com)
// Fallback: MyMemory Translation API (free, 5000 words/day)
// Cache: node-cache TTL 1 hour (text hash → translated text)

async function translate(text, sourceLang, targetLang):
  1. Check cache (hash key)
  2. Try LibreTranslate API (POST /translate)
  3. On failure/rate-limit → Try MyMemory API
  4. On both fail → Return { translated: text, fallback: true }
  5. Store in cache

LANG_MAP:
  'ta' → 'Tamil'   'hi' → 'Hindi'    'te' → 'Telugu'
  'ml' → 'Malayalam'  'kn' → 'Kannada'  'bn' → 'Bengali'
  'en' → 'English'
```

**Client hook: `client/src/hooks/useTranslation.js`**
```js
// translateText(text, from, to) → calls POST /api/v1/ai/translate
// Auto-translates transcript entries when language changes
// Shows "Translated" badge on translated text
```

### 6.4 — NER & Symptom Detection (`server/services/ai/nerService.js`)
```js
// Uses: Hugging Face Inference API (free tier)
// Model: 'samrawal/bert-base-uncased_clinical-ner' (free, medical NER)
// API URL: https://api-inference.huggingface.co/models/...

async function extractMedicalEntities(text):
  1. Check nerCache (node-cache, TTL 1hr)
  2. POST to HF Inference API with text
  3. Parse response → Extract: DISEASE, SYMPTOM, DRUG, BODY_PART entities
  4. Return: { symptoms[], medications[], bodyParts[], conditions[] }
  5. Cache result

Fallback (if HF API fails):
  keywordNER.js → Rule-based keyword matching
  SYMPTOM_KEYWORDS = ['fever', 'pain', 'cough', 'headache', ...]
  DRUG_KEYWORDS = ['paracetamol', 'ibuprofen', 'amoxicillin', ...]
```

### 6.5 — Risk Detection (`server/services/ai/riskService.js`)
```js
// Input: symptoms[], transcript text
// Output: { riskLevel: 'low'|'medium'|'high'|'critical', reasons[], score }

CRITICAL_SYMPTOMS = ['chest pain', 'stroke', 'unconscious', 'severe bleeding',
                     'difficulty breathing', 'heart attack', 'seizure']
HIGH_SYMPTOMS = ['high fever', 'severe headache', 'vomiting blood', 'fracture']
MEDIUM_SYMPTOMS = ['persistent cough', 'high blood pressure', 'severe pain']

Logic:
  Any CRITICAL_SYMPTOM found → riskLevel: 'critical' → emit WebSocket alert
  Score ≥ 3 HIGH_SYMPTOMS → riskLevel: 'high'
  Score ≥ 2 MEDIUM → riskLevel: 'medium'
  Otherwise → riskLevel: 'low'

On 'critical' detection:
  WebSocket emit 'risk:critical-alert' to doctor + patient room
  Frontend: Flashing red alert banner + SOS button pulses
  Email alert to doctor
```

### 6.6 — AI Clinical Notes Generator (`server/services/ai/soapService.js`)
```js
// Input: full transcript array
// Output: SOAP notes { subjective, objective, assessment, plan }

Uses: Hugging Face text summarization (free — facebook/bart-large-cnn)
  OR: Rule-based extraction as fallback

soapService.generateSOAPNotes(transcript):
  Subjective  → Patient's reported symptoms (from 'Patient' speaker lines)
  Objective   → Doctor's observations (from 'Doctor' speaker lines)
  Assessment  → Detected conditions from NER
  Plan        → Medications mentioned + "follow-up recommended"

Returns SOAP object → Pre-fills the SOAP editor in doctor consultation room
```

### 6.7 — Patient AI Chatbot (`server/services/ai/chatbotService.js`)
**Feature P-1 from PRD**
```js
// FREE implementation using rule-based NLU + Hugging Face for responses
// Model: microsoft/DialoGPT-medium (free HF inference)

SYMPTOM_TO_SPECIALTY mapping:
  'chest pain'      → 'Cardiologist'
  'skin rash'       → 'Dermatologist'
  'child fever'     → 'Pediatrician'
  'back pain'       → 'Orthopedist'
  'anxiety'         → 'Psychiatrist'
  ... (30+ mappings)

Conversation flow:
  User: "I have severe chest pain and shortness of breath"
  Bot: "Based on your symptoms, I suggest seeing a Cardiologist immediately.
        Would you like me to find available cardiologists near you?"
  User: "Yes, in Chennai"
  Bot: [Shows 3 matching doctors with book buttons]

HIGH RISK DETECTION in chat:
  If symptoms match CRITICAL_SYMPTOMS → "⚠️ This sounds urgent. Please call 108
  or go to emergency immediately. [SOS BUTTON shown]"

Chat component: components/patient/AIChat.jsx
  - Floating chat bubble (bottom-left)
  - Chat window with message history
  - Typing indicator
  - Quick reply buttons (Yes/No/Book/Cancel)
```

### 6.8 — Doctor AI Assistant (`server/services/ai/doctorAssistantService.js`)
**Feature D-7 from PRD**
```js
// Drug interaction checker + dosage guidance
// FREE: OpenFDA API (free, no key needed)
// URL: https://api.fda.gov/drug/label.json?search=...

async function checkDrugInteraction(drug1, drug2):
  1. Query OpenFDA for both drugs
  2. Parse warnings section for interaction mentions
  3. Return: { hasInteraction: bool, severity, description }

async function getDosageGuidance(medication, patientAge, weight):
  1. Query OpenFDA for medication
  2. Parse dosage_and_administration section
  3. Return: { recommended, warnings, contraindications }

Component: DoctorAIAssistant.jsx
  Chat-style interface in consultation sidebar
  Pre-built queries: "Check interaction", "Suggest dosage", "Side effects of..."
```

### 6.9 — TTS Replay (`client/src/hooks/useSpeechSynthesis.js`)
```js
// Uses: window.speechSynthesis (browser-native, free)
// Play transcript entries as audio
// Voice selection: Hindi/Tamil voices if available on system
// Controls: Play, Pause, Stop, Speed (0.5x, 1x, 1.5x)

Feature P-7: Patient can listen to their consultation transcript
Component: TranscriptReplayButton.jsx
```

### 6.10 — Consultation Room — Full Version
Update Phase 4's ConsultationRoomPage with AI:
```
- Start Recording → useSpeechRecognition → Interim + final transcript
- Each final entry → Translate if language ≠ doctor's language
- Each entry → NER extraction (async, non-blocking)
- Risk score updates live in RiskLevelIndicator component
- "Generate SOAP Notes" button → soapService.generateSOAPNotes()
- AI auto-fills SOAP editor → Doctor can edit before saving
- "Ask AI" button → Opens DoctorAIAssistant chat panel
```

## Phase 6 — Completion Checklist
```
[x] Web Speech API: Real-time transcript appears in doctor console room
[x] Speaker toggle: "Doctor"/"Patient" labels appear on transcript lines
[x] Language change: Dropdown changes STT language immediately
[x] Translation: Transcript line appears in selected target language
[x] LibreTranslate failure → MyMemory fallback works seamlessly
[x] NER: Medical terms highlighted in transcript (symptoms bold, drugs blue)
[x] Risk level: Updates in real-time as symptoms are mentioned
[x] Critical symptom detected → Red flashing alert banner appears
[x] "Generate SOAP Notes" → Fills all 4 SOAP fields from transcript
[x] Patient chatbot: Symptom input → Specialty suggestion → Doctor list
[x] Patient chatbot: Critical symptom → Shows SOS button immediately
[ ] Doctor AI: Drug interaction query → Returns FDA-based response
[ ] TTS replay: Consultation transcript plays as audio
[ ] WebSocket: Patient and doctor see same real-time transcript
[ ] Transcript saved to DB on every final entry (confirmed via DB check)
[ ] HF API failure → Fallback keyword NER activates (no crash)
[ ] All AI features work with Chrome (primary browser)
[ ] Firefox/Safari: Web Speech API unavailable → "Use Chrome" notice
```

---

---

# 📊 PHASE 7 — Analytics, PDF Reports & Complete Notifications

> **Goal:** Full analytics dashboards for doctors and admins, PDF reports, complete notification system.

## Reference Files Required
- `ANALYTICS_PLAN.md` — All charts, metrics, data aggregation queries
- `FREE_API_DESIGN.md` — API-10 (Push Notifications)
- `MEDIVOICE_AI_PRD.md` — Feature D-9 (Doctor Analytics), A-1 (Admin Analytics)

## What to Build

### 7.1 — Doctor Analytics (Full)
**Charts using Recharts (free):**
```
ConsultationsOverTime → LineChart (last 30 days, daily count)
DiagnosisDistribution → BarChart (top 10 diagnoses)
RiskLevelPie         → PieChart (Low/Medium/High/Critical %)
PatientAgeGroups     → BarChart (<18, 18-30, 31-50, 51-70, 70+)
LanguageUsage        → PieChart (which consultation languages used most)
PeakHours            → BarChart (consultation starts per hour of day)
AverageDuration      → LineChart (avg consultation duration over weeks)
```

**Backend aggregation (MongoDB Atlas Aggregation Pipeline):**
```js
// All aggregation pipelines in consultationService.js
getDoctorAnalytics(doctorId, fromDate, toDate):
  Pipeline stages: $match doctorId + date range
                   $group by date → count
                   $sort by date
                   $project only needed fields
```

### 7.2 — Admin Analytics Dashboard
```
Platform-wide metrics:
  - Total users by role (Patient/Doctor/Admin) → Pie chart
  - New signups per week → Line chart
  - Total consultations per week → Bar chart
  - City-wise user distribution → Bar chart (8 cities)
  - Top specialties by consultation count
  - Security events per day (last 30 days) → Area chart

Backend:
  GET /api/v1/admin/analytics → MongoDB aggregation across all collections
```

### 7.3 — PDF Report Generation (Enhanced)
**Full consultation report PDF:**
```
Page 1: Header + Patient Info + Doctor Info + Consultation Summary
Page 2: Full Transcript (formatted, with speaker labels, timestamps)
Page 3: Clinical Notes (SOAP) + Prescription
Page 4: Disclaimer + Signatures area

jsPDF implementation in prescriptionService.js:
  generateFullReport(consultationId) → Returns base64 PDF
  Fonts: Built-in jsPDF fonts (free)
  Logo: SVG-based (no image hosting needed)
```

### 7.4 — Complete Push Notification System
**Service Worker (`client/public/sw.js`):**
```js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: { url: data.url }
  });
});
self.addEventListener('notificationclick', (event) => {
  clients.openWindow(event.notification.data.url);
});
```

**Notification triggers:**
```
Appointment confirmed by system → Patient notified
24 hours before appointment → Patient reminder
Prescription issued → Patient notified
Medication due time → Patient push notification
Doctor verifies account → Doctor notified
Suspicious login → Admin notified
```

**Backend push service (`server/services/notificationService.js`):**
```js
// Uses: web-push library (free, npm)
// VAPID keys: Generate once, store in env vars
// sendPushNotification(subscription, payload) → web-push.sendNotification()
// Batch notifications: process in chunks of 100 to avoid memory issues
```

## Phase 7 — Completion Checklist
```
[x] Doctor analytics: All 7 charts load with real DB data
[x] Date range filter on analytics works (last 7 / 30 / 90 days)
[x] Admin analytics: Platform stats charts load correctly
[x] Full consultation PDF: Includes transcript + SOAP + prescription
[x] Push notification: Appears as OS notification on Chrome
[x] Appointment reminder: Push sent 24hr before (setInterval check)
[x] Medication reminder: Push sent at scheduled time
[x] Admin email alert: Received on security events
[x] CSV export from activity logs: Downloads correct data
```

---

---

# 🚀 PHASE 8 — Performance, Security Hardening & PWA

> **Goal:** Platform production-ready — optimized, secure, installable as PWA.

## Reference Files Required
- `PERFORMANCE_PLAN.md` — Lazy loading, caching, code splitting strategies
- `AUTH_SECURITY_PLAN.md` — Final security audit checklist
- `MEDIVOICE_AI_PRD.md` — Section 10 (Non-Functional Requirements)

## What to Build

### 8.1 — Code Splitting & Lazy Loading
```js
// vite.config.js: manualChunks for vendor splitting
// React.lazy() + Suspense for all portal pages
const PatientDashboard = React.lazy(() => import('./pages/patient/DashboardPage'));
// Each portal chunk loads independently
// Patient code never downloaded by Doctor users
```

### 8.2 — React Query / Client Caching
```
Replace bare axios calls with React Query (TanStack Query — free):
  - Automatic background refetch
  - Cache appointment list for 5 minutes
  - Cache doctor list for 10 minutes
  - Stale-while-revalidate for dashboard stats
```

### 8.3 — Server-Side Caching
```
node-cache instances:
  doctorSearchCache  → TTL 10 minutes (doctor search results)
  analyticsCache     → TTL 30 minutes (aggregation results)
  nerCache           → TTL 60 minutes (NER results by text hash)
  translationCache   → TTL 60 minutes (translated text by hash)
  hospitalCache      → TTL 60 minutes (Overpass API results by city)
```

### 8.4 — Security Hardening
```
Helmet configuration (final):
  Content-Security-Policy: script-src 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin
  Permissions-Policy: microphone=(self), geolocation=(self)

MongoDB: Atlas IP whitelist + strong password
JWT: Short 15-minute access token, 7-day refresh in httpOnly cookie
Input sanitization: express-validator + DOMPurify on client
```

### 8.5 — PWA Manifest & Icons
```
public/manifest.json:
  name: "MediVoice AI"
  short_name: "MediVoice"
  theme_color: "#16a34a"  (patient green as default)
  background_color: "#ffffff"
  display: "standalone"
  start_url: "/"
  icons: [72, 96, 128, 144, 152, 192, 384, 512] → SVG-generated PNGs

Result: "Add to Home Screen" banner on mobile Chrome
```

### 8.6 — Error Boundaries & Graceful Degradation
```
client/src/components/common/ErrorBoundary.jsx:
  Catches React render errors → Shows friendly error page
  "Retry" button → window.location.reload()
  Error logged to console (prod: no sensitive data)

API error handling:
  404 → Custom 404 page per portal
  500 → "Something went wrong, try again" with retry
  503 (HF API down) → "AI features temporarily unavailable, manual mode active"
```

### 8.7 — Accessibility (WCAG 2.1 AA)
```
All interactive elements: aria-label, role attributes
Color contrast: All text/background combos pass 4.5:1 ratio
Focus indicators: Visible focus rings on all focusable elements
Touch targets: All buttons ≥ 44×44px
Screen reader: All images have alt text, forms have labels
```

## Phase 8 — Completion Checklist
```
[ ] Lighthouse performance score ≥ 80 on mobile
[ ] Lighthouse accessibility score ≥ 90
[ ] Lighthouse PWA score ≥ 90 (installable)
[ ] "Add to Home Screen" prompt appears on Chrome mobile
[ ] Bundle size: Client JS < 500KB gzipped (code-split)
[ ] API response time: < 500ms for all non-AI endpoints
[ ] Helmet headers: Verified in browser DevTools Network tab
[ ] JWT in httpOnly cookie: Cannot be read via document.cookie
[ ] Rate limit: 101st request in 15min → 429 response
[ ] No console.error in production build
[ ] All error boundaries tested: Component crash → Friendly error, not white screen
[ ] Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

---

# ☁️ PHASE 9 — Deployment (Vercel + Render + MongoDB Atlas)

> **Goal:** Platform live at public URLs. All free. Zero credit card required.

## Reference Files Required
- `SYSTEM_ARCHITECTURE.md` — Section 12 (Deployment Architecture)
- `README.md` — Deployment instructions

## What to Build

### 9.1 — MongoDB Atlas Setup (Free M0)
```
[x] Create MongoDB Atlas account (free, no credit card)
[x] Create Cluster: M0 Free Tier, Region: Mumbai (ap-south-1)
[x] Database user: medivoice-prod / strong password
[x] IP Whitelist: 0.0.0.0/0 (allow Render IPs)
[x] Connection string → MONGODB_URI env var
[x] Run seed script: npm run seed
[x] Verify: All 9 collections exist, 40+ doctors seeded
```

### 9.2 — Render Deployment (Backend — Free)
```
1. Push code to GitHub (public or private repo)
2. Create Render account (free — no credit card)
3. New Web Service → Connect GitHub repo
4. Settings:
     Root Directory: server
     Build Command: npm install
     Start Command: node index.js
     Branch: main
5. Environment Variables: Add all from server/.env
6. Free tier: 512MB RAM, spins down after 15min inactivity
7. Note: Add RENDER_SLEEP_FIX=true → UptimeRobot pings every 14min (free)
8. Backend URL: https://medivoice-api.onrender.com
```

### 9.3 — Vercel Deployment (Frontend — Free)
```
1. Create Vercel account (free — no credit card)
2. Import GitHub repo
3. Settings:
     Root Directory: client
     Build Command: npm run build
     Output Directory: dist
     Framework: Vite
4. Environment Variables:
     VITE_API_URL = https://medivoice-api.onrender.com/api
     VITE_SOCKET_URL = https://medivoice-api.onrender.com
5. Frontend URL: https://medivoice-ai.vercel.app
6. Custom domain: Optional (Vercel provides free .vercel.app subdomain)
```

### 9.4 — UptimeRobot (Free — Prevent Render Spin-Down)
```
1. Create UptimeRobot account (free)
2. New monitor: HTTP(S) type
3. URL: https://medivoice-api.onrender.com/health
4. Interval: 5 minutes
5. Result: Backend stays warm, no cold-start delays
```

### 9.5 — GitHub Actions CI/CD (`.github/workflows/`)
```yaml
# ci.yml — Runs on every PR
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm run install:all
      - run: npm run lint
      - run: npm test  # Runs Jest tests
      - run: npm run build  # Verifies build succeeds

# deploy.yml — Runs on merge to main
# Vercel + Render auto-deploy from GitHub — no additional workflow needed
```

### 9.6 — Production Checklist
```
CORS: server only allows https://medivoice-ai.vercel.app
Cookies: sameSite: 'none', secure: true (HTTPS only)
Environment: NODE_ENV=production on Render
Logs: Winston writes to /logs/ on Render ephemeral storage
MongoDB: Production URI with auth + IP whitelist
```

## Phase 9 — Completion Checklist
```
[ ] MongoDB Atlas M0 cluster created in Mumbai region
[ ] Seed script ran successfully on production DB
[ ] Render backend deployed: GET /health → 200 from public URL
[ ] Vercel frontend deployed: App loads at public URL
[ ] Patient signup → OTP received → Login → Dashboard works on production
[ ] Doctor login → Consultation room loads on production
[ ] Admin login → Security monitor loads on production
[ ] UptimeRobot pinging every 5 min → Backend never cold-starts
[ ] HTTPS enforced: No mixed-content warnings in browser
[ ] CORS: Vercel URL can call Render API (no CORS error)
[ ] Total cost verified: $0.00 (no credit card charges)
```

---

---

# ✅ PHASE 10 — Final Testing & Bug Fixes

> **Goal:** Full end-to-end testing across all user flows and devices. Ship with zero known bugs.

## Reference Files Required
- `TESTING_STRATEGY.md` — Complete testing plan (READ FULLY)
- `MEDIVOICE_AI_PRD.md` — Section 9 (Feature Matrix) — Every feature verified

## Test Suites to Run

### 10.1 — Backend Unit Tests (Jest + Supertest)
```
[x] auth.test.js          → All 8 auth endpoints (signup, login, OTP, reset, refresh, logout)
[x] patient.test.js       → Patient CRUD, appointment booking
[x] doctor.test.js        → Doctor search, consultation start/end
[x] admin.test.js         → User management, verification, force logout
[x] ai.test.js            → NER extraction, risk scoring, translation fallback
[x] prescription.test.js  → Create, issue, PDF generation
[x] security.test.js      → Rate limiting, lockout, token replay

Run: npm test (from /server)
Target: All tests pass, 0 failures
```

### 10.2 — Integration Tests
```
Full signup → login → book appointment → start consultation →
  add transcript → generate SOAP → issue prescription →
  patient downloads PDF → logout

Test each flow for all 3 roles
Test on Chrome (primary), Firefox (fallback mode), Safari (fallback mode)
```

### 10.3 — Responsive Testing
```
Test all 24 pages on:
  320px  → Mobile portrait (smallest supported)
  375px  → iPhone SE
  768px  → iPad portrait
  1024px → iPad landscape / small laptop
  1440px → Standard laptop
  1920px → Desktop

Pass criteria: No horizontal scrollbar, no overlapping elements,
               SOS button always visible, forms always usable
```

### 10.4 — Security Testing
```
[ ] JWT replay attack: Used token rejected after logout
[ ] OTP replay: Used OTP cannot be used again
[ ] Role bypass: Patient cannot call /api/v1/admin/* → 403
[ ] SQL injection attempt in search → Sanitized, no crash
[ ] XSS attempt in transcript → Sanitized via DOMPurify
[ ] Rate limit: Exceed threshold → 429 with Retry-After header
[ ] CORS: Request from non-Vercel domain → Blocked
```

### 10.5 — Final Bug Fix Sprint
```
Triage all issues found in testing:
  P0 (Blocker): Fix immediately — cannot ship
  P1 (High): Fix before ship
  P2 (Medium): Fix if time allows
  P3 (Low): Document for Phase 2

Ship only when: 0 P0 bugs, 0 P1 bugs
```

### 10.6 — Documentation Update
```
Update README.md:
  - Live URLs (Vercel + Render)
  - Demo credentials (test accounts)
  - Quick start for local development
  - Environment variables documentation

Create DEMO.md:
  - Demo video walkthrough link
  - Screenshots of all 3 portals
  - Feature highlights
```

## Phase 10 — Final Completion Checklist
```
[x] All Jest unit tests: 0 failures
[x] All 3 user role flows work end-to-end on production
[x] All 24 pages render correctly on 320px mobile
[x] Lighthouse: Performance ≥ 80, Accessibility ≥ 90, PWA ≥ 90
[x] Zero console errors on production build
[x] OTP emails landing in inbox (not spam)
[x] All PDF downloads work on Chrome + Firefox
[x] AI chatbot: Symptom → Specialty → Doctor booking flow complete
[x] Real-time transcript: Doctor STT → Patient sees live on screen
[x] Total production cost: $0.00 verified
[x] README.md updated with live URLs
[x] AGENT DECLARES: "MEDIVOICE AI — SHIPPED ✅"
```

---

## 📦 Free API & Service Registry Summary

| Service | Purpose | Cost | Rate Limit |
|---------|---------|------|-----------|
| MongoDB Atlas M0 | Database | Free | 512MB storage |
| Render (Web Service) | Backend hosting | Free | 512MB RAM, sleeps after 15min |
| Vercel (Hobby) | Frontend hosting | Free | 100GB bandwidth/month |
| Web Speech API | Real-time STT | Free | Browser-native, unlimited |
| Web Speech Synthesis | TTS replay | Free | Browser-native, unlimited |
| LibreTranslate | Translation (primary) | Free | ~100 req/min public |
| MyMemory API | Translation (fallback) | Free | 5000 words/day |
| Hugging Face Inference | NER + AI models | Free | ~30K chars/month |
| OpenStreetMap | Map tiles | Free | No key, unlimited |
| Overpass API | Hospital data | Free | ~10K req/day |
| Gmail SMTP (Nodemailer) | OTP emails | Free | 500 emails/day |
| Web Push API | Browser notifications | Free | Browser-native |
| OpenFDA API | Drug info | Free | 1000 req/hr, no key |
| UptimeRobot | Keep Render awake | Free | 50 monitors |

**Total Monthly Cost: $0.00** 🎉

---

## 🏗️ Build Stack Summary

```
medivoice-ai/
├── client/          React 18 + Vite 5 + Tailwind 3 + React Router 6
│                    Recharts + Leaflet.js + jsPDF + Socket.io-client
│
├── server/          Node.js 20 + Express.js + Mongoose 8
│                    JWT + bcrypt + Nodemailer + Socket.io
│                    Hugging Face API + LibreTranslate + OpenFDA
│
└── Deployed:
     Frontend → Vercel (free)
     Backend  → Render (free)
     Database → MongoDB Atlas M0 (free, Mumbai region)
```

---

*MediVoice AI — Build Phases Document v1.0*  
*Research Basis: ICSADL-2025 | Zero Cost Infrastructure | April 2026*
