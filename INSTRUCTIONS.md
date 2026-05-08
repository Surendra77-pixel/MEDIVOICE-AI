# 🎙️ MEDIVOICE AI — Agent Build Instructions

> **Complete, ordered instructions for an AI agent to build the MediVoice AI platform from scratch.**
> Every rule, phase, file path, API, and architectural decision is encoded here.
> Follow this document sequentially. Do not skip steps. Do not improvise structure.

---

## ⚡ Project Summary

| Property | Value |
|---|---|
| **Platform Name** | MediVoice AI |
| **Type** | AI-Powered Healthcare Communication Platform |
| **Stack** | MERN (MongoDB · Express · React 18 · Node.js 20) |
| **Architecture** | Modular Monolith → Microservices-ready |
| **Infrastructure Cost** | $0.00/month — 100% free tools only |
| **Total Build Phases** | 14 (Phase 0 → Phase 13) |
| **User Roles** | Patient · Doctor · Admin |
| **AI Components** | 12 (all with keyword-rule fallbacks) |
| **Languages Supported** | Tamil · Telugu · Malayalam · Kannada · Bengali · Hindi |
| **Cities — Phase 1** | Chennai · Bangalore · Mumbai · Vijayawada · Hyderabad · Delhi · Goa · Puducherry |
| **Total Pages** | 24 unique screens across 4 portal zones |
| **MongoDB Collections** | 9 |
| **REST API Endpoints** | 38 |
| **WebSocket Events** | 14 |

---

## 🔴 NON-NEGOTIABLE AGENT RULES

> These rules govern every action taken during the build. Violation of any rule is a build error.

| # | Rule | What It Means |
|---|---|---|
| **RULE 1** | **PHASE GATE** | Never begin Phase N+1 until every test checklist item in Phase N is green. |
| **RULE 2** | **ZERO COST** | Never use a paid API, service, library, or hosting plan. If no free alternative exists, build it. |
| **RULE 3** | **FILE DISCIPLINE** | Follow the folder structure exactly. One file = one job. Never create files outside the defined structure. |
| **RULE 4** | **NO SECRETS IN CODE** | All secrets go in `.env` only. Always update `.env.example` at the same time. Never commit `.env`. |
| **RULE 5** | **RESPONSIVE ALWAYS** | Every UI must work from 320px to 1440px+. Test every Tailwind breakpoint before marking a phase complete. |
| **RULE 6** | **AI FALLBACK REQUIRED** | Every AI call must have a keyword-rule or cached fallback. The platform must never crash because an AI service is down. |
| **RULE 7** | **COMMIT AFTER EACH PHASE** | Commit after each phase with the message: `feat: Phase N complete — [phase name]` |
| **RULE 8** | **READ DOCS FIRST** | Re-read the listed reference documents before writing any code in a phase. |
| **RULE 9** | **GOLDEN RULE** | A phase is DONE when every checkbox in its test checklist is ✅ green — not when the code is written. |

---

## 🧰 Pre-Build Setup — Create These Free Accounts First

| Service | URL | Purpose | Free Limit |
|---|---|---|---|
| MongoDB Atlas | https://cloud.mongodb.com | Database (M0 cluster) | 512 MB |
| Vercel | https://vercel.com | Frontend hosting | Unlimited (hobby) |
| Render | https://render.com | Backend hosting | 750 hrs/month |
| GitHub | https://github.com | Version control + CI/CD | Unlimited public repos |
| Gmail | https://gmail.com | SMTP for OTP emails | 500 emails/day |
| Hugging Face | https://huggingface.co | NLP + AI inference API | ~30k req/month |

> Create all accounts before writing a single line of code. Have all credentials ready.

---

## 📐 Architecture Overview

```
USERS (Patient · Doctor · Admin)
        │  HTTPS / WSS
        ▼
┌───────────────────────────────────┐
│   CLIENT LAYER — React 18 PWA    │
│   Vite · Tailwind CSS · Axios    │
│   React Router · socket.io-client│
└─────────────────┬─────────────────┘
                  │ REST + WebSocket
┌─────────────────▼─────────────────┐
│  API GATEWAY — Express.js         │
│  JWT Auth · Rate Limiting · CORS  │
│  Helmet · Input Validation        │
└──────┬──────────┬──────────┬──────┘
       │          │          │
  Auth Svc   Controllers  WebSocket
  OTP·JWT    Services     Real-Time
       │          │          │
┌──────▼──────────▼──────────▼──────┐
│        AI SERVICES LAYER          │
│  ASR · NER · Translation · SOAP   │
│  Chatbot · Risk · TTS · Analytics │
└──────┬──────────┬──────────┬──────┘
       │          │          │
  Hugging   LibreTranslate  Web
  Face API   / MyMemory    Speech API
       │
┌──────▼──────────────────────────┐
│   MongoDB Atlas M0 (Free 512MB) │
│   9 Collections · Mumbai Region │
└─────────────────────────────────┘
```

---

## 🗂️ Complete Folder Structure

Follow this structure exactly. Do not create files or folders outside of it.

