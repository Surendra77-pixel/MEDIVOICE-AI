<div align="center">

# 📁 MEDIVOICE AI — Folder & File Structure
### Complete Project Organization Reference

![Document](https://img.shields.io/badge/Document-Folder%20%26%20File%20Structure-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20AI-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Pre--Development-orange?style=for-the-badge)

> **The single source of truth for every file, folder, and directory in MediVoice AI.**
> Every path is intentional. Every file has one job. Every folder has one reason to exist.

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication  
**Architecture:** Modular Monolith · MERN Stack · React PWA + Node.js API  
**Monorepo Strategy:** Single repository · Two workspaces (`/client` + `/server`)  
**Constraint:** 100% Free infrastructure · Zero paid services

</div>

---

## 📋 Table of Contents

1. [Repository Philosophy](#1-repository-philosophy)
2. [Top-Level Structure](#2-top-level-structure)
3. [Client — Complete Breakdown](#3-client--complete-breakdown)
   - [3.1 Root Config Files](#31-client-root-config-files)
   - [3.2 Public Directory](#32-public-directory)
   - [3.3 src/components](#33-srccomponents)
   - [3.4 src/pages](#34-srcpages)
   - [3.5 src/layouts](#35-srclayouts)
   - [3.6 src/hooks](#36-srchooks)
   - [3.7 src/context](#37-srccontext)
   - [3.8 src/services](#38-srcservices)
   - [3.9 src/utils](#39-srcutils)
   - [3.10 src/constants](#310-srcconstants)
   - [3.11 src/assets](#311-srcassets)
4. [Server — Complete Breakdown](#4-server--complete-breakdown)
   - [4.1 Server Root Files](#41-server-root-files)
   - [4.2 config/](#42-config)
   - [4.3 controllers/](#43-controllers)
   - [4.4 services/](#44-services)
   - [4.5 services/ai/](#45-servicesai)
   - [4.6 middleware/](#46-middleware)
   - [4.7 models/](#47-models)
   - [4.8 routes/](#48-routes)
   - [4.9 websocket/](#49-websocket)
   - [4.10 seed/](#410-seed)
   - [4.11 validators/](#411-validators)
   - [4.12 utils/](#412-utils)
5. [GitHub & DevOps Files](#5-github--devops-files)
6. [Environment Files](#6-environment-files)
7. [File Naming Conventions](#7-file-naming-conventions)
8. [Import Path Conventions](#8-import-path-conventions)
9. [File Responsibility Matrix](#9-file-responsibility-matrix)
10. [What Goes Where — Quick Reference](#10-what-goes-where--quick-reference)
11. [Files Never to Commit](#11-files-never-to-commit)
12. [Folder Growth Guide — Phase 2+](#12-folder-growth-guide--phase-2)

---

## 1. Repository Philosophy

Before reading the structure, understand **why** it is organized this way:

```
┌──────────────────────────────────────────────────────────────────────┐
│                    STRUCTURAL PRINCIPLES                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ONE FILE = ONE JOB                                                  │
│  Every file has a single, clearly named responsibility.              │
│  No "utils.js" that does 20 unrelated things.                        │
│  No "helpers.js" that grows without bound.                           │
│                                                                      │
│  DISCOVER BY READING THE PATH                                        │
│  Any developer should know what a file does before opening it.      │
│  /server/services/ai/riskService.js → obvious                       │
│  /server/misc/stuff.js              → never acceptable              │
│                                                                      │
│  ROLE-SEPARATED FRONTEND                                             │
│  Patient, Doctor, Admin pages/components are in their own           │
│  subdirectories. A developer working on the patient portal          │
│  never needs to touch doctor or admin files.                        │
│                                                                      │
│  CONTROLLERS ARE THIN, SERVICES ARE THICK                           │
│  Controllers: parse request → call service → return response        │
│  Services: ALL business logic, DB queries, AI calls                 │
│  Models: schema + validation only                                    │
│                                                                      │
│  AI IS ISOLATED                                                      │
│  All 12 AI components live in /server/services/ai/                  │
│  They can be extracted to microservices without touching             │
│  any other part of the codebase.                                     │
│                                                                      │
│  SHARED BEFORE DUPLICATED                                            │
│  Any component, hook, or utility used in 2+ places                  │
│  goes in the shared /common/ directory immediately.                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Top-Level Structure

```
medivoice-ai/                         ← Monorepo root
│
├── client/                           ← React 18 PWA (Vite)
│   └── ...                           → See Section 3
│
├── server/                           ← Node.js 20 + Express.js API
│   └── ...                           → See Section 4
│
├── .github/                          ← GitHub Actions CI/CD
│   └── workflows/
│       ├── ci.yml                    ← Test + lint + build on every PR
│       └── deploy.yml                ← Deploy to Vercel + Render on main merge
│
├── .env.example                      ← Template: ALL env vars documented
│                                       Developers copy this to .env
│                                       SAFE TO COMMIT — no real secrets
│
├── .gitignore                        ← Root-level ignores (shared)
├── .editorconfig                     ← Consistent formatting across editors
├── .eslintrc.json                    ← Shared ESLint config (root)
├── .prettierrc                       ← Code formatting rules
├── README.md                         ← Project overview + quick start
└── package.json                      ← Root package.json (workspace scripts)
```

### Root `package.json` — Workspace Scripts

```json
{
  "name": "medivoice-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":         "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client":  "cd client && npm run dev",
    "dev:server":  "cd server && npm run dev",
    "build":       "cd client && npm run build",
    "lint":        "cd client && npm run lint && cd ../server && npm run lint",
    "test":        "cd server && npm test",
    "seed":        "cd server && npm run seed",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

---

## 3. Client — Complete Breakdown

### Complete Client Tree

```
client/
│
├── public/                           ← Static assets served as-is
│   ├── index.html                    ← Entry HTML (Vite injects <script> here)
│   ├── manifest.json                 ← PWA manifest (name, icons, theme_color)
│   ├── robots.txt                    ← Search engine crawl rules
│   ├── favicon.ico                   ← Browser tab icon
│   └── icons/                        ← PWA app icons (multiple sizes)
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
│
├── src/
│   │
│   ├── components/                   ← Reusable UI components (no page logic)
│   │   ├── common/                   ← Shared across all 3 portals
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── FullScreenLoader.jsx
│   │   │   ├── PageLoader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── SOSButton.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Divider.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatusPill.jsx
│   │   │   └── Tooltip.jsx
│   │   │
│   │   ├── auth/                     ← Auth-specific form components
│   │   │   ├── SignupForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── OTPInput.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── ResetPasswordForm.jsx
│   │   │   └── PasswordStrengthBar.jsx
│   │   │
│   │   ├── patient/                  ← Patient portal components
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── ChatInputBar.jsx
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── DoctorSearchFilters.jsx
│   │   │   ├── SlotPicker.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── AppointmentStatusBadge.jsx
│   │   │   ├── HospitalMapPin.jsx
│   │   │   ├── HospitalCard.jsx
│   │   │   ├── PrescriptionCard.jsx
│   │   │   ├── MedicalHistoryItem.jsx
│   │   │   ├── TranscriptLine.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── RiskAlertModal.jsx
│   │   │   ├── MedicationReminderCard.jsx
│   │   │   └── ConsentModal.jsx
│   │   │
│   │   ├── doctor/                   ← Doctor portal components
│   │   │   ├── PatientQueueItem.jsx
│   │   │   ├── PatientRiskTag.jsx
│   │   │   ├── ConsultationTranscriptLine.jsx
│   │   │   ├── SOAPNoteEditor.jsx
│   │   │   ├── SOAPSection.jsx
│   │   │   ├── PrescriptionRow.jsx
│   │   │   ├── AddMedicationRow.jsx
│   │   │   ├── DoctorStatusToggle.jsx
│   │   │   ├── ScheduleCalendar.jsx
│   │   │   ├── CalendarDayCell.jsx
│   │   │   ├── BlockDateModal.jsx
│   │   │   ├── AnalyticsChart.jsx
│   │   │   ├── RiskTrendChart.jsx
│   │   │   ├── TopDiagnosesChart.jsx
│   │   │   ├── AIAssistantBubble.jsx
│   │   │   └── PatientHistoryAccordion.jsx
│   │   │
│   │   └── admin/                    ← Admin portal components
│   │       ├── UserTableRow.jsx
│   │       ├── UserRoleBadge.jsx
│   │       ├── UserActionMenu.jsx
│   │       ├── SecurityLogItem.jsx
│   │       ├── SecuritySeverityBadge.jsx
│   │       ├── StatCard.jsx
│   │       └── DoctorVerifyModal.jsx
│   │
│   ├── pages/                        ← Route-level page components (one per route)
│   │   ├── LandingPage.jsx           ← Public landing (/)
│   │   ├── NotFoundPage.jsx          ← 404 catch-all
│   │   │
│   │   ├── auth/                     ← Public auth pages
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OTPVerifyPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   ├── patient/                  ← Role-guarded: patient only
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   ├── AppointmentListPage.jsx
│   │   │   ├── BookAppointmentPage.jsx
│   │   │   ├── HospitalFinderPage.jsx
│   │   │   ├── MedicalHistoryPage.jsx
│   │   │   ├── ConsultationDetailPage.jsx
│   │   │   ├── PrescriptionListPage.jsx
│   │   │   ├── PrescriptionDetailPage.jsx
│   │   │   ├── LiveTranscriptPage.jsx
│   │   │   └── RemindersPage.jsx
│   │   │
│   │   ├── doctor/                   ← Role-guarded: doctor only
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientQueuePage.jsx
│   │   │   ├── ConsultationPanelPage.jsx
│   │   │   ├── ClinicalNotesPage.jsx
│   │   │   ├── PrescriptionBuilderPage.jsx
│   │   │   ├── PatientHistoryPage.jsx
│   │   │   ├── AIAssistantPage.jsx
│   │   │   ├── ScheduleManagerPage.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   │
│   │   └── admin/                    ← Role-guarded: admin only
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagementPage.jsx
│   │       ├── UserDetailPage.jsx
│   │       └── SecurityMonitorPage.jsx
│   │
│   ├── layouts/                      ← Persistent shell per portal (sidebar/navbar)
│   │   ├── PatientLayout.jsx
│   │   ├── DoctorLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── hooks/                        ← Custom React hooks (reusable logic)
│   │   ├── useSpeechRecognition.js
│   │   ├── useTextToSpeech.js
│   │   ├── useTranslation.js
│   │   ├── useSocket.js
│   │   ├── useNotifications.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── useGeolocation.js
│   │   ├── useClickOutside.js
│   │   └── usePagination.js
│   │
│   ├── context/                      ← React Context (global state)
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── services/                     ← All Axios API call functions
│   │   ├── authService.js
│   │   ├── patientService.js
│   │   ├── doctorService.js
│   │   ├── appointmentService.js
│   │   ├── consultationService.js
│   │   ├── prescriptionService.js
│   │   ├── reminderService.js
│   │   └── adminService.js
│   │
│   ├── utils/                        ← Pure helper functions (no React)
│   │   ├── axiosConfig.js
│   │   ├── pdfGenerator.js
│   │   ├── pushNotifications.js
│   │   ├── dateHelpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── storageHelpers.js
│   │
│   ├── constants/                    ← Static data & configuration constants
│   │   ├── languages.js
│   │   ├── cities.js
│   │   ├── specialties.js
│   │   ├── riskLevels.js
│   │   ├── appointmentStatuses.js
│   │   └── routes.js
│   │
│   ├── assets/                       ← Static media (imported in JS)
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── logo-white.svg
│   │   │   ├── hero-illustration.svg
│   │   │   └── empty-state.svg
│   │   └── icons/
│   │       ├── pill-icon.png
│   │       └── sos-icon.svg
│   │
│   ├── App.jsx                       ← Root component: AuthProvider + Router + Routes
│   ├── main.jsx                      ← ReactDOM.createRoot entry point
│   └── index.css                     ← Tailwind CSS directives + global styles
│
├── .env                              ← Local env vars (gitignored)
├── .env.example                      ← Template (committed)
├── .eslintrc.json                    ← ESLint rules (React specific)
├── tailwind.config.js                ← Tailwind config (content paths, theme)
├── postcss.config.js                 ← PostCSS (used by Tailwind)
├── vite.config.js                    ← Vite config (proxy, aliases, plugins)
└── package.json                      ← Frontend dependencies
```

---

### 3.1 Client Root Config Files

| File | Purpose | Key Contents |
|---|---|---|
| `vite.config.js` | Build tool config | Proxy `/api` → localhost:5000, path aliases (`@` → `src/`) |
| `tailwind.config.js` | CSS framework config | `content` paths, custom theme colors, font family |
| `postcss.config.js` | CSS post-processing | `tailwindcss` + `autoprefixer` plugins |
| `.eslintrc.json` | Linting rules | `react-hooks/exhaustive-deps`, no-unused-vars |
| `package.json` | Dependencies + scripts | All npm packages, `dev`, `build`, `lint` scripts |
| `.env` | Local environment | `VITE_API_URL`, `VITE_SOCKET_URL` (gitignored) |
| `.env.example` | Env template | Same keys, empty values — safe to commit |

```javascript
// vite.config.js — key settings
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages':      path.resolve(__dirname, 'src/pages'),
      '@hooks':      path.resolve(__dirname, 'src/hooks'),
      '@services':   path.resolve(__dirname, 'src/services'),
      '@utils':      path.resolve(__dirname, 'src/utils'),
      '@constants':  path.resolve(__dirname, 'src/constants'),
      '@context':    path.resolve(__dirname, 'src/context'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

### 3.2 Public Directory

| File/Folder | Purpose |
|---|---|
| `index.html` | Vite's entry HTML — `<div id="root">` is here. Keep minimal. |
| `manifest.json` | PWA config: app name, icons, theme color, background color, display mode |
| `robots.txt` | Tells search crawlers: don't index `/patient/*`, `/doctor/*`, `/admin/*` |
| `favicon.ico` | Browser tab icon |
| `icons/` | PWA icons in 8 sizes (required for "Add to Home Screen" on mobile) |

```json
// public/manifest.json
{
  "name":             "MediVoice AI",
  "short_name":       "MediVoice",
  "description":      "AI-Powered Healthcare Communication Platform",
  "start_url":        "/",
  "display":          "standalone",
  "orientation":      "portrait",
  "theme_color":      "#1A56DB",
  "background_color": "#FFFFFF",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

### 3.3 src/components

**Rule:** Components are pure UI — they receive props, render JSX, emit events. Zero direct API calls. Zero page-routing logic. Zero business logic.

#### `components/common/` — Shared Across All Portals

| File | What It Renders | Key Props |
|---|---|---|
| `ErrorBoundary.jsx` | Crash fallback UI with "Refresh" button | `children` |
| `FullScreenLoader.jsx` | Full-page loading spinner (used during session check) | `message?` |
| `PageLoader.jsx` | Inline section loader (skeleton-style) | `rows?` |
| `Modal.jsx` | Reusable overlay modal with backdrop | `isOpen`, `onClose`, `title`, `children` |
| `ConfirmDialog.jsx` | "Are you sure?" confirmation modal | `isOpen`, `onConfirm`, `onCancel`, `message` |
| `Toast.jsx` | Top-right notification snackbar | `type` (success/error/warning), `message` |
| `SOSButton.jsx` | Persistent red SOS button (fixed position) | `phoneNumber` (defaults to "108") |
| `RiskBadge.jsx` | Colored risk level pill (RED/YELLOW/GREEN) | `level`, `showLabel?` |
| `Avatar.jsx` | User avatar with initials fallback | `name`, `imageUrl?`, `size?` |
| `Badge.jsx` | Generic color badge | `color`, `children` |
| `Button.jsx` | Styled button with variants | `variant` (primary/secondary/danger/ghost), `loading?`, `disabled?` |
| `Input.jsx` | Form input with label + error display | `label`, `error?`, `...inputProps` |
| `Select.jsx` | Styled dropdown | `label`, `options`, `error?` |
| `Textarea.jsx` | Multiline text input | `label`, `rows?`, `error?` |
| `Card.jsx` | Container with shadow and border | `className?`, `children` |
| `Divider.jsx` | Horizontal rule with optional label | `label?` |
| `EmptyState.jsx` | "No data yet" placeholder with icon | `icon?`, `title`, `description`, `action?` |
| `Pagination.jsx` | Next/Prev + page number controls | `currentPage`, `totalPages`, `onPageChange` |
| `SearchBar.jsx` | Debounced search input | `onSearch`, `placeholder?` |
| `StatusPill.jsx` | Appointment/consultation status label | `status` (confirmed/completed/cancelled etc.) |
| `Tooltip.jsx` | Hover tooltip wrapper | `text`, `children` |

#### `components/auth/`

| File | What It Renders |
|---|---|
| `SignupForm.jsx` | Registration form: firstName, lastName, email, password, role selector, city |
| `LoginForm.jsx` | Login form: email, password, "Forgot password?" link |
| `OTPInput.jsx` | 6-box OTP entry grid (auto-advance on digit entry) |
| `ForgotPasswordForm.jsx` | Email-only form to trigger OTP for password reset |
| `ResetPasswordForm.jsx` | New password + confirm password with strength bar |
| `PasswordStrengthBar.jsx` | Visual 4-segment strength indicator (Weak/Fair/Good/Strong) |

#### `components/patient/`

| File | What It Renders |
|---|---|
| `ChatBubble.jsx` | Single chat message bubble (user or AI) with timestamp |
| `ChatInputBar.jsx` | Text input + voice mic button + send button bar |
| `DoctorCard.jsx` | Doctor search result card: name, specialty, rating, city, "Book" CTA |
| `DoctorSearchFilters.jsx` | Filter panel: specialty, city, language, date pickers |
| `SlotPicker.jsx` | Time slot grid for appointment booking |
| `AppointmentCard.jsx` | Summary card for an appointment with status and actions |
| `AppointmentStatusBadge.jsx` | Colored badge for appointment lifecycle status |
| `HospitalMapPin.jsx` | Leaflet custom pin popup: name, distance, wait time, rating |
| `HospitalCard.jsx` | List-view hospital card with "Directions" and "Book" actions |
| `PrescriptionCard.jsx` | Prescription summary with "Download PDF" button |
| `MedicalHistoryItem.jsx` | Single history record row with date, doctor, diagnosis |
| `TranscriptLine.jsx` | One line of live transcript: speaker label + text + translation |
| `LanguageSelector.jsx` | Dropdown to select patient language for consultation |
| `RiskAlertModal.jsx` | Full-screen RED/YELLOW risk alert with SOS button |
| `MedicationReminderCard.jsx` | Reminder card: drug, dose, next alarm time, toggle |
| `ConsentModal.jsx` | Transcription consent checkbox modal before consultation |

#### `components/doctor/`

| File | What It Renders |
|---|---|
| `PatientQueueItem.jsx` | Single queue row: patient name, time, risk badge, "Start" button |
| `PatientRiskTag.jsx` | Red/Yellow/Green tag chip inline in queue |
| `ConsultationTranscriptLine.jsx` | Doctor-view transcript line with original + translation |
| `SOAPNoteEditor.jsx` | Full SOAP note editing form with all 4 sections |
| `SOAPSection.jsx` | Single collapsible S/O/A/P section with editable fields |
| `PrescriptionRow.jsx` | One medication row: drug, dose, frequency, duration, instructions |
| `AddMedicationRow.jsx` | "+ Add Medication" row button that appends new PrescriptionRow |
| `DoctorStatusToggle.jsx` | Available / Busy / On Leave toggle switch |
| `ScheduleCalendar.jsx` | Monthly calendar view for appointment management |
| `CalendarDayCell.jsx` | Single calendar day cell: date, count, appointment dots |
| `BlockDateModal.jsx` | Modal to block a date range (holiday/leave) |
| `AnalyticsChart.jsx` | Chart.js bar chart wrapper for weekly patient counts |
| `RiskTrendChart.jsx` | Stacked bar chart: RED/YELLOW/GREEN counts over weeks |
| `TopDiagnosesChart.jsx` | Horizontal bar chart: top 5 diagnoses |
| `AIAssistantBubble.jsx` | Doctor AI response bubble with confidence + disclaimer |
| `PatientHistoryAccordion.jsx` | Collapsible past consultation record for a patient |

#### `components/admin/`

| File | What It Renders |
|---|---|
| `UserTableRow.jsx` | Single user row in admin table with role, status, action menu |
| `UserRoleBadge.jsx` | Color-coded role chip (Patient/Doctor/Admin) |
| `UserActionMenu.jsx` | Dropdown: View / Verify Doctor / Deactivate / Ban |
| `SecurityLogItem.jsx` | Single security event row: type, IP, timestamp, severity |
| `SecuritySeverityBadge.jsx` | Colored badge: LOW/MEDIUM/HIGH/CRITICAL |
| `StatCard.jsx` | Dashboard metric card: icon, label, big number |
| `DoctorVerifyModal.jsx` | Confirm modal to mark a doctor as verified |

---

### 3.4 src/pages

**Rule:** Pages orchestrate — they call services, manage page-level state, compose components. Pages are the only files that call API services directly.

#### `pages/auth/`

| File | Route | What It Does |
|---|---|---|
| `SignupPage.jsx` | `/signup` | Renders `SignupForm`, calls `authService.signup()`, redirects to OTP page |
| `LoginPage.jsx` | `/login` | Renders `LoginForm`, calls `authService.login()`, redirects by role |
| `OTPVerifyPage.jsx` | `/verify-otp` | Renders `OTPInput`, calls `authService.verifyOTP()`, resend countdown |
| `ForgotPasswordPage.jsx` | `/forgot-password` | Renders `ForgotPasswordForm`, calls `authService.forgotPassword()` |
| `ResetPasswordPage.jsx` | `/reset-password` | Renders `ResetPasswordForm`, calls `authService.resetPassword()` |

#### `pages/patient/`

| File | Route | What It Does |
|---|---|---|
| `PatientDashboard.jsx` | `/patient` | Stats overview: upcoming appointments, active reminders, risk level |
| `ChatbotPage.jsx` | `/patient/chat` | AI chatbot with chat history, voice input, risk alert integration |
| `AppointmentListPage.jsx` | `/patient/appointments` | Paginated list of past + upcoming appointments |
| `BookAppointmentPage.jsx` | `/patient/book/:doctorId` | Doctor profile + slot picker + booking confirmation |
| `HospitalFinderPage.jsx` | `/patient/hospitals` | Leaflet map + hospital list + GPS permission flow |
| `MedicalHistoryPage.jsx` | `/patient/history` | Timeline of all consultations, searchable/filterable |
| `ConsultationDetailPage.jsx` | `/patient/history/:id` | Full consultation: transcript + SOAP + prescription |
| `PrescriptionListPage.jsx` | `/patient/prescriptions` | All prescriptions with download buttons |
| `PrescriptionDetailPage.jsx` | `/patient/prescriptions/:id` | Full prescription detail + download PDF |
| `LiveTranscriptPage.jsx` | `/patient/consultation/:id/live` | Real-time STT + translation + SOS + consent flow |
| `RemindersPage.jsx` | `/patient/reminders` | Active medication reminders with time edit + delete |

#### `pages/doctor/`

| File | Route | What It Does |
|---|---|---|
| `DoctorDashboard.jsx` | `/doctor` | Queue summary, stats cards, status toggle, upcoming appointments |
| `PatientQueuePage.jsx` | `/doctor/queue` | Full ordered queue with risk tags, start consultation button |
| `ConsultationPanelPage.jsx` | `/doctor/consultation/:id/live` | Live transcript panel + language selector + end consultation |
| `ClinicalNotesPage.jsx` | `/doctor/consultation/:id/notes` | AI SOAP draft + full edit + confirm + link to prescription |
| `PrescriptionBuilderPage.jsx` | `/doctor/prescription/:id/edit` | Pre-filled prescription form + save + send to patient |
| `PatientHistoryPage.jsx` | `/doctor/patients/:id/history` | Scoped patient history (this doctor's records only) |
| `AIAssistantPage.jsx` | `/doctor/assistant` | Clinical QA chatbot for drug interactions, dosage guidance |
| `ScheduleManagerPage.jsx` | `/doctor/schedule` | Calendar + slot management + block dates + availability |
| `AnalyticsPage.jsx` | `/doctor/analytics` | Weekly/monthly charts + top diagnoses + risk trends |

#### `pages/admin/`

| File | Route | What It Does |
|---|---|---|
| `AdminDashboard.jsx` | `/admin` | Stat cards: total users, doctors, patients, consultations |
| `UserManagementPage.jsx` | `/admin/users` | Filterable/sortable user table with actions |
| `UserDetailPage.jsx` | `/admin/users/:id` | Full user profile + activity + action buttons |
| `SecurityMonitorPage.jsx` | `/admin/security` | Live security feed + force logout + ban controls |

---

### 3.5 src/layouts

**Rule:** Layouts provide the persistent shell (sidebar, navbar, footer) for each portal. They wrap `<Outlet />` for nested routes.

| File | Portal | What It Contains |
|---|---|---|
| `PatientLayout.jsx` | Patient | Top navbar, bottom nav (mobile), sidebar (desktop), `<SOSButton />` fixed |
| `DoctorLayout.jsx` | Doctor | Sidebar with nav items, patient queue badge, status indicator |
| `AdminLayout.jsx` | Admin | Sidebar with admin nav, security alert bell |
| `AuthLayout.jsx` | Auth pages | Centered card, logo, no nav/sidebar |

```
PatientLayout structure (mobile):
┌────────────────────────────┐
│  🎙️ MediVoice  [Bell] [👤] │  ← Top navbar
├────────────────────────────┤
│                            │
│      <Outlet />            │  ← Page renders here
│                            │
│                    [🚨 SOS] │  ← Fixed bottom-right
├────────────────────────────┤
│ 🏠  📅  🏥  📋  💊        │  ← Bottom nav (mobile only)
└────────────────────────────┘
```

---

### 3.6 src/hooks

**Rule:** Hooks extract reusable stateful logic from components. No API calls in hooks — those belong in `/services`.

| File | What It Provides | Used By |
|---|---|---|
| `useSpeechRecognition.js` | `{ isListening, transcript, interimText, startListening, stopListening, resetTranscript, isSupported }` | `LiveTranscriptPage`, `ConsultationPanelPage`, `ChatbotPage` |
| `useTextToSpeech.js` | `{ speak(text, lang), stop, isSupported }` | `LiveTranscriptPage`, `ConsultationPanelPage` |
| `useTranslation.js` | `{ translate(text, from, to), isTranslating, error }` | `LiveTranscriptPage`, `ConsultationPanelPage` |
| `useSocket.js` | `{ socket, connected, joinRoom, leaveRoom }` | `LiveTranscriptPage`, `ConsultationPanelPage` |
| `useNotifications.js` | `{ requestPermission, scheduleReminder, sendNow }` | `RemindersPage`, `NotificationContext` |
| `useDebounce.js` | `debouncedValue` — delays value by N ms | `SearchBar`, `DoctorSearchFilters` |
| `useLocalStorage.js` | `[value, setValue]` — persists in localStorage | `LanguageSelector` (remember preference) |
| `useGeolocation.js` | `{ coords, loading, error, requestLocation }` | `HospitalFinderPage` |
| `useClickOutside.js` | Calls callback when click is outside ref element | `Modal`, `UserActionMenu` |
| `usePagination.js` | `{ page, setPage, totalPages, from, to }` | `AppointmentListPage`, `UserManagementPage` |

---

### 3.7 src/context

| File | Global State It Manages | Consumers |
|---|---|---|
| `AuthContext.jsx` | `user`, `loading`, `login()`, `logout()` — current authenticated user | `App.jsx`, `PrivateRoute`, all pages (via `useContext`) |
| `NotificationContext.jsx` | `notifications[]`, `addNotification()`, `clearNotification()` — in-app toast queue | `Toast.jsx`, all pages that trigger notifications |

---

### 3.8 src/services

**Rule:** Every function here is an Axios call to the backend. One file per backend route group. No business logic here — just HTTP.

| File | Functions | Corresponding API Routes |
|---|---|---|
| `authService.js` | `signup()`, `verifyOTP()`, `resendOTP()`, `login()`, `logout()`, `getMe()`, `forgotPassword()`, `resetPassword()` | `/api/v1/auth/*` |
| `patientService.js` | `getProfile()`, `updateProfile()`, `getChatHistory()`, `sendChatMessage()`, `getNearbyHospitals()` | `/api/v1/patients/*` |
| `doctorService.js` | `searchDoctors()`, `getDoctorProfile()`, `getAvailableSlots()`, `updateMyProfile()`, `setStatus()`, `getQueue()`, `getAnalytics()`, `queryAIAssistant()`, `updateAvailability()` | `/api/v1/doctors/*` |
| `appointmentService.js` | `bookAppointment()`, `getAppointments()`, `getAppointment()`, `cancelAppointment()`, `updateAppointmentStatus()` | `/api/v1/patients/appointments` + `/api/v1/doctors/me/appointments` |
| `consultationService.js` | `getConsultations()`, `getConsultation()`, `getTranscript()`, `generateSOAPNotes()`, `confirmSOAPNote()`, `createConsultation()` | `/api/v1/patients/consultations/*` + `/api/v1/doctors/me/consultations/*` |
| `prescriptionService.js` | `getPrescriptions()`, `getPrescription()`, `createPrescription()`, `editPrescription()` | `/api/v1/patients/prescriptions` + `/api/v1/doctors/me/prescriptions` |
| `reminderService.js` | `getReminders()`, `updateReminder()`, `deleteReminder()` | `/api/v1/patients/reminders/*` |
| `adminService.js` | `getStats()`, `getUsers()`, `getUser()`, `deactivateUser()`, `reactivateUser()`, `banUser()`, `verifyDoctor()`, `getSecurityLogs()`, `forceLogout()` | `/api/v1/admin/*` |

```javascript
// Example: authService.js structure
import axios from './axiosConfig';

export const authService = {
  signup:          (data)        => axios.post('/auth/signup', data),
  verifyOTP:       (data)        => axios.post('/auth/verify-otp', data),
  resendOTP:       (email)       => axios.post('/auth/resend-otp', { email }),
  login:           (credentials) => axios.post('/auth/login', credentials),
  logout:          ()            => axios.post('/auth/logout'),
  getMe:           ()            => axios.get('/auth/me'),
  forgotPassword:  (email)       => axios.post('/auth/forgot-password', { email }),
  resetPassword:   (data)        => axios.post('/auth/reset-password', data),
};
```

---

### 3.9 src/utils

**Rule:** Pure functions only. No React, no Axios, no side effects. Testable in isolation with Jest.

| File | What It Contains |
|---|---|
| `axiosConfig.js` | `axios` instance with `baseURL`, `withCredentials: true`, 401 interceptor → auto-logout |
| `pdfGenerator.js` | `downloadPrescriptionPDF(prescriptionData)`, `downloadTranscriptPDF(transcriptData)` — jsPDF + html2canvas |
| `pushNotifications.js` | `requestPermission()`, `scheduleLocalReminder(reminder, delayMs)`, `cancelReminder(id)` |
| `dateHelpers.js` | `formatDate(date)`, `formatTime(date)`, `getRelativeTime(date)`, `isToday(date)`, `addMinutes(date, n)` |
| `validators.js` | `isValidEmail(email)`, `isStrongPassword(pw)`, `isValidPhone(phone)`, `isValidOTP(code)` |
| `formatters.js` | `formatDoctorName(doctor)`, `formatAppointmentTime(appt)`, `formatRiskLevel(level)`, `capitalizeFirst(str)` |
| `storageHelpers.js` | `getItem(key)`, `setItem(key, value)`, `removeItem(key)` — safe localStorage wrapper |

---

### 3.10 src/constants

**Rule:** Static configuration that never changes at runtime. No functions, no logic — just exported objects and arrays.

| File | Exports | Used By |
|---|---|---|
| `languages.js` | `SUPPORTED_LANGUAGES` array with `{ code, bcp47, label, nativeName }` | `LanguageSelector`, chatbot, WebSocket hooks |
| `cities.js` | `PHASE1_CITIES` array: 8 city names + display labels | `SignupForm`, `DoctorSearchFilters`, `HospitalFinder` |
| `specialties.js` | `DOCTOR_SPECIALTIES` array: 20+ medical specialties | `SignupForm` (doctor), `DoctorSearchFilters`, chatbot |
| `riskLevels.js` | `RISK_LEVELS` object: `{ RED, YELLOW, GREEN }` with label, color, icon | `RiskBadge`, `PatientRiskTag`, `RiskAlertModal` |
| `appointmentStatuses.js` | `APPOINTMENT_STATUS` object with all lifecycle states and display labels | `StatusPill`, `AppointmentCard` |
| `routes.js` | `ROUTES` object: all frontend route path constants | `App.jsx`, `PrivateRoute`, all redirect calls |

```javascript
// constants/languages.js
export const SUPPORTED_LANGUAGES = [
  { code: 'hi', bcp47: 'hi-IN', label: 'Hindi',     nativeName: 'हिन्दी'    },
  { code: 'ta', bcp47: 'ta-IN', label: 'Tamil',     nativeName: 'தமிழ்'    },
  { code: 'te', bcp47: 'te-IN', label: 'Telugu',    nativeName: 'తెలుగు'   },
  { code: 'ml', bcp47: 'ml-IN', label: 'Malayalam', nativeName: 'മലയാളം'  },
  { code: 'kn', bcp47: 'kn-IN', label: 'Kannada',   nativeName: 'ಕನ್ನಡ'   },
  { code: 'bn', bcp47: 'bn-IN', label: 'Bengali',   nativeName: 'বাংলা'    },
];

// constants/riskLevels.js
export const RISK_LEVELS = {
  RED:    { label: 'CRITICAL', color: '#DC2626', bg: '#FEE2E2', icon: '🔴' },
  YELLOW: { label: 'MODERATE', color: '#D97706', bg: '#FEF3C7', icon: '🟡' },
  GREEN:  { label: 'STABLE',   color: '#059669', bg: '#D1FAE5', icon: '🟢' },
};
```

---

### 3.11 src/assets

| Folder/File | Purpose |
|---|---|
| `images/logo.svg` | Primary MediVoice AI logo (dark version) |
| `images/logo-white.svg` | White logo for dark backgrounds (sidebar, modals) |
| `images/hero-illustration.svg` | Landing page hero graphic |
| `images/empty-state.svg` | Generic empty state illustration |
| `icons/pill-icon.png` | Used in browser push notification icon for medication reminders |
| `icons/sos-icon.svg` | SOS button icon |

---

## 4. Server — Complete Breakdown

### Complete Server Tree

```
server/
│
├── config/                           ← App-wide configuration modules
│   ├── db.js                         ← MongoDB Atlas connection + pooling
│   └── mailer.js                     ← Nodemailer Gmail SMTP transporter
│
├── controllers/                      ← HTTP handlers (thin — no business logic)
│   ├── authController.js
│   ├── patientController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   ├── consultationController.js
│   └── adminController.js
│
├── services/                         ← Business logic (thick — all the work)
│   ├── authService.js
│   ├── otpService.js
│   ├── userService.js
│   ├── appointmentService.js
│   ├── consultationService.js
│   ├── prescriptionService.js
│   ├── reminderService.js
│   ├── analyticsService.js
│   ├── hospitalService.js
│   │
│   └── ai/                           ← All 12 AI components isolated here
│       ├── nerService.js             ← AI-04: Hugging Face Medical NER
│       ├── nerCache.js               ← node-cache wrapper for NER results
│       ├── translateService.js       ← AI-02: LibreTranslate + MyMemory fallback
│       ├── chatbotService.js         ← AI-05: Patient chatbot NLU engine
│       ├── riskService.js            ← AI-06: Risk detection (keyword + NER)
│       ├── soapService.js            ← AI-07: SOAP note generator from transcript
│       ├── doctorQAService.js        ← AI-08: Clinical QA (RoBERTa model)
│       ├── prescriptionPrefillService.js  ← AI-09: Pre-fill from SOAP note
│       ├── riskClassifierService.js  ← AI-11: Patient queue risk tag
│       └── analyticsIntelligence.js  ← AI-12: MongoDB aggregation + insights
│
├── middleware/                       ← Express middleware functions
│   ├── authMiddleware.js             ← JWT verify + roleGuard factory
│   ├── rateLimiter.js                ← Multiple rate limit configs
│   ├── validate.js                   ← express-validator error collector
│   └── errorHandler.js               ← AppError class + global error handler
│
├── models/                           ← Mongoose schemas + models
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
├── routes/                           ← Express Router definitions
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   └── adminRoutes.js
│
├── websocket/                        ← socket.io event handlers
│   ├── transcriptSocket.js           ← Real-time consultation + translation
│   └── notificationSocket.js        ← Per-user push notification delivery
│
├── validators/                       ← express-validator rule sets per route
│   ├── authValidators.js
│   ├── patientValidators.js
│   ├── doctorValidators.js
│   └── appointmentValidators.js
│
├── utils/                            ← Pure server-side helpers
│   ├── responseHelper.js             ← sendSuccess(), sendError() shorthand
│   ├── dateUtils.js                  ← Server-side date manipulation
│   ├── tokenUtils.js                 ← JWT generate, verify, hash helpers
│   └── logger.js                     ← Structured console logger with levels
│
├── seed/                             ← One-time database seed scripts
│   ├── doctorSeed.js                 ← Seed 8 cities × specialties with doctors
│   └── adminSeed.js                  ← Create first admin account
│
├── app.js                            ← Express app setup (middleware + routes)
├── server.js                         ← HTTP + socket.io server (entry point)
├── .env                              ← Server environment vars (gitignored)
├── .env.example                      ← Template (committed)
├── .eslintrc.json                    ← Server-specific ESLint rules
└── package.json                      ← Server dependencies + scripts
```

---

### 4.1 Server Root Files

| File | Purpose | Key Contents |
|---|---|---|
| `app.js` | Express application factory | All middleware, all routes, error handler — **no** `listen()` call |
| `server.js` | Process entry point | Creates HTTP server, attaches socket.io, calls `app.listen()` |
| `package.json` | Server dependencies | `start`, `dev` (nodemon), `lint`, `test`, `seed` scripts |

```javascript
// server/server.js — entry point
const http      = require('http');
const { Server } = require('socket.io');
const app       = require('./app');
const { setupTranscriptSocket }    = require('./websocket/transcriptSocket');
const { setupNotificationSocket }  = require('./websocket/notificationSocket');
require('./config/db');                   // Connect to MongoDB on startup

const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:      process.env.CLIENT_URL,
    credentials: true,
  },
});

setupTranscriptSocket(io);
setupNotificationSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 MediVoice API running on port ${PORT}`);
});
```

---

### 4.2 config/

| File | Purpose | Key Contents |
|---|---|---|
| `db.js` | MongoDB Atlas connection | `mongoose.connect()`, connection events, pool size 5 |
| `mailer.js` | Nodemailer transporter | Gmail SMTP setup with app password, `sendMail()` wrapper |

```javascript
// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize:     5,       // Free Atlas M0: max 500, we use 5
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () =>
  console.warn('⚠️  MongoDB disconnected. Retrying...')
);

module.exports = connectDB;
```

---

### 4.3 controllers/

**Rule:** A controller function does exactly 3 things: (1) extract and validate request data, (2) call the appropriate service, (3) return the response. Zero business logic.

| File | Functions | Calls Service |
|---|---|---|
| `authController.js` | `signup`, `verifyOTP`, `resendOTP`, `login`, `logout`, `getMe`, `forgotPassword`, `resetPassword`, `refresh` | `authService`, `otpService` |
| `patientController.js` | `getProfile`, `updateProfile`, `sendChatMessage`, `getChatHistory`, `getNearbyHospitals` | `userService`, `chatbotService`, `hospitalService` |
| `doctorController.js` | `searchDoctors`, `getDoctorProfile`, `getAvailableSlots`, `getMyProfile`, `updateMyProfile`, `setStatus`, `getMyQueue`, `getPatientHistory`, `generateNotes`, `confirmNotes`, `createPrescription`, `queryAIAssistant`, `getAnalytics`, `updateAvailability` | `userService`, `appointmentService`, `consultationService`, `prescriptionService`, `soapService`, `doctorQAService`, `analyticsService` |
| `appointmentController.js` | `bookAppointment`, `getAppointments`, `getAppointment`, `cancelAppointment`, `updateStatus` | `appointmentService`, `riskClassifierService` |
| `consultationController.js` | `createConsultation`, `getConsultations`, `getConsultation`, `getTranscript`, `endConsultation` | `consultationService`, `soapService`, `prescriptionPrefillService` |
| `adminController.js` | `getStats`, `getUsers`, `getUser`, `deactivateUser`, `reactivateUser`, `banUser`, `verifyDoctor`, `getSecurityLogs`, `forceLogout` | `userService`, `appointmentService` |

---

### 4.4 services/

| File | Responsibility | Models Used |
|---|---|---|
| `authService.js` | Signup, login, session management, single-session enforcement | `User`, `SecurityLog` |
| `otpService.js` | OTP generation (6-digit), bcrypt hashing, email delivery, verification, attempt tracking | `OTP`, `User` |
| `userService.js` | Profile CRUD for all roles, admin user management actions | `User`, `Patient`, `Doctor` |
| `appointmentService.js` | Booking logic, slot conflict checks, status updates, reschedule history | `Appointment`, `Doctor` |
| `consultationService.js` | Create/end consultation, transcript assembly, link prescription | `Consultation`, `Appointment` |
| `prescriptionService.js` | Create/edit prescription, link to consultation, trigger reminder generation | `Prescription`, `Reminder` |
| `reminderService.js` | Parse medication frequency/duration, build reminder schedule objects | `Reminder` |
| `analyticsService.js` | MongoDB aggregation pipelines: weekly counts, top diagnoses, risk trends | `Consultation`, `Appointment` |
| `hospitalService.js` | Call Overpass API with patient lat/lng, parse hospital data, cache results | External (Overpass API) |

---

### 4.5 services/ai/

Every AI service follows the same pattern: **primary AI API → fallback → error** — the platform never crashes due to AI unavailability.

| File | AI Component | Primary | Fallback |
|---|---|---|---|
| `nerService.js` | AI-04 · Medical NER | Hugging Face `d4data/biomedical-ner-all` | `keywordFallbackNER()` in same file |
| `nerCache.js` | NER cache layer | `node-cache` (in-memory, 1hr TTL) | Pass-through if cache miss |
| `translateService.js` | AI-02 · Translation | LibreTranslate public API | MyMemory API |
| `chatbotService.js` | AI-05 · Patient chatbot | NER pipeline + rule engine | Keyword intent + static responses |
| `riskService.js` | AI-06 · Risk detection | Regex keyword layer + NER confirm | Keyword-only if NER unavailable |
| `soapService.js` | AI-07 · SOAP generator | NER on transcript + template engine | Template with empty fields (doctor fills) |
| `doctorQAService.js` | AI-08 · Doctor QA | Hugging Face `deepset/roberta-base-squad2` | Local keyword answer map |
| `prescriptionPrefillService.js` | AI-09 · Rx pre-fill | SOAP note entities + drug reference map | Empty form fields (no fabrication) |
| `riskClassifierService.js` | AI-11 · Queue risk tag | `riskService.assessRiskLevel()` | GREEN by default (safe fallback) |
| `analyticsIntelligence.js` | AI-12 · Analytics | MongoDB aggregation pipelines | Empty charts (no external API needed) |

---

### 4.6 middleware/

| File | Exports | Applied At |
|---|---|---|
| `authMiddleware.js` | `authMiddleware` (verify JWT + session), `roleGuard(...roles)` (check role) | Per route — not global |
| `rateLimiter.js` | `globalLimiter` (100/15min), `authLimiter` (5/15min), `aiLimiter` (30/15min) | `app.js` (global), `authRoutes.js`, AI routes |
| `validate.js` | `validateRequest` — runs express-validator, collects errors, returns 400 | After each validator array in routes |
| `errorHandler.js` | `AppError` class, `globalErrorHandler` function | `app.js` as last middleware |

```javascript
// middleware/rateLimiter.js — all rate limit configurations
const rateLimit = require('express-rate-limit');

const makeLimit = (max, windowMinutes, message) =>
  rateLimit({
    windowMs:        windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders:   false,
    message:         { success: false, error: { code: 'RATE_LIMIT', message } },
  });

module.exports = {
  globalLimiter: makeLimit(100, 15, 'Too many requests. Please wait.'),
  authLimiter:   makeLimit(5,   15, 'Too many auth attempts. Please wait 15 minutes.'),
  aiLimiter:     makeLimit(30,  15, 'AI request limit reached. Please wait.'),
  otpLimiter:    makeLimit(3,   60, 'Too many OTP requests. Please wait 1 hour.'),
};
```

---

### 4.7 models/

| File | Collection Name | Key Fields | Special Indexes |
|---|---|---|---|
| `User.js` | `users` | email, password (hashed), role, isVerified, failedLoginAttempts, lockoutUntil | Unique: email |
| `Patient.js` | `patients` | userId ref, dateOfBirth, gender, allergies, chronicConditions, currentRiskLevel | Unique: userId |
| `Doctor.js` | `doctors` | userId ref, specialty, availability, rating, isVerified, languagesSpoken | Compound: specialty+city+isVerified |
| `Appointment.js` | `appointments` | patientId, doctorId, scheduledAt, status, chiefComplaint, patientRiskLevel | Compound: doctorId+scheduledAt, patientId+scheduledAt |
| `Consultation.js` | `consultations` | appointmentId, transcript[], soapNote{}, status, patientConsentGiven | Compound: patientId+createdAt, doctorId+createdAt |
| `Prescription.js` | `prescriptions` | consultationId, medications[], diagnosis, doctorSnapshot{}, patientSnapshot{} | Single: consultationId, patientId |
| `Reminder.js` | `reminders` | patientId, prescriptionId, drugName, scheduledTime, daysRemaining, active | Compound: patientId+active |
| `OTP.js` | `otps` | email, code (hashed), type, expiresAt, isUsed | TTL on expiresAt (auto-delete at expiry) |
| `SecurityLog.js` | `securitylogs` | userId, eventType, ipAddress, severity, createdAt | TTL on createdAt (auto-delete after 90 days) |

---

### 4.8 routes/

**Rule:** Routes are mapping only — URL + HTTP method + middleware chain + controller function. No logic.

```javascript
// routes/authRoutes.js — complete structure example
const router = require('express').Router();
const {
  signup, verifyOTP, resendOTP, login, logout,
  getMe, forgotPassword, resetPassword
}                     = require('../controllers/authController');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const { validateRequest }         = require('../middleware/validate');
const { authMiddleware }          = require('../middleware/authMiddleware');
const {
  signupValidator, loginValidator,
  otpValidator, resetPasswordValidator
}                     = require('../validators/authValidators');

router.post('/signup',           signupValidator,          validateRequest, signup);
router.post('/verify-otp',       otpLimiter, otpValidator, validateRequest, verifyOTP);
router.post('/resend-otp',       otpLimiter,                                resendOTP);
router.post('/login',            authLimiter, loginValidator, validateRequest, login);
router.post('/logout',           authMiddleware,                             logout);
router.get('/me',                authMiddleware,                             getMe);
router.post('/forgot-password',  authLimiter,                               forgotPassword);
router.post('/reset-password',   resetPasswordValidator, validateRequest,   resetPassword);

module.exports = router;
```

| File | Route Prefix | Middleware Pattern |
|---|---|---|
| `authRoutes.js` | `/api/v1/auth` | `authLimiter` + validators → controller |
| `patientRoutes.js` | `/api/v1/patients` | `authMiddleware` + `roleGuard('patient')` + validators → controller |
| `doctorRoutes.js` | `/api/v1/doctors` | Public search routes (no auth) + `authMiddleware` + `roleGuard('doctor')` for `/me/*` |
| `adminRoutes.js` | `/api/v1/admin` | `authMiddleware` + `roleGuard('admin')` → all controllers |

---

### 4.9 websocket/

| File | Events Handled | Key Logic |
|---|---|---|
| `transcriptSocket.js` | `join:consultation`, `transcript:patient`, `transcript:doctor`, `consultation:save`, `consultation:end` | Real-time translation via `translateService`, NER risk check, room broadcast |
| `notificationSocket.js` | `join:notifications`, internal `emit:notification` | Per-user room, delivers appointment reminders, prescription ready, risk alerts |

---

### 4.10 seed/

| File | What It Seeds | When to Run |
|---|---|---|
| `doctorSeed.js` | ~40 doctors across 8 cities × 5 specialties (General Physician, Cardiologist, Neurologist, Orthopedist, Dermatologist). Creates associated User + Doctor documents. | Once: `npm run seed` before first test |
| `adminSeed.js` | One admin account: `admin@medivoice.ai` / `Admin@2026` — **change immediately in production** | Once: `npm run seed:admin` |

```javascript
// How to run seeds
// package.json scripts:
{
  "seed":       "node seed/doctorSeed.js",
  "seed:admin": "node seed/adminSeed.js",
  "seed:all":   "node seed/adminSeed.js && node seed/doctorSeed.js"
}
```

---

### 4.11 validators/

**Rule:** Validators use `express-validator` chain. One file per route group. Controllers never check input format — that is 100% validators' job.

| File | Validates |
|---|---|
| `authValidators.js` | `signupValidator` (email format, password strength, role enum), `loginValidator` (email required, password required), `otpValidator` (6 digits exactly), `resetPasswordValidator` (password match + strength) |
| `patientValidators.js` | Profile update fields, chat message (not empty, max 500 chars) |
| `doctorValidators.js` | Profile update fields, specialty enum, availability hours format |
| `appointmentValidators.js` | `scheduledAt` (future date only), `doctorId` (valid MongoDB ObjectId), `chiefComplaint` (max 300 chars) |

```javascript
// validators/authValidators.js — example
const { body } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

exports.signupValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must be 8+ chars with uppercase, number, and special character'),
  body('role')
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Role must be patient, doctor, or admin'),
  body('city')
    .optional()
    .isIn(['Chennai','Bangalore','Mumbai','Vijayawada','Hyderabad','Delhi','Goa','Puducherry'])
    .withMessage('City must be one of the 8 supported Phase 1 cities'),
];
```

---

### 4.12 utils/

| File | Functions | Used By |
|---|---|---|
| `responseHelper.js` | `sendSuccess(res, data, message, statusCode)`, `sendError(res, message, code, statusCode)` | All controllers |
| `dateUtils.js` | `addMinutes(date, n)`, `isSlotAvailable(date, existingAppts)`, `getSlots(doctor, date)` | `appointmentService.js` |
| `tokenUtils.js` | `generateJWT(payload)`, `verifyJWT(token)`, `hashToken(token)` | `authService.js` |
| `logger.js` | `logger.info()`, `logger.warn()`, `logger.error()` — structured log with timestamp + level | All services, middleware |

```javascript
// utils/responseHelper.js
exports.sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

exports.sendError = (res, message = 'Error', code = 'ERROR', statusCode = 400) =>
  res.status(statusCode).json({ success: false, error: { code, message } });
```

---

## 5. GitHub & DevOps Files

```
.github/
├── workflows/
│   ├── ci.yml          ← Runs on every push and PR
│   └── deploy.yml      ← Runs on merge to main
│
└── PULL_REQUEST_TEMPLATE.md   ← PR checklist (optional)
```

### `.github/workflows/ci.yml`

```yaml
name: CI — Lint, Test, Build

on:
  push:
    branches: ['**']          # All branches
  pull_request:
    branches: [main, develop]

jobs:
  server-test:
    name: Server — Lint + Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - run: cd server && npm ci
      - run: cd server && npm run lint
      - run: cd server && npm test

  client-build:
    name: Client — Lint + Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: cd client && npm ci
      - run: cd client && npm run lint
      - run: cd client && npm run build
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy — Vercel + Render

on:
  push:
    branches: [main]          # Only on main branch merge

jobs:
  notify-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
      # Vercel deploys automatically on push — no step needed
      - run: echo "✅ Render deploy triggered. Vercel deploys automatically."
```

---

## 6. Environment Files

### Root `.gitignore`

```gitignore
# ─── Environment files ────────────────────────────────────────
.env
.env.local
.env.development
.env.staging
.env.production

# ─── Dependencies ─────────────────────────────────────────────
node_modules/
client/node_modules/
server/node_modules/

# ─── Build outputs ────────────────────────────────────────────
client/dist/
client/.vite/

# ─── Logs ─────────────────────────────────────────────────────
*.log
npm-debug.log*
logs/

# ─── OS files ─────────────────────────────────────────────────
.DS_Store
Thumbs.db
.idea/
.vscode/

# ─── Test coverage ────────────────────────────────────────────
coverage/
.nyc_output/
```

### `.env.example` — Complete Template

```env
# ════════════════════════════════════════════════════════════════
# MEDIVOICE AI — Environment Variables Template
# Copy this file to .env and fill in your values.
# NEVER commit .env to Git.
# ════════════════════════════════════════════════════════════════

# ─── SERVER ──────────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── CLIENT URL (for CORS whitelist) ─────────────────────────────────
CLIENT_URL=http://localhost:3000

# ─── MONGODB ATLAS ───────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/medivoice
# Free M0 cluster — Mumbai region recommended (ap-south-1)

# ─── JWT ─────────────────────────────────────────────────────────────
JWT_SECRET=
# Min 32 characters. Generate: node -e "require('crypto').randomBytes(32).toString('hex')"
JWT_EXPIRES_IN=24h

# ─── BCRYPT ──────────────────────────────────────────────────────────
BCRYPT_SALT_ROUNDS=12
BCRYPT_OTP_ROUNDS=8

# ─── EMAIL (Gmail App Password — NOT your normal password) ───────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=
# Setup: Google Account → Security → 2-Step Verification → App Passwords
EMAIL_FROM=MediVoice AI <your.email@gmail.com>

# ─── OTP ─────────────────────────────────────────────────────────────
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3
OTP_RESEND_COOLDOWN_MINUTES=1

# ─── SECURITY ────────────────────────────────────────────────────────
MAX_LOGIN_ATTEMPTS=3
LOCKOUT_DURATION_MINUTES=15

# ─── HUGGING FACE AI (Free tier — no credit card needed) ─────────────
HUGGINGFACE_API_KEY=hf_
# Get: huggingface.co → Settings → Access Tokens → New token (read only)
HF_MODEL_NER=d4data/biomedical-ner-all
HF_MODEL_QA=deepset/roberta-base-squad2
HF_TIMEOUT_MS=8000

# ─── LIBRETRANSLATE (Free public API) ────────────────────────────────
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=
# Leave empty for free public tier (rate-limited to ~20 req/min)
LIBRETRANSLATE_TIMEOUT_MS=3000

# ─── MYMEMORY FALLBACK TRANSLATION ───────────────────────────────────
MYMEMORY_EMAIL=your.email@gmail.com
# Adding email increases free limit from 1000 to 10000 words/day

# ─── NER CACHE ───────────────────────────────────────────────────────
NER_CACHE_TTL_SECONDS=3600
NER_CACHE_MAX_KEYS=500

# ─── CLIENT ENV (.env in /client) ────────────────────────────────────
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

---

## 7. File Naming Conventions

```
┌─────────────────────────────────────────────────────────────────────┐
│                      NAMING CONVENTIONS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  REACT COMPONENTS        → PascalCase.jsx                          │
│  Example: DoctorCard.jsx, RiskAlertModal.jsx                        │
│                                                                     │
│  HOOKS                   → camelCase starting with "use"           │
│  Example: useSpeechRecognition.js, useGeolocation.js                │
│                                                                     │
│  SERVICES (frontend)     → camelCase ending with "Service"         │
│  Example: authService.js, appointmentService.js                     │
│                                                                     │
│  CONTROLLERS (backend)   → camelCase ending with "Controller"      │
│  Example: authController.js, doctorController.js                    │
│                                                                     │
│  SERVICES (backend)      → camelCase ending with "Service"         │
│  Example: otpService.js, consultationService.js                     │
│                                                                     │
│  AI SERVICES             → camelCase ending with "Service"         │
│  Example: nerService.js, riskService.js, soapService.js             │
│                                                                     │
│  MODELS (backend)        → PascalCase singular                     │
│  Example: User.js, Appointment.js, SecurityLog.js                   │
│                                                                     │
│  ROUTES (backend)        → camelCase ending with "Routes"          │
│  Example: authRoutes.js, patientRoutes.js                           │
│                                                                     │
│  MIDDLEWARE              → camelCase ending with "Middleware"      │
│  Example: authMiddleware.js, errorHandler.js                        │
│                                                                     │
│  VALIDATORS              → camelCase ending with "Validators"      │
│  Example: authValidators.js, appointmentValidators.js               │
│                                                                     │
│  CONSTANTS               → camelCase, plural nouns                 │
│  Example: languages.js, cities.js, specialties.js                  │
│                                                                     │
│  UTILS                   → camelCase ending with "Helpers/Utils"   │
│  Example: dateHelpers.js, responseHelper.js, tokenUtils.js          │
│                                                                     │
│  CONFIG FILES            → camelCase, descriptive                  │
│  Example: db.js, mailer.js, axiosConfig.js                          │
│                                                                     │
│  WORKFLOW FILES          → kebab-case                              │
│  Example: ci.yml, deploy.yml                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Import Path Conventions

Using the `@` alias configured in `vite.config.js`:

```javascript
// ✅ CORRECT — use aliases everywhere in /client/src
import DoctorCard         from '@components/patient/DoctorCard';
import { authService }   from '@services/authService';
import useSpeechRecognition from '@hooks/useSpeechRecognition';
import { RISK_LEVELS }   from '@constants/riskLevels';
import { formatDate }    from '@utils/dateHelpers';
import { AuthContext }   from '@context/AuthContext';

// ❌ WRONG — relative paths get confusing 4 levels deep
import DoctorCard from '../../../../components/patient/DoctorCard';

// ─── SERVER SIDE (Node.js — no aliases, use relative) ────────────────────
// ✅ CORRECT — relative paths are fine in small server structure
const nerService    = require('../services/ai/nerService');
const Appointment   = require('../models/Appointment');
const { sendSuccess } = require('../utils/responseHelper');

// ─── IMPORT ORDER CONVENTION (both client and server) ────────────────────
// 1. Node built-ins / external packages
// 2. Internal aliases / relative imports (longest path first)
// 3. Constants and types
// 4. Styles (client only, last)
```

---

## 9. File Responsibility Matrix

Quick reference: what is each file's **only** job?

| File | Single Responsibility | Must NOT Contain |
|---|---|---|
| `AuthContext.jsx` | Hold auth state globally | API calls (use authService), routing |
| `LoginPage.jsx` | Compose login form UI + call authService | Business logic, direct axios calls |
| `LoginForm.jsx` | Render form HTML + local validation state | API calls, navigation |
| `authService.js` (client) | Axios calls to `/api/v1/auth/*` | Business logic, state management |
| `authController.js` | Parse req → call service → send res | DB queries, business logic |
| `authService.js` (server) | Signup/login business logic, session mgmt | HTTP parsing, response formatting |
| `User.js` (model) | Define schema, pre-save hooks, instance methods | Business logic, API calls |
| `authRoutes.js` | Map URLs to middleware chains + controllers | Logic of any kind |
| `authValidators.js` | Define validation rules for auth inputs | Controller logic |
| `authMiddleware.js` | Verify JWT, attach user to req | Business logic |
| `nerService.js` | Call HF API, parse NER response | HTTP controllers, DB operations |
| `nerCache.js` | Cache NER results by input text | NER logic itself |
| `riskLevels.js` | Export static risk level config | Functions, logic |
| `dateHelpers.js` | Pure date manipulation functions | React, Axios, DB |

---

## 10. What Goes Where — Quick Reference

```
I need to add a new UI element that's used in 3+ places
  → /client/src/components/common/

I need a UI element used only in the patient portal
  → /client/src/components/patient/

I need a page with its own URL route
  → /client/src/pages/[role]/

I need reusable logic with React state/effects
  → /client/src/hooks/

I need to call a backend API endpoint
  → /client/src/services/

I need a pure function with no React or side effects
  → /client/src/utils/

I need a static value / array / config object
  → /client/src/constants/

I need to handle an HTTP request on the server
  → /server/controllers/ (thin: parse + call service)

I need business logic / DB query / AI call on server
  → /server/services/ (thick: all the work)

I need an AI component
  → /server/services/ai/

I need input validation rules
  → /server/validators/

I need a database collection
  → /server/models/ (schema + Mongoose model)

I need an Express route definition
  → /server/routes/

I need a WebSocket event handler
  → /server/websocket/

I need a one-time database setup script
  → /server/seed/

I need a shared config (DB, email)
  → /server/config/

I need an environment variable
  → .env (add to .env.example too — always)
```

---

## 11. Files Never to Commit

```
GITIGNORED — Never in version control:
══════════════════════════════════════════════════════════════

/client/.env              ← VITE_API_URL, VITE_SOCKET_URL
/server/.env              ← All secrets: DB URI, JWT secret, HF key, email pass
/.env                     ← Root-level env if used

node_modules/             ← Installed via npm ci in CI/CD
client/dist/              ← Built by Vite — generated, not source
*.log                     ← Runtime logs

SAFE TO COMMIT (no secrets, needed by teammates):
══════════════════════════════════════════════════════════════

.env.example              ← Template with empty values
package.json              ← Dependencies (no secrets)
package-lock.json         ← Locked dependency versions
tailwind.config.js        ← CSS configuration
vite.config.js            ← Build config
.eslintrc.json            ← Linting rules
.prettierrc               ← Formatting rules
.editorconfig             ← Editor settings
.github/workflows/        ← CI/CD pipeline definitions
seed/                     ← Seed scripts (no real data)
```

---

## 12. Folder Growth Guide — Phase 2+

When MediVoice AI grows beyond MVP, here is where new code goes — without breaking the current structure:

```
Phase 2 additions → WHERE they go:
══════════════════════════════════════════════════════════════

Video Consultation (WebRTC)
  client/src/hooks/         → useWebRTC.js
  client/src/components/doctor/ → VideoCallPanel.jsx
  client/src/pages/doctor/  → VideoConsultationPage.jsx
  server/websocket/          → videoSocket.js

Lab Report Upload & OCR
  client/src/components/patient/ → LabReportUploader.jsx
  client/src/pages/patient/  → LabReportsPage.jsx
  server/services/           → labReportService.js
  server/services/ai/        → ocrService.js
  server/models/             → LabReport.js

React Native Mobile App
  /mobile/                   ← New workspace (separate from /client)
  Shared constants: symlink  → /client/src/constants/

Additional Cities (beyond 8)
  client/src/constants/cities.js  → Add city to array (one-line change)
  server/seed/doctorSeed.js        → Add doctor data for new city

New Doctor Specialty
  client/src/constants/specialties.js → Add to array
  services/ai/chatbotService.js        → Add SYMPTOM_TO_SPECIALTY mapping

New Indian Language
  client/src/constants/languages.js   → Add language object
  server/services/ai/translateService.js → Add to LANG_MAP

Payment Gateway
  client/src/pages/patient/ → PaymentPage.jsx
  server/controllers/        → paymentController.js
  server/services/           → paymentService.js
  server/models/             → Transaction.js
  server/routes/             → paymentRoutes.js
```

---

<div align="center">

---

## Structure At A Glance

```
╔══════════════════════════════════════════════════════════════╗
║         MEDIVOICE AI — FILE STRUCTURE SUMMARY               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📁 client/src/                                             ║
║     components/  →  83 UI components across 4 groups       ║
║     pages/       →  24 route-level pages across 4 portals  ║
║     layouts/     →   4 portal shell layouts                 ║
║     hooks/       →  10 custom React hooks                   ║
║     context/     →   2 global state providers               ║
║     services/    →   8 API service files                    ║
║     utils/       →   7 pure utility files                   ║
║     constants/   →   6 static configuration files           ║
║                                                              ║
║  📁 server/                                                 ║
║     controllers/ →   6 thin HTTP handler files              ║
║     services/    →   9 business logic files                 ║
║     services/ai/ →  10 AI component files (all free)        ║
║     middleware/  →   4 Express middleware files              ║
║     models/      →   9 MongoDB schema files                 ║
║     routes/      →   4 Express router files                 ║
║     websocket/   →   2 socket.io handler files              ║
║     validators/  →   4 input validation files               ║
║     utils/       →   4 server utility files                 ║
║     seed/        →   2 database seed scripts                ║
║     config/      →   2 configuration files                  ║
║                                                              ║
║  📁 .github/workflows/  →  2 CI/CD pipeline files           ║
║                                                              ║
║  Total tracked source files:  ~165 files                   ║
║  Total directories:           ~45 directories              ║
╚══════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Folder & File Structure v1.0**

*One file. One job. One reason to exist.*

![React](https://img.shields.io/badge/React-18-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20_LTS-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
