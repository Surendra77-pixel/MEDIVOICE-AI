<div align="center">

# 🗺️ MEDIVOICE AI — UX Flow & Page Map
### Complete User Experience Architecture & Navigation Reference

![Document](https://img.shields.io/badge/Document-UX%20Flow%20%26%20Page%20Map-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Pages](https://img.shields.io/badge/Total%20Pages-24-purple?style=for-the-badge)
![Portals](https://img.shields.io/badge/Portals-Patient%20%7C%20Doctor%20%7C%20Admin-brightgreen?style=for-the-badge)

> **The authoritative reference for every screen, every user flow, every
> navigation path, and every interaction in MediVoice AI.**
> From first landing to SOS emergency — every journey is mapped here.

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication
**Total Screens:** 24 unique pages across 4 portal zones
**User Roles:** Patient · Doctor · Admin (+ public landing)
**Device Priority:** Mobile-first → Tablet → Laptop → Desktop
**Research Basis:** ICSADL-2025 — *Automated STT of Doctor-Patient Dialogues*

</div>

---

## 📋 Table of Contents

1. [UX Design Principles](#1-ux-design-principles)
2. [Complete Site Map](#2-complete-site-map)
3. [URL Route Architecture](#3-url-route-architecture)
4. [Master User Flow Overview](#4-master-user-flow-overview)
5. [Authentication Flows](#5-authentication-flows)
   - [5.1 New User Registration](#51-new-user-registration-flow)
   - [5.2 Login Flow](#52-login-flow)
   - [5.3 Forgot Password Flow](#53-forgot-password-flow)
6. [Patient Portal — Page Maps](#6-patient-portal--page-maps)
   - [6.1 Patient Dashboard](#61-patient-dashboard)
   - [6.2 AI Chatbot Page](#62-ai-chatbot-page)
   - [6.3 Appointment Booking Flow](#63-appointment-booking-flow)
   - [6.4 Hospital Finder Page](#64-hospital-finder-page)
   - [6.5 Live Consultation Page](#65-live-consultation-page)
   - [6.6 Medical History Page](#66-medical-history-page)
   - [6.7 Prescription Page](#67-prescription-page)
   - [6.8 Reminders Page](#68-reminders-page)
7. [Doctor Portal — Page Maps](#7-doctor-portal--page-maps)
   - [7.1 Doctor Dashboard](#71-doctor-dashboard)
   - [7.2 Patient Queue Page](#72-patient-queue-page)
   - [7.3 Live Consultation Panel](#73-live-consultation-panel)
   - [7.4 Clinical Notes Page](#74-clinical-notes-page)
   - [7.5 Prescription Builder Page](#75-prescription-builder-page)
   - [7.6 Schedule Manager Page](#76-schedule-manager-page)
   - [7.7 AI Doctor Assistant Page](#77-ai-doctor-assistant-page)
   - [7.8 Analytics Page](#78-analytics-page)
8. [Admin Portal — Page Maps](#8-admin-portal--page-maps)
   - [8.1 Admin Dashboard](#81-admin-dashboard)
   - [8.2 User Management Page](#82-user-management-page)
   - [8.3 Security Monitor Page](#83-security-monitor-page)
9. [Critical User Journeys](#9-critical-user-journeys)
10. [Navigation Architecture](#10-navigation-architecture)
11. [Responsive Layout System](#11-responsive-layout-system)
12. [Modal & Overlay Map](#12-modal--overlay-map)
13. [Empty States & Error Pages](#13-empty-states--error-pages)
14. [Notification & Alert UX](#14-notification--alert-ux)
15. [Accessibility Flow](#15-accessibility-flow)

---

## 1. UX Design Principles

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         UX DESIGN PRINCIPLES                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  MOBILE FIRST — ALWAYS                                                   │
│  Every screen is designed at 375px width first. Then enhanced           │
│  progressively for tablet (768px), laptop (1024px), desktop (1440px).   │
│  A feature that doesn't work on mobile doesn't ship.                    │
│                                                                          │
│  ONE PRIMARY ACTION PER SCREEN                                           │
│  Each page has exactly one dominant CTA. The booking page's CTA is     │
│  "Confirm Booking". The consultation page's CTA is "Start Listening".   │
│  Secondary actions are visually subordinate.                             │
│                                                                          │
│  ZERO DEAD ENDS                                                          │
│  Every error state has a next action. Every empty state has a prompt.   │
│  "No appointments yet" always shows a "Book Now" button.                │
│                                                                          │
│  LANGUAGE-FIRST                                                          │
│  Language selector is accessible from the first interaction. Patients  │
│  and doctors set their language once — the system remembers.            │
│                                                                          │
│  EMERGENCY ACCESSIBLE AT ALL TIMES                                       │
│  The SOS button appears on every patient page, always visible,          │
│  always one tap from calling 108. It cannot be hidden.                  │
│                                                                          │
│  TRUST THROUGH TRANSPARENCY                                              │
│  AI-generated content is always labeled. "AI-Generated Draft" appears   │
│  on SOAP notes. "AI Suggestion" appears on chatbot recommendations.     │
│  Doctors always confirm before anything is finalized.                   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Site Map

```
MEDIVOICE AI — COMPLETE SITE MAP
═══════════════════════════════════════════════════════════════════════════

🌐 PUBLIC (No auth required)
│
├── /                          Landing Page
├── /signup                    Registration (role selection)
├── /login                     Login
├── /verify-otp                Email OTP verification
├── /forgot-password           Password reset request
└── /reset-password            New password entry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 PATIENT PORTAL (/patient/*) — Requires: auth + role:patient
│
├── /patient                   Patient Dashboard (home)
├── /patient/chat              AI Health Chatbot
├── /patient/appointments      Appointment List
│   └── /patient/book/:doctorId  Book Appointment
├── /patient/hospitals         Hospital & Clinic Finder (Map)
├── /patient/history           Medical History Timeline
│   └── /patient/history/:id  Consultation Detail
├── /patient/prescriptions     Prescription List
│   └── /patient/prescriptions/:id  Prescription Detail
├── /patient/consultation/:id/live   Live Consultation (STT)
└── /patient/reminders         Medication Reminders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵 DOCTOR PORTAL (/doctor/*) — Requires: auth + role:doctor
│
├── /doctor                    Doctor Dashboard (home)
├── /doctor/queue              Patient Queue
├── /doctor/consultation/:id/live   Live Consultation Panel
├── /doctor/consultation/:id/notes  Clinical Notes (SOAP)
├── /doctor/prescription/:id/edit   Prescription Builder
├── /doctor/patients/:id/history    Patient History Access
├── /doctor/assistant          AI Doctor Assistant
├── /doctor/schedule           Schedule Manager
└── /doctor/analytics          Analytics Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟣 ADMIN PORTAL (/admin/*) — Requires: auth + role:admin
│
├── /admin                     Admin Dashboard
├── /admin/users               User Management
│   └── /admin/users/:id      User Detail
└── /admin/security            Security Monitor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ERROR STATES
│
└── /*                         404 — Not Found Page
```

---

## 3. URL Route Architecture

### Route Protection Rules

| Route Pattern | Auth Required | Role Check | Redirect if Fail |
|---|---|---|---|
| `/` | ❌ No | ❌ No | — |
| `/signup` `/login` | ❌ No | ❌ No | If logged in → `/[role]` |
| `/verify-otp` | ❌ No | ❌ No | — |
| `/forgot-password` | ❌ No | ❌ No | — |
| `/reset-password` | ❌ No | ❌ No | — |
| `/patient/*` | ✅ JWT | `role === 'patient'` | → `/login` or `/[actual_role]` |
| `/doctor/*` | ✅ JWT | `role === 'doctor'` | → `/login` or `/[actual_role]` |
| `/admin/*` | ✅ JWT | `role === 'admin'` | → `/login` or `/[actual_role]` |
| `/*` (catch-all) | ❌ No | ❌ No | Shows 404 page |

### Route Component Tree

```javascript
// App.jsx — Route structure

<AuthProvider>
  <Routes>

    {/* ── PUBLIC ───────────────────────────────────────────────── */}
    <Route path="/"                element={<LandingPage />} />
    <Route path="/signup"          element={<GuestRoute><SignupPage /></GuestRoute>} />
    <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/verify-otp"      element={<OTPVerifyPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password"  element={<ResetPasswordPage />} />

    {/* ── PATIENT PORTAL ───────────────────────────────────────── */}
    <Route path="/patient" element={
      <PrivateRoute role="patient">
        <PatientLayout />   {/* Sidebar + SOS + Notifications */}
      </PrivateRoute>
    }>
      <Route index                              element={<PatientDashboard />} />
      <Route path="chat"                        element={<ChatbotPage />} />
      <Route path="appointments"                element={<AppointmentListPage />} />
      <Route path="book/:doctorId"              element={<BookAppointmentPage />} />
      <Route path="hospitals"                   element={<HospitalFinderPage />} />
      <Route path="history"                     element={<MedicalHistoryPage />} />
      <Route path="history/:id"                 element={<ConsultationDetailPage />} />
      <Route path="prescriptions"               element={<PrescriptionListPage />} />
      <Route path="prescriptions/:id"           element={<PrescriptionDetailPage />} />
      <Route path="consultation/:id/live"       element={<LiveTranscriptPage />} />
      <Route path="reminders"                   element={<RemindersPage />} />
    </Route>

    {/* ── DOCTOR PORTAL ────────────────────────────────────────── */}
    <Route path="/doctor" element={
      <PrivateRoute role="doctor">
        <DoctorLayout />
      </PrivateRoute>
    }>
      <Route index                              element={<DoctorDashboard />} />
      <Route path="queue"                       element={<PatientQueuePage />} />
      <Route path="consultation/:id/live"       element={<ConsultationPanelPage />} />
      <Route path="consultation/:id/notes"      element={<ClinicalNotesPage />} />
      <Route path="prescription/:id/edit"       element={<PrescriptionBuilderPage />} />
      <Route path="patients/:id/history"        element={<PatientHistoryPage />} />
      <Route path="assistant"                   element={<AIAssistantPage />} />
      <Route path="schedule"                    element={<ScheduleManagerPage />} />
      <Route path="analytics"                   element={<AnalyticsPage />} />
    </Route>

    {/* ── ADMIN PORTAL ─────────────────────────────────────────── */}
    <Route path="/admin" element={
      <PrivateRoute role="admin">
        <AdminLayout />
      </PrivateRoute>
    }>
      <Route index                              element={<AdminDashboard />} />
      <Route path="users"                       element={<UserManagementPage />} />
      <Route path="users/:id"                   element={<UserDetailPage />} />
      <Route path="security"                    element={<SecurityMonitorPage />} />
    </Route>

    {/* ── CATCH ALL ────────────────────────────────────────────── */}
    <Route path="*" element={<NotFoundPage />} />

  </Routes>
</AuthProvider>
```

---

## 4. Master User Flow Overview

```
MEDIVOICE AI — MASTER FLOW (All roles combined)
═══════════════════════════════════════════════════════════════════════════

    NEW USER                                       RETURNING USER
        │                                                │
        ▼                                                ▼
  ┌───────────┐                                   ┌───────────┐
  │  LANDING  │                                   │   LOGIN   │
  │    PAGE   │                                   │   PAGE    │
  └─────┬─────┘                                   └─────┬─────┘
        │ "Get Started"                                  │
        ▼                                               │
  ┌───────────┐                                         │
  │  SIGN UP  │                                         │
  │   PAGE    │                                         │
  └─────┬─────┘                                         │
        │                                               │
        ▼                                               │
  ┌───────────┐                                         │
  │   EMAIL   │                                         │
  │    OTP    │                                         │
  │  VERIFY   │                                         │
  └─────┬─────┘                                         │
        │ Verified                                      │ JWT issued
        └──────────────────────┬────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Role Detection     │
                    │  (from JWT payload)  │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │   PATIENT   │    │   DOCTOR    │    │    ADMIN    │
   │  DASHBOARD  │    │  DASHBOARD  │    │  DASHBOARD  │
   │  /patient   │    │  /doctor    │    │  /admin     │
   └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 5. Authentication Flows

### 5.1 New User Registration Flow

```
REGISTRATION FLOW — COMPLETE UX SEQUENCE
═══════════════════════════════════════════════════════════════════════════

SCREEN 1: /signup — Sign Up Page
┌─────────────────────────────────────────────────┐
│  🎙️ MediVoice AI                               │
│  ─────────────────────────────────────────────  │
│  Create your account                            │
│                                                 │
│  I am a:  [👤 Patient]  [🩺 Doctor]  [🔐 Admin]│
│           ───────────                           │
│           (selected)                            │
│                                                 │
│  First Name  [________________]                 │
│  Last Name   [________________]                 │
│  Email       [________________]                 │
│  Password    [________________] 🔒              │
│  ──── Strength: ▓▓▓▓░  Strong ────             │
│                                                 │
│  City        [Chennai ▼]    (Patient only)      │
│  Language    [Tamil ▼]      (Preferred)         │
│                                                 │
│  [        Create Account        ]               │
│                                                 │
│  Already have an account? [Log in]              │
└─────────────────────────────────────────────────┘
         │
         │ Submit → POST /auth/signup
         │
    ┌────┴────┐
 Success    Error
    │           │
    │        ┌──┴────────────────────────────┐
    │        │  Validation errors shown      │
    │        │  inline per field             │
    │        │  "Email already exists" → 409 │
    │        └───────────────────────────────┘
    │
    ▼
SCREEN 2: /verify-otp — OTP Verification
┌─────────────────────────────────────────────────┐
│  📧 Check your email                            │
│                                                 │
│  We sent a 6-digit code to                     │
│  r**i@gmail.com                                 │
│                                                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │8 │ │4 │ │7 │ │  │ │  │ │  │               │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘               │
│  (auto-advance cursor on each digit entry)      │
│                                                 │
│  ⏰ Code expires in  09:23                      │
│                                                 │
│  [      Verify Email      ]                     │
│                                                 │
│  Didn't receive it? [Resend] (1:00 cooldown)    │
└─────────────────────────────────────────────────┘
         │
         │ Correct OTP → isVerified: true
         │
         ▼
SCREEN 3: /login — Login Page
┌─────────────────────────────────────────────────┐
│  ✅ Email verified! Please log in.              │
│  [Success toast — auto-dismisses in 3s]         │
│                                                 │
│  → User enters credentials → JWT issued →       │
│    Redirected to role-appropriate portal        │
└─────────────────────────────────────────────────┘
```

### 5.2 Login Flow

```
LOGIN FLOW
═══════════════════════════════════════════════════════════════════════════

SCREEN: /login — Login Page
┌─────────────────────────────────────────────────┐
│  🎙️ MediVoice AI                               │
│  ─────────────────────────────────────────────  │
│  Welcome back                                   │
│                                                 │
│  Email     [______________________________]     │
│  Password  [______________________________] 👁  │
│                                                 │
│  [           Log In           ]                 │
│                                                 │
│  Forgot password? [Reset it]                    │
│  New here? [Create an account]                  │
└─────────────────────────────────────────────────┘

LOGIN STATES:

State 1 — Wrong password (1st or 2nd attempt):
┌─────────────────────────────────────────────────┐
│  ❌ Invalid email or password.                  │
│     2 attempts remaining before lockout.        │
└─────────────────────────────────────────────────┘

State 2 — Account locked (3 wrong attempts):
┌─────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗          │
│  ║  🔒 Account Temporarily Locked   ║          │
│  ║                                   ║          │
│  ║  Too many failed attempts.         ║          │
│  ║  Try again in:                    ║          │
│  ║                                   ║          │
│  ║         14:23                     ║          │
│  ║    (countdown timer live)         ║          │
│  ║                                   ║          │
│  ║  [Forgot Password?]               ║          │
│  ╚═══════════════════════════════════╝          │
└─────────────────────────────────────────────────┘

State 3 — Session invalidated (new device login):
┌─────────────────────────────────────────────────┐
│  ⚠️  You were logged in from another device.    │
│     Please log in again to continue.            │
└─────────────────────────────────────────────────┘

State 4 — Successful login:
         ▼
  Role detection → redirect:
  patient → /patient     (Patient Dashboard)
  doctor  → /doctor      (Doctor Dashboard)
  admin   → /admin       (Admin Dashboard)
```

### 5.3 Forgot Password Flow

```
FORGOT PASSWORD FLOW
═══════════════════════════════════════════════════════════════════════════

SCREEN 1: /forgot-password
┌─────────────────────────────────────────────────┐
│  🔑 Reset your password                         │
│                                                 │
│  Enter the email address for your account       │
│  and we'll send a reset code.                   │
│                                                 │
│  Email  [______________________________]        │
│                                                 │
│  [       Send Reset Code       ]                │
│                                                 │
│  Back to [Log in]                               │
└─────────────────────────────────────────────────┘
         │
         │ (Same response whether email exists or not)
         ▼
┌─────────────────────────────────────────────────┐
│  📧 If an account exists for that email,        │
│     a reset code has been sent.                 │
│                                                 │
│  → User checks Gmail for 6-digit OTP           │
└─────────────────────────────────────────────────┘
         │
         ▼
SCREEN 2: /reset-password (user arrives with email from link)
┌─────────────────────────────────────────────────┐
│  🔑 Enter your reset code                       │
│                                                 │
│  Reset code from email:                         │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│  │  │ │  │ │  │ │  │ │  │ │  │               │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘               │
│                                                 │
│  New Password    [________________]             │
│  ──── Strength: ▓▓▓░░  Fair ──────             │
│  Confirm Password [________________]            │
│                                                 │
│  [       Reset Password       ]                 │
└─────────────────────────────────────────────────┘
         │
         │ Success → all sessions invalidated
         ▼
  → /login with toast:
    "✅ Password reset. Please log in with your new password."
```

---

## 6. Patient Portal — Page Maps

### Layout Shell (All Patient Pages)

```
PATIENT PORTAL LAYOUT — MOBILE (375px)
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────┐
│  🎙️ MediVoice        🔔 (bell)    👤 (avatar)   │  ← Top Navbar
├─────────────────────────────────────────────────┤
│                                                 │
│                  PAGE CONTENT                   │
│                  <Outlet />                     │
│                                                 │
│                                         [🆘SOS] │  ← Fixed bottom-right
├─────────────────────────────────────────────────┤
│  🏠     📅     🗺️     📋     💊               │  ← Bottom Nav (mobile)
│ Home  Appts  Hosps  Hist  Meds               │
└─────────────────────────────────────────────────┘

PATIENT PORTAL LAYOUT — DESKTOP (1440px)
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────┐
│  🎙️ MediVoice AI                    🔔 Notifications   👤 Ravi Kumar │
├──────────────┬───────────────────────────────────────────────────────┤
│  🏠 Dashboard│                                                       │
│  🤖 Chatbot  │              PAGE CONTENT                             │
│  📅 Appts    │              <Outlet />                               │
│  🗺️  Hospitals│                                                       │
│  📋 History  │                                                       │
│  📄 Rx       │                                             [🆘 SOS]  │
│  💊 Reminders│                                                       │
└──────────────┴───────────────────────────────────────────────────────┘
```

---

### 6.1 Patient Dashboard

```
PAGE: /patient — Patient Dashboard
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  Good morning, Ravi! 👋                              [🔔] [👤]     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🚨 Risk Alert                                               │  │
│  │  Your last chat showed concerning symptoms.                  │  │
│  │  [View Alert]                            Risk: 🟡 MODERATE  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  (Only shown if currentRiskLevel !== 'GREEN')                       │
│                                                                     │
│  UPCOMING APPOINTMENT                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📅 Tomorrow · 10:30 AM                                      │  │
│  │  Dr. Priya Sharma — Cardiologist                             │  │
│  │  Apollo Hospital, Hyderabad                                  │  │
│  │  [View Details]              [Cancel]                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  TODAY'S MEDICATIONS                                                │
│  ┌────────────────────┐  ┌────────────────────┐                    │
│  │  💊 Metformin      │  │  💊 Aspirin         │                    │
│  │  500mg · 8:00 AM   │  │  75mg · 8:00 AM    │                    │
│  │  ✅ Taken          │  │  ⏰ Due in 30min   │                    │
│  └────────────────────┘  └────────────────────┘                    │
│                                                                     │
│  QUICK ACTIONS                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  🤖 Ask AI   │  │  📅 Book     │  │  📋 History  │             │
│  │  Chatbot     │  │  Appointment │  │  Vault       │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  RECENT PRESCRIPTIONS                                               │
│  Apr 15 · Dr. Sharma · Hypertension  [Download PDF]                │
│  Mar 28 · Dr. Kumar  · Diabetes      [Download PDF]                │
└─────────────────────────────────────────────────────────────────────┘

NAVIGATION FROM THIS PAGE:
  → [Ask AI Chatbot]      → /patient/chat
  → [Book Appointment]    → /patient/appointments
  → [View History]        → /patient/history
  → [View Alert]          → AI Risk Alert modal opens
  → [View Details]        → /patient/history/:consultationId
  → [Download PDF]        → PDF generated client-side
  → 🔔 Bell               → Notification panel slides in
  → 👤 Avatar             → Profile dropdown
```

---

### 6.2 AI Chatbot Page

```
PAGE: /patient/chat — AI Health Assistant
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     🤖 AI Health Assistant               🌐 [Hindi ▼]      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🤖  Hello, Ravi! I'm your AI health assistant.              │  │
│  │       Tell me how you're feeling, or describe your           │  │
│  │       symptoms. I'll help guide you.                         │  │
│  │                                                    9:30 AM   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│            ┌──────────────────────────────────────────────────┐    │
│            │ 👤  I've been having chest pain for 2 days       │    │
│            │     and I feel short of breath sometimes.        │    │
│            │                                        9:31 AM   │    │
│            └──────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🤖  I understand. Chest pain and shortness of breath       │  │
│  │       can be signs of a cardiac condition.                  │  │
│  │                                                             │  │
│  │       Based on your symptoms, I recommend consulting        │  │
│  │       a Cardiologist.                                       │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────┐          │  │
│  │  │  🩺 Dr. Priya Sharma — Cardiologist ⭐ 4.7   │          │  │
│  │  │  Apollo Hospital, Hyderabad                  │          │  │
│  │  │  [Book Appointment →]                        │          │  │
│  │  └──────────────────────────────────────────────┘          │  │
│  │                                                    9:31 AM  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ⚠️ HIGH RISK DETECTED — See a doctor today or call 108            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📞 CALL 108 — Emergency    🏥 Find Hospital                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  (Risk alert banner appears when risk detected)                     │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌──────────────────────────────────────┐  [🎤]  [➤ Send]         │
│  │ Type your symptoms or question...    │                          │
│  └──────────────────────────────────────┘                          │
│  AI Suggestion: [Chest pain] [Shortness of breath] [Fever]         │
└─────────────────────────────────────────────────────────────────────┘

UX STATES:
  → 🎤 mic tapped      → Voice recording starts (Web Speech API)
  → Risk RED detected  → Full-screen risk modal overlays page
  → [Book Appointment] → /patient/book/:doctorId
  → [Find Hospital]    → /patient/hospitals?emergency=true
  → [CALL 108]         → tel:108 (mobile) or SOS modal (desktop)

EMPTY STATE:
  "No messages yet. Ask me about any symptoms you're experiencing."
```

---

### 6.3 Appointment Booking Flow

```
FLOW: Appointment Booking — 3 Screens
═══════════════════════════════════════════════════════════════════════════

SCREEN 1: /patient/appointments — Appointment List
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     📅 My Appointments           [+ Book New]              │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  UPCOMING                                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🟢 CONFIRMED                                                │  │
│  │  Dr. Priya Sharma · Cardiologist                             │  │
│  │  📅 Apr 20, 2026 · 10:30 AM · 30 min                        │  │
│  │  Apollo Hospital, Hyderabad                                  │  │
│  │  [View] [Cancel] [Reschedule]                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  PAST                                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ✅ COMPLETED                                                │  │
│  │  Dr. Ravi Kumar · General Physician                          │  │
│  │  📅 Mar 28, 2026 · 09:00 AM                                  │  │
│  │  [View Prescription] [View Transcript]                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  EMPTY STATE:                                                       │
│  📅 No appointments yet                                            │
│  "Book your first appointment with a doctor near you."             │
│  [Book Appointment →]                                               │
└─────────────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────────

SCREEN 2: Doctor Search → /patient/book/:doctorId (first load)
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     🔍 Find a Doctor                                       │
│  ─────────────────────────────────────────────────────────────────  │
│  Specialty  [Cardiologist ▼]   City  [Hyderabad ▼]                 │
│  Language   [Any ▼]            Date  [Apr 20 ▼]                    │
│                                                       [Search]     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🩺 Dr. Priya Sharma                      ✅ Verified        │  │
│  │     Cardiologist · 12 yrs exp             ⭐ 4.7 (48 reviews)│  │
│  │     Apollo Hospital, Hyderabad                               │  │
│  │     Languages: Telugu · Hindi · English                      │  │
│  │     [Book Appointment →]                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🩺 Dr. Anjali Reddy                      ✅ Verified        │  │
│  │     Cardiologist · 8 yrs exp              ⭐ 4.5 (31 reviews)│  │
│  │     KIMS Hospital, Hyderabad                                 │  │
│  │     [Book Appointment →]                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────────

SCREEN 3: /patient/book/:doctorId — Slot Selection & Booking
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     Book with Dr. Priya Sharma                             │
│  ─────────────────────────────────────────────────────────────────  │
│  Cardiologist · Apollo Hospital, Hyderabad · ⭐ 4.7               │
│                                                                     │
│  SELECT DATE:                                                       │
│  [< Apr]  Mon  Tue  Wed  Thu  Fri  Sat  [May >]                   │
│           14   15   16   17   18   19                              │
│                ●                                                    │
│           (● = selected, grey = unavailable)                       │
│                                                                     │
│  SELECT TIME — Apr 15:                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                   │
│  │ 09:00  │  │ 09:30  │  │ 10:00  │  │ 10:30  │                   │
│  │  Free  │  │ Booked │  │  Free  │  │  Free  │                   │
│  └────────┘  └────────┘  └────────┘  └────────┘                   │
│  ┌────────┐  ┌────────┐                                            │
│  │ 11:00  │  │ 11:30  │                                            │
│  │  Free  │  │ Booked │                                            │
│  └────────┘  └────────┘                                            │
│                                                                     │
│  Why are you visiting? (optional but helps doctor prepare)          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Chest pain for 2 days, mild shortness of breath              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ─────────────────────────────────────────────────────────────────  │
│  📅 Apr 15 at 10:00 AM · 30 min · Dr. Priya Sharma               │
│  [     Confirm Booking     ]                                        │
└─────────────────────────────────────────────────────────────────────┘
         │
         │ Booking confirmed
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════╗                      │
│  ║  ✅ Appointment Confirmed!               ║                      │
│  ║                                           ║                      │
│  ║  Dr. Priya Sharma                         ║                      │
│  ║  Apr 15, 2026 · 10:00 AM                 ║                      │
│  ║  Apollo Hospital, Hyderabad               ║                      │
│  ║                                           ║                      │
│  ║  We'll remind you 24 hours before.        ║                      │
│  ║                                           ║                      │
│  ║  [View Appointments]  [Go Home]           ║                      │
│  ╚═══════════════════════════════════════════╝                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6.4 Hospital Finder Page

```
PAGE: /patient/hospitals — Hospital & Clinic Finder
═══════════════════════════════════════════════════════════════════════════

STATE 1 — Before GPS permission:
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     🗺️ Nearby Hospitals                                    │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📍 Find hospitals near you                                  │  │
│  │                                                              │  │
│  │  We need your location to show nearby hospitals              │  │
│  │  and clinics. Your location is never stored.                 │  │
│  │                                                              │  │
│  │  [  📍 Use My Location  ]    [🏙️ Choose City]              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [Blank map placeholder — grey tiles]                               │
└─────────────────────────────────────────────────────────────────────┘

STATE 2 — Map loaded with pins:
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     🗺️ Nearby Hospitals                 [🔍 Filter]       │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  [OpenStreetMap — Leaflet.js]                                │  │
│  │                                                              │  │
│  │            📍 You are here                                   │  │
│  │                                                              │  │
│  │    🏥(1)           🏥(2)                                     │  │
│  │          🏥(3)                    🏥(4)                      │  │
│  │                                                              │  │
│  │  © OpenStreetMap contributors                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  NEAREST HOSPITALS (sorted by distance)                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🏥 Apollo Hospital           0.8 km away    ⭐ 4.6          │  │
│  │     Emergency · Cardiology · Neuro · Ortho                   │  │
│  │     ⏱️ ~20 min wait           🟢 Open now                    │  │
│  │     [View on Map]  [Book Appointment]                        │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  🏥 KIMS Hospital             1.2 km away    ⭐ 4.4          │  │
│  │     Emergency · General · Paediatrics                        │  │
│  │     ⏱️ ~35 min wait           🟢 Open now                    │  │
│  │     [View on Map]  [Book Appointment]                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

MAP PIN POPUP (when pin is tapped):
┌──────────────────────────────────────┐
│  🏥 Apollo Hospital                  │
│  📍 0.8 km away                     │
│  ⭐ 4.6 rating                      │
│  ⏱️ ~20 min est. wait               │
│  🏥 Emergency · Cardiology           │
│  [Book Appointment →]                │
└──────────────────────────────────────┘
```

---

### 6.5 Live Consultation Page

```
PAGE: /patient/consultation/:id/live — Live STT Consultation
═══════════════════════════════════════════════════════════════════════════

STATE 1 — Consent Gate (first time):
┌─────────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║  📋 Consultation Recording Consent                           ║  │
│  ║                                                               ║  │
│  ║  Your conversation with Dr. Priya Sharma will be             ║  │
│  ║  transcribed in real-time and stored as part of              ║  │
│  ║  your medical record.                                        ║  │
│  ║                                                               ║  │
│  ║  ☐ I consent to my consultation being transcribed            ║  │
│  ║    and stored for my medical records.                        ║  │
│  ║                                                               ║  │
│  ║  [Cancel]                   [Start Consultation →]           ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────────────┘

STATE 2 — Active Consultation:
┌─────────────────────────────────────────────────────────────────────┐
│  🔴 LIVE   Consultation with Dr. Priya Sharma    [⏱️ 12:34]        │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  YOUR LANGUAGE: [Hindi ▼]   DOCTOR'S LANGUAGE: [Tamil ▼]          │
│                                                                     │
│  ─── LIVE TRANSCRIPT ─────────────────────────────────────────────  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  [Doctor] 10:32 AM                                          │  │
│  │  नमस्ते। मुझे बताइए, आपको क्या तकलीफ है?                  │  │
│  │  (Hindi translation — doctor spoke Tamil)                    │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                    │  │
│  │  [You] 10:33 AM                                             │  │
│  │  मुझे 2 दिनों से सीने में दर्द हो रहा है।                 │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                    │  │
│  │  [Doctor] 10:33 AM                                          │  │
│  │  कितने समय से? क्या सांस लेने में भी दिक्कत है?           │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─                    │  │
│  │  [You] 10:34 AM — Speaking... (italic streaming)            │  │
│  │  हाँ, कभी-कभी...                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  🎤 [  LISTENING...  ]   (pulsing animation)                        │
│                                                                     │
│  [⏸ Pause]  [💾 Save Transcript]  [🔚 End Consultation]            │
└─────────────────────────────────────────────────────────────────────┘

STATE 3 — Risk Alert triggered mid-consultation:
┌─────────────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════════════╗  │
│  ║  🚨 HIGH RISK SYMPTOM DETECTED                               ║  │
│  ║                                                               ║  │
│  ║  Chest pain has been detected in your conversation.          ║  │
│  ║  Please seek emergency care immediately.                     ║  │
│  ║                                                               ║  │
│  ║  [📞 CALL 108 NOW]                                           ║  │
│  ║  [🏥 Nearest Emergency Hospital]                             ║  │
│  ║  [Continue Consultation]                                     ║  │
│  ╚═══════════════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6.6 Medical History Page

```
PAGE: /patient/history — Medical History Timeline
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     📋 Medical History                    [🔍 Search]      │
│  ─────────────────────────────────────────────────────────────────  │
│  Filter: [All ▼]   Date Range: [Last 3 months ▼]                  │
│                                                                     │
│  APRIL 2026                                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📅 Apr 15, 2026 · 10:00 AM                    🔴 CRITICAL  │  │
│  │  Dr. Priya Sharma · Cardiologist                             │  │
│  │  Diagnosis: Hypertension Stage 1                             │  │
│  │  Prescription: 2 medications                                 │  │
│  │  [View Full Record →]           [Download PDF]               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  MARCH 2026                                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  📅 Mar 28, 2026 · 09:00 AM                    🟢 STABLE    │  │
│  │  Dr. Ravi Kumar · General Physician                          │  │
│  │  Diagnosis: Type 2 Diabetes — routine checkup               │  │
│  │  Prescription: 1 medication                                  │  │
│  │  [View Full Record →]           [Download PDF]               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  EMPTY STATE:                                                       │
│  📋 No medical history yet                                         │
│  "Your consultation records will appear here."                     │
│  [Book Your First Appointment →]                                    │
└─────────────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────────

SCREEN 2: /patient/history/:id — Consultation Detail
┌─────────────────────────────────────────────────────────────────────┐
│  ← History     Apr 15, 2026 — Dr. Priya Sharma                    │
│  ─────────────────────────────────────────────────────────────────  │
│  CONSULTATION SUMMARY                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Doctor:    Dr. Priya Sharma · Cardiologist ✅               │  │
│  │  Date:      Apr 15, 2026 · 10:00–10:32 AM (32 min)          │  │
│  │  Location:  Apollo Hospital, Hyderabad                       │  │
│  │  Diagnosis: Hypertension Stage 1                             │  │
│  │  Risk Level at Visit: 🔴 CRITICAL                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  PRESCRIPTION                                                       │
│  • Amlodipine 5mg — Once daily (30 days)                           │
│  • Metoprolol 25mg — Twice daily (30 days)                         │
│  [📄 Download Prescription PDF]                                     │
│                                                                     │
│  CONSULTATION TRANSCRIPT                                            │
│  [▶ Show Transcript]  [📄 Download Transcript PDF]                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  [Doctor] Can you describe the pain?                        │  │
│  │  [Patient] It's a pressure in my chest...                   │  │
│  │  [Doctor] Any shortness of breath?                          │  │
│  │  ...                                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  SOAP NOTE (Doctor's clinical summary)                             │
│  [▶ View SOAP Note]                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6.7 Prescription Page

```
PAGE: /patient/prescriptions/:id — Prescription Detail
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     💊 Prescription                  [📄 Download PDF]     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🎙️ MediVoice AI                                             │  │
│  │  ════════════════════════════════════════════════════════   │  │
│  │  Patient: Ravi Kumar          Age: 34 yrs     Male          │  │
│  │  Date: April 15, 2026                                        │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          │  │
│  │  Doctor: Dr. Priya Sharma     MBBS, MD, DM — Cardiology     │  │
│  │  Reg No: MCI-HYD-CARD-001                                   │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          │  │
│  │  DIAGNOSIS: Hypertension Stage 1                             │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          │  │
│  │  MEDICATIONS:                                                │  │
│  │  1. Amlodipine 5mg — Once daily — 30 days                   │  │
│  │     Take at the same time daily                              │  │
│  │  2. Metoprolol 25mg — Twice daily — 30 days                 │  │
│  │     Take with food                                           │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          │  │
│  │  INSTRUCTIONS: Reduce salt. Avoid caffeine.                  │  │
│  │  FOLLOW-UP: April 29, 2026                                   │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          │  │
│  │  Apollo Clinic, Hyderabad · +91 9876543210                  │  │
│  │                              [Signature]                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [📄 Download Prescription PDF]    [📝 Download Transcript PDF]    │
│                                                                     │
│  MEDICATION REMINDERS                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  💊 Amlodipine    08:00 daily    [✅ Active] [Edit time]     │  │
│  │  💊 Metoprolol    08:00 + 20:00  [✅ Active] [Edit time]     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 6.8 Reminders Page

```
PAGE: /patient/reminders — Medication Reminders
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     💊 Medication Reminders                                │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  TODAY'S SCHEDULE                                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  08:00 AM                                                    │  │
│  │  💊 Amlodipine 5mg    ✅ Taken       [Undo]                 │  │
│  │  💊 Metoprolol 25mg   ✅ Taken       [Undo]                 │  │
│  │  💊 Metformin 500mg   ⏰ Due now     [Mark Taken]           │  │
│  │                                                              │  │
│  │  20:00 PM                                                    │  │
│  │  💊 Metoprolol 25mg   🔜 Scheduled                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ALL ACTIVE REMINDERS                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  💊 Amlodipine 5mg                                          │  │
│  │     08:00 AM daily · 18 days remaining                       │  │
│  │     From: Dr. Priya Sharma (Apr 15)                         │  │
│  │     [✅ Active]  [Edit Time]  [🗑️ Delete]                   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  💊 Metformin 500mg                                         │  │
│  │     08:00 + 14:00 + 20:00 · 12 days remaining              │  │
│  │     From: Dr. Ravi Kumar (Mar 28)                           │  │
│  │     [✅ Active]  [Edit Time]  [🗑️ Delete]                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  EMPTY STATE:                                                       │
│  💊 No active reminders                                            │
│  "Reminders are set automatically when a doctor prescribes         │
│   medication. Book a consultation to get started."                 │
│  [Book Appointment →]                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Doctor Portal — Page Maps

### Layout Shell (All Doctor Pages)

```
DOCTOR PORTAL LAYOUT — DESKTOP (primary device for doctors)
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  🎙️ MediVoice AI — Doctor        🟢 Available ▼    🔔    👤 Dr. Priya  │
├────────────────┬─────────────────────────────────────────────────────────┤
│                │                                                         │
│  🏠 Dashboard  │                                                         │
│                │                                                         │
│  📋 Queue      │              PAGE CONTENT                              │
│     (12 pts)   │              <Outlet />                                │
│                │                                                         │
│  👤 Patients   │                                                         │
│                │                                                         │
│  🤖 AI Assist  │                                                         │
│                │                                                         │
│  🗓️  Schedule  │                                                         │
│                │                                                         │
│  📊 Analytics  │                                                         │
│                │                                                         │
└────────────────┴─────────────────────────────────────────────────────────┘
```

---

### 7.1 Doctor Dashboard

```
PAGE: /doctor — Doctor Dashboard
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  Good morning, Dr. Priya! 👋              Status: [🟢 Available ▼] │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
│  │ Today's Queue│  │ Total Slots  │  │  Completed   │  │Remaining│ │
│  │     12       │  │     15       │  │      4       │  │   11   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────┘ │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  NEXT PATIENTS — [View Full Queue →]                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  10:30 AM  Ravi Kumar     🔴 CRITICAL   [Start →]           │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  11:00 AM  Priya Sharma   🟡 MODERATE   [Start →]           │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  11:30 AM  Arun Nair      🟢 STABLE     [Start →]           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  QUICK ACTIONS                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ 🤖 AI Assist │  │ 📊 Analytics │  │ 🗓️ Schedule  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  COMPLETED TODAY                                                    │
│  08:30 · Meena Iyer    ✅ Completed   [View Notes]                 │
│  09:00 · Suresh Patel  🚫 No-Show    [—]                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 7.2 Patient Queue Page

```
PAGE: /doctor/queue — Patient Queue
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back     📋 Today's Queue (Apr 15)    [🗓️ Calendar View]       │
│  ─────────────────────────────────────────────────────────────────  │
│  Showing: Today  [All Statuses ▼]  Sorted by: Time ▼               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🔴 CRITICAL — See Immediately                               │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  10:30 AM  Ravi Kumar · M · 34 yrs                          │  │
│  │  "Chest pain for 2 days, shortness of breath"               │  │
│  │  Risk: Possible cardiac event detected                       │  │
│  │  [View History] [Start Consultation →]                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🟡 MODERATE                                                 │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  11:00 AM  Priya Sharma · F · 42 yrs                        │  │
│  │  "Persistent headache and dizziness for a week"              │  │
│  │  [View History] [Start Consultation →]                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🟢 STABLE                                                   │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  11:30 AM  Arun Nair · M · 28 yrs                           │  │
│  │  "Routine diabetes checkup"                                  │  │
│  │  [View History] [Start Consultation →]                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

ACTIONS per patient card:
  → [Start Consultation]  → /doctor/consultation/:appointmentId/live
  → [View History]        → /doctor/patients/:patientId/history
  → Mark actions:         [Complete] [No-Show] [Reschedule]
```

---

### 7.3 Live Consultation Panel

```
PAGE: /doctor/consultation/:id/live — Live Consultation Panel
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  🔴 LIVE   Ravi Kumar · 34M · Cardiologist visit    [⏱️ 08:12]     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  My Language: [Tamil ▼]   Patient speaks: [Hindi ▼]                │
│                                                                     │
│  ─── LIVE TRANSCRIPT ──────────────────────────────────────────     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  [Patient] 10:32 AM                                🔴 RISK  │  │
│  │  மார்பில் வலி இருக்கிறது                                    │  │
│  │  (Tamil translation of: "I have chest pain")               │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─              │  │
│  │  [You] 10:33 AM                                             │  │
│  │  எவ்வளவு நேரத்திலிருந்து வலி இருக்கிறது?                  │  │
│  │  (Original Tamil — patient sees Hindi)                      │  │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─              │  │
│  │  [Patient] 10:33 AM                                         │  │
│  │  இரண்டு நாட்களாக...                                       │  │
│  │  (Tamil: "For two days...")                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  🔴 RISK ALERT: "chest pain" detected — Patient flagged CRITICAL   │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  🎤 [  LISTENING...  ]   (pulsing)                                  │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  🤖 Quick AI Assist: Type clinical question...            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  [⏸ Pause]  [💾 Save]  [📝 Generate Notes]  [🔚 End Consultation] │
└─────────────────────────────────────────────────────────────────────┘

NAVIGATION FROM THIS PAGE:
  → [Generate Notes]     → triggers AI-07 → /doctor/consultation/:id/notes
  → [End Consultation]   → confirmation modal → consultation saved
  → [🤖 Quick AI Assist] → inline QA response from AI-08
```

---

### 7.4 Clinical Notes Page

```
PAGE: /doctor/consultation/:id/notes — Clinical Notes (SOAP)
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   📝 Clinical Notes — Ravi Kumar     [⚠️ AI Draft — Review]│
│  ─────────────────────────────────────────────────────────────────  │
│  ⚠️ This note was AI-generated from the consultation transcript.   │
│     Please review, edit, and confirm before saving.                 │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ▼ S — SUBJECTIVE (Patient's report)                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Chief Complaint:                                            │  │
│  │  [Chest pain for 2 days, radiating to left arm           ]  │  │
│  │                                                              │  │
│  │  Reported Symptoms:                                          │  │
│  │  [chest pain ×]  [shortness of breath ×]  [+ Add]          │  │
│  │                                                              │  │
│  │  Duration:  [2 days                                      ]  │  │
│  │  History:   [No prior cardiac events                     ]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ▼ O — OBJECTIVE (Doctor's findings)                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Observations:  [ECG ordered, BP elevated at 150/95      ]  │  │
│  │  Vitals:        [BP: 150/95, HR: 88/min                  ]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ▼ A — ASSESSMENT                                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Probable Diagnosis:  [Hypertension Stage 1               ]  │  │
│  │  Differentials:       [Unstable Angina ×]   [+ Add]         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ▼ P — PLAN                                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Medications:  [Amlodipine 5mg × ]  [Metoprolol 25mg × ]   │  │
│  │  Follow-up:    [April 29, 2026                           ]  │  │
│  │  Advice:       [Reduce salt, avoid caffeine              ]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  [Save Draft]         [Confirm & Build Prescription →]              │
└─────────────────────────────────────────────────────────────────────┘

NAVIGATION FROM THIS PAGE:
  → [Confirm & Build Prescription] → /doctor/prescription/:id/edit
  → [Save Draft]                   → stays on this page, shows saved toast
```

---

### 7.5 Prescription Builder Page

```
PAGE: /doctor/prescription/:id/edit — Prescription Builder
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Notes   💊 Prescription Builder — Ravi Kumar                   │
│  ─────────────────────────────────────────────────────────────────  │
│  Patient: Ravi Kumar · M · 34 yrs          Date: Apr 15, 2026     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  DIAGNOSIS                                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Hypertension Stage 1                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  MEDICATIONS (⭐ = AI pre-filled — verify before saving)           │
│  ┌─────────────────┬──────┬────────────┬────────┬──────────────┐  │
│  │ Drug Name       │ Dose │ Frequency  │ Period │ Instructions │  │
│  ├─────────────────┼──────┼────────────┼────────┼──────────────┤  │
│  │ Amlodipine ⭐   │ 5mg  │ Once daily │ 30days │ Same time    │  │
│  ├─────────────────┼──────┼────────────┼────────┼──────────────┤  │
│  │ Metoprolol ⭐   │ 25mg │ Twice daily│ 30days │ With food    │  │
│  ├─────────────────┼──────┼────────────┼────────┼──────────────┤  │
│  │ [+ Add Row]     │      │            │        │              │  │
│  └─────────────────┴──────┴────────────┴────────┴──────────────┘  │
│                                                                     │
│  GENERAL INSTRUCTIONS                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Reduce salt intake. Avoid caffeine. Exercise 30 min daily. │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  FOLLOW-UP DATE:  [April 29, 2026]                                 │
│                                                                     │
│  Dr. Priya Sharma · Cardiologist · Reg: MCI-HYD-CARD-001          │
│  Apollo Clinic, Hyderabad · +91 9876543210                         │
│  ─────────────────────────────────────────────────────────────────  │
│  [👁 Preview PDF]          [💾 Save & Send to Patient]              │
└─────────────────────────────────────────────────────────────────────┘

NAVIGATION:
  → [Save & Send to Patient] → Patient notified, Rx in their portal
  → [Preview PDF]            → PDF preview modal opens
```

---

### 7.6 Schedule Manager Page

```
PAGE: /doctor/schedule — Schedule Manager
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   🗓️ Schedule Manager              [Day] [Week] [Month]   │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  AVAILABILITY SETTINGS                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Working Days:  [Mon ✅] [Tue ✅] [Wed ✅] [Thu ✅] [Fri ✅] │  │
│  │                 [Sat ☐]  [Sun ☐]                             │  │
│  │  Hours:   09:00 AM  to  05:00 PM                             │  │
│  │  Slot:    [30 minutes ▼]   Max Daily: [16]                   │  │
│  │  Break:   13:00 – 14:00 (Lunch)   [+ Add Break]             │  │
│  │                                           [Save Settings]    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  WEEK VIEW — Apr 14–20, 2026                                       │
│  ┌──────────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐   │
│  │ Time     │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │   │
│  ├──────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤   │
│  │ 09:00    │ ✅   │ 🔵   │ 🔵   │ ✅   │ 🔵   │ —    │ —    │   │
│  │ 09:30    │ ✅   │ ✅   │ 🔵   │ 🔵   │ ✅   │ —    │ —    │   │
│  │ 10:00    │ 🔵   │ 🔵   │ 🔵   │ ✅   │ 🔵   │ —    │ —    │   │
│  │ ...      │ ...  │ ...  │ ...  │ ...  │ ...  │ ...  │ ...  │   │
│  └──────────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘   │
│  ✅ = Available    🔵 = Booked    🚫 = Blocked                     │
│                                                                     │
│  [🚫 Block Dates]                         [← Prev Week] [Next →] │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 7.7 AI Doctor Assistant Page

```
PAGE: /doctor/assistant — AI Doctor Assistant
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   🤖 AI Clinical Assistant                                 │
│  ─────────────────────────────────────────────────────────────────  │
│  ⚠️ For reference only. Always apply clinical judgment.            │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  SUGGESTED QUERIES                                                  │
│  [Drug interactions] [Max dosage] [Contraindications] [First-line] │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🤖  Ask me anything clinical — drug interactions,          │  │
│  │       dosage guidelines, differential diagnosis support.     │  │
│  │                                        [AI Clinical Assist]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│            ┌──────────────────────────────────────────────────┐    │
│            │ 👤  Warfarin and Aspirin interaction?            │    │
│            └──────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🤖  Combining Warfarin with Aspirin significantly          │  │
│  │       increases bleeding risk. Both inhibit platelet        │  │
│  │       function through different mechanisms.                │  │
│  │                                                             │  │
│  │       Monitor INR closely if combination is necessary.     │  │
│  │       Consider PPI prophylaxis for GI protection.          │  │
│  │                                                             │  │
│  │  Confidence: HIGH   Source: AI Clinical Assistant           │  │
│  │  📋 For reference only. Always apply clinical judgment.    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  ┌──────────────────────────────────────┐  [➤ Ask]                │
│  │ Ask a clinical question...           │                          │
│  └──────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 7.8 Analytics Page

```
PAGE: /doctor/analytics — Analytics Dashboard
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   📊 Practice Analytics                [This Month ▼]     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │  Total Patients│  │ Completed Appts│  │ Completion Rate│       │
│  │      128       │  │     116        │  │    90.6%       │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
│                                                                     │
│  WEEKLY PATIENT COUNT                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  25 ┤                          ████                         │  │
│  │  20 ┤             ████    ████ ████ ████                    │  │
│  │  15 ┤  ████  ████ ████    ████ ████ ████                    │  │
│  │  10 ┤  ████  ████ ████    ████ ████ ████                    │  │
│  │   5 ┤  ████  ████ ████    ████ ████ ████                    │  │
│  │   0 └──────────────────────────────────────                 │  │
│  │      Mon   Tue   Wed   Thu   Fri   Sat                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  TOP 5 DIAGNOSES (last 30 days)                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Hypertension         ████████████████████░░  34 cases      │  │
│  │  Type 2 Diabetes      ██████████████░░░░░░░░  22 cases      │  │
│  │  Chest Pain           █████████░░░░░░░░░░░░░  16 cases      │  │
│  │  Arrhythmia           ██████░░░░░░░░░░░░░░░░  11 cases      │  │
│  │  Heart Failure        ████░░░░░░░░░░░░░░░░░░   7 cases      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  RISK LEVEL TREND                                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Wk1: 🔴 3   🟡 8   🟢 15   │  Wk2: 🔴 5   🟡 11  🟢 18  │  │
│  │  Wk3: 🔴 2   🟡 7   🟢 20   │  Wk4: 🔴 4   🟡 9   🟢 22  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Admin Portal — Page Maps

### Layout Shell (Admin Pages)

```
ADMIN PORTAL LAYOUT — DESKTOP
═══════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────────────┐
│  🎙️ MediVoice AI — Admin Panel                         👤 Admin         │
├──────────────────────┬───────────────────────────────────────────────────┤
│  🏠 Dashboard        │                                                   │
│  👥 Users            │              PAGE CONTENT                        │
│  🔐 Security         │              <Outlet />                          │
│  ⚙️  Settings (ph2)  │                                                   │
└──────────────────────┴───────────────────────────────────────────────────┘
```

---

### 8.1 Admin Dashboard

```
PAGE: /admin — Admin Dashboard
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  🎙️ MediVoice AI — Admin Dashboard                     👤 Admin    │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  PLATFORM OVERVIEW                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
│  │ Total Users  │  │   Doctors    │  │   Patients   │  │Consults│ │
│  │     847      │  │     103      │  │     744      │  │  1,284 │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────┘ │
│                                                                     │
│  ⚠️ SECURITY ALERTS (4 in last 24 hours)                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🔴 CRITICAL — suspicious_ip            10:34 AM Today      │  │
│  │     5 different IPs targeting user@gmail.com in 1 hour     │  │
│  │     [Investigate →]                                          │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  🟠 HIGH — account_locked               09:15 AM Today      │  │
│  │     dr.test@gmail.com locked after 3 failed attempts       │  │
│  │     [View →]                                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  RECENT SIGNUPS (last 24 hours)                                    │
│  Dr. Arjun Mehta — Neurologist — Delhi     [Verify Doctor]         │
│  Sneha Patel — Patient — Mumbai            [View Profile]          │
│  Dr. Kavya Reddy — Dermatologist — Hyd     [Verify Doctor]         │
│                                                                     │
│  QUICK ACTIONS                                                      │
│  [👥 Manage Users]  [🔐 Security Monitor]                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 8.2 User Management Page

```
PAGE: /admin/users — User Management
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   👥 User Management                  [Export CSV]         │
│  ─────────────────────────────────────────────────────────────────  │
│  Search: [________________]                                         │
│  Role: [All ▼]  Status: [All ▼]  Sort: [Joined (newest) ▼]         │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  ┌────────────────────────┬──────────┬───────────┬─────────┬──────┐ │
│  │ Name                   │ Role     │ Status    │ Joined  │ Act. │ │
│  ├────────────────────────┼──────────┼───────────┼─────────┼──────┤ │
│  │ Dr. Arjun Mehta        │ 🔵 Doctor│ ✅ Active │ Apr 15  │ [⋮]  │ │
│  │ arjun@gmail.com        │ UNVERIFIED│          │         │      │ │
│  ├────────────────────────┼──────────┼───────────┼─────────┼──────┤ │
│  │ Sneha Patel            │ 🟢 Patient│ ✅ Active │ Apr 15  │ [⋮]  │ │
│  │ sneha@gmail.com        │          │           │         │      │ │
│  ├────────────────────────┼──────────┼───────────┼─────────┼──────┤ │
│  │ unknown@spam.com       │ 🟢 Patient│ 🔴 Banned │ Apr 14  │ [⋮]  │ │
│  └────────────────────────┴──────────┴───────────┴─────────┴──────┘ │
│                                                                     │
│  ACTION MENU [⋮] expands to:                                       │
│  ┌──────────────────────────────┐                                   │
│  │ 👁️  View Full Profile        │                                   │
│  │ ✅ Verify Doctor             │  ← Only shown for doctor role    │
│  │ 🔒 Deactivate Account        │                                   │
│  │ 🚫 Ban Account               │                                   │
│  │ 🚪 Force Logout              │                                   │
│  │ 🗑️  Delete Account           │                                   │
│  └──────────────────────────────┘                                   │
│                                                                     │
│  Showing 1–10 of 847  [← Prev] [1] [2] [3] ... [85] [Next →]      │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 8.3 Security Monitor Page

```
PAGE: /admin/security — Security Monitor
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  ← Back   🔐 Security Monitor               [Export Logs CSV]     │
│  ─────────────────────────────────────────────────────────────────  │
│  Severity: [All ▼]  Type: [All ▼]  Date: [Today ▼]  [🔍 Search]  │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  SUSPICIOUS ACTIVITY DETECTED                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🔴 CRITICAL — Multi-IP Attack Pattern                      │  │
│  │  IP: 192.168.1.x · Target: user@gmail.com                   │  │
│  │  5 unique IPs attacked same email in 1 hour                 │  │
│  │  10:34 AM · Apr 15, 2026                                    │  │
│  │  [🚪 Force Logout]  [🚫 Ban Account]  [View Logs]           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  SECURITY EVENT LOG                                                 │
│  ┌──────────────┬────────────────────┬──────────┬─────┬──────────┐ │
│  │ Time         │ Event              │ IP       │Svr. │ User     │ │
│  ├──────────────┼────────────────────┼──────────┼─────┼──────────┤ │
│  │ 10:34 AM     │ suspicious_ip      │ 10.0.0.5 │ 🔴  │ user@..  │ │
│  │ 10:33 AM     │ login_failed       │ 10.0.0.5 │ 🟡  │ user@..  │ │
│  │ 10:32 AM     │ login_failed       │ 10.0.0.4 │ 🟡  │ user@..  │ │
│  │ 10:15 AM     │ account_locked     │ 10.0.1.2 │ 🟠  │ dr@..    │ │
│  │ 09:50 AM     │ otp_verified       │ 10.0.2.3 │ 🟢  │ new@..   │ │
│  │ 09:30 AM     │ login_success      │ 10.0.3.1 │ 🟢  │ doc@..   │ │
│  └──────────────┴────────────────────┴──────────┴─────┴──────────┘ │
│                                                                     │
│  Showing 1–10 of 4,231  [← Prev] [1] [2] [3] ... [424] [Next →]   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. Critical User Journeys

### Journey 1 — Patient: Emergency via Chatbot

```
CRITICAL JOURNEY: Patient reports emergency symptoms
═══════════════════════════════════════════════════════════════════════════

Patient opens app
      │
      ▼
/patient (Dashboard)
      │ Taps "Ask AI Chatbot"
      ▼
/patient/chat (Chatbot)
      │ Types: "I have severe chest pain and can't breathe"
      ▼
AI-06 Risk Detection: "chest pain" + "can't breathe" → RED
      │ (< 10ms keyword detection)
      ▼
┌─────────────────────────────────────────┐
│  🚨 FULL SCREEN RISK ALERT MODAL        │
│  "Emergency detected. Call 108 now."   │
│  [📞 CALL 108]  [🏥 Find Hospital]     │
└─────────────────────────────────────────┘
      │
  ┌───┴───┐
Calls 108  Finds Hospital
  │           │
  ▼           ▼
tel:108   /patient/hospitals?emergency=true
Phone     → Map centred on user
dialer    → Emergency hospitals highlighted
opens     → Book or navigate there
```

### Journey 2 — Complete Consultation Flow

```
COMPLETE CONSULTATION JOURNEY
═══════════════════════════════════════════════════════════════════════════

PATIENT books appointment (P-02):
  /patient/chat → AI suggests Cardiologist
  → /patient/book/drId → slot selected → confirmed
  → Patient notified + Doctor notified

DAY OF CONSULTATION:
  Patient:   /patient/consultation/:id/live
  Doctor:    /doctor/consultation/:id/live
  Both:      Consent modal → "Start Consultation"

  LIVE:
  Patient speaks Hindi
    → ASR (Web Speech API) → text
    → LibreTranslate → Tamil
    → WebSocket → Doctor sees Tamil
  Doctor speaks Tamil
    → ASR → text → LibreTranslate → Hindi
    → WebSocket → Patient sees Hindi

POST-CONSULTATION (Doctor side):
  Doctor clicks "End Consultation"
  → /doctor/consultation/:id/notes
  → AI-07 SOAP note auto-generated
  → Doctor reviews, edits, confirms
  → "Build Prescription" →
  → /doctor/prescription/:id/edit
  → AI-09 pre-fills medications
  → Doctor edits, confirms, saves

PATIENT receives:
  → Push notification: "Prescription ready"
  → /patient/prescriptions/:id
  → Download PDF (jsPDF, client-side)
  → AI-10 sets up medication reminders automatically
```

---

## 10. Navigation Architecture

### Navigation Components by Portal

```
PATIENT PORTAL NAVIGATION
═══════════════════════════════════════════════════════════════════════════

MOBILE — Bottom Navigation Bar:
  🏠 Home     → /patient
  📅 Appts    → /patient/appointments
  🗺️ Hospitals → /patient/hospitals
  📋 History  → /patient/history
  💊 Meds     → /patient/reminders

TABLET / DESKTOP — Left Sidebar:
  🏠 Dashboard     → /patient
  🤖 AI Chatbot    → /patient/chat
  📅 Appointments  → /patient/appointments
  🗺️ Hospital Finder → /patient/hospitals
  📋 Medical History → /patient/history
  📄 Prescriptions → /patient/prescriptions
  💊 Reminders     → /patient/reminders

TOP BAR (all sizes):
  Left:   MediVoice AI logo → /patient
  Right:  🔔 Notifications bell | 👤 Avatar → profile dropdown

FIXED PERSISTENT (all pages, patient only):
  🆘 SOS Button — bottom-right corner
  tel:108 on tap (mobile) | SOS modal (desktop)

PROFILE DROPDOWN (👤 tap):
  👤 My Profile
  ⚙️  Settings
  🌐 Language: [Hindi ▼]
  🚪 Sign Out

─────────────────────────────────────────────────────────────────────────

DOCTOR PORTAL NAVIGATION
═══════════════════════════════════════════════════════════════════════════

DESKTOP — Left Sidebar:
  🏠 Dashboard     → /doctor
  📋 Queue         → /doctor/queue   (badge: patient count)
  🤖 AI Assistant  → /doctor/assistant
  🗓️  Schedule      → /doctor/schedule
  📊 Analytics     → /doctor/analytics

TOP BAR:
  Left:  MediVoice AI logo → /doctor
  Centre: 🟢 Available [Status dropdown]
  Right: 🔔 Bell | 👤 Avatar

MOBILE — Top Tab Bar (doctors rarely on mobile, but supported):
  🏠 | 📋 | 🤖 | 🗓️ | 📊

─────────────────────────────────────────────────────────────────────────

ADMIN PORTAL NAVIGATION
═══════════════════════════════════════════════════════════════════════════

LEFT SIDEBAR:
  🏠 Dashboard     → /admin
  👥 Users         → /admin/users   (badge: unverified doctors)
  🔐 Security      → /admin/security (badge: active alerts count)
```

---

## 11. Responsive Layout System

### Breakpoint Behavior

```
RESPONSIVE BREAKPOINT GUIDE
═══════════════════════════════════════════════════════════════════════════

📱 MOBILE (320px–767px) — sm: prefix in Tailwind
  Layout:     Single column stack
  Navigation: Bottom tab bar (patient) | Hamburger drawer (doctor/admin)
  Cards:      Full width
  Tables:     Horizontal scroll or card-stack view
  Map:        Full-screen with overlay card
  Transcript: Full-screen panel
  SOS button: Fixed bottom-right, 60×60px

📟 TABLET (768px–1023px) — md: prefix
  Layout:     2-column grid for cards
  Navigation: Side drawer (collapsible)
  Cards:      2-column grid
  Tables:     Visible but compressed
  Map:        Half-screen with hospital list panel
  Transcript: Side-by-side (patient/doctor panels)
  SOS button: Fixed bottom-right, 56×56px

💻 LAPTOP (1024px–1439px) — lg: prefix
  Layout:     Persistent left sidebar (240px) + main content
  Navigation: Full sidebar always visible
  Cards:      3-column grid (stat cards)
  Tables:     Full data table with all columns
  Prescription: Side-by-side builder + preview

🖥️ DESKTOP (1440px+) — xl: prefix
  Layout:     Wide sidebar (260px) + spacious main + optional right panel
  Consultation: 3-panel: transcript + notes + AI assistant side-by-side
  Analytics:  Full chart grid
  Admin:      Full data tables with export controls

─────────────────────────────────────────────────────────────────────────
SPECIFIC COMPONENT BEHAVIOR:

PatientDashboard:
  Mobile:   Stacked: Risk alert → Upcoming appt → Medications → Quick actions
  Desktop:  Grid: Left (stat cards + upcoming) | Right (medications + actions)

LiveTranscript:
  Mobile:   Single column: Language selector → Transcript feed → Controls
  Desktop:  Dual panel: Patient view left, Doctor view right (synchronized)

HospitalFinder:
  Mobile:   Map takes 60% height, hospital list scrolls below
  Desktop:  Map takes 70% width, hospital list panel on right

PrescriptionBuilder:
  Mobile:   Scrollable form, medication rows stack vertically
  Desktop:  Table-style rows, PDF preview panel on right

Queue Dashboard:
  Mobile:   Patient cards stacked with swipe actions
  Desktop:  Full table with inline action buttons
```

---

## 12. Modal & Overlay Map

Every modal in MediVoice AI — what triggers it and what it contains:

| Modal | Trigger | Content | Action |
|---|---|---|---|
| **Consent Modal** | Patient opens live consultation | Transcription consent checkbox | Consent → start consultation |
| **Risk Alert Modal (RED)** | AI detects critical symptom | Emergency message + SOS + Hospital finder | Call 108 / Find Hospital / Dismiss |
| **Risk Alert Modal (YELLOW)** | AI detects moderate symptom | Advisory + Book Urgent Appointment | Book / Dismiss |
| **Booking Confirmation** | Patient confirms appointment slot | Doctor + Date + Time summary | Confirm / Cancel |
| **Account Locked Modal** | 3 failed login attempts | Countdown timer + forgot password | Wait / Reset Password |
| **New Device Login** | Login from new device (old session) | "Logged in elsewhere" message | Log In Again |
| **Cancel Appointment** | Patient clicks Cancel | Reason input (optional) + confirm | Confirm Cancel / Keep |
| **Doctor Status Change** | Doctor clicks status toggle | Available / Busy / On Leave options | Select + Save |
| **Block Date Modal** | Doctor clicks Block Dates | Date range picker + reason | Block / Cancel |
| **Delete Reminder** | Patient clicks delete reminder | Confirmation message | Delete / Keep |
| **Verify Doctor Modal** | Admin clicks Verify | Doctor credentials displayed | Verify / Deny |
| **Ban Account Modal** | Admin clicks Ban | Warning + confirmation input | Type "BAN" to confirm |
| **SOS Desktop Modal** | Desktop SOS button | 108 in large text + copy + link | Call / Copy / Close |
| **Force Logout Modal** | Admin triggers force logout | User info + confirmation | Confirm / Cancel |
| **PDF Preview Modal** | Doctor clicks Preview PDF | Prescription rendered as PDF | Download / Close |
| **OTP Expired Modal** | OTP timer reaches 0 | "Code expired" message | Request New OTP |
| **Duplicate Email Modal** | Email already registered | Generic "account exists" message | Log In / Try Different Email |

---

## 13. Empty States & Error Pages

### Empty States

```
EMPTY STATE DESIGN PATTERN
Each empty state shows: illustration + title + description + CTA button

Page                  → Empty State Text                    → CTA
──────────────────────────────────────────────────────────────────────────
Appointments List     → "No appointments yet"               → [Book Now]
Medical History       → "No consultation records"           → [Book Appointment]
Prescriptions         → "No prescriptions"                  → [View Appointments]
Reminders             → "No active reminders"               → [Book Consultation]
Patient Queue (doctor)→ "No patients today"                 → [View Schedule]
Hospital Finder (pre) → "Find hospitals near you"           → [Use My Location]
Search Results        → "No doctors found for your filters" → [Clear Filters]
Chat History          → "Start a conversation"              → [Ask about symptoms]
Security Logs (admin) → "No security events"                → [View Settings]
Analytics             → "Not enough data yet"               → [View Appointments]
```

### Error Pages

```
404 — NOT FOUND
┌─────────────────────────────────────────────────────────────────────┐
│              🔍 Page Not Found                                      │
│                                                                     │
│  The page you're looking for doesn't exist                          │
│  or you may not have permission to view it.                        │
│                                                                     │
│  [← Go Back]          [🏠 Go to Dashboard]                         │
└─────────────────────────────────────────────────────────────────────┘

500 — ERROR BOUNDARY (React ErrorBoundary)
┌─────────────────────────────────────────────────────────────────────┐
│              ⚠️ Something went wrong                                │
│                                                                     │
│  An unexpected error occurred. Please refresh the page.            │
│                                                                     │
│  [🔄 Refresh Page]                                                  │
└─────────────────────────────────────────────────────────────────────┘

SESSION EXPIRED
┌─────────────────────────────────────────────────────────────────────┐
│              ⏰ Session Expired                                      │
│                                                                     │
│  Your session has ended after 24 hours.                            │
│  Please log in again to continue.                                  │
│                                                                     │
│  [Log In Again →]                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 14. Notification & Alert UX

### Notification Center

```
NOTIFICATION PANEL (🔔 tapped)
┌─────────────────────────────────────┐
│  Notifications            [Mark all read] │
│  ─────────────────────────────────────   │
│  🔵 NEW                              │
│  ┌─────────────────────────────────┐ │
│  │ 📄 Prescription ready           │ │
│  │ Dr. Priya Sharma just sent      │ │
│  │ your prescription.              │ │
│  │ Tap to download PDF             │ │
│  │                    2 min ago    │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ ⏰ Appointment Tomorrow         │ │
│  │ Dr. Priya Sharma at 10:00 AM   │ │
│  │ Apollo Hospital, Hyderabad      │ │
│  │                   14 hours ago  │ │
│  └─────────────────────────────────┘ │
│  ─── Earlier ────────────────────   │
│  ✅ Booking confirmed  · Yesterday  │
│  💊 Take Metformin     · Yesterday  │
│  [View All Notifications]           │
└─────────────────────────────────────┘

TOAST NOTIFICATIONS (auto-dismiss after 4s):
  ✅ Success:  green · "Appointment booked successfully"
  ❌ Error:    red   · "Slot no longer available. Please choose another."
  ⚠️ Warning:  yellow· "Session expires in 5 minutes"
  ℹ️ Info:     blue  · "Saving transcript..."
```

---

## 15. Accessibility Flow

### Accessibility Requirements

```
ACCESSIBILITY STANDARDS — WCAG 2.1 AA
═══════════════════════════════════════════════════════════════════════════

TOUCH TARGETS:
  Minimum:      44 × 44px (WCAG 2.1 SC 2.5.5)
  SOS Button:   60 × 60px (critical — oversized on purpose)
  Nav items:    48px height minimum

COLOUR CONTRAST:
  Body text:    #374151 on #FFFFFF  → 7.6:1 ✅ (AA: 4.5:1 required)
  Primary blue: #1A56DB on white   → 5.2:1 ✅
  Red alerts:   #E02424 on white   → 5.4:1 ✅
  Risk RED badge: White on #DC2626 → 5.1:1 ✅

FONT SIZES:
  Body:         16px (1rem) — never below 14px
  Labels:       14px (0.875rem) minimum
  H1:           30px · H2: 24px · H3: 20px

KEYBOARD NAVIGATION:
  All interactive elements reachable via Tab key
  Modal focus trap: focus stays inside modal when open
  Escape key:   closes modals and dropdowns
  Enter/Space:  activates buttons and links

SCREEN READER:
  All images:   alt attributes present
  Icons only:   aria-label on icon-only buttons (SOS, bell, mic)
  Live regions: aria-live="polite" on transcript and notifications
  Role attrs:   role="alert" on risk alert modals

ASR ACCESSIBILITY:
  Web Speech API unavailable → text input always provided
  Voice commands: not relied upon as only input method
  All voice features have keyboard/touch equivalents

LANGUAGE SUPPORT:
  lang attribute set to active language code on html element
  RTL: not required for current 6 Indian languages (all LTR)
  Font: Arial/sans-serif — supports Devanagari, Tamil, Telugu scripts
```

---

<div align="center">

---

## UX Flow & Page Map Summary

```
╔══════════════════════════════════════════════════════════════════════╗
║          MEDIVOICE AI — UX FLOW & PAGE MAP AT A GLANCE              ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  Total Pages:             24 unique route-level pages               ║
║  Public Pages:             6  (landing + 5 auth pages)              ║
║  Patient Portal Pages:    11  (/patient/*)                          ║
║  Doctor Portal Pages:      9  (/doctor/*)                           ║
║  Admin Portal Pages:       4  (/admin/* + 404)                      ║
║                                                                      ║
║  Critical User Journeys:   3  (Emergency / Consultation / Admin)    ║
║  Modals & Overlays:       17  (all documented with triggers)        ║
║  Empty States:            10  (all with CTAs)                       ║
║  Error Pages:              3  (404 / Error Boundary / Session)      ║
║  Notification Types:      11  (push + in-app + toast)               ║
║                                                                      ║
║  Device Support:           4  (Mobile / Tablet / Laptop / Desktop)  ║
║  Breakpoints:              4  (sm/md/lg/xl via Tailwind)            ║
║  Navigation Patterns:      3  (Bottom tab / Sidebar / Top bar)      ║
║                                                                      ║
║  Accessibility:     WCAG 2.1 AA compliant                           ║
║  Language Support:  6 Indian languages (all LTR)                    ║
║  Emergency Access:  SOS button on every patient page                ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — UX Flow & Page Map v1.0**

*Every screen mapped. Every journey documented. Every user considered.*

![Pages](https://img.shields.io/badge/Screens-24-blue?style=flat)
![Mobile](https://img.shields.io/badge/Mobile%20First-✓-brightgreen?style=flat)
![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-orange?style=flat)
![Portals](https://img.shields.io/badge/Portals-3%20%2B%20Auth-purple?style=flat)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