```
medivoice-ai/                              ← Monorepo root
├── package.json                           ← Root workspace (concurrently scripts)
├── .gitignore
├── .editorconfig
├── .eslintrc.json
├── .prettierrc
├── .env.example                           ← All var names, empty values — COMMIT THIS
│
├── client/                                ← React 18 PWA (Vite)
│   ├── package.json
│   ├── vite.config.js                     ← Port 5173, proxy /api → :5000
│   ├── tailwind.config.js                 ← MediVoice brand colors
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env                               ← GITIGNORED
│   ├── public/
│   │   ├── manifest.json                  ← PWA manifest
│   │   ├── robots.txt
│   │   └── favicon.ico
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                        ← Root router with lazy-loaded routes
│       ├── index.css                      ← Tailwind directives only
│       │
│       ├── components/
│       │   ├── common/                    ← Shared across all portals
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── LoadingSpinner.jsx
│       │   │   ├── SOSButton.jsx          ← Always visible on patient pages
│       │   │   ├── RiskBadge.jsx
│       │   │   ├── LanguageSelector.jsx
│       │   │   ├── NotificationBell.jsx
│       │   │   ├── ConfirmModal.jsx
│       │   │   └── AIDisclaimer.jsx
│       │   ├── auth/
│       │   │   ├── RegisterForm.jsx
│       │   │   ├── LoginForm.jsx
│       │   │   ├── OTPInput.jsx
│       │   │   └── RolePicker.jsx
│       │   ├── patient/
│       │   │   ├── AppointmentCard.jsx
│       │   │   ├── HospitalCard.jsx
│       │   │   ├── ChatMessage.jsx
│       │   │   ├── TranscriptPanel.jsx
│       │   │   ├── PrescriptionCard.jsx
│       │   │   └── MedicalHistoryCard.jsx
│       │   ├── doctor/
│       │   │   ├── PatientQueueCard.jsx
│       │   │   ├── SOAPNoteEditor.jsx
│       │   │   ├── PrescriptionBuilder.jsx
│       │   │   ├── ScheduleSlot.jsx
│       │   │   └── RiskIndicator.jsx
│       │   └── admin/
│       │       ├── UserRow.jsx
│       │       ├── SecurityLogRow.jsx
│       │       └── StatsCard.jsx
│       │
│       ├── pages/
│       │   ├── Landing.jsx                ← Public homepage
│       │   ├── auth/
│       │   │   ├── Register.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── OTPVerify.jsx
│       │   │   └── ForgotPassword.jsx
│       │   ├── patient/
│       │   │   ├── PatientDashboard.jsx
│       │   │   ├── AIChatbot.jsx
│       │   │   ├── AppointmentBooking.jsx
│       │   │   ├── HospitalFinder.jsx
│       │   │   ├── LiveConsultation.jsx
│       │   │   ├── MedicalHistory.jsx
│       │   │   ├── Prescriptions.jsx
│       │   │   └── Reminders.jsx
│       │   ├── doctor/
│       │   │   ├── DoctorDashboard.jsx
│       │   │   ├── PatientQueue.jsx
│       │   │   ├── ConsultationPanel.jsx
│       │   │   ├── ClinicalNotes.jsx
│       │   │   ├── PrescriptionBuilder.jsx
│       │   │   ├── ScheduleManager.jsx
│       │   │   ├── DoctorAssistant.jsx
│       │   │   └── DoctorAnalytics.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── UserManagement.jsx
│       │       └── SecurityMonitor.jsx
│       │
│       ├── layouts/
│       │   ├── PublicLayout.jsx
│       │   ├── PatientLayout.jsx          ← Includes persistent SOSButton
│       │   ├── DoctorLayout.jsx
│       │   └── AdminLayout.jsx
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useSpeechRecognition.js    ← Web Speech API wrapper
│       │   ├── useTextToSpeech.js
│       │   ├── useTranslation.js
│       │   ├── useSocket.js
│       │   ├── useNotifications.js
│       │   └── useGeolocation.js
│       │
│       ├── context/
│       │   ├── AuthContext.jsx            ← Global auth state
│       │   ├── SocketContext.jsx
│       │   └── NotificationContext.jsx
│       │
│       ├── services/
│       │   ├── api.js                     ← Axios instance (baseURL + credentials)
│       │   ├── authService.js
│       │   ├── patientService.js
│       │   ├── doctorService.js
│       │   ├── adminService.js
│       │   ├── appointmentService.js
│       │   ├── consultationService.js
│       │   ├── aiService.js
│       │   └── hospitalService.js
│       │
│       ├── utils/
│       │   ├── pdfGenerator.js            ← jsPDF + html2canvas
│       │   ├── dateHelpers.js
│       │   ├── riskHelpers.js
│       │   └── validators.js
│       │
│       ├── constants/
│       │   ├── roles.js                   ← 'patient' | 'doctor' | 'admin'
│       │   ├── languages.js               ← 6 Indian languages config
│       │   ├── cities.js                  ← 8 Phase 1 cities
│       │   └── routes.js                  ← All URL path constants
│       │
│       └── assets/
│           ├── logo.svg
│           └── icons/
│
└── server/                                ← Node.js 20 + Express.js
    ├── package.json
    ├── server.js                          ← App entry + Socket.io init
    ├── .env                               ← GITIGNORED
    │
    ├── config/
    │   ├── db.js                          ← MongoDB Atlas connection
    │   └── email.js                       ← Nodemailer Gmail SMTP
    │
    ├── models/
    │   ├── User.js
    │   ├── Patient.js
    │   ├── Doctor.js
    │   ├── Appointment.js
    │   ├── Consultation.js
    │   ├── Prescription.js
    │   ├── Reminder.js
    │   ├── OTP.js
    │   └── SecurityLog.js
    │
    ├── controllers/                       ← THIN: parse → call service → respond
    │   ├── authController.js
    │   ├── patientController.js
    │   ├── doctorController.js
    │   ├── adminController.js
    │   ├── appointmentController.js
    │   ├── consultationController.js
    │   ├── prescriptionController.js
    │   └── aiController.js
    │
    ├── services/                          ← THICK: all business logic + DB
    │   ├── authService.js
    │   ├── patientService.js
    │   ├── doctorService.js
    │   ├── adminService.js
    │   ├── appointmentService.js
    │   ├── consultationService.js
    │   ├── prescriptionService.js
    │   ├── notificationService.js
    │   └── ai/                            ← All 12 AI components isolated here
    │       ├── asrService.js              ← AI-01
    │       ├── translationService.js      ← AI-02
    │       ├── ttsService.js              ← AI-03
    │       ├── nerService.js              ← AI-04 Medical NLP/NER
    │       ├── chatbotService.js          ← AI-05 Patient Chatbot
    │       ├── riskAlertService.js        ← AI-06 Risk Detection
    │       ├── soapService.js             ← AI-07 SOAP Note Generator
    │       ├── doctorAssistantService.js  ← AI-08 Doctor Clinical QA
    │       ├── prescriptionAIService.js   ← AI-09 Prescription Pre-Fill
    │       ├── reminderAIService.js       ← AI-10 Medication Reminder Engine
    │       ├── riskClassifierService.js   ← AI-11 Patient Risk Classifier
    │       └── analyticsAIService.js      ← AI-12 Doctor Analytics Intelligence
    │
    ├── middleware/
    │   ├── authMiddleware.js              ← JWT verify + role check
    │   ├── rateLimiter.js                 ← express-rate-limit config
    │   ├── errorHandler.js
    │   ├── sanitizer.js                   ← xss-clean + mongo-sanitize
    │   └── requestLogger.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── patientRoutes.js
    │   ├── doctorRoutes.js
    │   ├── adminRoutes.js
    │   ├── appointmentRoutes.js
    │   ├── consultationRoutes.js
    │   ├── prescriptionRoutes.js
    │   └── aiRoutes.js
    │
    ├── websocket/
    │   ├── index.js                       ← Socket.io server setup + room logic
    │   └── consultationSocket.js          ← All 14 WS event handlers
    │
    ├── validators/
    │   ├── authValidators.js
    │   ├── appointmentValidators.js
    │   └── prescriptionValidators.js
    │
    ├── seed/
    │   └── seedDoctors.js                 ← Seed 8 cities with doctor profiles
    │
    └── utils/
        ├── logger.js
        ├── otpGenerator.js
        └── responseHelpers.js

.github/
└── workflows/
    ├── ci.yml                             ← Lint + tests on every PR
    └── deploy.yml                         ← Deploy to Vercel + Render on main
```

