<div align="center">

# 🏗️ MEDIVOICE AI — System Architecture
### Complete Technical System Design Document

![Document](https://img.shields.io/badge/Document-System%20Architecture-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20AI-purple?style=for-the-badge)
![Cost](https://img.shields.io/badge/Infrastructure-Zero%20Cost-brightgreen?style=for-the-badge)

> **The authoritative reference for how every component of MediVoice AI is designed,
> connected, secured, and deployed — from browser to database to AI pipeline.**

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication  
**Architecture Style:** Modular Monolith → Microservices-ready  
**Research Basis:** ICSADL-2025 — *Automated STT Conversion of Doctor-Patient Dialogues*  
**Constraint:** 100% Free infrastructure · Zero paid services

</div>

---

## 📋 Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [High-Level System Overview](#2-high-level-system-overview)
3. [Layer-by-Layer Architecture](#3-layer-by-layer-architecture)
   - [3.1 Client Layer](#31-client-layer--presentation-tier)
   - [3.2 API Gateway Layer](#32-api-gateway-layer)
   - [3.3 Application / Business Logic Layer](#33-application--business-logic-layer)
   - [3.4 AI Services Layer](#34-ai-services-layer)
   - [3.5 Real-Time Layer](#35-real-time-layer--websocket)
   - [3.6 Data Layer](#36-data-layer--persistence-tier)
   - [3.7 External Services Layer](#37-external-services-layer)
4. [Technology Stack — Complete Reference](#4-technology-stack--complete-reference)
5. [Database Architecture](#5-database-architecture)
   - [5.1 MongoDB Schema Design](#51-mongodb-schema-design)
   - [5.2 All Collection Schemas](#52-all-collection-schemas)
   - [5.3 Database Relationships](#53-database-relationships)
   - [5.4 Indexes](#54-indexes)
6. [API Architecture](#6-api-architecture)
   - [6.1 REST API Design Principles](#61-rest-api-design-principles)
   - [6.2 Complete API Route Map](#62-complete-api-route-map)
   - [6.3 WebSocket Event Map](#63-websocket-event-map)
   - [6.4 Request / Response Contracts](#64-request--response-contracts)
7. [Authentication & Security Architecture](#7-authentication--security-architecture)
   - [7.1 JWT Architecture](#71-jwt-architecture)
   - [7.2 Role-Based Access Control (RBAC)](#72-role-based-access-control-rbac)
   - [7.3 Security Middleware Stack](#73-security-middleware-stack)
   - [7.4 OTP Flow Architecture](#74-otp-flow-architecture)
8. [Frontend Architecture](#8-frontend-architecture)
   - [8.1 Component Hierarchy](#81-component-hierarchy)
   - [8.2 State Management](#82-state-management)
   - [8.3 Routing Architecture](#83-routing-architecture)
   - [8.4 Responsive Design System](#84-responsive-design-system)
9. [AI Pipeline Architecture](#9-ai-pipeline-architecture)
10. [Real-Time Consultation Architecture](#10-real-time-consultation-architecture)
11. [Data Flow Diagrams](#11-data-flow-diagrams)
    - [11.1 User Registration & Auth Flow](#111-user-registration--auth-flow)
    - [11.2 Appointment Booking Flow](#112-appointment-booking-flow)
    - [11.3 Live Consultation Flow](#113-live-consultation-flow)
    - [11.4 Prescription & PDF Flow](#114-prescription--pdf-flow)
12. [Deployment Architecture](#12-deployment-architecture)
    - [12.1 Infrastructure Map](#121-infrastructure-map)
    - [12.2 CI/CD Pipeline](#122-cicd-pipeline)
    - [12.3 Environment Strategy](#123-environment-strategy)
13. [Scalability & Performance Design](#13-scalability--performance-design)
14. [Error Handling Architecture](#14-error-handling-architecture)
15. [Folder Structure — Complete](#15-folder-structure--complete)
16. [Environment Variables — Complete Reference](#16-environment-variables--complete-reference)
17. [Architecture Decision Records (ADRs)](#17-architecture-decision-records-adrs)
18. [Non-Functional Requirements Mapping](#18-non-functional-requirements-mapping)

---

## 1. Architecture Philosophy

MediVoice AI is built on **five architectural principles** that govern every design decision:

```
┌─────────────────────────────────────────────────────────────────────┐
│                   ARCHITECTURAL PRINCIPLES                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. SEPARATION OF CONCERNS                                          │
│     Every layer has one job. Client renders, server orchestrates,   │
│     AI processes, database persists. No bleed-through.              │
│                                                                     │
│  2. FREE-FIRST                                                      │
│     Every tool, service, API, and hosting platform is free.         │
│     Architecture is designed to avoid all paid services.            │
│                                                                     │
│  3. RESILIENT AI                                                    │
│     Every AI component has a fallback. If Hugging Face is down,     │
│     keyword rules run. If LibreTranslate fails, MyMemory activates. │
│     The platform never crashes because of an AI service outage.     │
│                                                                     │
│  4. SECURITY BY DEFAULT                                             │
│     JWT in httpOnly cookies. bcrypt hashing. Rate limiting.         │
│     Role-based middleware on every route. Input sanitization.       │
│                                                                     │
│  5. MOBILE-FIRST RESPONSIVE                                         │
│     Every UI decision starts at 320px and scales up.                │
│     Touch targets, performance, and layout are designed for         │
│     low-end Android devices on 4G networks first.                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. High-Level System Overview

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                        MEDIVOICE AI — SYSTEM OVERVIEW                        ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   USERS                          DEVICES                                      ║
║   ──────                         ───────                                      ║
║   👤 Patient    ──────────────►  📱 Mobile (iOS/Android)                     ║
║   🩺 Doctor     ──────────────►  💻 Laptop / Desktop                         ║
║   🔐 Admin      ──────────────►  📟 Tablet                                   ║
║                                                                               ║
║                           ▼  HTTPS / WSS                                     ║
║                                                                               ║
║   ┌───────────────────────────────────────────────────────────────────────┐  ║
║   │                     CLIENT LAYER (React PWA)                          │  ║
║   │   Patient Portal  │  Doctor Portal  │  Admin Portal                   │  ║
║   │   Tailwind CSS · React Router · Axios · Web Speech API               │  ║
║   └───────────────────────────────────┬───────────────────────────────────┘  ║
║                                       │ REST + WebSocket                      ║
║   ┌───────────────────────────────────▼───────────────────────────────────┐  ║
║   │                API GATEWAY LAYER (Express.js)                         │  ║
║   │   JWT Auth  │  Rate Limiting  │  CORS  │  Helmet  │  Input Validation │  ║
║   └────────┬──────────────────┬──────────────────┬────────────────────────┘  ║
║            │                  │                  │                            ║
║   ┌────────▼───────┐ ┌────────▼───────┐ ┌────────▼───────┐                  ║
║   │  AUTH SERVICE  │ │ BUSINESS LOGIC │ │  WEBSOCKET     │                  ║
║   │  OTP · JWT     │ │ CONTROLLERS    │ │  REAL-TIME     │                  ║
║   │  Sessions      │ │ SERVICES       │ │  TRANSCRIPT    │                  ║
║   └────────┬───────┘ └────────┬───────┘ └────────┬───────┘                  ║
║            │                  │                  │                            ║
║   ┌────────▼──────────────────▼──────────────────▼────────────────────────┐  ║
║   │                      AI SERVICES LAYER                                │  ║
║   │  ASR · NLP/NER · Translation · Risk Detection · SOAP · Chatbot · TTS  │  ║
║   └────────┬──────────────────┬──────────────────┬────────────────────────┘  ║
║            │                  │                  │                            ║
║   ┌────────▼──────┐  ┌────────▼──────┐  ┌────────▼──────┐                   ║
║   │  Hugging Face │  │ LibreTranslate│  │  Web Speech   │                   ║
║   │  Inference API│  │   (Free API)  │  │  API (Browser)│                   ║
║   └───────────────┘  └───────────────┘  └───────────────┘                   ║
║                                                                               ║
║   ┌───────────────────────────────────────────────────────────────────────┐  ║
║   │                      DATA LAYER (MongoDB Atlas)                        │  ║
║   │  Users · Patients · Doctors · Appointments · Consultations            │  ║
║   │  Prescriptions · Transcripts · SecurityLogs · Reminders               │  ║
║   └───────────────────────────────────────────────────────────────────────┘  ║
║                                                                               ║
║   ┌───────────────────────────────────────────────────────────────────────┐  ║
║   │                    EXTERNAL SERVICES (All Free)                        │  ║
║   │  OpenStreetMap · Overpass API · Nodemailer/Gmail · Leaflet.js          │  ║
║   │  jsPDF · MyMemory API (fallback) · Vercel (hosting) · Render (API)    │  ║
║   └───────────────────────────────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 3. Layer-by-Layer Architecture

### 3.1 Client Layer — Presentation Tier

The frontend is a **React Progressive Web App (PWA)** with full offline capability awareness, responsive design, and browser-native AI APIs.

```
CLIENT LAYER INTERNALS
══════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────┐
│                    React PWA (Vite)                      │
├─────────────────┬────────────────────┬──────────────────┤
│  Patient Portal │   Doctor Portal    │   Admin Portal   │
│  /patient/*     │   /doctor/*        │   /admin/*       │
├─────────────────┴────────────────────┴──────────────────┤
│                  Shared Components                       │
│  Navbar · Sidebar · Modal · Badge · Loader · SOSButton  │
├──────────────────────────────────────────────────────────┤
│                  State Management                        │
│  React Context API (AuthContext, NotificationContext)    │
│  useState / useReducer for local UI state               │
├──────────────────────────────────────────────────────────┤
│                  Custom Hooks                            │
│  useSpeechRecognition · useTextToSpeech                 │
│  useTranslation · useNotifications · useSocket          │
├──────────────────────────────────────────────────────────┤
│                  HTTP + WS Clients                       │
│  Axios (REST API) · socket.io-client (WebSocket)        │
├──────────────────────────────────────────────────────────┤
│                  Browser APIs Used                       │
│  Web Speech API · Speech Synthesis API                   │
│  Geolocation API · Notification API · tel: Protocol     │
├──────────────────────────────────────────────────────────┤
│                  Styling                                 │
│  Tailwind CSS · Responsive (sm/md/lg/xl) · Dark support │
└──────────────────────────────────────────────────────────┘
```

**Key Client Decisions:**
- **Vite** over CRA: 10–20× faster dev server, better HMR for rapid iteration
- **React Context** over Redux: sufficient complexity for MVP, zero bundle overhead
- **Axios** with interceptors: auto-attach JWT, auto-redirect on 401
- **socket.io-client**: matches the socket.io server, handles reconnection automatically

---

### 3.2 API Gateway Layer

Every inbound HTTP request and WebSocket connection passes through a **layered middleware stack** before reaching any business logic:

```
INBOUND REQUEST MIDDLEWARE PIPELINE
══════════════════════════════════════════════════════════════

HTTP Request arrives at Express.js
         │
         ▼
  ┌─────────────────┐
  │   1. helmet()   │  ← Sets 12 security HTTP headers
  │                 │    (XSS, clickjacking, MIME sniffing)
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │   2. cors()     │  ← Whitelist: CLIENT_URL only
  │                 │    Credentials: true (httpOnly cookies)
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ 3. compression()│  ← Gzip all responses > 1KB
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ 4. rateLimit()  │  ← Global: 100 req / 15 min / IP
  │                 │    Auth routes: 5 req / 15 min / IP
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ 5. express.json │  ← Parse JSON body, limit: 10KB
  │    bodyParser   │    Prevent JSON bomb attacks
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ 6. mongoSanitize│  ← Strip $ and . from user input
  │                 │    Prevent NoSQL injection
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │  7. xss-clean   │  ← Sanitize HTML tags from strings
  │                 │    Prevent XSS in stored data
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ 8. authMiddleware│  ← Verify JWT from httpOnly cookie
  │    (route-level) │    Decode role + userId
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ 9. roleGuard()  │  ← Check decoded role matches route
  │    (route-level) │    403 if mismatch
  └────────┬────────┘
           ▼
  Route Handler (Controller)
```

---

### 3.3 Application / Business Logic Layer

```
BUSINESS LOGIC LAYER
══════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────┐
│                     CONTROLLERS                          │
│  (thin — validate input, call service, return response)  │
├────────────┬───────────┬──────────────┬──────────────────┤
│   Auth     │  Patient  │    Doctor    │      Admin       │
│ Controller │Controller │  Controller  │   Controller     │
└────────────┴───────────┴──────────────┴──────────────────┘
         │           │            │               │
         ▼           ▼            ▼               ▼
┌──────────────────────────────────────────────────────────┐
│                      SERVICES                            │
│  (heavy — business logic, DB calls, AI orchestration)    │
├─────────────────────────────────────────────────────────┤
│  authService         │  appointmentService              │
│  otpService          │  consultationService             │
│  userService         │  prescriptionService             │
│  nerService          │  analyticsService                │
│  chatbotService      │  riskService                     │
│  translateService    │  reminderService                 │
│  soapService         │  pdfService                      │
│  doctorQAService     │  hospitalService                 │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│                      MODELS                              │
│  (Mongoose schemas — data shape + validation)            │
├─────────────────────────────────────────────────────────┤
│  User · Patient · Doctor · Admin                         │
│  Appointment · Consultation · Prescription               │
│  Transcript · Reminder · SecurityLog · OTP               │
└──────────────────────────────────────────────────────────┘
```

**Controller vs Service Responsibility:**

| Layer | Responsibility | What It Should NOT Do |
|---|---|---|
| **Controller** | Parse req, call service, format res | Business logic, DB queries |
| **Service** | Business logic, DB access, AI calls | Parse HTTP, format responses |
| **Model** | Data shape, validation, indexes | Business logic |

---

### 3.4 AI Services Layer

The AI layer is a **dedicated service module** inside the Node.js backend. It is completely decoupled from controllers — any controller can call AI services without knowing which external API backs them.

```
AI SERVICES LAYER INTERNALS
══════════════════════════════════════════════════════════════

Controller calls: aiOrchestrator.process(type, input)
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│                  AI ORCHESTRATOR                        │
│  Routes to correct AI service based on task type       │
│  Handles retry logic, fallback chaining, caching       │
└──────┬──────────┬────────────┬──────────┬──────────────┘
       │          │            │          │
       ▼          ▼            ▼          ▼
 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
 │  NER     │ │Translate │ │  Risk    │ │   Doctor     │
 │ Service  │ │ Service  │ │ Service  │ │  QA Service  │
 │          │ │          │ │          │ │              │
 │HF API    │ │LibreTrans│ │Keyword + │ │HF QA Model   │
 │Fallback: │ │Fallback: │ │NER combo │ │Fallback:     │
 │Keyword   │ │MyMemory  │ │          │ │Knowledge base│
 └──────────┘ └──────────┘ └──────────┘ └──────────────┘
       │
       ▼
 ┌──────────────────────────────────────────────────────┐
 │                   NER CACHE                          │
 │  node-cache · TTL: 1 hour · Max: 500 keys           │
 │  Avoids duplicate Hugging Face API calls            │
 └──────────────────────────────────────────────────────┘
```

---

### 3.5 Real-Time Layer — WebSocket

Live consultation transcription requires a persistent bidirectional connection. MediVoice AI uses **socket.io** for this.

```
WEBSOCKET ARCHITECTURE
══════════════════════════════════════════════════════════════

                    CONSULTATION ROOM MODEL
                    ══════════════════════
         Each active consultation = one socket.io room
         Room ID = consultation MongoDB ObjectId

         Patient socket  ──┐
                           ├──► Room: consultation:64abc123
         Doctor socket   ──┘

EVENTS FLOW:

Patient speaks (Hindi)
  │
  ▼ [Browser]
Web Speech API → text
  │
  ▼ [socket emit]
transcript:patient
  { consultationId, text: "मुझे दर्द है", sourceLang: "hi-IN", targetLang: "ta-IN" }
  │
  ▼ [Server — transcriptSocket.js]
translateText("मुझे दर्द है", "hi-IN", "ta-IN")
  │
  ▼ [Server → room broadcast]
transcript:from-patient
  { original: "मुझे दर्द है", translated: "என்னை வலி இருக்கிறது",
    speaker: "Patient", timestamp: "..." }
  │
  ▼ [Doctor's browser]
Display translated Tamil text
Run NER risk check in background

SOCKET EVENTS REFERENCE:
  Client → Server:
    join:consultation    │ join:notification-room
    transcript:patient   │ transcript:doctor
    consultation:save    │ consultation:end

  Server → Client:
    transcript:from-patient  │ transcript:from-doctor
    risk:alert               │ notification:push
    consultation:saved       │ error:socket
```

---

### 3.6 Data Layer — Persistence Tier

```
DATA LAYER ARCHITECTURE
══════════════════════════════════════════════════════════════

MongoDB Atlas (Free Tier — 512MB)
         │
         │  Mongoose ODM
         │  Connection pooling: 5 connections
         │  Connection string: env variable
         │
         ├─── medivoice_users           (User, Patient, Doctor, Admin)
         ├─── medivoice_appointments    (All appointment records)
         ├─── medivoice_consultations   (Transcripts, SOAP notes, AI notes)
         ├─── medivoice_prescriptions   (Structured prescription data)
         ├─── medivoice_reminders       (Medication reminder schedules)
         ├─── medivoice_otps            (OTP records — TTL index auto-delete)
         ├─── medivoice_securitylogs    (Auth events — TTL 90 days)
         └─── medivoice_sessions        (Active JWT session tracking)

DATA PERSISTENCE STRATEGY:
  ┌──────────────────┬────────────────────────────────────────┐
  │ Data Type        │ Storage Strategy                       │
  ├──────────────────┼────────────────────────────────────────┤
  │ User auth data   │ MongoDB · bcrypt hashed passwords      │
  │ Medical records  │ MongoDB · encrypted fields (sensitive) │
  │ Transcripts      │ MongoDB · per-consultation document    │
  │ OTP codes        │ MongoDB · TTL index (10 min auto-del)  │
  │ AI NER results   │ node-cache · in-memory · 1hr TTL       │
  │ JWT sessions     │ httpOnly cookie · 24hr expiry          │
  │ Security logs    │ MongoDB · TTL index (90 day auto-del)  │
  │ PDF files        │ Generated client-side (jsPDF) · not    │
  │                  │ stored on server — zero storage cost   │
  └──────────────────┴────────────────────────────────────────┘
```

---

### 3.7 External Services Layer

```
EXTERNAL SERVICES (ALL FREE)
══════════════════════════════════════════════════════════════

┌──────────────────────┬──────────────────────────────────────┐
│ Service              │ Purpose & Integration Point          │
├──────────────────────┼──────────────────────────────────────┤
│ Hugging Face API     │ Medical NER, Clinical QA             │
│ (inference API)      │ Called from: nerService.js,          │
│                      │ doctorQAService.js                   │
│                      │ Auth: Bearer token (HF_API_KEY)      │
├──────────────────────┼──────────────────────────────────────┤
│ LibreTranslate       │ Real-time multilingual translation   │
│ (public API)         │ Called from: translateService.js     │
│                      │ Fallback: MyMemory API               │
├──────────────────────┼──────────────────────────────────────┤
│ OpenStreetMap /      │ Hospital/clinic map tiles & data     │
│ Overpass API         │ Called from: React frontend          │
│                      │ via Leaflet.js                       │
├──────────────────────┼──────────────────────────────────────┤
│ Web Speech API       │ Browser-native ASR + TTS             │
│ (Google/Chrome)      │ Runs in: React hooks (client-only)   │
│                      │ No server call needed                │
├──────────────────────┼──────────────────────────────────────┤
│ Gmail SMTP           │ OTP emails, notifications            │
│ (Nodemailer)         │ Called from: otpService.js           │
│                      │ Auth: Gmail App Password             │
├──────────────────────┼──────────────────────────────────────┤
│ Vercel               │ React frontend hosting               │
│                      │ Auto-deploy from GitHub main branch  │
├──────────────────────┼──────────────────────────────────────┤
│ Render               │ Node.js backend hosting              │
│                      │ Free tier: 512MB RAM, spins down     │
│                      │ after 15min inactivity               │
├──────────────────────┼──────────────────────────────────────┤
│ MongoDB Atlas        │ Database hosting                     │
│                      │ Free tier: 512MB storage             │
│                      │ Connection: Mongoose connection pool │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 4. Technology Stack — Complete Reference

### Full Stack Matrix

| Layer | Technology | Version | Purpose | Why This Choice |
|---|---|---|---|---|
| **Frontend Framework** | React.js | 18.x | UI component library | Ecosystem, hooks, PWA support |
| **Build Tool** | Vite | 5.x | Dev server & bundler | 10-20× faster than CRA |
| **CSS Framework** | Tailwind CSS | 3.x | Responsive styling | Utility-first, no unused CSS in prod |
| **Routing** | React Router | 6.x | Client-side routing | Standard, nested routes support |
| **HTTP Client** | Axios | 1.x | API requests | Interceptors for JWT auto-attach |
| **WebSocket Client** | socket.io-client | 4.x | Real-time events | Matches server, auto-reconnect |
| **PDF Generation** | jsPDF + html2canvas | Latest | Prescription PDFs | Client-side, zero server cost |
| **Maps** | Leaflet.js | 1.x | Hospital finder map | Free, OpenStreetMap compatible |
| **Charts** | Chart.js | 4.x | Analytics dashboards | Free, lightweight, responsive |
| **Backend Runtime** | Node.js | 20.x LTS | Server runtime | Non-blocking I/O for WebSocket |
| **Web Framework** | Express.js | 4.x | HTTP server + routing | Minimal, middleware-based |
| **WebSocket Server** | socket.io | 4.x | Real-time bi-directional | Room support, namespace, fallback |
| **Database** | MongoDB Atlas | 7.x | Primary data store | Document model suits medical records |
| **ODM** | Mongoose | 8.x | Schema + DB queries | Validation, virtuals, middleware |
| **Authentication** | JWT (jsonwebtoken) | 9.x | Stateless auth tokens | Scalable, role-encodable |
| **Password Hashing** | bcrypt | 5.x | Secure password storage | Industry standard, salt rounds |
| **Email** | Nodemailer | 6.x | OTP delivery | Works with Gmail SMTP (free) |
| **Security** | Helmet.js | 7.x | HTTP security headers | 12 headers set automatically |
| **Rate Limiting** | express-rate-limit | 7.x | Brute force protection | Per-IP, per-route configuration |
| **Input Sanitization** | express-mongo-sanitize | 2.x | NoSQL injection prevention | Strips $ . from input |
| **XSS Protection** | xss-clean | 0.1.x | Cross-site scripting prevention | Sanitizes HTML from strings |
| **Caching** | node-cache | 5.x | NER results cache | In-memory, TTL-based |
| **AI — NER** | Hugging Face API | — | Medical entity extraction | Free inference, best medical NER |
| **AI — Translation** | LibreTranslate | — | Multilingual real-time | Open-source, free tier |
| **AI — QA** | Hugging Face API | — | Clinical QA for doctors | Free inference, RoBERTa-based |
| **AI — ASR/TTS** | Web Speech API | — | Speech I/O | Browser-native, zero cost |
| **Frontend Hosting** | Vercel | — | Static + SSR hosting | Free tier, GitHub auto-deploy |
| **Backend Hosting** | Render | — | Node.js hosting | Free tier, Docker support |
| **DB Hosting** | MongoDB Atlas | — | Managed MongoDB | Free 512MB, automatic backups |
| **Compression** | compression (npm) | 1.x | Gzip HTTP responses | Reduces payload 60-80% |
| **Env Variables** | dotenv | 16.x | Environment config | Standard Node.js practice |

---

## 5. Database Architecture

### 5.1 MongoDB Schema Design

MediVoice AI uses a **hybrid embedding + referencing** strategy:
- **Embed** data that is always read together (prescription medications inside consultation)
- **Reference** data that is shared across documents (Doctor referenced in Appointment)

```
COLLECTION RELATIONSHIP MAP
══════════════════════════════════════════════════════════════

User (base)
  ├── Patient (extends User via userId ref)
  │     ├── Appointments[] (refs)
  │     ├── Consultations[] (refs)
  │     └── Reminders[] (refs)
  │
  ├── Doctor (extends User via userId ref)
  │     ├── Appointments[] (refs)
  │     └── Availability (embedded)
  │
  └── Admin (extends User via userId ref)

Appointment
  ├── patientId → Patient
  ├── doctorId  → Doctor
  └── consultationId → Consultation (created on completion)

Consultation
  ├── appointmentId → Appointment
  ├── patientId     → Patient
  ├── doctorId      → Doctor
  ├── transcript    (embedded — always read together)
  ├── soapNote      (embedded — always read together)
  └── prescriptionId → Prescription

Prescription
  ├── consultationId → Consultation
  ├── patientId      → Patient
  ├── doctorId       → Doctor
  └── medications[]  (embedded array)

SecurityLog
  └── userId → User (nullable — logs failed attempts too)

OTP
  └── userId → User
      TTL Index: auto-delete after 10 minutes
```

---

### 5.2 All Collection Schemas

#### User Schema (Base)

```javascript
// server/models/User.js

const UserSchema = new mongoose.Schema({
  // Core identity
  email:         { type: String, required: true, unique: true, lowercase: true,
                   match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] },
  password:      { type: String, required: true, minlength: 8, select: false },
                 // select: false — never returned in queries by default

  // Role & status
  role:          { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  isVerified:    { type: Boolean, default: false },
                 // false until email OTP confirmed
  isActive:      { type: Boolean, default: true },
                 // false = deactivated by admin
  isBanned:      { type: Boolean, default: false },

  // Security tracking
  failedLoginAttempts: { type: Number, default: 0 },
  lockoutUntil:        { type: Date, default: null },
  lastLoginAt:         { type: Date },
  lastLoginIP:         { type: String },
  currentSessionToken: { type: String, select: false },
                       // Single session enforcement

  // Profile
  firstName:     { type: String, required: true, trim: true },
  lastName:      { type: String, required: true, trim: true },
  phone:         { type: String },
  city:          { type: String, enum: ['Chennai','Bangalore','Mumbai','Vijayawada',
                                         'Hyderabad','Delhi','Goa','Puducherry'] },
  preferredLanguage: { type: String, default: 'hi', enum: ['hi','ta','te','ml','kn','bn'] },

}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual: full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});
```

#### Patient Schema

```javascript
// server/models/Patient.js

const PatientSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Demographics
  dateOfBirth:   { type: Date },
  gender:        { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  bloodGroup:    { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'] },

  // Medical profile
  allergies:     [{ type: String }],
  chronicConditions: [{ type: String }],
  emergencyContact: {
    name:        { type: String },
    phone:       { type: String },
    relation:    { type: String },
  },

  // AI-generated risk classification (updated per consultation)
  currentRiskLevel: {
    type:        String,
    enum:        ['GREEN', 'YELLOW', 'RED'],
    default:     'GREEN',
  },
  lastRiskAssessedAt: { type: Date },

  // Statistics
  totalConsultations: { type: Number, default: 0 },
  totalAppointments:  { type: Number, default: 0 },

}, { timestamps: true });
```

#### Doctor Schema

```javascript
// server/models/Doctor.js

const DoctorSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Professional
  specialty:     { type: String, required: true },
  subSpecialty:  { type: String },
  qualifications: [{ type: String }],
  experience:    { type: Number },           // Years
  registrationNumber: { type: String, unique: true },
  isVerified:    { type: Boolean, default: false }, // Admin-verified doctor

  // Practice
  clinicName:    { type: String },
  clinicAddress: { type: String },
  city:          { type: String },
  consultationFee: { type: Number, default: 0 },

  // Availability
  availability: {
    workingDays: [{ type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }],
    startTime:   { type: String, default: '09:00' },
    endTime:     { type: String, default: '17:00' },
    slotDuration: { type: Number, default: 30 }, // minutes
    maxSlotsPerDay: { type: Number, default: 16 },
    blockedDates:   [{ type: Date }],
  },

  // AI-facing
  languagesSpoken: [{ type: String }],
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  totalRatings:    { type: Number, default: 0 },
  totalPatients:   { type: Number, default: 0 },
  status:          { type: String, enum: ['available','busy','on_leave'], default: 'available' },

}, { timestamps: true });
```

#### Appointment Schema

```javascript
// server/models/Appointment.js

const AppointmentSchema = new mongoose.Schema({
  patientId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Timing
  scheduledAt:   { type: Date, required: true },
  duration:      { type: Number, default: 30 },     // minutes
  endAt:         { type: Date },                     // computed: scheduledAt + duration

  // Status lifecycle
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'pending',
  },

  // Clinical context
  chiefComplaint:   { type: String },               // Patient's stated reason
  patientRiskLevel: { type: String, enum: ['GREEN','YELLOW','RED'], default: 'GREEN' },
  riskCondition:    { type: String },               // e.g., "Possible cardiac event"

  // References
  consultationId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
                    // Populated when consultation is created

  // Cancellation / reschedule
  cancelReason:     { type: String },
  rescheduleHistory: [{
    previousTime:  Date,
    newTime:       Date,
    changedBy:     { type: String, enum: ['patient','doctor'] },
    changedAt:     Date,
  }],

  // Reminders sent
  reminderSent24h:  { type: Boolean, default: false },
  reminderSent1h:   { type: Boolean, default: false },

}, { timestamps: true });
```

#### Consultation Schema

```javascript
// server/models/Consultation.js

const ConsultationSchema = new mongoose.Schema({
  appointmentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Language pair used during consultation
  patientLanguage: { type: String, default: 'hi' },
  doctorLanguage:  { type: String, default: 'en' },

  // Transcript
  transcript: [{
    speaker:     { type: String, enum: ['Patient', 'Doctor'] },
    originalText: { type: String },
    translatedText: { type: String },
    originalLang:  { type: String },
    targetLang:    { type: String },
    timestamp:     { type: Date, default: Date.now },
    isRisky:       { type: Boolean, default: false },
  }],

  // AI-generated SOAP note (doctor must confirm before finalizing)
  soapNote: {
    subjective: {
      chiefComplaint:      String,
      reportedSymptoms:    [String],
      symptomDuration:     String,
      currentMedications:  [String],
      relevantHistory:     [String],
    },
    objective: {
      doctorObservations:  [String],
      examinationFindings: [String],
      vitalsDiscussed:     [String],
    },
    assessment: {
      probableDiagnosis:      String,
      differentialDiagnoses:  [String],
    },
    plan: {
      prescribedMedications:  [String],
      investigationsOrdered:  [String],
      followUpInstructions:   String,
      lifestyleAdvice:        [String],
    },
    aiGenerated:  { type: Boolean, default: true },
    doctorConfirmed: { type: Boolean, default: false },
    confirmedAt:  Date,
  },

  // Risk events during consultation
  riskEvents: [{
    level:     String,
    condition: String,
    text:      String,
    timestamp: Date,
  }],

  // Status
  status:          { type: String, enum: ['active','completed','abandoned'], default: 'active' },
  startedAt:       { type: Date },
  completedAt:     { type: Date },
  duration:        { type: Number },   // Actual duration in minutes

  // Patient consent for transcription
  patientConsentGiven: { type: Boolean, default: false },
  consentTimestamp:    { type: Date },

  // Linked prescription
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },

}, { timestamps: true });
```

#### Prescription Schema

```javascript
// server/models/Prescription.js

const PrescriptionSchema = new mongoose.Schema({
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  patientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  diagnosis:      { type: String, required: true },
  medications: [{
    drugName:     { type: String, required: true },
    dose:         { type: String },
    frequency:    { type: String },
    duration:     { type: String },
    instructions: { type: String },
    aiPrefilled:  { type: Boolean, default: false },
  }],
  generalInstructions: { type: String },
  followUpDate:   { type: Date },

  // Doctor details snapshot at time of prescription
  doctorSnapshot: {
    name:               String,
    specialty:          String,
    registrationNumber: String,
    clinicName:         String,
    clinicAddress:      String,
    phone:              String,
  },

  // Patient details snapshot
  patientSnapshot: {
    name:        String,
    age:         Number,
    gender:      String,
    dateOfBirth: Date,
  },

  issuedAt:      { type: Date, default: Date.now },
  status:        { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },

}, { timestamps: true });
```

#### OTP Schema (with TTL auto-delete)

```javascript
// server/models/OTP.js

const OTPSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email:      { type: String, required: true },
  code:       { type: String, required: true },
                // Stored as bcrypt hash — not plaintext
  type:       { type: String, enum: ['email_verify', 'password_reset'], required: true },
  attempts:   { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  expiresAt:  { type: Date, required: true },
  isUsed:     { type: Boolean, default: false },
  createdAt:  { type: Date, default: Date.now },
});

// TTL index: MongoDB auto-deletes this document 10 minutes after expiresAt
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

#### Security Log Schema (with TTL 90 days)

```javascript
// server/models/SecurityLog.js

const SecurityLogSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email:      { type: String },
  eventType:  {
    type: String,
    enum: ['login_success', 'login_failed', 'account_locked',
           'password_reset', 'otp_requested', 'otp_failed',
           'suspicious_ip', 'session_invalidated', 'account_banned'],
    required: true,
  },
  ipAddress:  { type: String },
  userAgent:  { type: String },
  details:    { type: String },
  severity:   { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  createdAt:  { type: Date, default: Date.now },
});

// Auto-delete logs older than 90 days
SecurityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
```

---

### 5.3 Database Relationships

```
ENTITY RELATIONSHIP DIAGRAM (Simplified)
══════════════════════════════════════════════════════════════

User (1) ─────────────── (1) Patient
User (1) ─────────────── (1) Doctor

Patient (1) ──────────── (many) Appointments
Doctor  (1) ──────────── (many) Appointments

Patient (1) ──────────── (many) Consultations
Doctor  (1) ──────────── (many) Consultations

Appointment (1) ───────── (0..1) Consultation
Consultation (1) ──────── (0..1) Prescription

Patient (1) ──────────── (many) Reminders
Prescription (1) ────────── (many) Reminders (derived)

User (1) ──────────────── (many) SecurityLogs
User (1) ──────────────── (many) OTPs
```

---

### 5.4 Indexes

```javascript
// Performance-critical indexes — run once on DB initialization

// User lookups (most frequent query)
UserSchema.index({ email: 1 });                    // Login, duplicate check
UserSchema.index({ role: 1, isActive: 1 });        // Admin user listing

// Appointment queries (high frequency)
AppointmentSchema.index({ patientId: 1, scheduledAt: -1 });  // Patient history
AppointmentSchema.index({ doctorId: 1, scheduledAt: 1 });    // Doctor queue
AppointmentSchema.index({ doctorId: 1, status: 1 });         // Status filtering
AppointmentSchema.index({ scheduledAt: 1, status: 1 });      // Reminder cron

// Doctor search (appointment booking)
DoctorSchema.index({ specialty: 1, city: 1, isVerified: 1 }); // Core search
DoctorSchema.index({ city: 1, rating: -1 });                   // Rating sort

// Consultation access
ConsultationSchema.index({ patientId: 1, createdAt: -1 });    // Patient history
ConsultationSchema.index({ doctorId: 1, createdAt: -1 });     // Doctor records

// Analytics aggregation
ConsultationSchema.index({ doctorId: 1, 'soapNote.assessment.probableDiagnosis': 1 });

// TTL indexes (auto-cleanup)
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SecurityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
```

---

## 6. API Architecture

### 6.1 REST API Design Principles

```
API DESIGN CONVENTIONS
══════════════════════════════════════════════════════════════

Base URL:     https://api.medivoice.ai/api/v1
Content-Type: application/json
Auth:         JWT via httpOnly cookie (automatic with credentials:true)

URL Naming:
  ✅ /api/v1/patients/:id/appointments    (nested resource)
  ✅ /api/v1/doctors/search               (action on collection)
  ✅ /api/v1/consultations/:id/generate-notes  (action on resource)
  ❌ /api/v1/getPatientAppointments        (no verbs in URL)
  ❌ /api/v1/patient_appointments          (no underscores)

HTTP Methods:
  GET     → Retrieve (safe, idempotent)
  POST    → Create
  PUT     → Full replacement
  PATCH   → Partial update
  DELETE  → Remove

Response Envelope:
  {
    "success": true,
    "data": { ... },         // Payload
    "message": "...",        // Human-readable status
    "pagination": { ... }    // When applicable
  }

Error Envelope:
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Email is required",
      "fields": { "email": "required" }  // For validation errors
    }
  }

HTTP Status Codes Used:
  200 OK           → Success (GET, PUT, PATCH)
  201 Created      → Resource created (POST)
  204 No Content   → Success, no body (DELETE)
  400 Bad Request  → Validation error
  401 Unauthorized → Not authenticated
  403 Forbidden    → Authenticated but wrong role
  404 Not Found    → Resource doesn't exist
  409 Conflict     → Duplicate (email already exists)
  429 Too Many Requests → Rate limit hit
  500 Internal Error → Unexpected server error
```

---

### 6.2 Complete API Route Map

#### Authentication Routes — `POST /api/v1/auth/*`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | None | Register new user (any role) |
| `POST` | `/auth/verify-otp` | None | Verify email OTP after signup |
| `POST` | `/auth/resend-otp` | None | Resend OTP (max 3 per email/hour) |
| `POST` | `/auth/login` | None | Login with email + password |
| `POST` | `/auth/logout` | JWT | Invalidate session, clear cookie |
| `POST` | `/auth/forgot-password` | None | Request password reset OTP |
| `POST` | `/auth/reset-password` | None | Reset password with OTP |
| `GET`  | `/auth/me` | JWT | Get current authenticated user |
| `POST` | `/auth/refresh` | Cookie | Refresh JWT before expiry |

#### Patient Routes — `* /api/v1/patients/*`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/patients/profile` | Patient | Get own profile |
| `PATCH` | `/patients/profile` | Patient | Update own profile |
| `GET` | `/patients/appointments` | Patient | List all appointments (paginated) |
| `GET` | `/patients/appointments/:id` | Patient | Get single appointment detail |
| `POST` | `/patients/appointments` | Patient | Book new appointment |
| `PATCH` | `/patients/appointments/:id/cancel` | Patient | Cancel appointment |
| `GET` | `/patients/consultations` | Patient | Medical history list |
| `GET` | `/patients/consultations/:id` | Patient | Single consultation record |
| `GET` | `/patients/consultations/:id/transcript` | Patient | Get consultation transcript |
| `GET` | `/patients/prescriptions` | Patient | All prescriptions |
| `GET` | `/patients/prescriptions/:id` | Patient | Single prescription |
| `GET` | `/patients/reminders` | Patient | Active medication reminders |
| `PATCH` | `/patients/reminders/:id` | Patient | Update reminder time |
| `DELETE` | `/patients/reminders/:id` | Patient | Delete reminder |
| `POST` | `/patients/chat` | Patient | Send message to AI chatbot |
| `GET` | `/patients/chat/history` | Patient | Get chat conversation history |
| `GET` | `/patients/hospitals` | Patient | Nearby hospitals (lat/lng query) |

#### Doctor Routes — `* /api/v1/doctors/*`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/doctors/search` | None | Search doctors by specialty, city |
| `GET` | `/doctors/:id/profile` | None | Public doctor profile |
| `GET` | `/doctors/:id/slots` | None | Available booking slots |
| `GET` | `/doctors/me/profile` | Doctor | Own full profile |
| `PATCH` | `/doctors/me/profile` | Doctor | Update own profile |
| `PATCH` | `/doctors/me/status` | Doctor | Set status (available/busy/leave) |
| `GET` | `/doctors/me/queue` | Doctor | Today's patient queue |
| `GET` | `/doctors/me/appointments` | Doctor | All appointments (paginated) |
| `PATCH` | `/doctors/me/appointments/:id` | Doctor | Update appointment status |
| `GET` | `/doctors/me/patients/:patientId/history` | Doctor | Patient history (own patients) |
| `POST` | `/doctors/me/consultations/:id/generate-notes` | Doctor | Trigger AI SOAP generation |
| `PATCH` | `/doctors/me/consultations/:id/notes` | Doctor | Edit + confirm SOAP note |
| `POST` | `/doctors/me/prescriptions` | Doctor | Create prescription |
| `PATCH` | `/doctors/me/prescriptions/:id` | Doctor | Edit prescription |
| `POST` | `/doctors/me/assistant` | Doctor | Query AI doctor assistant |
| `GET` | `/doctors/me/analytics` | Doctor | Practice analytics |
| `PATCH` | `/doctors/me/availability` | Doctor | Update schedule/blocks |

#### Admin Routes — `* /api/v1/admin/*`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | Admin | Platform statistics |
| `GET` | `/admin/users` | Admin | All users (paginated, filterable) |
| `GET` | `/admin/users/:id` | Admin | Single user detail |
| `PATCH` | `/admin/users/:id/deactivate` | Admin | Deactivate account |
| `PATCH` | `/admin/users/:id/reactivate` | Admin | Reactivate account |
| `PATCH` | `/admin/users/:id/ban` | Admin | Permanently ban account |
| `PATCH` | `/admin/doctors/:id/verify` | Admin | Verify doctor credentials |
| `GET` | `/admin/security-logs` | Admin | Security event log (paginated) |
| `POST` | `/admin/users/:id/force-logout` | Admin | Invalidate all user sessions |

---

### 6.3 WebSocket Event Map

```javascript
// WebSocket events reference (socket.io)

// ─── CLIENT → SERVER ────────────────────────────────────────────────────────

socket.emit('join:consultation', { consultationId })
// Patient and doctor both call this to enter the same room
// Server: socket.join(`consultation:${consultationId}`)

socket.emit('transcript:patient', { consultationId, text, sourceLang, targetLang })
// Patient's transcribed speech segment (final text from Web Speech API)
// Server: translate → broadcast to room

socket.emit('transcript:doctor', { consultationId, text, sourceLang, targetLang })
// Doctor's transcribed speech segment
// Server: translate → broadcast to room

socket.emit('consultation:save', { consultationId })
// Both parties confirm: save transcript to MongoDB

socket.emit('consultation:end', { consultationId })
// Doctor ends consultation → triggers AI note generation

socket.emit('join:notifications', { userId })
// Subscribe to personal push notifications

// ─── SERVER → CLIENT ────────────────────────────────────────────────────────

socket.emit('transcript:from-patient', { original, translated, speaker, timestamp })
// Doctor receives patient's speech (translated to doctor's language)

socket.emit('transcript:from-doctor', { original, translated, speaker, timestamp })
// Patient receives doctor's speech (translated to patient's language)

socket.emit('risk:alert', { level, condition, message, callToAction })
// Broadcast to both parties when risk detected in transcript

socket.emit('consultation:notes-ready', { soapNoteId })
// Tells doctor: AI SOAP note has been generated, ready to review

socket.emit('notification:push', { type, title, body, data })
// Personal notification (appointment reminder, prescription ready, etc.)

socket.emit('session:invalidated', {})
// Sent to old session when user logs in from new device
// Frontend: auto-redirect to login page

socket.emit('error:socket', { code, message })
// Socket-level error (auth failure, invalid room, etc.)
```

---

### 6.4 Request / Response Contracts

#### POST `/auth/signup`

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName":  "Ravi",
  "lastName":   "Kumar",
  "email":      "ravi@gmail.com",
  "password":   "Ravi@2024",
  "role":       "patient",
  "city":       "Hyderabad",
  "phone":      "9876543210",
  "preferredLanguage": "hi"
}

201 Created
{
  "success": true,
  "message": "Account created. Please verify your email with the OTP sent to ravi@gmail.com",
  "data": {
    "userId": "64abc123...",
    "email":  "ravi@gmail.com",
    "role":   "patient"
  }
}

409 Conflict (email exists)
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists. Please log in instead."
  }
}
```

#### POST `/auth/login`

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "ravi@gmail.com", "password": "Ravi@2024" }

200 OK
Set-Cookie: token=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
{
  "success": true,
  "data": {
    "user": {
      "id":        "64abc123",
      "firstName": "Ravi",
      "lastName":  "Kumar",
      "role":      "patient",
      "city":      "Hyderabad",
      "isVerified": true
    }
  }
}

401 Unauthorized (wrong password)
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password.",
    "attemptsRemaining": 2
  }
}

423 Locked
{
  "success": false,
  "error": {
    "code": "ACCOUNT_LOCKED",
    "message": "Too many failed attempts. Account locked for 15 minutes.",
    "lockedUntil": "2026-04-20T10:45:00.000Z",
    "minutesRemaining": 12
  }
}
```

---

## 7. Authentication & Security Architecture

### 7.1 JWT Architecture

```
JWT TOKEN STRUCTURE
══════════════════════════════════════════════════════════════

Header:
  { "alg": "HS256", "typ": "JWT" }

Payload:
  {
    "sub":   "64abc123def456",    ← MongoDB User._id
    "role":  "patient",           ← Role-based access control
    "email": "ravi@gmail.com",
    "iat":   1713600000,          ← Issued at
    "exp":   1713686400           ← Expires in 24 hours
  }

Signature:
  HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)

Storage:
  ┌────────────────────────────────────────────────────────┐
  │  Set-Cookie: token=<jwt>                               │
  │    HttpOnly   → JS cannot access (XSS protection)     │
  │    Secure     → HTTPS only                            │
  │    SameSite=Strict → CSRF protection                  │
  │    Max-Age=86400   → 24 hours                         │
  │                                                        │
  │  NEVER stored in localStorage or sessionStorage       │
  └────────────────────────────────────────────────────────┘

Single Session Enforcement:
  1. JWT issued → its token hash stored in User.currentSessionToken
  2. Every auth request: verify JWT AND check stored token matches
  3. New login → new JWT issued → old token hash overwritten
  4. Old session gets socket event: "session:invalidated"
```

#### Auth Middleware

```javascript
// server/middleware/authMiddleware.js

const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const crypto  = require('crypto');

const authMiddleware = async (req, res, next) => {
  // 1. Extract JWT from httpOnly cookie
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authentication required.' }
    });
  }

  // 2. Verify signature and expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Session expired. Please log in again.' }
    });
  }

  // 3. Check user still exists and is active
  const user = await User.findById(decoded.sub).select('+currentSessionToken');
  if (!user || !user.isActive || user.isBanned) {
    return res.status(401).json({
      success: false,
      error: { code: 'USER_INACTIVE', message: 'Account is not active.' }
    });
  }

  // 4. Single session check — token must match stored session
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  if (user.currentSessionToken !== tokenHash) {
    return res.status(401).json({
      success: false,
      error: { code: 'SESSION_EXPIRED', message: 'Logged in elsewhere. Please log in again.' }
    });
  }

  // 5. Attach user to request
  req.user   = user;
  req.userId = decoded.sub;
  req.role   = decoded.role;

  next();
};

// Role guard factory
const roleGuard = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.role)) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'You do not have permission for this action.' }
    });
  }
  next();
};

module.exports = { authMiddleware, roleGuard };
```

---

### 7.2 Role-Based Access Control (RBAC)

```
RBAC MATRIX — What each role can access
══════════════════════════════════════════════════════════════

Route Prefix          │ Patient │ Doctor │ Admin
──────────────────────┼─────────┼────────┼───────
/api/v1/auth/*        │   ✅    │   ✅   │  ✅
/api/v1/patients/me/* │   ✅    │   ❌   │  ❌
/api/v1/doctors/me/*  │   ❌    │   ✅   │  ❌
/api/v1/doctors/search│   ✅    │   ✅   │  ✅  (public)
/api/v1/admin/*       │   ❌    │   ❌   │  ✅

Data Scoping Rules:
  Patient  → can only access their own records (patientId = req.userId)
  Doctor   → can only access records where doctorId = req.userId
             OR where patient has appointment with this doctor
  Admin    → can access metadata of all users but NOT consultation content
```

---

### 7.3 Security Middleware Stack

```javascript
// server/app.js — Full security stack

const express          = require('express');
const helmet           = require('helmet');
const cors             = require('cors');
const compression      = require('compression');
const rateLimit        = require('express-rate-limit');
const mongoSanitize    = require('express-mongo-sanitize');
const xss              = require('xss-clean');
const cookieParser     = require('cookie-parser');

const app = express();

// 1. Security headers (must be first)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'"],
      connectSrc:  ["'self'", "https://api-inference.huggingface.co",
                   "https://libretranslate.com", "wss://"],
      imgSrc:      ["'self'", "data:", "https://tile.openstreetmap.org"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// 2. CORS — only allow frontend origin
app.use(cors({
  origin:      process.env.CLIENT_URL,
  credentials: true,   // Allow cookies
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// 3. Compression
app.use(compression());

// 4. Global rate limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests.' }},
  standardHeaders: true,
  legacyHeaders: false,
}));

// 5. Stricter limiter for auth routes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
app.use('/api/v1/auth/', authLimiter);

// 6. Body parsing (limit size to prevent bombs)
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 7. Input sanitization
app.use(mongoSanitize());  // NoSQL injection
app.use(xss());            // XSS

// 8. Routes
app.use('/api/v1/auth',     require('./routes/authRoutes'));
app.use('/api/v1/patients', require('./routes/patientRoutes'));
app.use('/api/v1/doctors',  require('./routes/doctorRoutes'));
app.use('/api/v1/admin',    require('./routes/adminRoutes'));

// 9. Global error handler (must be last)
app.use(require('./middleware/errorHandler'));
```

---

### 7.4 OTP Flow Architecture

```
OTP GENERATION & VERIFICATION FLOW
══════════════════════════════════════════════════════════════

SIGNUP OTP:

1. User submits signup form
         │
         ▼
2. Backend creates User (isVerified: false)
         │
         ▼
3. otpService.generateOTP(userId, email, 'email_verify')
   │
   ├── Generate 6-digit code: Math.floor(100000 + Math.random() * 900000)
   ├── Hash code: await bcrypt.hash(code.toString(), 8)
   ├── Save to OTP collection:
   │     { userId, email, code: HASH, type, expiresAt: now+10min }
   └── Send email via Nodemailer:
         Subject: "MediVoice AI — Your Verification Code"
         Body:    "Your OTP is: 847293. Expires in 10 minutes."
         │
         ▼
4. User receives OTP in Gmail
         │
         ▼
5. User submits OTP on verification page
         │
         ▼
6. otpService.verifyOTP(email, submittedCode, 'email_verify')
   │
   ├── Find OTP: { email, type, isUsed: false, expiresAt: { $gt: now } }
   ├── If not found or expired → error: "OTP expired or invalid"
   ├── otp.attempts++ → if >= maxAttempts → error: "Too many attempts"
   ├── bcrypt.compare(submittedCode, otp.code) → if false → error
   ├── Mark OTP: { isUsed: true }
   └── Mark User: { isVerified: true }
         │
         ▼
7. User redirected to login page
```

---

## 8. Frontend Architecture

### 8.1 Component Hierarchy

```
APP COMPONENT TREE
══════════════════════════════════════════════════════════════

<App>
  <AuthContext.Provider>           ← Global auth state
  <NotificationContext.Provider>   ← Push notification state
    <BrowserRouter>
      <Routes>

        {/* Public routes — no auth required */}
        <Route path="/"              → <LandingPage> />
        <Route path="/signup"        → <SignupPage> />
        <Route path="/login"         → <LoginPage> />
        <Route path="/verify-otp"    → <OTPVerifyPage> />
        <Route path="/forgot-password" → <ForgotPasswordPage> />
        <Route path="/reset-password"  → <ResetPasswordPage> />

        {/* Patient portal — role: patient */}
        <Route path="/patient" element={<PrivateRoute role="patient"><PatientLayout/></PrivateRoute>}>
          <Route index               → <PatientDashboard> />
          <Route path="chat"         → <ChatbotPage> />
          <Route path="appointments" → <AppointmentList> />
          <Route path="book/:doctorId" → <BookAppointment> />
          <Route path="hospitals"    → <HospitalFinder> />
          <Route path="history"      → <MedicalHistory> />
          <Route path="history/:id"  → <ConsultationDetail> />
          <Route path="prescriptions" → <PrescriptionList> />
          <Route path="prescriptions/:id" → <PrescriptionDetail> />
          <Route path="consultation/:id/live" → <LiveTranscript> />
        </Route>

        {/* Doctor portal — role: doctor */}
        <Route path="/doctor" element={<PrivateRoute role="doctor"><DoctorLayout/></PrivateRoute>}>
          <Route index               → <DoctorDashboard> />
          <Route path="queue"        → <PatientQueue> />
          <Route path="consultation/:id/live" → <ConsultationPanel> />
          <Route path="consultation/:id/notes" → <ClinicalNotes> />
          <Route path="prescription/:id/edit" → <PrescriptionBuilder> />
          <Route path="patients/:id/history" → <PatientHistory> />
          <Route path="assistant"    → <AIAssistant> />
          <Route path="schedule"     → <ScheduleManager> />
          <Route path="analytics"    → <Analytics> />
        </Route>

        {/* Admin portal — role: admin */}
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminLayout/></PrivateRoute>}>
          <Route index               → <AdminDashboard> />
          <Route path="users"        → <UserManagement> />
          <Route path="users/:id"    → <UserDetail> />
          <Route path="security"     → <SecurityMonitor> />
        </Route>

        <Route path="*"              → <NotFoundPage> />
      </Routes>
    </BrowserRouter>
  </NotificationContext.Provider>
  </AuthContext.Provider>
</App>
```

---

### 8.2 State Management

```javascript
// client/src/context/AuthContext.jsx

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);  // Check stored session on mount

  // Check if user has valid session on app load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data } = await axios.get('/api/v1/auth/me', { withCredentials: true });
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login  = (userData) => setUser(userData);
  const logout = async () => {
    await axios.post('/api/v1/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── PrivateRoute Guard ──────────────────────────────────────────────────────
const PrivateRoute = ({ role, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <FullScreenLoader />;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return children;
};
```

---

### 8.3 Routing Architecture

```
ROUTING STRATEGY
══════════════════════════════════════════════════════════════

Route Protection Layers:
  1. PrivateRoute component → checks AuthContext
  2. Role check → redirects wrong role to their portal
  3. Backend middleware → second layer (JWT + role)
     (defense in depth — frontend guard + backend guard)

URL Structure:
  / ──────────────────── Landing page (public)
  /login ─────────────── Login (public, redirect if authed)
  /signup ────────────── Signup (public, redirect if authed)
  /patient/* ─────────── Patient portal (role:patient only)
  /doctor/* ──────────── Doctor portal (role:doctor only)
  /admin/* ───────────── Admin portal (role:admin only)

Deep Link Support:
  After login, redirect to originally requested URL
  const location = useLocation();
  <Navigate to={location.state?.from || `/${user.role}`} />

Axios Base Configuration:
  axios.defaults.baseURL       = process.env.VITE_API_URL;
  axios.defaults.withCredentials = true;  // Send cookies with every request

  // Auto-logout on 401 (session expired)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
```

---

### 8.4 Responsive Design System

```
BREAKPOINT SYSTEM (Tailwind CSS)
══════════════════════════════════════════════════════════════

Default (no prefix):  < 640px    → Mobile first baseline
sm:                   ≥ 640px    → Large mobile / small tablet
md:                   ≥ 768px    → Tablet
lg:                   ≥ 1024px   → Laptop
xl:                   ≥ 1280px   → Desktop
2xl:                  ≥ 1536px   → Large desktop

LAYOUT PATTERNS BY ROLE:

Patient Portal (Mobile-first priority — most patients use phones):
  Mobile:   single column, bottom nav, full-width cards
  Tablet:   2-column grid, side navigation
  Desktop:  sidebar + main content, fixed SOS button bottom-right

Doctor Portal (Laptop/desktop primary — doctors use workstations):
  Mobile:   stacked panels, slide-out drawer
  Tablet:   2-column: patient list + detail
  Desktop:  3-column: sidebar + queue + consultation panel

Admin Portal (Desktop only in practice):
  All sizes: responsive table with horizontal scroll on mobile

TYPOGRAPHY SCALE:
  Base:   16px (1rem)    — body text, minimum readable
  sm:     14px (0.875rem) — secondary text, labels
  lg:     18px (1.125rem) — section headings
  xl:     20px (1.25rem)  — card titles
  2xl:    24px (1.5rem)   — page headings
  3xl:    30px (1.875rem) — dashboard metrics

TOUCH TARGETS (WCAG 2.1 AA):
  Minimum: 44 × 44px for all interactive elements
  SOS button: 60 × 60px (critical action — larger target)
  Navbar items: 48px height minimum
```

---

## 9. AI Pipeline Architecture

```
COMPLETE AI PIPELINE — HOW ALL 12 COMPONENTS CONNECT
══════════════════════════════════════════════════════════════

                    SHARED AI INFRASTRUCTURE
                    ══════════════════════════

  INPUT                          PROCESSING                    OUTPUT
  ─────                          ──────────                    ──────

[Patient Speech]──►[ASR (AI-01)]──►[Raw text in patient's lang]
                                           │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                     [AI-02 Translate] [AI-04 NER]  [AI-06 Risk]
                         to English      entities    check
                              │            │            │
                     ┌────────┘            └────────┐   │
                     ▼                             ▼   ▼
              [Doctor sees              [AI-05 Chatbot]  [Risk Alert
               translation]             builds response   to patient]
                              │
                     [Doctor Speech]──►[ASR]──►[AI-02 Translate]──►[Patient sees]
                                                      │
                                               [AI-04 NER on full transcript]
                                                      │
                              ┌───────────────────────┤
                              ▼                       ▼
                       [AI-07 SOAP Note]      [AI-09 Prescription
                        generator              Pre-fill]
                              │                       │
                              ▼                       ▼
                       [Doctor reviews]         [Doctor reviews]
                       [confirms SOAP]          [completes Rx]
                              │                       │
                              ▼                       ▼
                       [MongoDB save]           [AI-10 Reminder
                                                 engine parses Rx]
                                                      │
                                                      ▼
                                               [Push notifications
                                                scheduled]

PARALLEL BACKGROUND PROCESSES:
  [AI-11 Risk Classifier] runs when patient sends ANY chat message
    → Updates patient's risk tag in doctor's queue view

  [AI-12 Analytics] runs as MongoDB aggregation
    → Updates doctor's analytics dashboard (no external API)

  [AI-08 Doctor QA] runs independently
    → Doctor queries anytime between/during consultations
```

---

## 10. Real-Time Consultation Architecture

```
LIVE CONSULTATION — FULL TECHNICAL FLOW
══════════════════════════════════════════════════════════════

PRE-CONSULTATION:
  1. Doctor starts consultation from their queue
     POST /api/v1/doctors/me/consultations (creates Consultation doc)
     Consultation.status = 'active'
     Consultation.startedAt = now()

  2. Patient and doctor both load /consultation/:id/live
     Both get consent modal (patient must check consent)

  3. Both emit: socket.emit('join:consultation', { consultationId })
     Server: socket.join(`consultation:${consultationId}`)

DURING CONSULTATION (Real-time loop):
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │  PATIENT SCREEN          │  DOCTOR SCREEN               │
  │  ─────────────           │  ───────────                 │
  │  Language: Hindi (hi-IN) │  Language: Tamil (ta-IN)     │
  │                          │                              │
  │  [🎤 Listening...]       │  [🎤 Listening...]           │
  │                          │                              │
  │  [Patient] मुझे दर्द है │  [Patient] என்னை வலி        │
  │           (original)     │            (translated)      │
  │                          │                              │
  │  [Doctor]  आपको कब से   │  [Doctor] எப்போது இருந்து   │
  │            दर्द है?      │           வலி இருக்கிறது?   │
  │           (translated)   │            (original)        │
  │                          │                              │
  │  [🚨 SOS BUTTON]         │  [⚠️ Risk: YELLOW tag]       │
  └──────────────────────────────────────────────────────────┘

  For each final speech segment:
    1. Web Speech API onResult fires with final=true
    2. Frontend: socket.emit('transcript:patient', { text, sourceLang, targetLang })
    3. Server: translateText() → LibreTranslate → translated text
    4. Server: NER check (background) → risk assessment
    5. Server: socket.to(room).emit('transcript:from-patient', { original, translated })
    6. Both screens update simultaneously

POST-CONSULTATION:
  1. Doctor clicks "End Consultation"
     socket.emit('consultation:end', { consultationId })

  2. Server triggers:
     a. generateSOAPNote(transcript, patientData) → AI-07
     b. preFillPrescription(soapNote) → AI-09
     c. Consultation.status = 'completed'
     d. socket.emit('consultation:notes-ready', { soapNoteId })

  3. Doctor redirected to notes review page
  4. Patient notified: "Consultation ended. Prescription will be ready shortly."

  5. Doctor confirms SOAP note → saves
  6. Doctor fills/edits prescription → saves
  7. generateReminderSchedule(medications) → AI-10
  8. Patient notified: "Your prescription is ready. Tap to download PDF."
```

---

## 11. Data Flow Diagrams

### 11.1 User Registration & Auth Flow

```
REGISTRATION + LOGIN FLOW
══════════════════════════════════════════════════════════════

REGISTRATION:
User fills SignupPage
      │ POST /auth/signup
      ▼
Validate input (express-validator)
      │ ─ fail → 400 + field errors
      │ ─ email exists → 409 + "Account already exists"
      ▼
Hash password (bcrypt, 12 rounds)
Create User: { isVerified: false }
      │
      ▼
Generate 6-digit OTP
Hash OTP (bcrypt, 8 rounds — faster for short strings)
Save OTP to DB: { expiresAt: now+10min }
Send email (Nodemailer + Gmail SMTP)
      │
      ▼
Return 201: "OTP sent to email"
User redirected to OTPVerifyPage
      │
      ▼ (User enters OTP)
POST /auth/verify-otp
Find OTP in DB (not expired, not used)
bcrypt.compare(submitted, stored hash)
      │ ─ fail → increment attempts, error
      │ ─ expired → error "OTP expired"
      ▼
Mark OTP as used
Set User.isVerified = true
Delete OTP document (or let TTL handle it)
Return 200: "Email verified. Please log in."

LOGIN:
User fills LoginPage
      │ POST /auth/login
      ▼
Find user by email
Check: not banned, is verified
Check: not locked (lockoutUntil < now)
      │
      ▼
bcrypt.compare(password, stored hash)
      │ ─ fail → increment failedLoginAttempts
      │          if attempts >= 3:
      │            lockoutUntil = now + 15min
      │            return 423 LOCKED
      │          else return 401 + attemptsRemaining
      ▼ (password match)
Reset failedLoginAttempts = 0
Generate JWT: { sub: userId, role, email }
Hash token → store in User.currentSessionToken (single session)
Set-Cookie: token=JWT; HttpOnly; Secure
Log: SecurityLog { event: 'login_success', ip, userAgent }
Return 200 + user data (no token in body)
```

---

### 11.2 Appointment Booking Flow

```
APPOINTMENT BOOKING FLOW
══════════════════════════════════════════════════════════════

Patient on BookAppointment page
      │
      ▼
GET /api/v1/doctors/search
  Query: { specialty, city, date }
  Returns: doctors with available slots
      │
      ▼
Patient selects doctor + time slot
      │
      ▼
POST /api/v1/patients/appointments
  Body: { doctorId, scheduledAt, chiefComplaint }
      │
      ▼
Backend:
  1. Verify doctor exists and is active
  2. Check slot is still available
     (no other appointment at same time for this doctor)
  3. Create Appointment: { status: 'confirmed' }
  4. Run AI risk check on chiefComplaint → set patientRiskLevel
  5. Update doctor's slot as booked
      │
      ▼
Notifications (async — don't block response):
  a. Email to patient: "Appointment confirmed"
  b. Socket to doctor: "New appointment booked"
      │
      ▼
Return 201: { appointment }
Patient sees confirmation screen
```

---

### 11.3 Live Consultation Flow

*(See Section 10 — Real-Time Consultation Architecture for full detail)*

```
SIMPLIFIED LIVE CONSULTATION DATA FLOW:

Patient App                  Server                    Doctor App
──────────                   ──────                    ──────────
[Speak Hindi]
      │
[Web Speech API]
      │ final text
[socket emit]──────────────►[translateText()]
                             [hi→ta LibreTranslate]
                             [NER risk check]
                                   │
                             [socket broadcast]──────►[Show Tamil text]
                                                       [TTS speaks Tamil]

                             [Doctor speaks Tamil]◄────[Web Speech API]
[socket emit]◄──────────────[translateText()]
[Show Hindi text]            [ta→hi LibreTranslate]
[TTS speaks Hindi]
```

---

### 11.4 Prescription & PDF Flow

```
PRESCRIPTION → PDF DOWNLOAD FLOW
══════════════════════════════════════════════════════════════

Doctor on PrescriptionBuilder
      │
      ▼
AI-09 pre-fills from SOAP note (medications extracted)
Doctor reviews + edits all fields
Doctor clicks "Save & Send to Patient"
      │
      ▼
POST /api/v1/doctors/me/prescriptions
  Backend:
    1. Save Prescription to MongoDB
    2. Link to Consultation: consultation.prescriptionId = rx._id
    3. Run AI-10: generateReminderSchedule(medications)
    4. Save Reminders to MongoDB
    5. Socket notification to patient: "prescription:ready"
      │
      ▼
Patient receives push notification
Patient clicks "Download Prescription"
      │
      ▼
GET /api/v1/patients/prescriptions/:id
  Returns: full prescription JSON
      │
      ▼
jsPDF (client-side — zero server cost):
  1. Render prescription HTML template in memory
  2. html2canvas converts to image
  3. jsPDF embeds image into PDF
  4. PDF streamed to browser as download
  5. File: "MediVoice_Prescription_[Date]_[DoctorName].pdf"

PDF Content:
  ┌──────────────────────────────────────────┐
  │  🎙️ MediVoice AI                         │
  │  ──────────────────────────────────────  │
  │  Patient: Ravi Kumar (Age 34, Male)      │
  │  Date: April 20, 2026                   │
  │  Doctor: Dr. Priya Sharma, MBBS, MD      │
  │  Reg No: MCI/12345                      │
  │  ──────────────────────────────────────  │
  │  DIAGNOSIS: Hypertension Stage 1        │
  │                                          │
  │  MEDICATIONS:                            │
  │  1. Amlodipine 5mg — Once daily          │
  │     Take at same time daily              │
  │  2. Metoprolol 25mg — Twice daily        │
  │     Take with food                       │
  │  ──────────────────────────────────────  │
  │  INSTRUCTIONS: Reduce salt intake.      │
  │  FOLLOW-UP: 2 weeks                     │
  │  ──────────────────────────────────────  │
  │  Apollo Clinic, Hyderabad · 9876543210  │
  │                    [Signature Block]    │
  └──────────────────────────────────────────┘
```

---

## 12. Deployment Architecture

### 12.1 Infrastructure Map

```
PRODUCTION INFRASTRUCTURE (100% Free)
══════════════════════════════════════════════════════════════

Users (all devices)
      │
      │ HTTPS
      ▼
┌─────────────────────────────┐
│        VERCEL (Free)        │
│   React PWA — Frontend      │
│   Auto-deploy from GitHub   │
│   Global CDN edge delivery  │
│   Domain: medivoice.vercel. │
│           app               │
│   Build: vite build         │
│   Output: /dist             │
└──────────────┬──────────────┘
               │ REST API + WSS
               │ (HTTPS)
               ▼
┌─────────────────────────────┐
│        RENDER (Free)        │
│   Node.js API Server        │
│   512MB RAM                 │
│   Spins down after 15min    │
│   inactivity (free tier)    │
│   Domain: medivoice-api.    │
│           onrender.com      │
│   Start: node server/app.js │
└──────────────┬──────────────┘
               │ Mongoose connection
               │ (TLS)
               ▼
┌─────────────────────────────┐
│    MONGODB ATLAS (Free)     │
│   M0 Cluster (512MB)        │
│   Region: Mumbai (ap-south) │
│   Automatic daily backups   │
│   TLS encrypted connections │
│   IP whitelist: Render IPs  │
└─────────────────────────────┘

EXTERNAL SERVICES (called from Render):
  ├── Hugging Face API   → api-inference.huggingface.co
  ├── LibreTranslate     → libretranslate.com
  ├── Gmail SMTP         → smtp.gmail.com:587
  └── MyMemory Fallback  → api.mymemory.translated.net

CLIENT-SIDE ONLY (no Render involvement):
  ├── Web Speech API     → Handled by Chrome
  ├── OpenStreetMap      → tile.openstreetmap.org
  ├── Overpass API       → overpass-api.de
  └── jsPDF              → Runs in browser
```

---

### 12.2 CI/CD Pipeline

```
CI/CD PIPELINE (GitHub Actions — Free)
══════════════════════════════════════════════════════════════

Developer push to branch
      │
      ▼
GitHub PR created
      │
      ▼ (GitHub Actions: .github/workflows/ci.yml)
┌─────────────────────────────────────────────────────────┐
│                      CI PIPELINE                        │
│                                                         │
│  1. Install dependencies (npm ci — locked versions)    │
│  2. Lint: ESLint on client + server                    │
│  3. Unit tests: Jest (server services)                 │
│  4. Build: vite build (client)                         │
│  5. Check: no console.log in production code           │
│                                                         │
│  ✅ All pass → PR can be merged                        │
│  ❌ Any fail → PR blocked                              │
└────────────────────────────┬────────────────────────────┘
                             │ Merge to main
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     CD PIPELINE                         │
│                                                         │
│  FRONTEND (Vercel — automatic):                        │
│    Vercel detects push to main                         │
│    Runs: npm run build                                 │
│    Deploys: /dist to Vercel CDN                        │
│    Deploy time: ~45 seconds                            │
│                                                         │
│  BACKEND (Render — automatic):                         │
│    Render detects push to main                         │
│    Runs: npm install && node app.js                    │
│    Deploy time: ~2 minutes                             │
│    Zero-downtime: new instance starts before old stops │
└─────────────────────────────────────────────────────────┘

.github/workflows/ci.yml:
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: '20' }
        - run: cd server && npm ci
        - run: cd server && npm run lint
        - run: cd server && npm test
        - run: cd client && npm ci
        - run: cd client && npm run build
```

---

### 12.3 Environment Strategy

```
THREE ENVIRONMENTS
══════════════════════════════════════════════════════════════

┌──────────────┬───────────────────┬─────────────────────────┐
│ Environment  │ Frontend          │ Backend                 │
├──────────────┼───────────────────┼─────────────────────────┤
│ Development  │ localhost:3000    │ localhost:5000          │
│              │ Vite dev server   │ nodemon                 │
│              │ HMR enabled       │ .env file               │
├──────────────┼───────────────────┼─────────────────────────┤
│ Staging      │ staging.medivoice │ medivoice-api-staging.  │
│              │ .vercel.app       │ onrender.com            │
│              │ Preview deploy    │ Staging MongoDB cluster │
│              │ (every PR)        │                         │
├──────────────┼───────────────────┼─────────────────────────┤
│ Production   │ medivoice.ai or   │ medivoice-api.          │
│              │ .vercel.app       │ onrender.com            │
│              │ Main branch only  │ Production MongoDB      │
└──────────────┴───────────────────┴─────────────────────────┘

Environment variables per environment:
  Development:  .env.development (gitignored)
  Staging:      Vercel env vars + Render env vars (staging)
  Production:   Vercel env vars + Render env vars (production)
```

---

## 13. Scalability & Performance Design

### Performance Targets

| Metric | Target | Strategy |
|---|---|---|
| Page load (4G mobile) | < 3s | Vite code splitting, lazy routes, compressed assets |
| API response (non-AI) | < 300ms | MongoDB indexes, connection pooling, response caching |
| AI chatbot response | < 2s | NER cache, keyword fallback for common inputs |
| ASR latency | < 300ms | Browser-native Web Speech API — no server round-trip |
| Translation latency | < 2s | LibreTranslate direct, timeout 3s, immediate fallback |
| WebSocket broadcast | < 100ms | socket.io room broadcast — direct peer-to-peer via server |
| PDF generation | < 3s | Client-side jsPDF — no server overhead |

### Scaling Strategy (When Free Tier Is Outgrown)

```
FREE TIER LIMITS & UPGRADE PATH:
══════════════════════════════════════════════════════════════

MongoDB Atlas M0 (512MB):
  → Upgrade trigger: 400MB used
  → Next: M2 ($9/month) = 2GB
  → Migration: zero-downtime cluster upgrade

Render Free:
  → Upgrade trigger: consistent > 400MB RAM usage
  → Next: $7/month starter = 512MB RAM, no spin-down
  → Key benefit of upgrade: no cold-start delay

Hugging Face Free:
  → Upgrade trigger: approaching 30K req/month
  → Strategy: Expand NER cache TTL to 24 hours
  → Ultimate: Deploy own medical NER model on Render

LibreTranslate:
  → Upgrade trigger: rate limiting in production
  → Strategy: Self-host LibreTranslate on Render (free)
  → Docker: libre-translate/libretranslate (public image)

Horizontal Scaling Architecture (built-in readiness):
  → Express is stateless (JWT in cookies, no server-side sessions)
  → WebSocket: socket.io with Redis adapter (add Redis when needed)
  → MongoDB: connection pooling already configured (max 5 connections)
  → No sticky sessions required — any instance can serve any request
```

---

## 14. Error Handling Architecture

### Error Handling Stack

```javascript
// server/middleware/errorHandler.js

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code       = code;
    this.isOperational = true;   // Vs. programming errors
  }
}

// Global error handler (last middleware in app.js)
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.code       = err.code       || 'INTERNAL_ERROR';

  // Log all errors (production: would send to Sentry/Datadog — free tier)
  console.error(`[ERROR] ${err.code}: ${err.message}`, {
    url:    req.originalUrl,
    method: req.method,
    userId: req.userId || 'unauthenticated',
    stack:  process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed', fields }
    });
  }

  // Mongoose duplicate key (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_KEY',
               message: `An account with this ${field} already exists.` }
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid authentication token.' }
    });
  }

  // Operational errors (thrown by AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message }
    });
  }

  // Programming errors — don't leak details
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' }
  });
};

module.exports = { AppError, globalErrorHandler };
```

### Frontend Error Boundaries

```javascript
// client/src/components/common/ErrorBoundary.jsx

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('React Error Boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">Please refresh the page to continue.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 15. Folder Structure — Complete

```
medivoice-ai/
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI pipeline
│
├── client/                           # React Frontend (Vite)
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json             # PWA manifest
│   │   └── icons/                    # App icons (PWA)
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── FullScreenLoader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── SOSButton.jsx      # Always-visible SOS
│   │   │   │   ├── RiskBadge.jsx      # Red/Yellow/Green badge
│   │   │   │   ├── Pagination.jsx
│   │   │   │   └── NotificationToast.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── OTPInput.jsx
│   │   │   │   └── PasswordStrengthBar.jsx
│   │   │   │
│   │   │   ├── patient/
│   │   │   │   ├── ChatBubble.jsx
│   │   │   │   ├── DoctorCard.jsx
│   │   │   │   ├── AppointmentCard.jsx
│   │   │   │   ├── HospitalMapPin.jsx
│   │   │   │   ├── PrescriptionCard.jsx
│   │   │   │   ├── MedicalHistoryItem.jsx
│   │   │   │   └── RiskAlertModal.jsx
│   │   │   │
│   │   │   ├── doctor/
│   │   │   │   ├── PatientQueueItem.jsx
│   │   │   │   ├── TranscriptLine.jsx
│   │   │   │   ├── SOAPNoteEditor.jsx
│   │   │   │   ├── PrescriptionRow.jsx
│   │   │   │   ├── AnalyticsChart.jsx
│   │   │   │   └── LanguageSelector.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── UserTableRow.jsx
│   │   │       ├── SecurityLogItem.jsx
│   │   │       └── StatCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── auth/
│   │   │   │   ├── SignupPage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── OTPVerifyPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   └── ResetPasswordPage.jsx
│   │   │   │
│   │   │   ├── patient/
│   │   │   │   ├── PatientDashboard.jsx
│   │   │   │   ├── ChatbotPage.jsx
│   │   │   │   ├── AppointmentList.jsx
│   │   │   │   ├── BookAppointment.jsx
│   │   │   │   ├── HospitalFinder.jsx
│   │   │   │   ├── MedicalHistory.jsx
│   │   │   │   ├── ConsultationDetail.jsx
│   │   │   │   ├── PrescriptionList.jsx
│   │   │   │   ├── PrescriptionDetail.jsx
│   │   │   │   └── LiveTranscript.jsx
│   │   │   │
│   │   │   ├── doctor/
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   ├── PatientQueue.jsx
│   │   │   │   ├── ConsultationPanel.jsx
│   │   │   │   ├── ClinicalNotes.jsx
│   │   │   │   ├── PrescriptionBuilder.jsx
│   │   │   │   ├── PatientHistory.jsx
│   │   │   │   ├── AIAssistant.jsx
│   │   │   │   ├── ScheduleManager.jsx
│   │   │   │   └── Analytics.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       ├── UserDetail.jsx
│   │   │       └── SecurityMonitor.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── PatientLayout.jsx     # Sidebar + SOSButton
│   │   │   ├── DoctorLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.js
│   │   │   ├── useTextToSpeech.js
│   │   │   ├── useTranslation.js
│   │   │   ├── useNotifications.js
│   │   │   └── useSocket.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── patientService.js
│   │   │   ├── doctorService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── consultationService.js
│   │   │   └── adminService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── axiosConfig.js        # Interceptors, base URL
│   │   │   ├── pdfGenerator.js       # jsPDF + html2canvas
│   │   │   ├── pushNotifications.js  # Browser push setup
│   │   │   ├── dateHelpers.js
│   │   │   └── validators.js         # Client-side validation
│   │   │
│   │   ├── constants/
│   │   │   ├── languages.js          # BCP-47 language codes
│   │   │   ├── cities.js             # 8 Phase 1 cities
│   │   │   └── riskLevels.js         # RED/YELLOW/GREEN config
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                           # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── mailer.js                 # Nodemailer transporter
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── consultationController.js
│   │   └── adminController.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── otpService.js
│   │   ├── userService.js
│   │   ├── appointmentService.js
│   │   ├── consultationService.js
│   │   ├── prescriptionService.js
│   │   ├── reminderService.js
│   │   ├── analyticsService.js
│   │   ├── ai/
│   │   │   ├── nerService.js         # AI-04: Hugging Face NER
│   │   │   ├── nerCache.js           # node-cache for NER results
│   │   │   ├── translateService.js   # AI-02: LibreTranslate
│   │   │   ├── chatbotService.js     # AI-05: Patient chatbot
│   │   │   ├── riskService.js        # AI-06: Risk detection
│   │   │   ├── soapService.js        # AI-07: SOAP generator
│   │   │   ├── doctorQAService.js    # AI-08: Doctor QA
│   │   │   ├── prescriptionPrefillService.js  # AI-09
│   │   │   └── riskClassifierService.js       # AI-11
│   │   │
│   │   └── hospitalService.js        # Overpass API integration
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verify + roleGuard
│   │   ├── rateLimiter.js            # express-rate-limit configs
│   │   ├── validate.js               # express-validator wrapper
│   │   └── errorHandler.js           # AppError + globalErrorHandler
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Consultation.js
│   │   ├── Prescription.js
│   │   ├── Reminder.js
│   │   ├── OTP.js
│   │   └── SecurityLog.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── websocket/
│   │   ├── transcriptSocket.js       # Consultation real-time
│   │   └── notificationSocket.js     # User notifications
│   │
│   ├── seed/
│   │   ├── doctorSeed.js             # Seed 8 cities × specialties
│   │   └── adminSeed.js              # Create first admin account
│   │
│   ├── app.js                        # Express app setup
│   ├── server.js                     # HTTP + socket.io server
│   └── package.json
│
├── .env.example                      # Template (commit this)
├── .gitignore                        # .env, node_modules, dist
└── README.md
```

---

## 16. Environment Variables — Complete Reference

```env
# ════════════════════════════════════════════════════════════════
# MEDIVOICE AI — ENVIRONMENT VARIABLES
# Copy to .env and fill in values. NEVER commit .env to Git.
# ════════════════════════════════════════════════════════════════

# ─── SERVER ──────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development                   # development | staging | production

# ─── CLIENT (for CORS) ───────────────────────────────────────────
CLIENT_URL=http://localhost:3000       # Production: https://medivoice.vercel.app

# ─── DATABASE ────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/medivoice
             # Free Atlas: M0 cluster, Mumbai region (ap-south-1)
             # Max connections: 500 (M0), pool size: 5

# ─── JWT ─────────────────────────────────────────────────────────
JWT_SECRET=<minimum-32-char-random-string>
           # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_EXPIRES_IN=24h

# ─── BCRYPT ──────────────────────────────────────────────────────
BCRYPT_SALT_ROUNDS=12                  # Passwords: 12 rounds (~300ms)
BCRYPT_OTP_ROUNDS=8                    # OTPs: 8 rounds (~30ms — shorter strings)

# ─── EMAIL (Gmail SMTP — Free) ───────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false                     # STARTTLS (not SSL)
EMAIL_USER=your.gmail@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx        # Gmail App Password (NOT your Gmail password)
           # Setup: Google Account → Security → 2-Step → App Passwords
EMAIL_FROM=MediVoice AI <your.gmail@gmail.com>

# ─── OTP SETTINGS ────────────────────────────────────────────────
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3
OTP_RESEND_COOLDOWN_MINUTES=1

# ─── SECURITY ────────────────────────────────────────────────────
MAX_LOGIN_ATTEMPTS=3
LOCKOUT_DURATION_MINUTES=15
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100            # Global
AUTH_RATE_LIMIT_MAX=5                  # Auth routes only

# ─── AI — HUGGING FACE (Free Tier) ───────────────────────────────
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxx
  # Get: huggingface.co → Settings → Access Tokens → New token (read)
HF_MODEL_NER=d4data/biomedical-ner-all
HF_MODEL_QA=deepset/roberta-base-squad2
HF_TIMEOUT_MS=8000                     # Allow for cold start (20-30s first call)
HF_RETRY_ATTEMPTS=2

# ─── AI — TRANSLATION (LibreTranslate) ───────────────────────────
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=                # Optional (empty = free public tier)
LIBRETRANSLATE_TIMEOUT_MS=3000
LIBRETRANSLATE_RPM=18                  # Stay under 20 req/min free limit

# ─── AI — MYMEMORY FALLBACK ──────────────────────────────────────
MYMEMORY_EMAIL=your.gmail@gmail.com   # Increases free limit to 10k words/day

# ─── AI — NER CACHE ──────────────────────────────────────────────
NER_CACHE_TTL_SECONDS=3600             # 1 hour
NER_CACHE_MAX_KEYS=500

# ─── DEFAULT LANGUAGES ───────────────────────────────────────────
DEFAULT_ASR_LANGUAGE=hi-IN
DEFAULT_UI_LANGUAGE=hi

# ─── CLIENT ENVIRONMENT (.env in /client) ────────────────────────
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

---

## 17. Architecture Decision Records (ADRs)

Key architectural decisions and the reasoning behind them:

### ADR-001 · MongoDB over PostgreSQL

```
Decision:  Use MongoDB Atlas (free tier) as primary database
Date:      April 2026

Context:
  Medical records have variable structure. A consultation may have
  5 transcript lines or 500. A prescription may have 1 drug or 20.
  Relational schemas would require many JOINs for common queries.

Decision:
  MongoDB document model maps naturally to medical records.
  SOAP notes, transcripts, and prescriptions can be embedded.
  Atlas free tier (512MB) sufficient for MVP.

Trade-offs:
  ✅ Flexible schema for varying medical data structures
  ✅ Embedded documents = single query for full consultation
  ✅ Atlas free tier available
  ❌ No ACID transactions across collections (not needed for MVP)
  ❌ Less mature full-text search vs PostgreSQL
```

### ADR-002 · JWT in httpOnly cookies over localStorage

```
Decision:  Store JWT in httpOnly cookies, never localStorage
Date:      April 2026

Context:
  JWT storage location determines XSS and CSRF attack surface.

Decision:
  httpOnly cookies: JS cannot access → immune to XSS token theft
  SameSite=Strict: CSRF attacks blocked
  Secure flag: HTTPS only in production

Trade-offs:
  ✅ XSS cannot steal token (httpOnly)
  ✅ CSRF blocked (SameSite=Strict)
  ✅ Automatic on every request (withCredentials: true)
  ❌ Cannot read token in JS — use /auth/me to get user data
  ❌ Requires CORS credentials:true configuration
```

### ADR-003 · Web Speech API over Whisper/cloud ASR

```
Decision:  Use browser-native Web Speech API as primary ASR
Date:      April 2026

Context:
  Whisper (OpenAI) and cloud ASR services cost money at scale.
  Real-time transcription requires very low latency.

Decision:
  Web Speech API is free, browser-native, and has < 300ms latency.
  Chrome supports all 6 Indian languages well.
  Whisper self-hosted can be added in Phase 2 for non-Chrome browsers.

Trade-offs:
  ✅ Zero cost — no API key needed
  ✅ < 300ms latency — lower than any cloud API
  ✅ Supports all 6 required Indian languages
  ❌ Chrome-only — Firefox/Safari need text fallback
  ❌ Requires internet (sends audio to Google servers)
  ❌ No offline support
```

### ADR-004 · Modular Monolith over Microservices

```
Decision:  Single Node.js application (modular monolith) for MVP
Date:      April 2026

Context:
  Microservices add operational complexity (service discovery,
  inter-service auth, distributed tracing) not warranted at MVP scale.
  Free hosting on Render = one service per free account.

Decision:
  Modular monolith: clear service boundaries within one process.
  AI services are isolated modules — extractable to microservices
  later without changing interfaces.

Trade-offs:
  ✅ Single deployment, single Render free tier slot
  ✅ No network latency between services
  ✅ Simpler debugging and testing
  ✅ Service boundaries already drawn for future extraction
  ❌ Scaling requires scaling the entire app
  ❌ One crash can bring down all services
```

### ADR-005 · Client-side PDF over Server-side

```
Decision:  Generate prescription PDFs in the browser (jsPDF)
Date:      April 2026

Context:
  Server-side PDF generation (puppeteer, pdfkit) uses significant
  RAM on a free Render instance (512MB). Puppeteer alone uses ~200MB.

Decision:
  jsPDF + html2canvas runs in the user's browser.
  Zero server memory usage. No Render resources consumed.
  PDFs are not stored on server — generated on demand.

Trade-offs:
  ✅ Zero server memory cost
  ✅ PDFs generated without network round-trip
  ✅ No storage cost (not saved on server)
  ❌ Quality slightly lower than server-side puppeteer
  ❌ Cannot pre-generate PDFs (generated on user request only)
```

---

## 18. Non-Functional Requirements Mapping

How the architecture satisfies each non-functional requirement:

| NFR | Requirement | Architectural Solution |
|---|---|---|
| **Performance** | Page load < 3s on 4G | Vite code splitting + Vercel CDN + compression middleware |
| **Performance** | API < 300ms (non-AI) | MongoDB indexes on all query patterns + Mongoose connection pool |
| **Performance** | ASR < 300ms | Browser-native Web Speech API — no server round-trip |
| **Security** | Passwords never stored plain | bcrypt with 12 salt rounds in User model pre-save hook |
| **Security** | XSS prevention | xss-clean middleware + helmet CSP headers + httpOnly cookies |
| **Security** | NoSQL injection | express-mongo-sanitize strips `$` and `.` from all input |
| **Security** | Brute force protection | express-rate-limit: 3 login attempts → 15min lockout |
| **Security** | CSRF protection | SameSite=Strict cookie + CORS origin whitelist |
| **Security** | Data in transit | HTTPS (Vercel/Render enforce TLS) + MongoDB TLS connection |
| **Privacy** | Patient data scoped | RBAC middleware: patients only access own records |
| **Privacy** | Doctor data scoped | Doctors access only their own patients' records |
| **Reliability** | AI service outages | Every AI component has a keyword/rule-based fallback |
| **Reliability** | Cold start delay (Render) | Graceful loading states; `/auth/me` pre-warm on app open |
| **Scalability** | Stateless backend | JWT in cookies (no server-side sessions) — any instance serves any request |
| **Scalability** | WebSocket scaling | socket.io rooms — Redis adapter ready for multi-instance |
| **Accessibility** | WCAG 2.1 AA | 44px touch targets, rem font sizes, color contrast ratios |
| **Accessibility** | Non-Chrome users | Text input fallback for all voice-dependent features |
| **Responsiveness** | All screen sizes | Tailwind CSS mobile-first breakpoints (sm/md/lg/xl/2xl) |
| **Cost** | Zero infrastructure | Vercel + Render + Atlas + all APIs on free tiers |

---

<div align="center">

---

## Architecture Summary

```
╔═══════════════════════════════════════════════════════════╗
║            MEDIVOICE AI — ARCHITECTURE AT A GLANCE       ║
╠═══════════════════════════════════════════════════════════╣
║  Style:        Modular Monolith (Microservices-ready)    ║
║  Frontend:     React 18 + Vite + Tailwind CSS (PWA)      ║
║  Backend:      Node.js 20 + Express.js 4                 ║
║  Database:     MongoDB Atlas M0 (Free · 512MB)           ║
║  Real-time:    socket.io 4 (WebSocket rooms)             ║
║  Auth:         JWT httpOnly cookies + bcrypt + OTP       ║
║  AI:           Web Speech + Hugging Face + LibreTranslate║
║  Deploy:       Vercel (frontend) + Render (backend)      ║
║  Cost:         $0.00 / month                             ║
║  Collections:  9 MongoDB collections                     ║
║  API Routes:   38 REST endpoints                         ║
║  WS Events:    14 socket.io events                       ║
║  AI Components: 12 (all with fallbacks)                  ║
║  Languages:    6 Indian languages (STT + Translation)    ║
║  Cities:       8 Phase 1 Indian cities                   ║
╚═══════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — System Architecture v1.0**

*Designed for zero cost · Built for real healthcare · Grounded in ICSADL-2025 research*

![Node.js](https://img.shields.io/badge/Node.js-20_LTS-43853D?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=flat&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_M0-4EA94B?style=flat&logo=mongodb&logoColor=white)
![socket.io](https://img.shields.io/badge/socket.io-4-010101?style=flat&logo=socket.io&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Free-000000?style=flat&logo=vercel&logoColor=white)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
