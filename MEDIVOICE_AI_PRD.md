**MEDIVOICE AI**	Product Requirements Document v1.0.0

**MEDIVOICE AI**

Product Requirements Document

*AI-Powered Healthcare Communication Platform*

|**Document Version**|v1.0.0 — Initial Release|
| :- | :- |
|**Date**|April 2026|
|**Project Name**|MediVoice AI|
|**Document Type**|Product Requirements Document (PRD)|
|**Target Platforms**|Web (Mobile, iOS, Android, Tablet, Desktop, Laptop)|
|**Status**|Draft — Awaiting Stakeholder Review|
|**Research Basis**|ICSADL-2025: Enhancing Healthcare Communication via Automated STT|

*Prepared by: Senior Product & AI Architecture Team*

\

# **1. Executive Summary**
MediVoice AI is a next-generation, AI-powered, zero-cost healthcare communication platform that bridges the gap between doctors, patients, and administrators through real-time speech-to-text transcription, multilingual dialogue translation, intelligent clinical documentation, and AI-assisted decision support.

Rooted in the research published at ICSADL-2025 — which demonstrated the transformative potential of Automated Speech Recognition (ASR) and Natural Language Processing (NLP) in converting doctor-patient dialogues into structured clinical records — MediVoice AI extends these findings into a fully functional, production-grade web platform.

The platform serves three distinct user roles — Patient, Doctor, and Admin — each equipped with a dedicated AI-powered portal, role-specific dashboards, and intelligent assistants. All features are built exclusively on free, open-source tools and APIs, ensuring zero infrastructure cost.

## **1.1 Core Value Propositions**

|**Pillar**|**Value Delivered**|
| :-: | :-: |
|**🎤 Voice-First**|Real-time STT transcription of doctor-patient conversations using Web Speech API + ASR|
|**🌐 Multilingual**|Seamless translation across Tamil, Telugu, Malayalam, Kannada, Bengali, Hindi|
|**🤖 AI-Driven**|AI agents assist patients, doctors, and admins with clinical recommendations and analytics|
|**📄 Auto-Docs**|Automatic generation of clinical notes, prescriptions, and PDF downloads|
|**💰 Zero Cost**|Built entirely on free APIs, open-source frameworks, and no-cost infrastructure|
|**📱 Responsive**|Pixel-perfect on Mobile, iOS, Android, Tablet, Desktop, and Laptop screens|



# **2. Project Overview**
## **2.1 Problem Statement**
Healthcare systems globally face a critical bottleneck: the administrative burden of clinical documentation. Doctors spend a disproportionate amount of time on manual note-taking, reducing the quality time available for direct patient care. Simultaneously, language barriers between multilingual doctors and patients in India create miscommunication, misdiagnoses, and poor patient experiences.

The research paper underpinning this project (ICSADL-2025) identifies these exact pain points and proposes automated STT-based systems as the solution. MediVoice AI is the practical implementation of that vision.

## **2.2 Mission Statement**
***"MediVoice AI exists to make every doctor-patient interaction smarter, clearer, and more efficient — by giving voice to healthcare through artificial intelligence."***

## **2.3 Target Audience**

|**Role**|**Who They Are**|**Primary Need**|**Platform Color**|
| :-: | :-: | :-: | :-: |
|**Patient**|Individuals seeking medical care across 8 major Indian cities|Easy appointment booking, AI health guidance, consultation records|Green — Trust & Health|
|**Doctor**|Licensed medical practitioners across specialties|Efficient consultation workflow, AI clinical support, patient management|Blue — Knowledge & Calm|
|**Admin**|Platform administrators managing operations|System oversight, user management, security monitoring|Purple — Authority & Control|

## **2.4 Geographic Scope — Phase 1**
MediVoice AI Phase 1 will cover the following 8 Indian cities with real-time hospital data, maps, ratings, and appointment slots:

|**Chennai**|**Bangalore**|**Mumbai**|**Vijayawada**|**Hyderabad**|**Delhi**|**Goa**|**Puducherry**|
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |



# **3. Technical Architecture**
## **3.1 Technology Stack (100% Free)**