---

## 🔐 Environment Variables

### `server/.env` (GITIGNORED — never commit)

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/medivoice

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
JWT_EXPIRES_IN=24h

# Email — Gmail SMTP
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=MediVoice AI <your_gmail@gmail.com>

# Hugging Face
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL_NER=d4data/biomedical-ner-all
HUGGINGFACE_MODEL_QA=deepset/roberta-base-squad2

# Translation
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=

# Security
BCRYPT_SALT_ROUNDS=12
OTP_EXPIRY_MINUTES=10
MAX_LOGIN_ATTEMPTS=3
LOCKOUT_DURATION_MINUTES=15

# CORS
CLIENT_URL=http://localhost:3000
```

### `client/.env` (GITIGNORED)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🎨 Design System

### Brand Colors (add to `tailwind.config.js`)

```js
colors: {
  patient: { DEFAULT: '#16a34a', light: '#dcfce7', dark: '#14532d' },  // Green
  doctor:  { DEFAULT: '#2563eb', light: '#dbeafe', dark: '#1e3a8a' },  // Blue
  admin:   { DEFAULT: '#7c3aed', light: '#ede9fe', dark: '#4c1d95' },  // Purple
}
```

### Responsive Breakpoints

| Breakpoint | Width | Device |
|---|---|---|
| (default) | 320px | Mobile S |
| `sm` | 640px | Mobile L |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop XL |

### UX Rules (non-negotiable)
- Every screen designed at 375px first, then scaled up
- One primary CTA per page — visually dominant
- No dead ends: every error/empty state has a next action
- Language selector accessible from first interaction
- SOS button visible on **every** patient page, always — never hidden
- AI-generated content always labeled: "AI-Generated Draft" or "AI Suggestion"
- 44px minimum touch targets on all interactive elements
- WCAG 2.1 AA contrast ratios enforced

---

## 🗄️ Database — 9 MongoDB Collections

### Schema Summary

| Collection | Purpose | Key Fields |
|---|---|---|
| `users` | Base auth for all roles | email, passwordHash, role, isVerified, loginAttempts, lockedUntil |
| `patients` | Patient profile + health data | userId, medicalHistory[], allergies[], bloodType, city |
| `doctors` | Doctor profile + scheduling | userId, specialty, licenseNumber, city, isVerified, availableSlots[] |
| `appointments` | Booking records | patientId, doctorId, date, timeSlot, status, city |
| `consultations` | Live session + transcript | appointmentId, transcript[], soapNotes{}, nerEntities[], riskLevel |
| `prescriptions` | Issued medications | consultationId, medications[], patientSnapshot{}, doctorSnapshot{} |
| `reminders` | Medication reminders | patientId, prescriptionId, schedule[], nextDue, isActive |
| `otps` | Email verification codes | email, otp, expiresAt (TTL index: auto-delete after 10 min) |
| `securitylogs` | Audit + security events | userId, event, ip, userAgent, severity, timestamp |

### Critical Indexes to Create

```js
// Performance-critical indexes
users:         { email: 1 } unique
appointments:  { doctorId: 1, date: 1, status: 1 }
appointments:  { patientId: 1, status: 1 }
consultations: { appointmentId: 1 } unique
prescriptions: { patientId: 1, createdAt: -1 }
otps:          { expiresAt: 1 } TTL (expireAfterSeconds: 0)
securitylogs:  { userId: 1, createdAt: -1 }
doctors:       { city: 1, specialty: 1, isVerified: 1 }
```

---

## 🤖 AI Components — All 12

Every AI component must have both a primary path and a fallback path.

| ID | Component | Primary | Fallback |
|---|---|---|---|
| AI-01 | Automated Speech Recognition (ASR) | Web Speech API (browser-native) | Text input field |
| AI-02 | Multilingual Translation | LibreTranslate API | MyMemory API |
| AI-03 | Text-to-Speech (TTS) | Web Speech Synthesis API | Silent (text only) |
| AI-04 | Medical NLP / NER | Hugging Face `d4data/biomedical-ner-all` | Keyword regex rules |
| AI-05 | Patient AI Chatbot | Hugging Face `deepset/roberta-base-squad2` | Hardcoded FAQ responses |
| AI-06 | Risk Alert & Severity Detection | NER output + risk keyword scoring | Risk keyword list |
| AI-07 | SOAP Note Generator | NER entities → template assembly | Blank SOAP template |
| AI-08 | Doctor AI Assistant (Clinical QA) | Hugging Face QA model | Canned clinical answers |
| AI-09 | Prescription Pre-Fill | NER medication entities | Empty prescription form |
| AI-10 | Medication Reminder Engine | Schedule parsing from prescription | Manual time input |
| AI-11 | Patient Risk Level Classifier | Multi-factor scoring (vitals + symptoms + history) | HIGH risk default |
| AI-12 | Doctor Analytics Intelligence | Aggregated consultation NER data | Raw count charts |

### AI Implementation Rules
- Check `node-cache` before every Hugging Face call
- Every AI route must respond within 5 seconds — use timeout + fallback
- Always display: `⚕️ AI-generated content. Not a substitute for professional medical advice.`
- Log all AI failures to `securitylogs` with `severity: 'info'`

---

## 🔌 External APIs — 12 Free Services

| API | Use Case | Always Free? | Rate Limit |
|---|---|---|---|
| Web Speech API | ASR — voice to text | ✅ Browser native | Unlimited |
| Web Speech Synthesis | TTS — text to voice | ✅ Browser native | Unlimited |
| LibreTranslate | 6-language translation (primary) | ✅ Free public | ~5 req/s |
| MyMemory | Translation fallback | ✅ Free | 5k req/day |
| Hugging Face Inference | Medical NER + QA models | ✅ Free tier | ~30k req/month |
| OpenStreetMap Tiles | Map rendering via Leaflet.js | ✅ Always free | Tile-based |
| Overpass API | Hospital/clinic location data | ✅ Always free | ~1 req/s |
| Geolocation API | Browser GPS for hospital finder | ✅ Browser native | Unlimited |
| Gmail SMTP (Nodemailer) | OTP email delivery | ✅ Free | 500 emails/day |
| Push Notifications API | Medication reminders | ✅ Browser native | Unlimited |
| MongoDB Atlas M0 | Database | ✅ Free tier | 512 MB |
| `tel:108` Protocol | SOS emergency call | ✅ Native | Unlimited |

---

## 🔒 Authentication & Security Architecture

### Auth Flow
1. User submits registration form with role selection (Patient / Doctor / Admin)
2. Server creates user with `isVerified: false`, sends 6-digit OTP via Gmail SMTP
3. OTP stored in `otps` collection with 10-minute TTL index (auto-deletes)
4. User enters OTP → account activated (`isVerified: true`)
5. Login: credentials verified → JWT signed → stored in **httpOnly cookie** (never localStorage)
6. Every protected route: JWT decoded from cookie → role checked → request proceeds or 403

### JWT Configuration
```js
// Token stored as httpOnly cookie — not in localStorage
res.cookie('token', jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
});
```

### Security Middleware Stack (apply in this order in `server.js`)
```js
app.use(helmet())                    // Security headers
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '10kb' }))
app.use(mongoSanitize())             // NoSQL injection prevention
app.use(xssClean())                  // XSS prevention
app.use(compression())               // Gzip
// Then routes with rate limiting per-router
```

### Rate Limiting Rules
- Auth routes: max 5 requests per 15 minutes per IP
- Login: 3 failed attempts → account locked 15 minutes → show countdown modal
- General API: max 100 requests per 15 minutes per IP

### Role-Based Access Control
```js
// Middleware signature
protect(roles: string[])

