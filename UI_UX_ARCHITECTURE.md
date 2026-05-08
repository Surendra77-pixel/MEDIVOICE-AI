# MediVoice AI - UI/UX Architecture & Requirements

This document outlines the complete list of User Interface (UI) screens and User Experience (UX) flows required for the MediVoice AI platform. All designs should adhere to the **"Clinical Innovation"** design system (Medical Blues, Teals, clean whitespace, and subtle glassmorphism).

---

## 1. Public & Authentication Flow
These are the first touchpoints for any user visiting the platform.

*   [ ] **Landing Page / Home**
    *   **UX Flow:** Introduce the platform's core value (AI translation, SOAP notes). Drive users to sign up or view a demo.
    *   **UI Elements:** Hero section with illustration, Feature cards, Trust badges (HIPAA compliant), Clean navigation bar, Footer.
*   [ ] **Login Screen**
    *   **UX Flow:** Secure entry point. Users enter email/password, with clear error states.
    *   **UI Elements:** Clean form, "Forgot Password" link, Social/SSO login options (optional).
*   [ ] **Registration / Sign Up (Patient & Doctor)**
    *   **UX Flow:** Split flow. Patients provide basic info; Doctors provide medical license, specialty, and clinic details.
    *   **UI Elements:** Multi-step form, Role selection toggle, Document upload UI (for doctors).
*   [ ] **OTP / Email Verification Screen**
    *   **UX Flow:** Verification step post-signup or for password resets.
    *   **UI Elements:** 6-digit input fields, Resend timer, Success/Error alerts.

---

## 2. Patient Portal
The patient experience focuses on ease of use, clear scheduling, and understanding their health data.

*   [ ] **Patient Dashboard (Home)**
    *   **UX Flow:** High-level overview of health. What's next? What to take?
    *   **UI Elements:** Upcoming STT Call card, Medication Reminders checklist, Recent Consultations summary.
*   [ ] **Book Appointment Flow**
    *   **UX Flow:** Search for doctors, select a time slot, provide a chief complaint.
    *   **UI Elements:** Search bar with filters (Specialty, City), Doctor profile cards, Interactive Calendar/Time-slot picker, Confirmation modal.
*   [ ] **My Health Vault (Medical History)**
    *   **UX Flow:** Deep dive into past records.
    *   **UI Elements:** List/Table of past visits. Click to view detailed AI SOAP notes, prescribed medications, and downloadable PDF reports.
*   [ ] **Medication & Reminders Manager**
    *   **UX Flow:** View active prescriptions and manage daily pill reminders.
    *   **UI Elements:** Timeline view of daily meds, toggle switches for active reminders.
*   [ ] **AI Symptom Checker (Chatbot)**
    *   **UX Flow:** Pre-consultation triage. Patient chats with AI, which summarizes risk level for the doctor.
    *   **UI Elements:** Chat interface, Quick-reply bubbles, Risk-level indicator.

---

## 3. Doctor Portal
The doctor experience focuses on efficiency, patient queue management, and reducing documentation overhead.

*   [ ] **Doctor Dashboard (Home)**
    *   **UX Flow:** Command center for the day. Who is next? Are there emergencies?
    *   **UI Elements:** Statistics row (Today's count, Revenue), Urgent AI Alerts (High-risk patients), Today's Patient Queue table.
*   [ ] **Patient Queue & Management**
    *   **UX Flow:** Detailed view of the daily schedule.
    *   **UI Elements:** Drag-and-drop or status-based list (Waiting, In Progress, Completed), Patient mini-profiles.
*   [ ] **Live STT Consultation Room (Core Feature)**
    *   **UX Flow:** The actual telemedicine call. Real-time translation and note-taking.
    *   **UI Elements:** 
        *   Split-screen video feed.
        *   **Live STT Chat Panel:** Scrolling transcript showing original language and translated language.
        *   **Live SOAP Panel:** AI auto-filling Subjective/Objective fields in real-time.
        *   Call controls (Mute, Video, End).
*   [ ] **Post-Consultation & E-Prescription**
    *   **UX Flow:** Reviewing the AI-generated SOAP note, adding a prescription, and finalizing the visit.
    *   **UI Elements:** Editable text areas for SOAP, Form to add drugs (Name, Dose, Frequency), Digital signature, "Send to Patient" button.
*   [ ] **Analytics & Earnings**
    *   **UX Flow:** Tracking practice growth.
    *   **UI Elements:** Charts showing patient volume over 30 days, revenue tracking, patient demographic breakdown.

---

## 4. Admin Portal
The administrative experience focuses on platform health, security, and verification.

*   [ ] **Admin Control Center (Dashboard)**
    *   **UX Flow:** Bird's eye view of platform metrics.
    *   **UI Elements:** Growth charts, Translation accuracy metrics, High-level system alerts.
*   [ ] **Doctor Verification Queue**
    *   **UX Flow:** Reviewing new doctor signups to ensure they are licensed professionals.
    *   **UI Elements:** Table of pending applications. Click to view uploaded credentials, "Approve" (Green) and "Reject" (Red) action buttons.
*   [ ] **User Management**
    *   **UX Flow:** Managing active users, handling bans or lockouts.
    *   **UI Elements:** Searchable user table, Status toggle switches, Role badges.
*   [ ] **Security & Audit Logs**
    *   **UX Flow:** Monitoring for suspicious activity or failed logins.
    *   **UI Elements:** Read-only data table with timestamps, IP addresses, and event types.

---

## 5. Shared UI Components (Design System Essentials)
These are the reusable pieces that make up the pages above.

*   [ ] **Navigation & Menus:** Top Navbar, Collapsible Sidebars.
*   [ ] **Feedback Indicators:** Loading spinners, Skeleton loaders (for data fetching), Toast notifications (Success/Error popups).
*   [ ] **Data Display:** Badges (e.g., Risk Level: High/Low), Avatars, Custom Tables with pagination.
*   [ ] **Forms:** Styled text inputs, dropdowns, date pickers, glassmorphic buttons.
*   [ ] **Modals:** Pop-up dialogs for confirmations (e.g., "Are you sure you want to cancel this appointment?").

---
*Generated by Antigravity for MediVoice AI*