|**Layer**|**Technology**|**Purpose**|**Cost**|
| :-: | :-: | :-: | :-: |
|**Frontend**|React.js + Tailwind CSS|Responsive UI across all devices|Free / Open-source|
|**Backend**|Node.js + Express.js|REST API, business logic, session handling|Free / Open-source|
|**Database**|MongoDB Atlas (Free Tier)|User data, medical records, appointments|Free (512MB)|
|**ASR Engine**|Web Speech API (Browser-native)|Real-time speech-to-text in browser|Free (Browser API)|
|**NLP / AI**|Hugging Face Inference API (Free)|Medical NLP, sentiment analysis, AI chatbot|Free Tier|
|**Translation**|LibreTranslate (Self-hosted / Free API)|Multilingual real-time transcription|Free|
|**TTS Engine**|Web Speech Synthesis API|Text-to-speech replay of consultations|Free (Browser API)|
|**Maps**|Leaflet.js + OpenStreetMap|Real-time hospital/clinic locator with maps|Free / Open-source|
|**PDF Generation**|jsPDF + html2canvas|One-click prescription PDF download|Free / Open-source|
|**Authentication**|JWT + bcrypt|Secure role-based auth with OTP|Free / Open-source|
|**Email OTP**|EmailJS or Nodemailer (Gmail SMTP)|Real-time OTP to Gmail for signup/reset|Free|
|**Hosting**|Vercel (Frontend) + Render (Backend)|Production deployment|Free Tier|
|**Doctor Dataset**|NHA / Practo Open Data / Custom Seed|Real doctor profiles across India|Free|

## **3.2 Core AI Components (From Research Paper)**
Based on the ICSADL-2025 research paper, the following AI components are integrated:

|**Component**|**Implementation**|**Use Case in MediVoice AI**|
| :-: | :-: | :-: |
|ASR (Automated Speech Recognition)|Web Speech API + optional Whisper via Hugging Face|Live consultation transcription, voice commands|
|NLP (Natural Language Processing)|Hugging Face medical NER models (free tier)|Medical term extraction, symptom detection, sentiment analysis|
|CNN Architecture|Pre-trained models via Hugging Face|Feature extraction from speech patterns for risk detection|
|RNN / LSTM|Sequence modeling for dialogue context|Maintaining conversation context in AI chatbot|
|TTS (Text-to-Speech)|Web Speech Synthesis API|Audio replay of consultations, accessibility|
|NLU Dialogue System|Intent Classification + Response Generation|AI chatbot for patient and doctor portals|

## **3.3 System Architecture Overview**
The platform follows a microservices-inspired architecture with three client applications (Patient, Doctor, Admin) connecting to a unified backend API layer:

- Client Layer: React.js PWA — fully responsive across all screen sizes
- API Gateway: Express.js REST API with JWT-secured role-based routing
- AI Services: Modular AI microservice layer (ASR, NLP, TTS, Translation, Chatbot)
- Data Layer: MongoDB Atlas for persistent storage of users, records, appointments
- Real-time Layer: WebSockets for live transcription and notification delivery
- External APIs: OpenStreetMap/Leaflet for hospital maps, LibreTranslate for language



# **4. Authentication System**
MediVoice AI implements a robust, multi-layered authentication system applicable to all three user roles — Patient, Doctor, and Admin. All authentication is role-based, OTP-verified, JWT-secured, and rate-limited.