// Usage on routes
router.get('/patient/history', protect(['patient']), getHistory)
router.get('/doctor/queue', protect(['doctor']), getQueue)
router.get('/admin/users', protect(['admin']), getUsers)
// Cross-role access returns 403 — no exceptions
```

---

## 🌐 REST API — 38 Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register with role, triggers OTP email |
| POST | `/verify-otp` | Public | Verify OTP → activate account |
| POST | `/login` | Public | Login → set httpOnly JWT cookie |
| POST | `/logout` | Auth | Clear cookie + invalidate session |
| GET | `/me` | Auth | Get current user (no token in body — reads cookie) |
| POST | `/forgot-password` | Public | Send password reset OTP |
| POST | `/reset-password` | Public | Reset password with OTP |

### Patient Routes (`/api/patient`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Patient | Dashboard stats + upcoming appointments |
| GET | `/appointments` | Patient | All appointments (paginated) |
| GET | `/medical-history` | Patient | Full medical history |
| GET | `/prescriptions` | Patient | All prescriptions |
| GET | `/reminders` | Patient | Active medication reminders |
| PUT | `/profile` | Patient | Update profile |

### Doctor Routes (`/api/doctor`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Doctor | Stats + today's queue |
| GET | `/patients` | Doctor | All assigned patients |
| GET | `/schedule` | Doctor | Available slots |
| PUT | `/schedule` | Doctor | Update availability |
| GET | `/analytics` | Doctor | Consultation analytics |

### Appointment Routes (`/api/appointments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/hospitals` | Patient | Search hospitals by city |
| GET | `/doctors/:city/:specialty` | Patient | Available doctors |
| POST | `/book` | Patient | Book appointment |
| PUT | `/:id/cancel` | Patient/Doctor | Cancel appointment |
| PUT | `/:id/confirm` | Doctor | Confirm appointment |

### Consultation Routes (`/api/consultations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/start` | Doctor | Start live consultation session |
| PUT | `/:id/end` | Doctor | End consultation + save transcript |
| GET | `/:id` | Patient/Doctor | Get consultation details |
| PUT | `/:id/soap` | Doctor | Save SOAP notes |

### Prescription Routes (`/api/prescriptions`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Doctor | Issue new prescription |
| GET | `/:id` | Patient/Doctor | Get prescription |
| GET | `/patient/:patientId` | Doctor | Patient's prescription history |

### AI Routes (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/chat` | Patient | Patient AI chatbot message |
| POST | `/analyze-symptoms` | Patient | Symptom risk analysis |
| POST | `/ner` | Doctor | Extract medical entities from transcript |
| POST | `/soap` | Doctor | Generate SOAP notes from transcript |
| POST | `/translate` | Auth | Translate text to target language |
| POST | `/risk-classify` | Doctor | Classify patient risk level |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | All users (paginated + filtered) |
| PUT | `/users/:id/verify` | Admin | Verify doctor account |
| PUT | `/users/:id/suspend` | Admin | Suspend user account |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/security-logs` | Admin | Security audit log |
| POST | `/force-logout/:id` | Admin | Force-logout a specific user |
| GET | `/stats` | Admin | Platform-wide statistics |

---

## ⚡ WebSocket Events — 14 Events

All WebSocket rooms are named: `consultation:{consultationId}`

### Client → Server Events
| Event | Payload | Description |
|---|---|---|
| `join-consultation` | `{ consultationId, role }` | Join a consultation room |
| `leave-consultation` | `{ consultationId }` | Leave consultation room |
| `transcript-update` | `{ consultationId, line, speaker, language }` | Send transcript line |
| `language-change` | `{ consultationId, language }` | Notify language switch |
| `risk-alert` | `{ consultationId, level, symptoms }` | Broadcast risk alert |

### Server → Client Events
| Event | Payload | Description |
|---|---|---|
| `consultation-joined` | `{ participants }` | Confirm room join |
| `transcript-line` | `{ line, speaker, timestamp, language }` | Broadcast transcript line |
| `translation-ready` | `{ original, translated, language }` | Translation result |
| `risk-alert-broadcast` | `{ level, symptoms, timestamp }` | Alert all participants |
| `participant-joined` | `{ role, name }` | New participant entered |
| `participant-left` | `{ role }` | Participant left room |
| `consultation-ended` | `{ consultationId }` | Doctor ended session |
| `soap-ready` | `{ soap }` | AI SOAP notes generated |
| `ner-entities` | `{ entities }` | NER extraction complete |

---

## 📱 Pages & Routes — 24 Screens

### URL Route Architecture

| URL | Page | Auth Required | Role |
|---|---|---|---|
| `/` | Landing Page | ❌ | Public |
| `/register` | Registration | ❌ | Public |
| `/login` | Login | ❌ | Public |
| `/verify-otp` | OTP Verification | ❌ | Public |
| `/forgot-password` | Forgot Password | ❌ | Public |
| `/patient/dashboard` | Patient Dashboard | ✅ | Patient |
| `/patient/chatbot` | AI Chatbot | ✅ | Patient |
| `/patient/book` | Appointment Booking | ✅ | Patient |
| `/patient/hospitals` | Hospital Finder | ✅ | Patient |
| `/patient/consultation` | Live Consultation | ✅ | Patient |
| `/patient/history` | Medical History | ✅ | Patient |
| `/patient/prescriptions` | Prescriptions | ✅ | Patient |
| `/patient/reminders` | Medication Reminders | ✅ | Patient |
| `/doctor/dashboard` | Doctor Dashboard | ✅ | Doctor |
| `/doctor/queue` | Patient Queue | ✅ | Doctor |
| `/doctor/consultation` | Live Consultation Panel | ✅ | Doctor |
| `/doctor/notes` | Clinical Notes | ✅ | Doctor |
| `/doctor/prescriptions` | Prescription Builder | ✅ | Doctor |
| `/doctor/schedule` | Schedule Manager | ✅ | Doctor |
| `/doctor/assistant` | AI Doctor Assistant | ✅ | Doctor |
| `/doctor/analytics` | Analytics Dashboard | ✅ | Doctor |
| `/admin/dashboard` | Admin Dashboard | ✅ | Admin |
| `/admin/users` | User Management | ✅ | Admin |
| `/admin/security` | Security Monitor | ✅ | Admin |

---

## 🏗️ Build Phases — Step-by-Step

---

### Phase 0 — Project Setup & Monorepo Foundation

**Goal:** Monorepo skeleton, all dependencies installed, both dev servers running without errors.

**Install Commands:**

```bash
# Root workspace
npm init -y
npm install -D concurrently

# Client
cd client
npm create vite@latest . -- --template react
npm install react-router-dom axios socket.io-client react-hot-toast lucide-react jspdf html2canvas leaflet react-leaflet
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Server
cd ../server
npm install express mongoose dotenv bcryptjs jsonwebtoken nodemailer cors helmet express-rate-limit express-validator express-mongo-sanitize xss-clean compression socket.io node-cache uuid
npm install -D nodemon jest supertest
```

**Root `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "test": "npm test --prefix server && npm test --prefix client"
  }
}
```

**✅ Phase 0 Tests:**
- [ ] `npm run dev` from root starts both servers without errors
- [ ] `http://localhost:5173` loads a blank Vite React page
- [ ] `http://localhost:5000/api/health` returns `{ status: 'ok' }`
- [ ] MongoDB connects (check server logs: `"MongoDB connected"`)
- [ ] `.env` is gitignored — does not appear in `git status`
- [ ] `.env.example` is committed with all var names and empty values

---

### Phase 1 — Database Models & Server Foundation

**Goal:** All 9 Mongoose models defined, indexes created, seed script working.

**Key Implementation Notes:**
- `User.js`: pre-save hook for bcrypt hashing (`saltRounds: 12`)
- `OTP.js`: TTL index on `expiresAt` field (`expireAfterSeconds: 0`)
- `Doctor.js`: `isVerified: false` by default — admin must verify
- `Consultation.js`: embed `transcript[]` array (not a separate collection)
- Run `npm run seed` to populate 8 cities with doctor profiles

**✅ Phase 1 Tests:**
- [ ] All 9 models import without errors
- [ ] `npm run seed` populates doctors for all 8 cities
- [ ] OTP document auto-deletes after 10 minutes (TTL index working)
- [ ] Password is hashed in DB — never stored as plaintext

---

### Phase 2 — Authentication System

**Goal:** Full auth cycle: register → OTP email → verify → login → protected routes → logout.

**Key Implementation Notes:**
- JWT stored in `httpOnly` cookie — never return it in JSON body
- Failed login increments `loginAttempts` counter in User model
- After 3 failures: set `lockedUntil = Date.now() + 15 minutes`
- `/api/auth/me` reads JWT from cookie — frontend uses this to hydrate AuthContext
- Doctor signup: set `isVerified: false` — requires admin approval before full access

**Auth Routes to implement:** Register · Verify OTP · Login · Logout · `/me` · Forgot Password · Reset Password

**Frontend Requirements:**
- `AuthContext.jsx` provides `{ user, login, logout, loading }` to all components
- Protected route wrapper: redirect to `/login` if no valid session
- Role-based redirect after login: Patient → `/patient/dashboard`, Doctor → `/doctor/dashboard`, Admin → `/admin/dashboard`
- Lockout modal: shows countdown timer when account is locked

**✅ Phase 2 Tests:**
- [ ] Full registration flow: form → email arrives → OTP input → account active
- [ ] Login with wrong password 3× → lockout modal appears with countdown
- [ ] Refreshing the page preserves login state (cookie survives refresh)
- [ ] Accessing `/patient/dashboard` when logged in as doctor → 403 redirect
- [ ] Logout clears cookie and redirects to `/login`
- [ ] JWT is in `httpOnly` cookie — not visible in browser JS console

---

### Phase 3 — Landing Page & Public UI

**Goal:** Public homepage that communicates the platform's value proposition.

**Landing Page Sections (in order):**
1. Hero — headline, subheadline, "Get Started Free" CTA, medical illustration
2. Features — 4 problem/solution cards (STT, Translation, History Vault, SOS Alert)
3. How It Works — 3-step flow for Patient, Doctor, and Admin
4. Language Support — 6 Indian language badges
5. Cities — 8 Phase 1 city cards
6. Research — ICSADL-2025 research basis section
7. CTA — "Join as Patient" / "Join as Doctor" split CTA
8. Footer — links + disclaimer

**✅ Phase 3 Tests:**
- [ ] Landing page renders correctly at 375px, 768px, 1024px, 1440px
- [ ] "Get Started Free" → `/register`
- [ ] Lighthouse Performance ≥ 80 on mobile

---

### Phase 4 — Patient Portal — Core Features

**Goal:** Full patient experience — dashboard, booking, hospital finder, prescriptions, medical history, reminders.

**Patient Dashboard must show:**
- Next appointment card
- Recent prescription card
- Risk level badge (from last consultation)
- Upcoming medication reminder
- Quick action buttons: Book · Chatbot · Hospitals · SOS

**Hospital Finder:**
- Use Leaflet.js + OpenStreetMap tiles (zero cost)
- Fetch hospitals via Overpass API: `amenity=hospital` within city bounding box
- Geolocation API for "near me" — graceful fallback if permission denied
- Show hospital cards with name, distance, rating, "Book Here" button

**Appointment Booking Flow:**
1. Select city
2. Select specialty
3. Select doctor (from seeded data)
4. Select date + available time slot
5. Confirm booking → POST `/api/appointments/book`
6. Confirmation screen with appointment details