|**#**|**Feature**|**Detailed Description**|
| :-: | :-: | :-: |
|**Auth1**|**Role-Based Registration**|On the signup page, users must select their role: Patient, Doctor, or Admin. Role determines portal access, dashboard layout, and feature availability. Role is encoded in JWT token.|
|**Auth2**|**Email OTP Verification**|Upon signup, a real 6-digit OTP is generated server-side and dispatched to the user's Gmail via Nodemailer (Gmail SMTP — free). OTP expires in exactly 10 minutes. The account is NOT activated until OTP is verified.|
|**Auth3**|**Duplicate Email Prevention**|If a user attempts to register with an already-registered email, a generic error is shown: "An account with this email already exists. Please log in instead." No additional account details are revealed.|
|**Auth4**|**Login Rate Limiting**|After 3 consecutive failed login attempts (wrong password), the account is automatically locked for 15 minutes. A countdown timer is shown on screen.|
|**Auth5**|**Lockout Popup**|A clear, friendly modal popup displays: "Too many failed attempts. Your account is locked for [X] minutes. Please try again after [timestamp]."|
|**Auth6**|**Suspicious Activity Logging**|Multiple login attempts from different IPs, or rapid successive attempts, are automatically flagged and logged. These logs are visible in the Admin panel under Security Alerts.|
|**Auth7**|**Single Session Enforcement**|Each new login generates a fresh JWT token, automatically invalidating all previous sessions for that user. A notification is sent to the previously active session: "You have been logged out because your account was accessed from another device."|
|**Auth8**|**JWT Authentication**|All API calls are secured via JWT tokens. Tokens encode the user's role, ID, and expiry (24-hour validity). Role-based middleware on the backend ensures patients cannot access doctor routes and vice versa.|
|**Auth9**|**Password Reset via OTP**|Forgot Password flow: User enters registered email → 6-digit OTP sent to Gmail → User enters OTP → Directed to password reset page → New password saved (hashed via bcrypt). OTP is single-use and expires in 10 minutes.|
|**Auth10**|**Password Strength Rules**|Passwords must meet: minimum 8 characters, at least 1 uppercase letter, at least 1 number, and at least 1 special character (!@#$%^&\*). A real-time strength indicator (Weak / Moderate / Strong) is shown as the user types.|



# **5. Patient Portal — Feature Requirements**
The Patient Portal is the primary interface for individuals seeking medical care. It is designed to be intuitive, AI-assisted, and fully accessible across all devices. Every feature listed below is required for the initial release.

## **P-1 | AI Chatbot Assistant**

|**Feature ID**|P-1|
| :- | :- |
|**Feature Name**|AI Health Assistant Chatbot|
|**Priority**|**CRITICAL**|
|**Description**|A mini AI chatbot embedded in the patient portal. The patient describes their health issues in natural language (text or voice). The AI analyzes symptoms, suggests a doctor specialty, recommends appropriate medications and food, and can autonomously book an appointment with a relevant specialist.|

**Functional Requirements:**

- Accept patient health issue descriptions in both text and voice input
- Perform NLP-based symptom analysis to identify probable health conditions
- Suggest appropriate doctor specialty based on symptoms (e.g., 'You may need a Cardiologist')
- Provide general medication guidance and dietary recommendations (non-prescriptive)
- Offer one-click appointment booking directly from the chat interface
- Detect high-risk symptoms and trigger a RISK ALERT: 'Please visit the ER immediately'
- Maintain conversation context using LSTM/RNN dialogue management

## **P-2 | Appointment Booking System**

|**Feature ID**|P-2|
| :- | :- |
|**Feature Name**|Smart Appointment Booking|
|**Priority**|**CRITICAL**|
|**Description**|Patients can search for doctors by specialty, location, availability, and ratings. Available time slots are displayed in real-time. The system uses open doctor datasets for India (NHA + custom seeded data) to populate doctor profiles across all 8 Phase 1 cities.|

**Functional Requirements:**

- Search filters: Specialty, City, Availability, Rating, Language Spoken
- Real-time slot availability — slots marked booked/available dynamically
- Doctor profile cards: Name, Specialty, Experience, Rating, Languages
- Booking confirmation sent via in-app notification and email
- Ability to cancel or reschedule appointments up to 2 hours before slot

## **P-3 | Hospital & Clinic Finder**

|**Feature ID**|P-3|
| :- | :- |
|**Feature Name**|Nearby Hospital & Clinic Finder|
|**Priority**|**HIGH**|
|**Description**|Uses the patient's device GPS location (with explicit permission) to display nearby hospitals and clinics on an interactive map powered by Leaflet.js + OpenStreetMap. Displays ratings, estimated wait times, and allows appointment booking for specialist doctors at that facility.|

**Functional Requirements:**

- Request geolocation permission on first use with clear privacy explanation
- Interactive map with pin markers for hospitals/clinics within configurable radius
- Each pin shows: Name, Distance, Rating, Wait Time (estimated), Specialties Available
- Filter map results by specialty type (e.g., 'Cardiac', 'Ortho', 'General')
- Direct appointment booking for a specific specialist at a selected hospital
- Coverage across all 8 Phase 1 cities using OpenStreetMap + Overpass API (free)

## **P-4 | Prescription PDF Download**

|**Feature ID**|P-4|
| :- | :- |
|**Feature Name**|One-Click Prescription Download|
|**Priority**|**CRITICAL**|
|**Description**|After a consultation is marked complete by the doctor, the patient receives a one-click button to download the full prescription as a formatted PDF. Additionally, the complete conversation transcript between doctor and patient can also be downloaded as PDF.|

**Functional Requirements:**

- PDF includes: Patient Name, Date, Doctor Name & Specialty, Diagnosis, Medications, Dosage, Instructions
- 'Download Prescription' button appears immediately after consultation is marked complete
- 'Download Consultation Transcript' button — downloads the full STT transcript as PDF
- PDF generated client-side using jsPDF (no server cost)
- PDF branded with MediVoice AI header and consultation timestamp

## **P-5 | AI Medication Reminder**

|**Feature ID**|P-5|
| :- | :- |
|**Feature Name**|AI-Powered Medication Reminders|
|**Priority**|**HIGH**|
|**Description**|AI parses the prescription data and automatically sets up medication reminders. For example, if a patient is prescribed Metformin twice daily, the system sends browser push notifications at the specified times. The patient can customize reminder times.|

**Functional Requirements:**

- AI auto-parses prescription: drug name, dosage frequency, duration
- Browser Push Notifications delivered at scheduled medication times
- Patient can adjust reminder times from their dashboard
- Reminder shows: Drug Name, Dose, Special Instructions (e.g., 'Take with food')
- Reminders automatically deactivate after prescription duration ends

## **P-6 | Medical History Vault**

|**Feature ID**|P-6|
| :- | :- |
|**Feature Name**|Complete Medical History Storage|
|**Priority**|**CRITICAL**|
|**Description**|All consultations, prescriptions, lab reports, and appointment history for a patient are stored in a centralized, encrypted vault in MongoDB. The patient can view their complete health timeline from any device at any time.|

**Functional Requirements:**

- Timeline view of all past consultations sorted by date
- Each record includes: Date, Doctor, Diagnosis, Prescription, Transcript, Notes
- Reports and uploaded documents stored with record
- Search and filter by date range, doctor, or diagnosis keyword
- All data encrypted at rest in MongoDB Atlas

## **P-7 | Live Consultation Transcript**

|**Feature ID**|P-7|
| :- | :- |
|**Feature Name**|Real-Time Multilingual Consultation Transcript|
|**Priority**|**CRITICAL**|
|**Description**|During a live consultation, the patient's speech is transcribed in real-time via ASR (Web Speech API) and translated to the doctor's preferred language using LibreTranslate. Simultaneously, the doctor's speech is translated back to the patient's language. Both parties see live, translated text on their respective screens.|

**Supported Languages:**

|**Tamil**|**Telugu**|**Malayalam**|**Kannada**|**Bengali**|**Hindi**|
| :-: | :-: | :-: | :-: | :-: | :-: |

**Functional Requirements:**

- Real-time speech capture using Web Speech API (no cost, browser-native)
- Language auto-detection OR manual selection per speaker
- Live translation using LibreTranslate free API or self-hosted instance
- Transcript displayed with speaker labels: [Doctor] / [Patient]
- A 'Save Transcript' button persists the session to the patient's Medical History
- Full transcript downloadable as PDF (see P-4)

## **P-8 | Appointment Notifications**

|**Feature ID**|P-8|
| :- | :- |
|**Feature Name**|Real-Time Appointment Notifications|
|**Priority**|**HIGH**|
|**Description**|Patients receive browser-based push notifications and in-app alerts for upcoming appointments, consultation completions, prescription availability, and medication reminders. Notifications are triggered on website/app open and in the background.|

**Notification Types:**

- Appointment Reminder: 24 hours before and 1 hour before slot
- Booking Confirmation: Immediately after appointment is booked
- Prescription Ready: Immediately after doctor marks consultation complete
- Medication Time Alert: At scheduled medication times (from P-5)
- Doctor Reply: When the doctor sends notes or updates to the patient

## **P-9 | AI Risk Alert System**

|**Feature ID**|P-9|
| :- | :- |
|**Feature Name**|High-Risk Symptom Alert|
|**Priority**|**CRITICAL**|
|**Description**|When the AI detects high-risk symptoms (e.g., chest pain, stroke symptoms, severe difficulty breathing) in the patient chatbot conversation or live transcription, a prominent red alert banner is displayed immediately: "⚠️ High-Risk Symptom Detected — Please visit the Emergency Room immediately or call 108."|

**Functional Requirements:**

- NLP model scans patient input continuously for high-risk keyword patterns
- Risk detected → full-screen red alert modal displayed immediately
- Alert includes SOS button — one tap to call 108 emergency services
- Alert is logged in patient's Medical History with timestamp
- Doctor receives simultaneous risk flag notification on their portal

## **P-10 | SOS Emergency Button**

|**Feature ID**|P-10|
| :- | :- |
|**Feature Name**|SOS Emergency Dial — 108|
|**Priority**|**CRITICAL**|
|**Description**|A persistent red SOS button is visible at all times in the patient portal. Tapping it initiates a direct call to 108 (National Emergency Ambulance Service, India). On mobile it uses tel:108 protocol. On desktop, it displays the number prominently with a copy button.|



# **6. Doctor Portal — Feature Requirements**
The Doctor Portal is the clinical workspace for licensed medical practitioners. It focuses on workflow efficiency, AI-assisted clinical decision-making, patient management, and documentation automation.

## **D-1 | Patient Dashboard**

|**Feature ID**|D-1|
| :- | :- |
|**Feature Name**|Daily Patient Queue Dashboard|
|**Priority**|**CRITICAL**|
|**Description**|When the doctor logs in, they immediately see their full daily dashboard: today's queue, total booked slots, completed consultations, upcoming appointments, and their current availability status (Available / Busy / On Leave).|

**Dashboard Metrics Displayed:**

- Today's Queue: Ordered list of patients with appointment times
- Slot Summary: Total Slots / Booked / Completed / Remaining
- Status Toggle: Doctor can set themselves as Available / Busy / On Leave
- Upcoming Appointments panel with patient names and complaint previews
- Completed Today panel with quick access to past notes

## **D-2 | Patient Risk Level Indicator**

|**Feature ID**|D-2|
| :- | :- |
|**Feature Name**|AI Risk Level Classification|
|**Priority**|**CRITICAL**|
|**Description**|Each patient in the queue is AI-tagged with a risk level based on their reported symptoms and chat history. This allows the doctor to prioritize critical patients first.|

|**Level**|**Label**|**Meaning & Doctor Action**|
| :-: | :-: | :-: |
|**🔴 RED**|**CRITICAL**|High-risk symptoms detected. Doctor must see this patient immediately. Alert pings doctor even if they are in another consultation.|
|**🟡 YELLOW**|**MODERATE**|Concerning symptoms present. Patient should be seen within normal queue priority but monitored.|
|**🟢 GREEN**|**STABLE**|Routine consultation. No immediate concern detected by AI.|

## **D-3 | Live Transcription Panel**

|**Feature ID**|D-3|
| :- | :- |
|**Feature Name**|Live Multilingual Consultation Transcript Panel|
|**Priority**|**CRITICAL**|
|**Description**|Mirror of P-7 (Patient side). The doctor sees the live transcript in their preferred language while the patient sees it in theirs. Language pairs are selectable from a dropdown. The doctor can pause, resume, or reset the transcript. A Save button persists the session.|

## **D-4 | AI Clinical Note Generator**

|**Feature ID**|D-4|
| :- | :- |
|**Feature Name**|AI-Generated Structured Clinical Notes|
|**Priority**|**CRITICAL**|
|**Description**|At the end of a consultation, AI automatically generates structured clinical notes from the conversation transcript using NLP (medical NER). The doctor reviews and edits the AI-generated notes before saving. Notes follow standard SOAP format (Subjective, Objective, Assessment, Plan).|

**Auto-Extracted Fields:**

- Chief Complaint (extracted from patient speech)
- Symptoms listed with severity indicators
- Doctor's observations and assessment
- Recommended investigations or tests
- Treatment plan and follow-up instructions

## **D-5 | Prescription Builder**

|**Feature ID**|D-5|
| :- | :- |
|**Feature Name**|Digital Prescription Builder + PDF Export|
|**Priority**|**CRITICAL**|
|**Description**|The doctor fills or edits the prescription in a structured digital form. Fields are pre-filled where AI can extract data from the transcript. The final prescription is exported as a branded PDF and instantly made available to the patient via P-4.|

**Prescription Form Fields:**

- Patient Name, Age, Gender, Date
- Diagnosis / Chief Complaint
- Medication rows: Drug Name | Dosage | Frequency | Duration | Instructions
- Doctor's signature field and Registration Number
- Doctor's Clinic Name, Address, Contact

## **D-6 | Patient History Access**

|**Feature ID**|D-6|
| :- | :- |
|**Feature Name**|Full Patient Medical History Access|
|**Priority**|**HIGH**|
|**Description**|The doctor has read-only access to the complete consultation history of any patient they are currently treating, including past prescriptions, diagnoses, test results, and consultation transcripts. Data access is scoped: doctors can only view records of patients with active or past appointments with them.|

## **D-7 | AI Doctor Assistant**

|**Feature ID**|D-7|
| :- | :- |
|**Feature Name**|AI Clinical Decision Support Assistant|
|**Priority**|**HIGH**|
|**Description**|A dedicated AI assistant for doctors that answers clinical queries in real time. Example queries: 'What are the interactions between Drug X and Drug Y?' or 'What is the standard dosage of Metformin for Type 2 Diabetes in an elderly patient?' Powered by Hugging Face medical models (free tier).|

## **D-8 | Patient Scheduling Manager**

|**Feature ID**|D-8|
| :- | :- |
|**Feature Name**|Appointment & Schedule Manager|
|**Priority**|**HIGH**|
|**Description**|Doctors can view and manage their complete appointment calendar. They can reschedule appointments, mark no-shows, block time slots (for breaks or leaves), and set daily slot capacity.|

**Scheduling Features:**

- Calendar view: Day / Week / Month toggle
- Mark appointment as: Completed / No-Show / Rescheduled / Cancelled
- Set available hours and break times
- Block dates for holidays or leave
- Automatic notification to patient when appointment is rescheduled by doctor

## **D-9 | Analytics & Insights Dashboard**

|**Feature ID**|D-9|
| :- | :- |
|**Feature Name**|Doctor Analytics & Practice Insights|
|**Priority**|**MEDIUM**|
|**Description**|Provides the doctor with data-driven insights about their practice over time.|

**Analytics Panels:**

- Weekly & Monthly patient count charts
- Top 5 most common diagnoses in past 30 days
- Risk trend chart: Count of Red / Yellow / Green patients over time
- Appointment completion rate (Completed vs No-Show %)
- Upcoming vs Completed appointments visual summary



# **7. Admin Portal — Feature Requirements**
The Admin Portal provides platform-level oversight and management. For Phase 1, two core features are required:

## **A-1 | User & Platform Management Dashboard**

|**Feature ID**|A-1|
| :- | :- |
|**Feature Name**|Platform Management & User Control Dashboard|
|**Priority**|**CRITICAL**|
|**Description**|The admin has a centralized dashboard showing total registered users, breakdown by role (Patient / Doctor), recently joined users, and active sessions. The admin can deactivate or ban accounts, verify doctor credentials, and manage platform-wide settings.|

**Functional Requirements:**

- Total user count: Patients, Doctors, Admins — shown as stat cards
- User table: Search, filter by role, sort by date joined
- Actions per user: View Profile, Deactivate, Reactivate, Delete
- Doctor verification: Mark doctor as Verified (adds badge to their profile)
- Platform stats: Total consultations completed, total appointments, active sessions

## **A-2 | Security & Activity Monitor**

|**Feature ID**|A-2|
| :- | :- |
|**Feature Name**|Security Monitoring & Suspicious Activity Alerts|
|**Priority**|**CRITICAL**|
|**Description**|The admin can monitor all security-related events on the platform. Suspicious login activities (multiple IPs, rapid repeated attempts, locked accounts) are flagged and displayed in a live security feed with the ability to force-logout or ban accounts.|

**Functional Requirements:**

- Live security event feed: Failed logins, lockouts, multi-IP attempts
- Suspicious account flags with recommended actions
- Force logout: Admin can terminate any active session immediately
- Activity log: Filterable log of all auth events with timestamps and IP addresses
- Email alert to admin when a new suspicious event is detected

# **8. Responsive Design Requirements**
MediVoice AI MUST function flawlessly and look visually polished across ALL of the following devices and screen sizes. This is a non-negotiable requirement.

|**Device**|**Screen Size**|**Breakpoint (CSS)**|**Key UX Consideration**|
| :-: | :-: | :-: | :-: |
|📱 Mobile (iOS/Android)|320px – 480px|xs / sm|Bottom nav bar, large tap targets, single column layout, SOS always visible|
|📟 Tablet|768px – 1024px|md|Two-column layout, collapsible sidebar, touch-friendly controls|
|💻 Laptop|1024px – 1440px|lg|Full sidebar navigation, multi-panel dashboard views|
|🖥️ Desktop|1440px+|xl / 2xl|Full dashboard with analytics charts, wide transcript panel, side-by-side views|

## **8.1 Responsive Implementation Rules**
- Use Tailwind CSS responsive prefixes (sm:, md:, lg:, xl:) for all layout changes
- Implement CSS Grid and Flexbox for adaptive layouts — no fixed pixel widths
- All modals and popups must be scrollable on mobile — no overflow hidden traps
- Touch targets must be minimum 44x44px as per WCAG 2.1 guidelines
- Font sizes must scale: use rem units, min 16px body text on all screens
- Images and maps must use fluid widths (max-width: 100%)
- Test on Chrome DevTools for all breakpoints before any feature release



# **9. Complete Feature Matrix**

|**ID**|**Feature**|**Description Summary**|**Priority**|**Portal**|
| :-: | :-: | :-: | :-: | :-: |
|**P-1**|AI Chatbot Assistant|Symptom analysis, specialty suggestion, appointment booking via AI|**CRITICAL**|Patient|
|**P-2**|Appointment Booking|Search doctors by specialty, city, slot; real-time availability|**CRITICAL**|Patient|
|**P-3**|Hospital Finder|GPS-based nearby hospital/clinic map with ratings & wait times|**HIGH**|Patient|
|**P-4**|Prescription PDF|One-click PDF download of prescription + consultation transcript|**CRITICAL**|Patient|
|**P-5**|Medication Reminders|AI parses prescription, sends browser push notifications|**HIGH**|Patient|
|**P-6**|Medical History Vault|All consultations, prescriptions, reports in one encrypted place|**CRITICAL**|Patient|
|**P-7**|Live Transcript|Real-time multilingual STT transcription (6 Indian languages)|**CRITICAL**|Patient|
|**P-8**|Notifications|Push alerts for appointments, prescriptions, medications|**HIGH**|Patient|
|**P-9**|AI Risk Alert|High-risk symptom detection triggers immediate ER alert|**CRITICAL**|Patient|
|**P-10**|SOS Button|One-tap direct call to 108 ambulance service|**CRITICAL**|Patient|
|**D-1**|Patient Dashboard|Daily queue, slots summary, appointment overview|**CRITICAL**|Doctor|
|**D-2**|Risk Level Indicator|Red/Yellow/Green AI risk classification per patient|**CRITICAL**|Doctor|
|**D-3**|Live Transcript Panel|Doctor-side multilingual consultation transcription|**CRITICAL**|Doctor|
|**D-4**|AI Clinical Notes|Auto-generated SOAP notes from consultation transcript|**CRITICAL**|Doctor|
|**D-5**|Prescription Builder|Digital prescription form with AI pre-fill + PDF export|**CRITICAL**|Doctor|
|**D-6**|Patient History Access|Full consultation + prescription history per patient|**HIGH**|Doctor|
|**D-7**|AI Doctor Assistant|Drug interaction queries, dosage guidance, clinical AI chat|**HIGH**|Doctor|
|**D-8**|Patient Scheduling|Calendar management: reschedule, no-shows, blocks|**HIGH**|Doctor|
|**D-9**|Analytics Dashboard|Patient counts, top diagnoses, risk trends over time|**MEDIUM**|Doctor|
|**A-1**|User Management|All users dashboard: view, verify doctors, deactivate accounts|**CRITICAL**|Admin|
|**A-2**|Security Monitor|Suspicious login alerts, activity logs, force logout|**CRITICAL**|Admin|



# **10. Non-Functional Requirements**

|**Category**|**Requirement**|
| :-: | :-: |
|**Performance**|Page load under 3 seconds on 4G mobile. ASR transcription latency under 500ms. API responses under 2 seconds.|
|**Security**|All data encrypted in transit (HTTPS/TLS). Passwords hashed with bcrypt (salt rounds ≥ 12). MongoDB data encrypted at rest. JWT tokens never stored in localStorage — use httpOnly cookies.|
|**Availability**|Platform targets 99% uptime using free Vercel + Render hosting. Graceful degradation if AI services are temporarily unavailable.|
|**Scalability**|Architecture designed for horizontal scaling. MongoDB Atlas can scale to paid tier if user base grows beyond free limits.|
|**Accessibility**|WCAG 2.1 AA compliance. Minimum 44x44px touch targets. Screen reader compatible markup. Sufficient color contrast ratios.|
|**Privacy**|Patient medical data is private by design. Doctors can only access records of their own patients. Admins see metadata only, not consultation content.|
|**Browser Support**|Chrome (primary — Web Speech API support), Firefox, Safari, Edge. Web Speech API requires Chrome for full ASR functionality. Fallback text input provided for other browsers.|

# **11. Open Questions & Assumptions**
## **11.1 Open Questions**
- Will LibreTranslate's free API provide sufficient accuracy for medical terminology in all 6 Indian languages, or will a self-hosted instance be required?
- Which Indian doctor dataset will be used as the primary source — NHA Health Facility Registry, Practo open data, or a custom-seeded database?
- Will medication reminder delivery use browser Push Notifications only, or should email reminders (via Gmail SMTP) be added as a fallback?
- What is the data retention policy for consultation transcripts — how long are they stored, and does the patient control deletion?
- For the SOS button on desktop (non-mobile) — should it display 108 prominently or attempt a WebRTC call?

## **11.2 Assumptions**
- All users (Patients, Doctors) have access to a modern smartphone or computer with a working microphone for STT features
- Chrome browser is the primary target browser for Web Speech API functionality
- Doctor data will be seeded manually for the 8 Phase 1 cities before launch
- The platform will not handle payment processing in Phase 1 — all consultations are assumed to be free or handled outside the platform
- Medical advice from the AI chatbot is explicitly labeled as guidance only, not a clinical prescription — legal disclaimer will be displayed

# **12. Glossary**

|**Term**|**Definition**|
| :-: | :-: |
|**ASR**|Automated Speech Recognition — converts spoken audio to text|
|**NLP**|Natural Language Processing — AI analysis of text for meaning, entities, intent|
|**TTS**|Text-to-Speech — converts written text back to spoken audio|
|**STT**|Speech-to-Text — equivalent term to ASR, used interchangeably in this document|
|**NLU**|Natural Language Understanding — subset of NLP focused on intent and semantic meaning|
|**JWT**|JSON Web Token — a compact, self-contained token used for secure authentication|
|**OTP**|One-Time Password — a temporary, single-use code sent to verify identity|
|**EHR**|Electronic Health Record — digital version of a patient's medical history|
|**CNN**|Convolutional Neural Network — deep learning architecture for feature extraction|
|**RNN/LSTM**|Recurrent Neural Network / Long Short-Term Memory — deep learning for sequential data|
|**SOAP Notes**|Subjective, Objective, Assessment, Plan — a standard clinical documentation format|
|**SOS**|Emergency distress signal — in this platform, triggers a direct call to 108 (India)|
|**PWA**|Progressive Web App — a web application that works like a native mobile app|
|**MediVoice AI**|The name of this platform — derived from 'Medical' + 'Voice' + 'AI', emphasizing AI-powered voice communication in healthcare|

*— End of Document —*

MEDIVOICE AI | Product Requirements Document v1.0.0 | April 2026
Confidential — Internal Use Only	Page 