**Prescription Page:**
- List of all prescriptions (newest first)
- Each card: doctor name, date, medications list
- "Download PDF" button → generates PDF client-side using jsPDF (no server call)

**SOS Button:**
```jsx
// This component must appear in PatientLayout — cannot be removed
<a href="tel:108" className="sos-button">🚨 SOS · Call 108</a>
```

**✅ Phase 4 Tests:**
- [ ] Patient dashboard loads with real data from DB
- [ ] Hospital finder map renders with pins for 8 cities
- [ ] Full booking flow completes and appointment appears in doctor's queue
- [ ] Prescription PDF downloads with correct data
- [ ] SOS button visible on all patient pages — `href="tel:108"` confirmed
- [ ] All pages work on 375px mobile (no horizontal overflow)

---

### Phase 5 — Doctor Portal — Core Features

**Goal:** Doctor workflow — dashboard, patient queue, schedule manager, clinical notes, prescription builder, analytics.

**Doctor Dashboard must show:**
- Today's appointment count
- Pending patients in queue
- Risk alerts (patients with HIGH risk from last consultation)
- Quick actions: View Queue · Start Consultation · Schedule · Assistant

**Patient Queue:**
- List of today's appointments sorted by time
- Each row: patient name, age, reason, risk badge, "Start Consultation" button
- Filter by: All · Pending · In Progress · Completed

**Schedule Manager:**
- Weekly calendar view
- Click time slot → toggle available/unavailable
- Changes POST to `/api/doctor/schedule`

**Prescription Builder:**
- Search medications by name
- Add medication: name, dosage, frequency, duration, instructions
- Preview → Issue Prescription → saved to DB + triggers reminder creation

**✅ Phase 5 Tests:**
- [ ] Doctor can see all their appointments in the queue
- [ ] Risk badges display correctly (GREEN · YELLOW · RED)
- [ ] Doctor can update their schedule — changes reflected in booking system
- [ ] Prescription issued by doctor appears in patient's Prescriptions page

---

### Phase 6 — Admin Portal — Core Features

**Goal:** Admin dashboard, user management, security monitor.

**Admin Dashboard shows:**
- Total platform users (by role count)
- Unverified doctors pending review
- Recent security events
- Daily registration trend chart

**User Management:**
- Table: all users filterable by role, status, city
- Per-user actions: Verify Doctor · Suspend · Delete · Force Logout
- Unverified doctors shown with warning badge
- Search by name or email

**Security Monitor:**
- Table of `securitylogs` entries
- Filter by: severity (info / warning / critical) · event type · date range
- Events to log: failed logins · lockouts · suspicious IPs · force logouts

**✅ Phase 6 Tests:**
- [ ] Admin can verify a doctor → doctor can now log in to full portal
- [ ] Suspending a user → user's next request returns 401
- [ ] Force logout invalidates the user's cookie immediately
- [ ] Security log shows failed login attempts with IP + timestamp

---

### Phase 7 — AI Voice Engine (ASR + Translation + TTS)

**Goal:** Real-time voice transcription, translation, and text-to-speech using browser-native APIs.

**`useSpeechRecognition.js` hook:**
```js
// Must detect browser support and show fallback text input if not Chrome
const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
// Supported languages: ta-IN, te-IN, ml-IN, kn-IN, bn-IN, hi-IN, en-IN
```

**`translationService.js` (server-side):**
```js
// Always try LibreTranslate first
// On failure (non-200 or timeout): switch to MyMemory API
// Cache translation results for 1 hour in node-cache
```

**`useTextToSpeech.js` hook:**
```js
// Use window.speechSynthesis
// Map language codes to voice names for 6 Indian languages
// Graceful silent fallback if no voice available
```

**✅ Phase 7 Tests:**
- [ ] Chrome: microphone permission requested → voice captured → transcript displayed
- [ ] Firefox / Safari: fallback text input shown (no crash, no empty screen)
- [ ] Translation: English text → Tamil → displayed correctly (Unicode renders)
- [ ] TTS: translated text is spoken in correct language
- [ ] LibreTranslate down → MyMemory fallback activates automatically
- [ ] All voice features work on mobile Chrome with mic permission

---

### Phase 8 — AI Intelligence Layer (NLP, NER, Chatbot, Risk, SOAP)

**Goal:** Activate all 12 AI components with their fallbacks.

**AI-04 Medical NER (`nerService.js`):**
```js
// POST to Hugging Face: d4data/biomedical-ner-all
// Extract: symptoms, diagnoses, medications, procedures
// Fallback: regex keyword matching against medical terms list
// Cache results by transcript hash (node-cache, 30 min TTL)
```

**AI-05 Patient Chatbot (`chatbotService.js`):**
```js
// Use Hugging Face: deepset/roberta-base-squad2
// System context: patient's medical history + current symptoms
// Always append: "⚕️ This is AI guidance. Please consult a doctor."
// Fallback: FAQ response lookup table
```

**AI-06 Risk Alert (`riskAlertService.js`):**
```js
// Input: NER-extracted symptoms + patient risk history
// Score symptoms against HIGH/MEDIUM/LOW keyword lists
// HIGH keywords: "chest pain", "difficulty breathing", "stroke", etc.
// Output: { level: 'HIGH'|'MEDIUM'|'LOW', symptoms: [], recommendation: '' }
// HIGH risk → trigger WebSocket risk-alert event to doctor
```

**AI-07 SOAP Note Generator (`soapService.js`):**
```js
// Input: full transcript + NER entities
// Map entities to SOAP sections:
//   Subjective: patient-reported symptoms
//   Objective: observed vitals/findings
//   Assessment: diagnoses identified
//   Plan: medications + follow-up
// Always label output: "AI-Generated Draft — Requires Doctor Review"
```

**✅ Phase 8 Tests:**
- [ ] NER extracts symptoms from a sample transcript (test with fixture)
- [ ] Chatbot responds to "I have chest pain" with HIGH risk + disclaimer
- [ ] Risk level: "I feel dizzy" → MEDIUM; "I can't breathe" → HIGH alert
- [ ] SOAP note generated with all 4 sections populated
- [ ] Hugging Face API key removed/invalid → fallback activates, no crash
- [ ] All AI responses display the medical disclaimer

---

### Phase 9 — Live Consultation System

**Goal:** Real-time bidirectional consultation with transcript, translation, and AI analysis.

**Consultation Flow:**
1. Doctor clicks "Start Consultation" for an appointment
2. Server creates Consultation document, opens Socket.io room
3. Both patient and doctor join room via `join-consultation` event
4. Patient speaks → Web Speech API → transcript line emitted via `transcript-update`
5. Server receives line → runs NER → rebroadcasts via `transcript-line`
6. Translation service translates line → emits `translation-ready`
7. Risk service evaluates every line → emits `risk-alert-broadcast` if HIGH
8. Doctor clicks "End Consultation" → all data saved to Consultation document
9. SOAP notes auto-generated → emitted via `soap-ready`

**Live Consultation Page Layout (Patient):**
- Top: Doctor info + language selector + SOS button
- Center: Live transcript panel (auto-scrolling)
- Bottom: Mic toggle button + language selector

**Live Consultation Panel (Doctor):**
- Left: Live transcript with speaker labels
- Right: Real-time NER entities panel (auto-updating)
- Bottom: Risk level indicator + SOAP notes draft area

**✅ Phase 9 Tests:**
- [ ] Both patient and doctor can join the same consultation room
- [ ] Transcript line spoken by patient appears on doctor's screen < 2s
- [ ] HIGH risk symptom triggers red alert on doctor's panel immediately
- [ ] "End Consultation" saves transcript to DB and closes room
- [ ] SOAP notes auto-populate after consultation ends
- [ ] WebSocket reconnects automatically after 3-second network dropout

---

### Phase 10 — Documents & Hospital Maps

**Goal:** PDF generation for prescriptions, full hospital map with booking integration.

**PDF Generation (client-side, jsPDF):**
- Never generate PDF on server — use client-side jsPDF + html2canvas
- Prescription PDF must contain: patient info, doctor info, medications table, date, digital signature placeholder
- Clinical Notes PDF: SOAP format with AI-generated label
- Trigger: "Download PDF" button → generates and downloads in browser

**Hospital Finder (full implementation):**
- Leaflet.js map centered on selected city
- Overpass API query: fetch hospitals within city bounding box
- Cluster markers when zoomed out (use Leaflet.markercluster)
- Click hospital pin → popup with name, address, "Book Here" button
- "Near Me" button → browser geolocation → recenter map

**✅ Phase 10 Tests:**
- [ ] Prescription PDF downloads with correct patient/doctor/medication data
- [ ] PDF is readable, properly formatted (no overlapping text)
- [ ] Hospital map loads for all 8 cities without errors
- [ ] Clicking a hospital → booking flow opens with that hospital pre-selected
- [ ] Geolocation "Near Me" works on mobile Chrome

---

### Phase 11 — Notifications & Medication Reminders

**Goal:** Browser push notifications for medication reminders and appointment alerts.

**Medication Reminder Flow:**
1. Doctor issues prescription → `reminderAIService.js` parses medication schedule
2. Reminder documents created in DB (one per medication per dose time)
3. Frontend requests Notification permission on login
4. Service worker registered for background notifications
5. Reminders fire at scheduled times even when tab is in background

**Notification Types:**
- Medication reminder: "Time to take [medication] [dosage]"
- Appointment reminder: "Appointment with Dr. [name] tomorrow at [time]"
- Risk alert: "⚠️ Your recent symptoms were flagged. Please check with your doctor."
- Doctor verification: "Your account has been verified. You can now accept patients."

**✅ Phase 11 Tests:**
- [ ] Medication reminder notification fires at correct time
- [ ] Notification appears even when browser tab is in background
- [ ] Declining notification permission → reminders shown as in-app toasts instead
- [ ] Appointment reminder fires 24h before the appointment

---

### Phase 12 — Analytics & Reporting Dashboard

**Goal:** Data-driven analytics for doctors and admins using recharts (free, open-source).

**Doctor Analytics Dashboard:**
- Consultations per week (line chart — recharts `LineChart`)
- Top diagnoses from NER data (bar chart — recharts `BarChart`)
- Patient risk distribution (pie chart — recharts `PieChart`)
- Language usage breakdown (recharts `BarChart`)
- Time range selector: 7 days · 30 days · 90 days

**Admin Analytics Dashboard:**
- User growth over time (line chart)
- User breakdown by role (pie chart)
- City-wise appointment distribution (bar chart)
- Security events over time (area chart)

**Library:** `recharts` — always use `ResponsiveContainer` wrapper for all charts.

**✅ Phase 12 Tests:**
- [ ] All charts render without errors (no console errors)
- [ ] Charts are responsive — correct on 375px and 1440px
- [ ] Time range selector updates all charts correctly
- [ ] Empty state (0 consultations) shows placeholder — no crash
- [ ] Top Diagnoses chart uses actual NER data from DB

---

### Phase 13 — Testing, Performance & Deployment

**Goal:** All tests pass, Lighthouse targets met, deployed to Vercel + Render.

**Test Files to Create:**
```
server/__tests__/
├── auth.test.js         # Register → OTP → Login → Protected → Logout
├── patient.test.js      # Patient API endpoints
├── doctor.test.js       # Doctor API endpoints
├── ai.test.js           # Mock Hugging Face — test fallbacks
└── models.test.js       # Schema validation tests

client/src/__tests__/
├── AuthContext.test.jsx
├── useSpeechRecognition.test.js    # Mock Web Speech API
└── SOSButton.test.jsx              # href="tel:108" confirmed
```

**Performance Optimizations (apply before deployment):**
```js
// App.jsx — lazy load all portal pages
const PatientDashboard = React.lazy(() => import('./pages/patient/PatientDashboard'));
const DoctorDashboard  = React.lazy(() => import('./pages/doctor/DoctorDashboard'));
const AdminDashboard   = React.lazy(() => import('./pages/admin/AdminDashboard'));

// server.js — gzip compression
const compression = require('compression');
app.use(compression());

// All AI services — cache before API call
const cached = cache.get(cacheKey);
if (cached) return cached;
```

**Deployment:**

**Frontend → Vercel:**
```
Framework:  Vite
Build cmd:  npm run build
Output dir: client/dist
Env vars:   VITE_API_URL · VITE_SOCKET_URL (set in Vercel dashboard)
```

**Backend → Render:**
```
Type:       Web Service
Build:      npm install
Start:      node server.js
Region:     Singapore (lowest latency to India)
Health:     GET /api/health → 200
Env vars:   All server .env vars (set in Render dashboard)
Auto-deploy: Yes — on push to main branch
```

**Update CORS for production:**
```js
// server.js
origin: process.env.CLIENT_URL  // = https://your-app.vercel.app
```

**Performance Targets:**

| Metric | Target |
|---|---|
| Page load on 4G mobile | < 3 seconds |
| ASR latency | < 500ms (client-side only) |
| API response (non-AI) | < 2 seconds |
| Lighthouse Performance | ≥ 85 |
| Lighthouse Accessibility | ≥ 90 |

**✅ Phase 13 Tests:**

**Automated:**
- [ ] `npm test` (server) — all Jest tests pass · ≥ 80% coverage
- [ ] `npm test` (client) — all Vitest tests pass
- [ ] GitHub Actions CI runs tests on PR without failure

**End-to-End:**
- [ ] Patient: Register → OTP → Book Appointment → Live Consultation → Download PDF
- [ ] Doctor: Login → View Queue → Start Consultation → SOAP Notes → Issue Prescription
- [ ] Admin: Login → Verify Doctor → View Security Log → Force Logout User

**Cross-Browser:**
- [ ] Chrome — full feature set (Web Speech API works)
- [ ] Firefox — ASR fallback text input shown gracefully
- [ ] Safari (iOS) — httpOnly cookie works
- [ ] Mobile Chrome (Android) — mic permission + real STT works on device

**Production:**
- [ ] `https://[your-app].vercel.app` loads without console errors
- [ ] `https://[your-api].onrender.com/api/health` → 200
- [ ] Registration email arrives from production Gmail SMTP
- [ ] WebSocket connects from Vercel frontend to Render backend

---

## 🔒 Security Checklist — Run Before Every Deployment

- [ ] All `.env` files gitignored — `git status` confirms they don't appear
- [ ] `.env.example` has all var names with empty values — committed to repo
- [ ] No API keys, passwords, or JWT secrets in any committed file
- [ ] JWT stored in httpOnly cookie — not in localStorage or sessionStorage
- [ ] bcrypt `saltRounds` is 12 or higher
- [ ] Every AI output displays the medical disclaimer
- [ ] CORS `origin` set to production Vercel URL (not `*`)
- [ ] Helmet.js security headers active in production
- [ ] Rate limiting active on all auth routes
- [ ] MongoDB Atlas network access: only allow Render's outbound IP (not `0.0.0.0/0`)
- [ ] `express-mongo-sanitize` active (strips `$` and `.` from inputs)
- [ ] `xss-clean` active on all input routes

---

## 🗺️ Quick Reference — What Goes Where

```
New UI used in 3+ places          → client/src/components/common/
New UI for patient only           → client/src/components/patient/
New page with its own URL         → client/src/pages/[role]/
Logic with React state/effects    → client/src/hooks/
API call to backend               → client/src/services/
Pure function, no React           → client/src/utils/
Static value / config object      → client/src/constants/

HTTP request handler (server)     → server/controllers/ (thin: parse → call service)
Business logic / DB / AI call     → server/services/ (thick: all the work)
AI component                      → server/services/ai/
Input validation rules            → server/validators/
Database collection               → server/models/
Express route definition          → server/routes/
WebSocket event handler           → server/websocket/
One-time DB setup script          → server/seed/
New environment variable          → .env AND .env.example (always both, simultaneously)
```

---

## 📈 Build Progress Tracker

Copy this into your project notes and mark off as each phase completes.

```
╔══════════════════════════════════════════════════════════════════════╗
║                  MEDIVOICE AI — BUILD PROGRESS                       ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  [ ] Phase 0  — Project Setup & Monorepo Foundation                 ║
║  [ ] Phase 1  — Database Models & Server Foundation                 ║
║  [ ] Phase 2  — Authentication System                               ║
║  [ ] Phase 3  — Landing Page & Public UI                            ║
║  [ ] Phase 4  — Patient Portal — Core Features                      ║
║  [ ] Phase 5  — Doctor Portal — Core Features                       ║
║  [ ] Phase 6  — Admin Portal — Core Features                        ║
║  [ ] Phase 7  — AI Voice Engine (ASR · Translation · TTS)           ║
║  [ ] Phase 8  — AI Intelligence Layer (NER · Chatbot · Risk · SOAP) ║
║  [ ] Phase 9  — Live Consultation System (WebSocket)                ║
║  [ ] Phase 10 — Documents & Hospital Maps                           ║
║  [ ] Phase 11 — Notifications & Medication Reminders                ║
║  [ ] Phase 12 — Analytics & Reporting Dashboard                     ║
║  [ ] Phase 13 — Testing, Performance & Deployment                   ║
║                                                                      ║
║  Status:  NOT STARTED                                                ║
║  Started: ___________          Target: ___________                   ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🚫 Post-MVP Features — Do NOT Build in MVP

These are explicitly out of scope. Do not implement them, even if they seem easy.

| Feature | Reason Deferred |
|---|---|
| Payment gateway / billing | Adds compliance complexity |
| Video/audio calling (WebRTC) | High infrastructure cost |
| AI diagnosis engine (clinical-grade) | Regulatory/liability concerns |
| Lab report upload & OCR analysis | Requires separate OCR pipeline |
| React Native mobile apps | Web PWA covers mobile in MVP |
| Multi-country support | Phase 1 is India only |
| Insurance integration | Out of MVP scope |
| Wearable device data | IoT planned for Phase 3 |

---

## 📖 Glossary

| Term | Definition |
|---|---|
| **ASR** | Automated Speech Recognition — converts spoken audio to text |
| **STT** | Speech-to-Text — equivalent term to ASR |
| **TTS** | Text-to-Speech — converts written text to spoken audio |
| **NER** | Named Entity Recognition — extracts symptoms, drugs, diagnoses from text |
| **SOAP Notes** | Subjective · Objective · Assessment · Plan — standard clinical note format |
| **JWT** | JSON Web Token — stateless auth token (stored in httpOnly cookie) |
| **OTP** | One-Time Password — 6-digit temporary verification code |
| **PWA** | Progressive Web App — web app installable and mobile-optimized |
| **LibreTranslate** | Free, open-source machine translation API |
| **Hugging Face** | Free AI model hosting — used for medical NLP/NER |
| **Overpass API** | Free OpenStreetMap query API — fetches hospital location data |
| **Leaflet.js** | Free open-source JavaScript library for interactive maps |
| **jsPDF** | Free client-side PDF generation library |
| **Nodemailer** | Free Node.js SMTP email library (used with Gmail) |
| **SOS** | Emergency trigger — one-tap call to 108 (India ambulance service) |
| **RBAC** | Role-Based Access Control — routes locked by role (patient/doctor/admin) |
| **Modular Monolith** | Single deployable app with clear module boundaries — microservices-ready |

---

<div align="center">

---

**MEDIVOICE AI — Agent Build Instructions v1.0**

*14 phases · 24 pages · 12 AI components · 38 API endpoints · $0 infrastructure*

*Research Basis: ICSADL-2025 — Enhancing Healthcare Communication via Automated STT*

*Built for better healthcare communication across India*

---

</div>
