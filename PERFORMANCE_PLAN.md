<div align="center">

# ⚡ MEDIVOICE AI — Performance Plan
### Complete Performance Strategy, Targets & Optimization Reference

![Document](https://img.shields.io/badge/Document-Performance%20Plan-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![LCP](https://img.shields.io/badge/LCP%20Target-%3C2.5s-brightgreen?style=for-the-badge)
![Cost](https://img.shields.io/badge/Optimization%20Tools-100%25%20Free-purple?style=for-the-badge)

> **The authoritative reference for every performance target, optimization strategy,
> measurement tool, and monitoring plan in MediVoice AI — ensuring fast,
> reliable healthcare delivery for patients across all 8 Indian cities.**

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication
**Priority:** Performance is patient safety — slow healthcare UI costs lives
**Primary Target:** Mobile 4G users in Tier-2 Indian cities (Vijayawada, Goa, Puducherry)
**Budget:** $0.00 — all optimization tools and techniques are free

</div>

---

## 📋 Table of Contents

1. [Performance Philosophy](#1-performance-philosophy)
2. [Core Web Vitals Targets](#2-core-web-vitals-targets)
3. [Performance Budget](#3-performance-budget)
4. [Frontend Performance](#4-frontend-performance)
   - [4.1 Bundle Optimization](#41-bundle-optimization)
   - [4.2 Code Splitting & Lazy Loading](#42-code-splitting--lazy-loading)
   - [4.3 Image Optimization](#43-image-optimization)
   - [4.4 CSS Optimization](#44-css-optimization)
   - [4.5 Font Optimization](#45-font-optimization)
   - [4.6 Caching Strategy](#46-caching-strategy)
   - [4.7 React Performance Patterns](#47-react-performance-patterns)
5. [Backend Performance](#5-backend-performance)
   - [5.1 API Response Time Targets](#51-api-response-time-targets)
   - [5.2 Database Query Optimization](#52-database-query-optimization)
   - [5.3 Server-Side Caching](#53-server-side-caching)
   - [5.4 Connection Pooling](#54-connection-pooling)
   - [5.5 Compression & Payload Optimization](#55-compression--payload-optimization)
   - [5.6 Render Cold Start Mitigation](#56-render-cold-start-mitigation)
6. [AI Component Performance](#6-ai-component-performance)
   - [6.1 Hugging Face Cold Start](#61-hugging-face-cold-start)
   - [6.2 NER Result Caching](#62-ner-result-caching)
   - [6.3 Translation Caching](#63-translation-caching)
   - [6.4 WebSocket Optimization](#64-websocket-optimization)
7. [Database Performance](#7-database-performance)
   - [7.1 Index Strategy](#71-index-strategy)
   - [7.2 Aggregation Pipeline Optimization](#72-aggregation-pipeline-optimization)
   - [7.3 Query Pattern Optimization](#73-query-pattern-optimization)
   - [7.4 Storage Optimization](#74-storage-optimization)
8. [Network Performance](#8-network-performance)
   - [8.1 CDN Strategy](#81-cdn-strategy)
   - [8.2 HTTP/2 & Headers](#82-http2--headers)
   - [8.3 API Payload Optimization](#83-api-payload-optimization)
9. [Mobile Performance](#9-mobile-performance)
   - [9.1 Mobile-First Metrics](#91-mobile-first-metrics)
   - [9.2 Progressive Web App](#92-progressive-web-app)
   - [9.3 Touch & Interaction Performance](#93-touch--interaction-performance)
10. [Real-Time Consultation Performance](#10-real-time-consultation-performance)
11. [Performance Monitoring](#11-performance-monitoring)
    - [11.1 Lighthouse Automation](#111-lighthouse-automation)
    - [11.2 Real User Monitoring](#112-real-user-monitoring)
    - [11.3 Backend Monitoring](#113-backend-monitoring)
12. [Performance Testing](#12-performance-testing)
13. [Performance Regression Prevention](#13-performance-regression-prevention)
14. [Scaling & Growth Plan](#14-scaling--growth-plan)
15. [Performance Checklist — Pre-Launch](#15-performance-checklist--pre-launch)

---

## 1. Performance Philosophy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       PERFORMANCE PRINCIPLES                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PERFORMANCE IS PATIENT SAFETY                                           │
│  A patient in distress cannot wait 8 seconds for the app to load.      │
│  The SOS button must render in the first 1.5 seconds. Risk alerts       │
│  must fire in under 50ms. Every millisecond matters in healthcare.      │
│                                                                          │
│  MOBILE 4G IS THE BASELINE — NOT DESKTOP BROADBAND                      │
│  70% of India's healthcare seekers use smartphones on 4G networks.      │
│  Vijayawada, Goa, and Puducherry have inconsistent connectivity.        │
│  Every performance decision is benchmarked on a mid-range Android       │
│  device on a 4G connection — not a MacBook on WiFi.                     │
│                                                                          │
│  MEASURE FIRST — OPTIMIZE SECOND                                         │
│  No premature optimization. Every optimization is preceded by a         │
│  Lighthouse audit, a network waterfall, or a query explain plan.        │
│  We fix what the data tells us to fix.                                  │
│                                                                          │
│  FREE PERFORMANCE — NO PAID CDNS OR SERVICES                            │
│  Vercel's free CDN, MongoDB Atlas M0, browser-native APIs, and          │
│  zero-cost optimizations (code splitting, compression, caching)         │
│  deliver production-grade performance without a paid infrastructure.    │
│                                                                          │
│  PROGRESSIVE ENHANCEMENT                                                 │
│  Core features work on slow connections with graceful degradation.      │
│  Hospital list works without maps. Chatbot works without voice.         │
│  Consultation works without live translation (text shown as-is).        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Web Vitals Targets

### Target Thresholds

| Metric | Full Name | Target | Good | Needs Work |
|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | **< 2.5s** | < 2.5s | 2.5–4.0s | > 4.0s |
| **FID** | First Input Delay | **< 100ms** | < 100ms | 100–300ms | > 300ms |
| **CLS** | Cumulative Layout Shift | **< 0.1** | < 0.1 | 0.1–0.25 | > 0.25 |
| **INP** | Interaction to Next Paint | **< 200ms** | < 200ms | 200–500ms | > 500ms |
| **FCP** | First Contentful Paint | **< 1.8s** | < 1.8s | 1.8–3.0s | > 3.0s |
| **TTFB** | Time to First Byte | **< 600ms** | < 600ms | 600ms–1.5s | > 1.5s |

### Page-Level Performance Targets

| Page | LCP Target | Priority | Notes |
|---|---|---|---|
| Landing Page `/` | < 1.5s | 🔴 Critical | First impression — must be fast |
| Login / Signup | < 2.0s | 🔴 Critical | Auth is gateway to healthcare |
| Patient Dashboard `/patient` | < 2.5s | 🔴 Critical | First page after login |
| Live Consultation | < 2.0s | 🔴 Critical | Real-time — delay unacceptable |
| Hospital Finder (map) | < 3.0s | 🟠 High | Map tiles have inherent delay |
| AI Chatbot | < 2.0s | 🟠 High | AI response delay excluded |
| Prescription PDF | < 1.0s | 🔴 Critical | PDF generation is client-side |
| Doctor Dashboard | < 2.5s | 🟠 High | Complex data but not emergency |
| Analytics | < 3.5s | 🟡 Medium | Charts are deferred |
| Admin Dashboard | < 3.0s | 🟡 Medium | Non-critical admin workflow |

### Lighthouse Score Targets

| Category | Target Score | Current Baseline | Strategy |
|---|---|---|---|
| **Performance** | ≥ 90 mobile · ≥ 95 desktop | — | Code split · compress · cache |
| **Accessibility** | ≥ 95 | — | WCAG 2.1 AA · aria labels |
| **Best Practices** | ≥ 95 | — | HTTPS · no console errors |
| **SEO** | ≥ 90 | — | Meta tags · semantic HTML |
| **PWA** | ≥ 80 | — | Service worker · manifest |

---

## 3. Performance Budget

### Bundle Size Budget

```
JAVASCRIPT BUNDLE BUDGET (compressed gzip sizes)
═══════════════════════════════════════════════════════════════════════════

Initial load (code that blocks render):
  ┌─────────────────────────────────────────────────────────────────┐
  │  main chunk (React + router + auth)    ≤ 60 KB  gzipped       │
  │  vendor chunk (React DOM)              ≤ 40 KB  gzipped       │
  │  Total initial JS                      ≤ 100 KB gzipped  ✅   │
  └─────────────────────────────────────────────────────────────────┘

Lazy-loaded chunks (loaded on demand):
  ┌─────────────────────────────────────────────────────────────────┐
  │  Patient portal chunk                  ≤ 80 KB  gzipped       │
  │  Doctor portal chunk                   ≤ 80 KB  gzipped       │
  │  Admin portal chunk                    ≤ 40 KB  gzipped       │
  │  Leaflet.js + map                      ≤ 60 KB  gzipped       │
  │  Chart.js (doctor analytics)           ≤ 50 KB  gzipped       │
  │  jsPDF + html2canvas                   ≤ 90 KB  gzipped       │
  └─────────────────────────────────────────────────────────────────┘

Total application JS budget:
  ┌─────────────────────────────────────────────────────────────────┐
  │  All JS loaded through app lifetime    ≤ 600 KB gzipped       │
  └─────────────────────────────────────────────────────────────────┘

CSS BUDGET:
  ┌─────────────────────────────────────────────────────────────────┐
  │  Tailwind CSS (purged)                 ≤ 15 KB  gzipped       │
  │  Leaflet CSS                           ≤ 5 KB   gzipped       │
  │  Total CSS                             ≤ 20 KB  gzipped  ✅   │
  └─────────────────────────────────────────────────────────────────┘

IMAGE BUDGET (per page):
  ┌─────────────────────────────────────────────────────────────────┐
  │  Hero images (landing)                 ≤ 80 KB  WebP          │
  │  Avatars / icons                       ≤ 10 KB  each          │
  │  Total images per page                 ≤ 200 KB               │
  └─────────────────────────────────────────────────────────────────┘

NETWORK TRANSFER BUDGET (full page load on 4G):
  ┌─────────────────────────────────────────────────────────────────┐
  │  Initial page transfer                 ≤ 400 KB               │
  │  Time on 4G (10 Mbps): 400KB / 10Mbps = ~320ms transfer      │
  │  Target: render < 2.5s on mid-range Android / 4G             │
  └─────────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Performance

### 4.1 Bundle Optimization

```javascript
// client/vite.config.js — Production build optimization

import { defineConfig }   from 'vite';
import react              from '@vitejs/plugin-react';
import path               from 'path';

export default defineConfig({
  plugins: [
    react({
      // Only include React refresh in dev mode
      fastRefresh: process.env.NODE_ENV === 'development',
    }),
  ],

  build: {
    // ── Output targets ────────────────────────────────────────────────
    target:          'es2020',       // Modern syntax — smaller bundles
    minify:          'esbuild',      // Fastest minifier (built into Vite)
    cssMinify:       true,
    sourcemap:       false,          // No source maps in production

    // ── Chunk splitting strategy ──────────────────────────────────────
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React core (changes rarely — cached aggressively)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // UI libraries (separate chunk — also cached)
          'vendor-ui':    ['axios'],

          // Heavy libraries: loaded only when used
          'vendor-map':   ['leaflet'],
          'vendor-charts':['chart.js'],
          'vendor-pdf':   ['jspdf', 'html2canvas'],
          'vendor-socket':['socket.io-client'],
        },
        // Content-hash filenames for cache busting
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // ── Warn if any chunk exceeds budget ─────────────────────────────
    chunkSizeWarningLimit: 100,   // 100 KB → warn in build output
  },

  // ── Path aliases (shorter imports = smaller source maps) ─────────────
  resolve: {
    alias: {
      '@':           path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages':      path.resolve(__dirname, 'src/pages'),
      '@hooks':      path.resolve(__dirname, 'src/hooks'),
      '@services':   path.resolve(__dirname, 'src/services'),
      '@utils':      path.resolve(__dirname, 'src/utils'),
      '@constants':  path.resolve(__dirname, 'src/constants'),
    },
  },
});
```

### 4.2 Code Splitting & Lazy Loading

```javascript
// client/src/App.jsx — Route-level code splitting

import React, { lazy, Suspense } from 'react';
import { Routes, Route }         from 'react-router-dom';
import FullScreenLoader           from '@components/common/FullScreenLoader';

// ── Eager imports (critical path — always loaded) ──────────────────────
import LandingPage         from '@pages/LandingPage';
import LoginPage           from '@pages/auth/LoginPage';
import SignupPage          from '@pages/auth/SignupPage';
import OTPVerifyPage       from '@pages/auth/OTPVerifyPage';
import ForgotPasswordPage  from '@pages/auth/ForgotPasswordPage';
import ResetPasswordPage   from '@pages/auth/ResetPasswordPage';

// ── Lazy imports — Patient portal (only loaded when patient logs in) ───
const PatientLayout        = lazy(() => import('@layouts/PatientLayout'));
const PatientDashboard     = lazy(() => import('@pages/patient/PatientDashboard'));
const ChatbotPage          = lazy(() => import('@pages/patient/ChatbotPage'));
const AppointmentListPage  = lazy(() => import('@pages/patient/AppointmentListPage'));
const BookAppointmentPage  = lazy(() => import('@pages/patient/BookAppointmentPage'));
const HospitalFinderPage   = lazy(() => import('@pages/patient/HospitalFinderPage'));
const MedicalHistoryPage   = lazy(() => import('@pages/patient/MedicalHistoryPage'));
const ConsultationDetailPage=lazy(() => import('@pages/patient/ConsultationDetailPage'));
const PrescriptionListPage = lazy(() => import('@pages/patient/PrescriptionListPage'));
const PrescriptionDetailPage=lazy(() => import('@pages/patient/PrescriptionDetailPage'));
const LiveTranscriptPage   = lazy(() => import('@pages/patient/LiveTranscriptPage'));
const RemindersPage        = lazy(() => import('@pages/patient/RemindersPage'));

// ── Lazy imports — Doctor portal ───────────────────────────────────────
const DoctorLayout         = lazy(() => import('@layouts/DoctorLayout'));
const DoctorDashboard      = lazy(() => import('@pages/doctor/DoctorDashboard'));
const PatientQueuePage     = lazy(() => import('@pages/doctor/PatientQueuePage'));
const ConsultationPanelPage= lazy(() => import('@pages/doctor/ConsultationPanelPage'));
const ClinicalNotesPage    = lazy(() => import('@pages/doctor/ClinicalNotesPage'));
const PrescriptionBuilderPage=lazy(()=> import('@pages/doctor/PrescriptionBuilderPage'));
const PatientHistoryPage   = lazy(() => import('@pages/doctor/PatientHistoryPage'));
const AIAssistantPage      = lazy(() => import('@pages/doctor/AIAssistantPage'));
const ScheduleManagerPage  = lazy(() => import('@pages/doctor/ScheduleManagerPage'));
const AnalyticsPage        = lazy(() => import('@pages/doctor/AnalyticsPage'));

// ── Lazy imports — Admin portal ────────────────────────────────────────
const AdminLayout          = lazy(() => import('@layouts/AdminLayout'));
const AdminDashboard       = lazy(() => import('@pages/admin/AdminDashboard'));
const UserManagementPage   = lazy(() => import('@pages/admin/UserManagementPage'));
const SecurityMonitorPage  = lazy(() => import('@pages/admin/SecurityMonitorPage'));

// ── Page-level Suspense fallback ──────────────────────────────────────
const PageSuspense = ({ children }) => (
  <Suspense fallback={<FullScreenLoader message="Loading..." />}>
    {children}
  </Suspense>
);

const App = () => (
  <Routes>
    {/* Eagerly loaded — no Suspense needed */}
    <Route path="/"                element={<LandingPage />} />
    <Route path="/login"           element={<LoginPage />} />
    <Route path="/signup"          element={<SignupPage />} />
    <Route path="/verify-otp"      element={<OTPVerifyPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password"  element={<ResetPasswordPage />} />

    {/* Lazy loaded — Suspense wraps each portal */}
    <Route path="/patient/*" element={
      <PageSuspense>
        <PrivateRoute role="patient">
          <PatientLayout />
        </PrivateRoute>
      </PageSuspense>
    } />

    <Route path="/doctor/*" element={
      <PageSuspense>
        <PrivateRoute role="doctor">
          <DoctorLayout />
        </PrivateRoute>
      </PageSuspense>
    } />

    <Route path="/admin/*" element={
      <PageSuspense>
        <PrivateRoute role="admin">
          <AdminLayout />
        </PrivateRoute>
      </PageSuspense>
    } />
  </Routes>
);

export default App;
```

### Component-Level Lazy Loading

```javascript
// Heavy components deferred until needed

// Leaflet map — loaded only when Hospital Finder page mounts
const LeafletMap = lazy(() =>
  import('leaflet').then(leaflet => ({
    default: () => <LeafletMapComponent L={leaflet} />,
  }))
);

// Chart.js — loaded only when Analytics page mounts
const AnalyticsChart = lazy(() =>
  import('chart.js').then(() => import('@components/doctor/AnalyticsChart'))
);

// jsPDF — loaded only when patient clicks "Download PDF"
const downloadPrescriptionPDF = async (data) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');
  // Generate PDF...
};
```

---

### 4.3 Image Optimization

```javascript
// All images use WebP format with PNG fallback
// Sizes are specified to prevent layout shift (CLS)

// client/src/components/common/OptimizedImage.jsx
const OptimizedImage = ({ src, alt, width, height, className, lazy = true }) => (
  <picture>
    {/* Modern browsers: WebP */}
    <source
      srcSet={`${src}.webp`}
      type="image/webp"
    />
    {/* Fallback: PNG */}
    <img
      src={`${src}.png`}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      style={{ aspectRatio: `${width}/${height}` }}
      // aspect-ratio prevents CLS while image loads
    />
  </picture>
);

// SVG assets: imported directly (zero network request, inlined in bundle)
import { ReactComponent as Logo } from '@assets/images/logo.svg';

// Avatar placeholder: CSS-based initials (zero image request)
const AvatarInitials = ({ name, size = 40 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div
      className="rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
```

---

### 4.4 CSS Optimization

```javascript
// tailwind.config.js — Aggressive purging

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ── PurgeCSS: only include classes actually used in source ─────────
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    // Exclude test files and stories
    '!./src/**/*.test.{js,jsx}',
    '!./src/**/*.stories.{js,jsx}',
  ],

  theme: {
    extend: {
      // Custom brand colours (prevents arbitrary value classes)
      colors: {
        primary:   '#1A56DB',
        secondary: '#0E9F6E',
        accent:    '#7E3AF2',
        danger:    '#E02424',
        warning:   '#FF8A4C',
      },
      // Custom font stack (system fonts — zero download)
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },

  // ── Disable unused variants (reduces generated CSS size) ──────────
  corePlugins: {
    // Only enable what we actually use
    float:         false,
    clear:         false,
    skew:          false,
    caretColor:    false,
  },
};
```

---

### 4.5 Font Optimization

```html
<!-- client/index.html — Font loading strategy -->
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Preconnect to font origin for faster DNS resolution -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Font: display=swap prevents invisible text while font loads -->
  <!-- Subset: only Latin + Devanagari chars (for Hindi) -->
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap&subset=latin"
    rel="stylesheet"
  />

  <!-- Preload critical above-fold font subset -->
  <link
    rel="preload"
    href="/fonts/inter-400.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <title>MediVoice AI</title>
</head>
```

**Font Strategy:** System fonts as primary (zero download), Inter as enhancement only. Indian language scripts (Tamil, Telugu, etc.) use OS-native fonts — no download required for script rendering.

---

### 4.6 Caching Strategy

```javascript
// Vercel deploys automatically set these headers

// vercel.json — Cache configuration
{
  "headers": [
    {
      // Immutable assets (JS/CSS with content hash filenames)
      // Safe to cache for 1 year — hash changes when content changes
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      // HTML pages — no cache (always get fresh HTML shell)
      "source": "/(.*).html",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    },
    {
      // PWA manifest — short cache
      "source": "/manifest.json",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    },
    {
      // Icons — long cache (rarely change)
      "source": "/icons/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=2592000" }
      ]
    }
  ]
}
```

**Browser Cache Hierarchy:**

```
CACHE DURATION BY ASSET TYPE
═══════════════════════════════════════════════════════════════════════════

Asset Type             Cache Duration     Strategy
──────────────────────────────────────────────────────────────────────────
JS/CSS (hashed)        1 year             Immutable (content hash = auto-bust)
Fonts (.woff2)         1 year             Immutable
Images (hashed)        1 year             Immutable
PWA manifest           24 hours           Short (can update app name/icons)
HTML shell             No cache           Always fresh (references hashed assets)
API responses          No cache (default) Dynamic data — browser never caches
Map tiles (OSM)        Browser default    ~1 hour (browser handles automatically)
```

---

### 4.7 React Performance Patterns

```javascript
// Pattern 1: Memoize expensive list renders
// client/src/pages/doctor/PatientQueuePage.jsx

import { memo, useCallback, useMemo } from 'react';

// PatientQueueItem only re-renders when its specific appointment changes
const PatientQueueItem = memo(({ appointment, onStart }) => {
  return (
    <div className="queue-item">
      <span>{appointment.patientName}</span>
      <RiskBadge level={appointment.patientRiskLevel} />
      <button onClick={() => onStart(appointment.id)}>Start</button>
    </div>
  );
}, (prev, next) =>
  // Custom comparator: only re-render if these specific fields change
  prev.appointment.id === next.appointment.id &&
  prev.appointment.status === next.appointment.status &&
  prev.appointment.patientRiskLevel === next.appointment.patientRiskLevel
);

const PatientQueuePage = () => {
  const [appointments, setAppointments] = useState([]);

  // Stable callback — doesn't cause child re-renders
  const handleStart = useCallback((appointmentId) => {
    navigate(`/doctor/consultation/${appointmentId}/live`);
  }, [navigate]);

  // Expensive sort: only recompute when appointments change
  const sortedByRisk = useMemo(() =>
    [...appointments].sort((a, b) => {
      const PRIORITY = { RED: 0, YELLOW: 1, GREEN: 2 };
      return PRIORITY[a.patientRiskLevel] - PRIORITY[b.patientRiskLevel];
    }),
    [appointments]
  );

  return (
    <div>
      {sortedByRisk.map(appt => (
        <PatientQueueItem
          key={appt.id}
          appointment={appt}
          onStart={handleStart}
        />
      ))}
    </div>
  );
};
```

```javascript
// Pattern 2: Virtualize long lists
// For medical history with 100+ records — only render visible items

import { FixedSizeList as List } from 'react-window';  // Free package

const MedicalHistoryPage = () => {
  const [consultations, setConsultations] = useState([]);

  const ConsultationRow = ({ index, style }) => (
    <div style={style}>   {/* style is REQUIRED for virtual positioning */}
      <MedicalHistoryItem consultation={consultations[index]} />
    </div>
  );

  // Only render ~10 items visible in viewport — not all 100+
  return (
    <List
      height={600}          // Container height
      itemCount={consultations.length}
      itemSize={100}        // Row height in px
      width="100%"
    >
      {ConsultationRow}
    </List>
  );
};
```

```javascript
// Pattern 3: Debounce search inputs to prevent API flooding
// client/src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

const useDebounce = (value, delayMs = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
};

// Usage: Doctor search — only fires API after user stops typing 300ms
const DoctorSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchDoctors({ query: debouncedSearch });
    }
  }, [debouncedSearch]);  // Only fires when debounced value changes
};
```

```javascript
// Pattern 4: Intersection Observer for lazy data loading
// Load older consultation records only when user scrolls to them

import { useRef, useEffect } from 'react';

const useLazyLoad = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }  // Fire when 10% visible
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
};

// In MedicalHistoryPage — load next page when sentinel becomes visible
const loadMoreRef = useLazyLoad(loadNextPage);
// <div ref={loadMoreRef} /> at bottom of list
```

---

## 5. Backend Performance

### 5.1 API Response Time Targets

| Endpoint | Target | Acceptable | Unacceptable | Primary Optimization |
|---|---|---|---|---|
| `POST /auth/login` | < 400ms | < 500ms | > 700ms | bcrypt cost factor tuned |
| `GET /auth/me` | < 100ms | < 200ms | > 400ms | DB index on userId |
| `GET /doctors/search` | < 200ms | < 300ms | > 500ms | Compound index + field projection |
| `POST /patients/appointments` | < 300ms | < 500ms | > 800ms | Slot conflict check indexed |
| `POST /patients/chat` (AI) | < 2000ms | < 3000ms | > 5000ms | NER cache + fallback |
| `GET /patients/consultations` | < 200ms | < 300ms | > 500ms | Index on patientId+createdAt |
| `GET /doctors/me/queue` | < 150ms | < 250ms | > 400ms | Index on doctorId+scheduledAt |
| `POST /consultations/generate-notes` | < 3000ms | < 5000ms | > 8000ms | Async + NER cache |
| `GET /admin/security-logs` | < 300ms | < 500ms | > 800ms | Index on severity+createdAt |

### 5.2 Database Query Optimization

```javascript
// server/services/appointmentService.js — Optimized queries

// ── OPTIMIZED: Doctor queue query ─────────────────────────────────────
// Uses compound index: { doctorId: 1, scheduledAt: 1 }
const getDoctorQueue = async (doctorId) => {
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  return Appointment.find({
    doctorId,
    scheduledAt: { $gte: today, $lt: tomorrow },
    status:      { $in: ['confirmed', 'in_progress'] },
  })
  // ✅ Select only fields needed for queue UI — not entire document
  .select('patientId scheduledAt status patientRiskLevel chiefComplaint durationMinutes')
  .populate('patientId', 'firstName lastName')  // ✅ Limit populate fields
  .sort({ scheduledAt: 1 })
  .lean();  // ✅ Returns plain objects (faster than Mongoose documents)
};

// ── OPTIMIZED: Medical history with pagination ────────────────────────
// Uses compound index: { patientId: 1, createdAt: -1 }
const getPatientHistory = async (patientId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // ✅ Parallel: count + data (not sequential)
  const [total, consultations] = await Promise.all([
    Consultation.countDocuments({ patientId }),
    Consultation.find({ patientId })
      .select('createdAt status soapNote.assessment.probableDiagnosis prescriptionId')
      // ✅ Only top-level SOAP field — not full nested soapNote object
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    consultations,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// ── OPTIMIZED: Doctor search ──────────────────────────────────────────
// Uses compound index: { specialty: 1, city: 1, isVerified: 1 }
const searchDoctors = async ({ specialty, city, language, page = 1, limit = 10 }) => {
  const filter = {
    ...(specialty && { specialty }),
    ...(city      && { city }),
    ...(language  && { languagesSpoken: language }),
    isVerified: true,
    status:     { $ne: 'on_leave' },
  };

  const [total, doctors] = await Promise.all([
    Doctor.countDocuments(filter),
    Doctor.find(filter)
      // ✅ Only fields needed for search result cards
      .select('userId specialty city rating totalRatings experienceYears languagesSpoken status isVerified')
      .populate('userId', 'firstName lastName')
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return { doctors, pagination: { total, page, limit } };
};

// ── ANTI-PATTERN avoided: Never do this ──────────────────────────────
// ❌ BAD: Loads entire document including transcript (could be 15KB)
// const consult = await Consultation.findById(id);

// ✅ GOOD: Select only what you need
// const consult = await Consultation.findById(id).select('status soapNote').lean();
```

---

### 5.3 Server-Side Caching

```javascript
// server/utils/cache.js — Multi-purpose in-memory cache

const NodeCache = require('node-cache');

// ── Cache instances by purpose ─────────────────────────────────────────
const caches = {
  // NER results: same symptom text → same entities (1hr TTL)
  ner: new NodeCache({ stdTTL: 3600, maxKeys: 500, useClones: false }),

  // Translation results: same text+lang pair → same translation (30min TTL)
  translation: new NodeCache({ stdTTL: 1800, maxKeys: 1000, useClones: false }),

  // Hospital data: GPS coords → nearby hospitals (10min TTL)
  hospitals: new NodeCache({ stdTTL: 600, maxKeys: 200, useClones: false }),

  // Doctor search results: same query params → same results (5min TTL)
  doctorSearch: new NodeCache({ stdTTL: 300, maxKeys: 100, useClones: false }),

  // Analytics: expensive aggregations (15min TTL — not real-time needed)
  analytics: new NodeCache({ stdTTL: 900, maxKeys: 50, useClones: false }),
};

/**
 * Cache wrapper — get or compute
 * @param {string} cacheName  - Which cache to use
 * @param {string} key        - Cache key
 * @param {Function} fetchFn  - Async function to compute value on cache miss
 * @returns {Promise<any>}    - Cached or freshly computed value
 */
const cached = async (cacheName, key, fetchFn) => {
  const cache  = caches[cacheName];
  const cached = cache.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const fresh = await fetchFn();
  if (fresh !== null && fresh !== undefined) {
    cache.set(key, fresh);
  }
  return fresh;
};

// ── Cache invalidation helpers ─────────────────────────────────────────
const invalidate = {
  // Called when a doctor updates their profile or availability
  doctorSearch: (doctorCity, specialty) => {
    caches.doctorSearch.keys()
      .filter(k => k.includes(doctorCity) || k.includes(specialty))
      .forEach(k => caches.doctorSearch.del(k));
  },

  // Called when new consultation is completed (analytics stale)
  analytics: (doctorId) => {
    caches.analytics.del(`analytics:${doctorId}`);
  },
};

// ── Usage example: Doctor analytics ──────────────────────────────────
const getDoctorAnalytics = async (doctorId) => {
  const cacheKey = `analytics:${doctorId}`;

  return cached('analytics', cacheKey, async () => {
    // This MongoDB aggregation is expensive — only runs every 15min
    return performAnalyticsAggregation(doctorId);
  });
};

module.exports = { cached, invalidate, caches };
```

---

### 5.4 Connection Pooling

```javascript
// server/config/db.js — Connection pool tuning

await mongoose.connect(process.env.MONGODB_URI, {
  // ── Pool configuration ────────────────────────────────────────────────
  maxPoolSize:  5,      // Atlas M0 allows 500 — we use 5 conservatively
  minPoolSize:  1,      // Keep 1 warm connection at all times

  // ── Timing configuration ──────────────────────────────────────────────
  maxIdleTimeMS:            30000,  // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,   // Fail fast if Atlas unreachable
  socketTimeoutMS:          45000,  // Drop stuck queries after 45s
  connectTimeoutMS:         10000,  // Initial connection timeout
  heartbeatFrequencyMS:     10000,  // Check connection health every 10s

  // ── Performance options ───────────────────────────────────────────────
  compressors: ['zlib'],    // Compress wire protocol data ~40-60%
  retryWrites: true,        // Auto-retry on transient failures
  w:           'majority',  // Confirm writes on majority of nodes
});

// ── Connection event handling for monitoring ──────────────────────────
mongoose.connection.on('connected',    () => console.log('✅ MongoDB: Connected'));
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB: Disconnected'));
mongoose.connection.on('error',        (err) => console.error('❌ MongoDB:', err));
```

---

### 5.5 Compression & Payload Optimization

```javascript
// server/app.js — Response compression

const compression = require('compression');

// Gzip all responses > 1 KB
// Achieves 60-80% size reduction on JSON API responses
app.use(compression({
  level:     6,         // Balance: 1 (fastest) to 9 (smallest) — 6 is sweet spot
  threshold: 1024,      // Only compress if response > 1KB
  filter: (req, res) => {
    // Don't compress if client explicitly doesn't accept
    if (req.headers['x-no-compression']) return false;
    // Use compression's default filter for everything else
    return compression.filter(req, res);
  },
}));

// ── Field projection best practices ──────────────────────────────────
// Always project only necessary fields to reduce payload size

// ❌ NEVER: Returns entire user document (1-2KB including all fields)
const user = await User.findById(id);

// ✅ ALWAYS: Returns only needed fields (< 200 bytes)
const user = await User.findById(id).select('firstName lastName role city').lean();

// ── Response envelope efficiency ──────────────────────────────────────
// Use consistent, minimal envelope structure
const sendSuccess = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });
//  Not: res.json({ status: 'success', statusCode: 200, data, timestamp, ... })
//  Minimal keys = smaller payload
```

---

### 5.6 Render Cold Start Mitigation

```javascript
// Render free tier spins down after 15 minutes of inactivity
// Cold start: first request takes 15-20 seconds

// Strategy 1: Keep-alive ping (from client)
// client/src/utils/keepAlive.js

const BACKEND_URL = import.meta.env.VITE_API_URL;
const PING_INTERVAL = 13 * 60 * 1000;  // Ping every 13 minutes

let pingInterval;

export const startKeepAlive = () => {
  if (pingInterval) return;  // Already running
  pingInterval = setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
    } catch (_) {}  // Silent — only for keep-alive
  }, PING_INTERVAL);
};

export const stopKeepAlive = () => {
  clearInterval(pingInterval);
  pingInterval = null;
};

// server/routes/healthRoutes.js — Ultra-lightweight health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
  // No DB call — just confirms server is awake
});

// Strategy 2: Pre-warm AI models on server start
// server/server.js

const { preWarmNERModel } = require('./services/ai/nerService');

server.listen(PORT, async () => {
  console.log(`🚀 MediVoice API running on port ${PORT}`);

  // Warm HF model 5s after start (don't block startup)
  setTimeout(async () => {
    try {
      await preWarmNERModel();
      console.log('✅ NER model warmed');
    } catch (_) {
      console.warn('⚠️  NER pre-warm failed — will warm on first request');
    }
  }, 5000);
});

// Strategy 3: Frontend loading state for cold start
// Show "Server is waking up..." message if first request takes > 3s
const useWithColdStartWarning = (apiCall) => {
  const [isSlowStart, setIsSlowStart] = useState(false);

  const call = async (...args) => {
    const timer = setTimeout(() => setIsSlowStart(true), 3000);
    try {
      return await apiCall(...args);
    } finally {
      clearTimeout(timer);
      setIsSlowStart(false);
    }
  };

  return { call, isSlowStart };
};
```

---

## 6. AI Component Performance

### 6.1 Hugging Face Cold Start

```
HUGGING FACE COLD START MITIGATION
═══════════════════════════════════════════════════════════════════════════

PROBLEM:
  Hugging Face free inference models "sleep" after inactivity.
  First request to a sleeping model: 20-30 seconds
  Subsequent requests: 100-500ms

SOLUTIONS APPLIED:

  1. SERVER START PRE-WARM (reduces cold start for first patient):
     On server boot → send a test NER request to wake up the model
     5-second delay to not block other startup tasks

  2. NER RESULT CACHE (reduces repeated API calls by ~80%):
     Common symptom phrases cached for 1 hour
     "chest pain and fever" → same result → cache hit → 0ms

  3. KEYWORD FALLBACK (makes cold start invisible):
     If HF API takes > 8 seconds → keyword rules activate
     User gets risk assessment immediately (no delay visible)
     Background: HF response ignored once keyword fallback returned

  4. GRACEFUL LOADING UI:
     Chatbot shows "Analyzing your symptoms..." spinner
     Risk detection still works via keywords (Layer 1)
     NER result comes async — updates UI when available

RESPONSE TIME TARGETS:
  ┌────────────────────────────────────────────────────────────┐
  │  Risk detection (keyword layer):    < 10ms — always       │
  │  Risk detection (NER confirmation): < 2s — when model warm│
  │  NER extraction (cache hit):        < 5ms                 │
  │  NER extraction (model warm):       100–500ms             │
  │  NER extraction (model cold):       20-30s → use fallback │
  └────────────────────────────────────────────────────────────┘
```

### 6.2 NER Result Caching

```javascript
// server/services/ai/nerCache.js

const NodeCache = require('node-cache');
const cache     = new NodeCache({
  stdTTL:    3600,   // 1 hour — medical terms don't change meaning
  maxKeys:   500,    // Max 500 unique phrases cached
  useClones: false,  // Return reference (faster — we never mutate cached objects)
  checkperiod: 600,  // Check for expired keys every 10 minutes
});

let cacheHits   = 0;
let cacheMisses = 0;

const cachedNER = async (text, nerFn) => {
  // Normalize key: lowercase + trim + first 150 chars (avoid huge keys)
  const key = text.toLowerCase().trim().substring(0, 150);

  const cached = cache.get(key);
  if (cached !== undefined) {
    cacheHits++;
    return cached;
  }

  cacheMisses++;
  const result = await nerFn(text);

  if (result) {
    cache.set(key, result);
  }

  return result;
};

// Cache statistics (log every 30 minutes for monitoring)
setInterval(() => {
  const total   = cacheHits + cacheMisses;
  const hitRate = total > 0 ? Math.round((cacheHits / total) * 100) : 0;
  console.log(`[NER Cache] Hit rate: ${hitRate}% (${cacheHits} hits / ${total} total)`);
  // Reset counters
  cacheHits   = 0;
  cacheMisses = 0;
}, 30 * 60 * 1000);

module.exports = { cachedNER };
```

### 6.3 Translation Caching

```javascript
// server/services/ai/translateService.js — Cache integration

const NodeCache = require('node-cache');
const transCache = new NodeCache({ stdTTL: 1800, maxKeys: 1000 }); // 30 min TTL

const translateText = async (text, sourceLang, targetLang) => {
  if (!text?.trim() || sourceLang === targetLang) return text || '';

  // Cache key: language pair + first 100 chars of text
  const cacheKey = `${sourceLang}:${targetLang}:${text.substring(0, 100)}`;
  const cached   = transCache.get(cacheKey);
  if (cached) return cached;

  const result = await callLibreTranslate(text, sourceLang, targetLang)
                  .catch(() => callMyMemory(text, sourceLang, targetLang));

  if (result) transCache.set(cacheKey, result);
  return result || `[Translation unavailable] ${text}`;
};
```

### 6.4 WebSocket Optimization

```javascript
// server/websocket/transcriptSocket.js — Performance optimizations

const setupTranscriptSocket = (io) => {

  // ── Socket.io configuration for real-time performance ─────────────────
  // Already set at server level:
  // io = new Server(server, {
  //   pingTimeout:  10000,     // Drop inactive sockets after 10s
  //   pingInterval: 5000,      // Heartbeat every 5s
  //   transports:   ['websocket', 'polling'],  // WebSocket preferred
  //   perMessageDeflate: {     // Compress messages > 1KB
  //     threshold: 1024,
  //   },
  // });

  io.on('connection', (socket) => {

    socket.on('transcript:patient', async ({ consultationId, text, sourceLang, targetLang }) => {

      // ── Performance: validate first (fail fast before async work) ─────
      if (!text?.trim() || text.length > 1000) return;

      // ── Performance: parallel execution ──────────────────────────────
      // Don't await translation before starting risk check
      // Both run concurrently
      const [translationResult, riskResult] = await Promise.allSettled([
        translateText(text, sourceLang, targetLang),
        assessRiskLevel(text),   // Keyword check: instant (< 10ms)
      ]);

      const translated = translationResult.status === 'fulfilled'
        ? translationResult.value
        : text;  // Fallback: show original if translation fails

      const risk = riskResult.status === 'fulfilled'
        ? riskResult.value
        : { level: 'GREEN' };

      // ── Performance: single broadcast (not multiple emits) ────────────
      // One message to doctor room with all data
      io.to(`consultation:${consultationId}`).emit('transcript:from-patient', {
        original:   text,
        translated,
        speaker:    'Patient',
        timestamp:  Date.now(),  // Unix timestamp (smaller than ISO string)
        isRisky:    risk.level !== 'GREEN',
      });

      // Only emit risk alert if actually risky (don't spam)
      if (risk.level !== 'GREEN') {
        io.to(`consultation:${consultationId}`).emit('risk:alert', {
          level:     risk.level,
          condition: risk.condition,
          message:   risk.message,
        });
      }
    });
  });
};
```

---

## 7. Database Performance

### 7.1 Index Strategy

```javascript
// server/config/indexSetup.js — Run once on DB initialization

const setupIndexes = async () => {
  console.log('Setting up MongoDB indexes...');

  // ── USERS — highest frequency queries ─────────────────────────────────
  await User.collection.createIndex({ email: 1 }, { unique: true, background: true });
  await User.collection.createIndex({ role: 1, isActive: 1 }, { background: true });

  // ── DOCTORS — search-critical ──────────────────────────────────────────
  // Core search: covers specialty + city + verified filter in one index
  await Doctor.collection.createIndex(
    { specialty: 1, city: 1, isVerified: 1 },
    { background: true, name: 'idx_doctor_search' }
  );
  await Doctor.collection.createIndex({ city: 1, rating: -1 }, { background: true });
  await Doctor.collection.createIndex({ userId: 1 }, { unique: true, background: true });

  // ── APPOINTMENTS — daily queue & booking ───────────────────────────────
  // Doctor queue: this index is hit every page load for doctors
  await Appointment.collection.createIndex(
    { doctorId: 1, scheduledAt: 1 },
    { background: true, name: 'idx_doctor_queue' }
  );
  await Appointment.collection.createIndex(
    { patientId: 1, scheduledAt: -1 },
    { background: true, name: 'idx_patient_history' }
  );
  // Reminder cron: find upcoming reminders to send
  await Appointment.collection.createIndex(
    { scheduledAt: 1, status: 1, reminderSent24h: 1 },
    { background: true, name: 'idx_reminder_cron' }
  );

  // ── CONSULTATIONS — medical history & analytics ────────────────────────
  await Consultation.collection.createIndex(
    { patientId: 1, createdAt: -1 },
    { background: true }
  );
  await Consultation.collection.createIndex(
    { doctorId: 1, createdAt: -1 },
    { background: true }
  );
  // Analytics: top diagnoses aggregation
  await Consultation.collection.createIndex(
    { doctorId: 1, 'soapNote.assessment.probableDiagnosis': 1, createdAt: -1 },
    { background: true, name: 'idx_analytics_diagnoses', sparse: true }
  );

  // ── REMINDERS — medication schedule ───────────────────────────────────
  await Reminder.collection.createIndex(
    { patientId: 1, active: 1 },
    { background: true }
  );
  // Cron deactivation: find expired reminders
  await Reminder.collection.createIndex(
    { endDate: 1, active: 1 },
    { background: true }
  );

  // ── OTP — TTL auto-delete ──────────────────────────────────────────────
  await OTP.collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, background: true }  // Auto-delete at expiresAt
  );
  await OTP.collection.createIndex({ email: 1, type: 1, isUsed: 1 }, { background: true });

  // ── SECURITY LOGS — TTL + admin queries ───────────────────────────────
  await SecurityLog.collection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 7776000, background: true }  // Auto-delete after 90 days
  );
  await SecurityLog.collection.createIndex(
    { severity: 1, createdAt: -1 },
    { background: true }
  );

  console.log('✅ All indexes created');
};
```

### 7.2 Aggregation Pipeline Optimization

```javascript
// server/services/analyticsService.js — Optimized aggregations

const getDoctorAnalytics = async (doctorId) => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // ── Optimization 1: $match FIRST to minimize documents processed ──────
  // ── Optimization 2: $project EARLY to reduce memory per document ──────
  // ── Optimization 3: All aggregations in single pipeline (not multiple) ─

  const [weeklyStats, topDiagnoses, riskTrend] = await Promise.all([

    // Weekly patient count by day of week
    Appointment.aggregate([
      // $match uses index: doctorId + scheduledAt
      { $match: { doctorId: mongoose.Types.ObjectId(doctorId), scheduledAt: { $gte: monthAgo } }},
      // $project early: only extract the day, discard rest
      { $project: { dayOfWeek: { $dayOfWeek: '$scheduledAt' }}},
      { $group: { _id: '$dayOfWeek', count: { $sum: 1 }}},
      { $sort: { _id: 1 }},
    ]),

    // Top 5 diagnoses
    Consultation.aggregate([
      // $match uses index: doctorId + probableDiagnosis
      { $match: {
        doctorId: mongoose.Types.ObjectId(doctorId),
        createdAt: { $gte: monthAgo },
        'soapNote.doctorConfirmed': true,
        'soapNote.assessment.probableDiagnosis': { $exists: true, $ne: '' },
      }},
      // $project: only the field we need
      { $project: { diagnosis: '$soapNote.assessment.probableDiagnosis' }},
      { $group: { _id: '$diagnosis', count: { $sum: 1 }}},
      { $sort: { count: -1 }},
      { $limit: 5 },  // Only top 5
    ]),

    // Risk trend
    Appointment.aggregate([
      { $match: { doctorId: mongoose.Types.ObjectId(doctorId), scheduledAt: { $gte: monthAgo }}},
      { $project: { week: { $week: '$scheduledAt' }, risk: '$patientRiskLevel' }},
      { $group: { _id: { week: '$week', risk: '$risk' }, count: { $sum: 1 }}},
      { $sort: { '_id.week': 1 }},
    ]),
  ]);

  return { weeklyStats, topDiagnoses, riskTrend };
};
```

### 7.3 Query Pattern Optimization

```javascript
// Query optimization cheat sheet for MediVoice AI

// ── Use .lean() for read-only queries (2-3x faster) ───────────────────
// Mongoose documents have prototype methods, virtuals, change tracking
// .lean() skips all that — returns plain JS object
const appointments = await Appointment.find(filter).lean();  // 2-3x faster
// When NOT to use .lean(): when you need save(), instance methods, virtuals

// ── Use projection to limit fields returned ───────────────────────────
// ❌ Loads 3KB consultation doc (transcript + soapNote + everything)
const c = await Consultation.findById(id);

// ✅ Loads only what the patient list view needs (~200 bytes)
const c = await Consultation.findById(id)
  .select('createdAt status soapNote.assessment.probableDiagnosis')
  .lean();

// ── Use countDocuments for pagination totals (not .find().length) ─────
// ❌ Loads all documents just to count them
const total = (await Consultation.find({ patientId })).length;

// ✅ Count only — much faster, uses index
const total = await Consultation.countDocuments({ patientId });

// ── Use .explain() in development to verify index usage ───────────────
// Run in MongoDB shell or Mongoose:
const explanation = await Appointment
  .find({ doctorId, scheduledAt: { $gte: today } })
  .explain('executionStats');
// Check: winningPlan.inputStage.stage should be 'IXSCAN' not 'COLLSCAN'

// ── Batch reads instead of N+1 queries ────────────────────────────────
// ❌ N+1: One query per patient in the queue (12 queries for 12-patient queue)
const queue = await Appointment.find({ doctorId, status: 'confirmed' });
for (const appt of queue) {
  appt.patient = await User.findById(appt.patientId);  // 12 extra queries!
}

// ✅ Single .populate() or two parallel queries
const queue = await Appointment
  .find({ doctorId, status: 'confirmed' })
  .populate('patientId', 'firstName lastName')  // One extra query for all patients
  .lean();
```

### 7.4 Storage Optimization

```javascript
// Keep document sizes small to stay within MongoDB Atlas M0 (512MB)

// ── Transcript compression strategy ──────────────────────────────────
// Instead of storing full rich objects per line, store minimal structure
// Each transcript line: ~150 bytes (not ~600 bytes)

// ❌ Bloated transcript line (600+ bytes):
{
  _id:           ObjectId,
  speaker:       "Patient",
  originalText:  "मुझे सीने में दर्द है",
  translatedText: "மார்பில் வலி இருக்கிறது",
  originalLang:  "hi-IN",
  targetLang:    "ta-IN",
  isRisky:       false,
  timestamp:     ISODate("2026-04-15T10:32:15.123Z"),
  confidence:    0.95,
  wordCount:     5,
  // ... other fields
}

// ✅ Lean transcript line (150 bytes):
{
  sp:  "P",          // P = Patient, D = Doctor (1 char vs 6)
  ot:  "मुझे दर्द", // originalText (abbreviated key)
  tt:  "வலி உள்ளது", // translatedText
  ts:  1713176535,   // Unix timestamp (4 bytes vs ISO string ~28 bytes)
  r:   false,        // isRisky
}

// ── Auto-cleanup expired data ─────────────────────────────────────────
// OTPs: TTL index auto-deletes after 10 minutes (never accumulate)
// Security logs: TTL index auto-deletes after 90 days
// Inactive reminders: Cron job deactivates, admin cleanup quarterly

// ── Storage monitoring ────────────────────────────────────────────────
const getStorageStats = async () => {
  const stats = await mongoose.connection.db.stats();
  const usedMB = Math.round(stats.dataSize / 1024 / 1024);
  const limitMB = 512;  // M0 limit
  const pct = Math.round((usedMB / limitMB) * 100);

  console.log(`[Storage] ${usedMB}MB / ${limitMB}MB used (${pct}%)`);

  if (pct >= 80) {
    console.warn(`[Storage] ⚠️  80% of Atlas M0 limit reached. Consider upgrade.`);
  }

  return { usedMB, limitMB, percentage: pct };
};
```

---

## 8. Network Performance

### 8.1 CDN Strategy

```
VERCEL CDN — FREE TIER CONFIGURATION
═══════════════════════════════════════════════════════════════════════════

Vercel automatically distributes to their global CDN (free tier):
  ✅ Edge locations worldwide including Mumbai (closest to Phase 1 cities)
  ✅ HTTP/2 by default
  ✅ Automatic Brotli/Gzip compression
  ✅ Automatic HTTPS/TLS
  ✅ DDoS protection included
  ✅ Smart routing to nearest edge

For Indian users:
  Mumbai edge → Chennai, Hyderabad, Bangalore (~10-30ms)
  Singapore edge → Delhi, Goa, Puducherry (~50-70ms)

STATIC ASSET DELIVERY:
  JS/CSS bundles → Served from nearest Vercel edge
  Images (SVG/WebP) → Served from nearest Vercel edge
  Fonts → Served from Google Fonts CDN (preconnected)

API REQUESTS:
  → Always go to Render backend (no CDN for dynamic data)
  → Render Mumbai region → Hyderabad, Chennai < 50ms latency
  → Render Mumbai region → Delhi, Goa, Puducherry < 100ms latency
```

### 8.2 HTTP/2 & Headers

```javascript
// server/app.js — Security + performance headers

app.use(helmet({
  // Enable HTTP/2 server push hints (Vercel handles actual H2)
  hsts: {
    maxAge:            31536000,
    includeSubDomains: true,
    preload:           true,      // Submit to HSTS preload list
  },

  // Referrer policy: reduces data sent in Referer headers
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ── Resource hints in HTML (helps browser prioritize downloads) ───────
// Add to client/index.html:
// <link rel="preconnect" href="https://api.medivoice.ai" />
// <link rel="dns-prefetch" href="https://api-inference.huggingface.co" />
// <link rel="dns-prefetch" href="https://libretranslate.com" />
// <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
```

### 8.3 API Payload Optimization

```javascript
// Minimize API response payload size throughout the application

// ── 1. Consistent field projection in all API handlers ────────────────

// Patient appointment list — only what the UI card needs
const appointmentListFields = 'patientId doctorId scheduledAt status ' +
  'patientRiskLevel chiefComplaint durationMinutes';

// Doctor queue — only what the queue row needs
const queueCardFields = 'patientId scheduledAt status ' +
  'patientRiskLevel riskCondition chiefComplaint';

// ── 2. Paginate all list endpoints ────────────────────────────────────
// Default limit: 10 items. Max limit: 50 items.
const DEFAULT_LIMIT = 10;
const MAX_LIMIT     = 50;

const getPaginationParams = (query) => ({
  page:  Math.max(1, parseInt(query.page)  || 1),
  limit: Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT)),
});

// ── 3. Remove null/undefined from responses ──────────────────────────
// MongoDB lean() returns objects with null fields
// Filter them out to reduce payload
const stripNulls = (obj) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== null && v !== undefined)
  );

// ── 4. Timestamp optimization ─────────────────────────────────────────
// ISO string: "2026-04-15T10:32:15.123Z" = 24 bytes
// Unix timestamp: 1713176535 = 10 bytes (2.4x smaller)
// For high-volume transcript lines: use Unix timestamps
const toUnix = (date) => Math.floor(new Date(date).getTime() / 1000);
```

---

## 9. Mobile Performance

### 9.1 Mobile-First Metrics

```
MOBILE PERFORMANCE BASELINE
═══════════════════════════════════════════════════════════════════════════

Test device profile (simulates median Indian smartphone user):
  Device:      Mid-range Android (Redmi Note 12, ~₹15,000)
  CPU:         Snapdragon 685 (throttled to 4x slower in testing)
  Memory:      4GB RAM
  Network:     4G LTE (simulated: 20Mbps down, 5Mbps up, 40ms RTT)
  Location:    Hyderabad (closest city to Mumbai Render region)

LIGHTHOUSE MOBILE SIMULATION:
  Simulated network: Slow 4G (12.5 Mbps down, 375 KB/s, 70ms RTT)
  CPU slowdown:      4x (simulates mid-range Android)

CRITICAL MOBILE METRICS:
  ┌──────────────────────────────────────────────────────────┐
  │  First byte (TTFB):           < 600ms                   │
  │  First Contentful Paint:      < 1.8s                    │
  │  Largest Contentful Paint:    < 2.5s                    │
  │  Time to Interactive:         < 3.5s                    │
  │  Total Blocking Time:         < 200ms                   │
  │  Cumulative Layout Shift:     < 0.1                     │
  └──────────────────────────────────────────────────────────┘

MOBILE-SPECIFIC OPTIMIZATIONS APPLIED:
  ✅ System fonts (zero font download on Android)
  ✅ CSS containment: layout/paint boundaries prevent reflow cascade
  ✅ passive: true on scroll event listeners
  ✅ will-change: transform on animated elements (SOS pulse, loading)
  ✅ touch-action: manipulation on interactive elements
  ✅ Hardware acceleration for SOS button animation
  ✅ Bottom navigation (thumb-friendly — no reaching to top)
  ✅ 48px minimum tap target height (more generous than 44px minimum)
```

### 9.2 Progressive Web App

```javascript
// client/public/manifest.json — PWA configuration
{
  "name":             "MediVoice AI",
  "short_name":       "MediVoice",
  "description":      "AI-Powered Healthcare Communication",
  "start_url":        "/",
  "scope":            "/",
  "display":          "standalone",
  "orientation":      "portrait-primary",
  "theme_color":      "#1A56DB",
  "background_color": "#FFFFFF",
  "lang":             "hi",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "shortcuts": [
    {
      "name":      "Emergency SOS",
      "url":       "/patient?sos=true",
      "icons":     [{ "src": "/icons/sos-shortcut.png", "sizes": "96x96" }]
    },
    {
      "name":      "Book Appointment",
      "url":       "/patient/appointments",
      "icons":     [{ "src": "/icons/book-shortcut.png", "sizes": "96x96" }]
    }
  ]
}

// client/src/sw.js — Service Worker for offline capability
// (Registered in main.jsx using Vite PWA plugin - free)

const CACHE_NAME = 'medivoice-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
];

// Cache static shell for offline access
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Serve from cache when offline (static assets only — not API data)
self.addEventListener('fetch', (event) => {
  // Only cache GET requests to same origin
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;  // Never cache API calls

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});
```

### 9.3 Touch & Interaction Performance

```css
/* client/src/index.css — Mobile performance CSS */

/* Prevent 300ms tap delay on mobile */
html {
  touch-action: manipulation;
}

/* Prevent hover effects from sticking on touch devices */
@media (hover: none) {
  .hover\:bg-blue-700:hover {
    background-color: inherit;
  }
}

/* Hardware-accelerate the SOS pulse animation */
[data-testid="sos-button"] {
  will-change: transform;
  transform: translateZ(0);  /* Force GPU layer */
}

/* Smooth scroll on iOS */
.overflow-y-auto,
.overflow-y-scroll {
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection on interactive elements (better touch UX) */
button,
[role="button"] {
  user-select: none;
  -webkit-user-select: none;
}

/* CSS containment — limits reflow to the component */
.queue-card,
.appointment-card,
.doctor-card {
  contain: layout style;  /* Changes inside can't affect outside layout */
}
```

---

## 10. Real-Time Consultation Performance

```
LIVE CONSULTATION PERFORMANCE REQUIREMENTS
═══════════════════════════════════════════════════════════════════════════

For live consultation to feel natural, the speech→translate→display
pipeline must complete in under 2 seconds end-to-end.

PIPELINE TIMING BREAKDOWN:
  ┌─────────────────────────────────────────────────────────────────┐
  │  Step                          Target    Notes                  │
  ├─────────────────────────────────────────────────────────────────┤
  │  1. Web Speech API ASR         < 300ms   Browser-native, instant│
  │  2. WebSocket emit to server   < 50ms    Local network overhead │
  │  3. LibreTranslate API call    < 1500ms  Main bottleneck        │
  │  4. Risk detection (keyword)   < 10ms    Runs in parallel       │
  │  5. WebSocket broadcast        < 50ms    Socket.io room emit    │
  │  6. React state update + render< 16ms    < 1 frame (60fps)      │
  ├─────────────────────────────────────────────────────────────────┤
  │  TOTAL END-TO-END              < 2000ms  Target achieved ✅     │
  └─────────────────────────────────────────────────────────────────┘

OPTIMIZATIONS FOR REAL-TIME FEEL:

  1. INTERIM TEXT STREAMING:
     Web Speech API fires interim results every ~50ms while speaking
     These are shown immediately (before translation completes)
     Creates impression of instant response even before translation

  2. PARALLEL PROCESSING:
     Translation and risk check run concurrently (Promise.allSettled)
     Not sequential (translation → then risk check)
     Saves ~500ms per transcript event

  3. TRANSLATION CACHE:
     Common medical phrases are cached for 30 minutes
     "Chest pain" → Tamil translation served from cache in < 5ms
     Cache hit rate target: > 30% for common phrases

  4. WEBSOCKET KEEP-ALIVE:
     Socket.io heartbeat: every 5 seconds
     Prevents connection dropping during long consultation pauses
     Reconnection: automatic (socket.io built-in)

  5. PROGRESSIVE DISPLAY:
     Interim text: shown in italics, immediately
     Final text: shown in full weight, after 300ms
     Translation: replaces placeholder after ~1.5s
     This creates perceived performance even if actual is slower
```

---

## 11. Performance Monitoring

### 11.1 Lighthouse Automation

```javascript
// package.json — Lighthouse CI scripts

{
  "scripts": {
    "perf:audit":     "lighthouse http://localhost:3000 --output json --output-path ./reports/lighthouse.json",
    "perf:patient":   "lighthouse http://localhost:3000/patient --output html --chrome-flags='--headless'",
    "perf:mobile":    "lighthouse http://localhost:3000 --preset=perf --emulated-form-factor=mobile",
    "perf:compare":   "lighthouse http://localhost:3000 --output json | node scripts/comparePerf.js"
  }
}

// .github/workflows/ci.yml — Automated Lighthouse in CI

- name: Lighthouse Performance Audit
  run: |
    npm install -g lighthouse
    lighthouse http://localhost:3000 \
      --output json \
      --chrome-flags="--headless --no-sandbox" \
      --output-path=./lighthouse-report.json

- name: Assert Lighthouse Scores
  run: |
    node -e "
      const report = require('./lighthouse-report.json');
      const perf = report.categories.performance.score * 100;
      const a11y = report.categories.accessibility.score * 100;

      console.log('Performance:', perf);
      console.log('Accessibility:', a11y);

      if (perf < 85)  { console.error('❌ Performance score below 85'); process.exit(1); }
      if (a11y < 90)  { console.error('❌ Accessibility score below 90'); process.exit(1); }

      console.log('✅ All Lighthouse targets met');
    "
```

### 11.2 Real User Monitoring

```javascript
// client/src/utils/performance.js — Lightweight RUM (no paid service)

// Report Core Web Vitals using web-vitals library (free, 1.5KB)
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const reportVital = (metric) => {
  // In production: send to a free analytics endpoint
  // For MVP: log to console and track manually
  const entry = {
    name:   metric.name,
    value:  Math.round(metric.value),
    rating: metric.rating,  // 'good' | 'needs-improvement' | 'poor'
    id:     metric.id,
  };

  // Log poor performance for investigation
  if (metric.rating === 'poor') {
    console.warn(`[Performance] Poor ${metric.name}: ${metric.value}ms`, entry);
  }

  // Post to your own backend endpoint (no cost)
  if (process.env.NODE_ENV === 'production') {
    navigator.sendBeacon('/api/v1/metrics', JSON.stringify(entry));
    // sendBeacon: non-blocking, fire-and-forget — doesn't delay page unload
  }
};

// Measure all Core Web Vitals automatically
onCLS(reportVital);   // Cumulative Layout Shift
onFID(reportVital);   // First Input Delay
onFCP(reportVital);   // First Contentful Paint
onLCP(reportVital);   // Largest Contentful Paint
onTTFB(reportVital);  // Time to First Byte
onINP(reportVital);   // Interaction to Next Paint

// Custom performance mark: Time to interactive for consultation
export const markConsultationReady = () => {
  performance.mark('consultation-ready');
  performance.measure(
    'time-to-consultation',
    'navigationStart',
    'consultation-ready'
  );

  const measure = performance.getEntriesByName('time-to-consultation')[0];
  console.log(`[Performance] Consultation ready in ${Math.round(measure.duration)}ms`);
};
```

### 11.3 Backend Monitoring

```javascript
// server/middleware/performanceMonitor.js

const performanceMonitor = (req, res, next) => {
  const start    = Date.now();
  const endpoint = `${req.method} ${req.route?.path || req.path}`;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status   = res.statusCode;

    // Log slow requests (> 500ms is noteworthy for non-AI endpoints)
    const SLOW_THRESHOLD = endpoint.includes('chat') ||
                           endpoint.includes('generate-notes') ||
                           endpoint.includes('translate')
      ? 3000   // AI endpoints: 3s threshold
      : 500;   // Standard endpoints: 500ms threshold

    if (duration > SLOW_THRESHOLD) {
      console.warn(`[Slow API] ${endpoint} → ${status} in ${duration}ms`);
    }

    // Structured log for all production requests
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({
        type:     'api_request',
        endpoint,
        status,
        duration,
        slow:     duration > SLOW_THRESHOLD,
      }));
    }
  });

  next();
};

// Apply to all routes
app.use(performanceMonitor);
```

---

## 12. Performance Testing

```javascript
// server/tests/performance/loadTest.js — Simple load testing (no paid tools)

const http    = require('http');
const cluster = require('cluster');

// Simulate concurrent users
const CONCURRENT_USERS = 50;
const TEST_DURATION_MS = 30000;  // 30 seconds
const ENDPOINT         = 'http://localhost:5000/api/v1/doctors/search?specialty=GP&city=Delhi';

const makeRequest = () => new Promise((resolve) => {
  const start = Date.now();
  http.get(ENDPOINT, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve({ status: res.statusCode, time: Date.now() - start }));
  }).on('error', () => resolve({ status: 0, time: Date.now() - start }));
});

const runLoadTest = async () => {
  console.log(`Load test: ${CONCURRENT_USERS} concurrent users for ${TEST_DURATION_MS / 1000}s`);

  const results   = [];
  const startTime = Date.now();

  while (Date.now() - startTime < TEST_DURATION_MS) {
    const batch = await Promise.all(
      Array.from({ length: CONCURRENT_USERS }, makeRequest)
    );
    results.push(...batch);
    await new Promise(r => setTimeout(r, 100));  // Brief pause between batches
  }

  const successful  = results.filter(r => r.status === 200);
  const avgTime     = results.reduce((sum, r) => sum + r.time, 0) / results.length;
  const p95         = results.map(r => r.time).sort((a, b) => a - b)[Math.floor(results.length * 0.95)];

  console.log('\n📊 LOAD TEST RESULTS:');
  console.log(`Total requests:    ${results.length}`);
  console.log(`Success rate:      ${Math.round(successful.length / results.length * 100)}%`);
  console.log(`Avg response time: ${Math.round(avgTime)}ms`);
  console.log(`P95 response time: ${p95}ms`);
  console.log(`Target (P95 < 300ms): ${p95 < 300 ? '✅ PASS' : '❌ FAIL'}`);
};

runLoadTest();
```

---

## 13. Performance Regression Prevention

```javascript
// .github/workflows/perf-check.yml — Block PRs that regress performance

name: Performance Check

on:
  pull_request:
    branches: [main]

jobs:
  bundle-size:
    name: 📦 Bundle Size Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd client && npm ci && npm run build

      - name: Check bundle sizes
        run: |
          node -e "
            const { readdirSync, statSync } = require('fs');
            const path = require('path');

            const distDir   = './client/dist/assets';
            const jsFiles   = readdirSync(distDir).filter(f => f.endsWith('.js'));
            const maxChunk  = 100 * 1024;  // 100KB per chunk limit
            let failed      = false;

            jsFiles.forEach(file => {
              const size = statSync(path.join(distDir, file)).size;
              const kb   = Math.round(size / 1024);
              const status = size > maxChunk ? '❌' : '✅';
              console.log(\`\${status} \${file}: \${kb}KB\`);
              if (size > maxChunk) failed = true;
            });

            if (failed) {
              console.error('Bundle size budget exceeded. Refactor before merging.');
              process.exit(1);
            }
            console.log('✅ All chunks within budget');
          "

  lighthouse-check:
    name: 🏠 Lighthouse Check
    runs-on: ubuntu-latest
    needs: bundle-size
    steps:
      - uses: actions/checkout@v4
      - run: npm install && npm start &
      - run: npx wait-on http://localhost:3000
      - name: Run Lighthouse
        run: npx lighthouse http://localhost:3000 --score-threshold=85
```

---

## 14. Scaling & Growth Plan

### Free Tier Limits & Upgrade Triggers

```
PERFORMANCE SCALING ROADMAP
═══════════════════════════════════════════════════════════════════════════

CURRENT: MVP (0–500 active users)
  All services on free tier
  Performance targets: achievable at this scale
  MongoDB: ~28MB / 512MB limit (5%)
  Render: May spin down but keep-alive prevents most cold starts

────────────────────────────────────────────────────────────────────

SCALE 1: 500–2,000 users (still free)
  MongoDB: ~112MB / 512MB (22%) — still safe
  Render: Memory pressure may appear — monitor
  Action:  Expand NER cache TTL 1hr → 4hrs (reduce HF API calls)
           Enable gzip at nginx level if added
           Review slow query logs weekly

────────────────────────────────────────────────────────────────────

SCALE 2: 2,000–5,000 users (~$16/month)
  Upgrade trigger: > 400MB MongoDB or Render memory alerts
  Upgrades:
    MongoDB Atlas M0 → M2 ($9/month, 2GB) ← most important
    Render Free → Render Starter ($7/month, no spin-down)
  Performance gain:
    No more cold starts (Render Starter: always-on)
    8x more DB storage headroom

────────────────────────────────────────────────────────────────────

SCALE 3: 5,000–20,000 users (~$50-100/month)
  Self-host LibreTranslate on Render (free Docker — no more rate limits)
  Redis for socket.io adapter (multi-instance WebSocket support)
  Add second Render instance for API (horizontal scaling)
  MongoDB Atlas M10 ($57/month, 10GB, dedicated cluster)

────────────────────────────────────────────────────────────────────

SCALE 4: 20,000+ users (custom budget)
  CDN for map tiles (CloudFront or own CDN)
  Dedicated AI inference (self-hosted Hugging Face models)
  Database sharding strategy
  Microservices extraction (AI service → separate process)
  Regional Render deployments (Mumbai + Singapore)
```

---

## 15. Performance Checklist — Pre-Launch

### Bundle & Assets

- [ ] Vite build runs without warnings above `chunkSizeWarningLimit: 100`
- [ ] Initial JS bundle < 100KB gzipped (vendor-react + main)
- [ ] Total JS across all chunks < 600KB gzipped
- [ ] CSS after Tailwind purge < 20KB gzipped
- [ ] All images converted to WebP with PNG fallback
- [ ] All images have explicit `width` and `height` attributes (prevents CLS)
- [ ] No unused `import` statements in production code
- [ ] Tree-shaking verified: Chart.js only in analytics chunk

### Core Web Vitals (Mobile 4G simulation)

- [ ] LCP < 2.5s on Lighthouse mobile simulation
- [ ] FCP < 1.8s on Lighthouse mobile simulation
- [ ] CLS < 0.1 (no unexpected layout shifts)
- [ ] TBT < 200ms (no long JavaScript tasks blocking main thread)
- [ ] Lighthouse Performance score ≥ 85 mobile
- [ ] Lighthouse Performance score ≥ 95 desktop

### API Performance

- [ ] `GET /doctors/search` responds in < 200ms (100 concurrent requests)
- [ ] `POST /auth/login` responds in < 400ms (bcrypt timing expected)
- [ ] `GET /doctors/me/queue` responds in < 150ms
- [ ] All database queries using `IXSCAN` (verified with .explain())
- [ ] No N+1 query patterns in any controller
- [ ] Response compression enabled (gzip on all responses > 1KB)

### AI Performance

- [ ] Risk detection keyword layer responds in < 10ms
- [ ] NER model pre-warmed on server start (20s cold start eliminated for first user)
- [ ] NER cache hit rate > 30% after 1 hour of traffic
- [ ] Translation cache working (same phrase returns cache hit)
- [ ] HF 503 fallback activates within 8 seconds (not 30 second wait)

### Real-Time Consultation

- [ ] Speech → display end-to-end < 2 seconds on 4G
- [ ] WebSocket connection established in < 1 second
- [ ] Translation cache miss < 2 seconds
- [ ] Interim text streaming visible within 300ms of speech start
- [ ] Risk alert fires within 50ms of trigger keyword detection
- [ ] Socket reconnects automatically after 5-second network drop

### Caching

- [ ] Static assets (JS/CSS) served with `Cache-Control: immutable` 1 year
- [ ] HTML served with `no-cache` (always fresh)
- [ ] Render keep-alive ping running every 13 minutes
- [ ] MongoDB NER cache operating with < 500 key limit
- [ ] Translation cache operating with < 1000 key limit

### Mobile

- [ ] SOS button renders within 1.5s of page load (patient safety critical)
- [ ] Bottom navigation accessible with thumb without scrolling
- [ ] All touch targets ≥ 48px height on mobile
- [ ] App installable (PWA) on Android Chrome
- [ ] App works with 0 network after install (static shell cached)
- [ ] No horizontal scroll on 375px viewport

---

<div align="center">

---

## Performance Plan Summary

```
╔══════════════════════════════════════════════════════════════════════╗
║          MEDIVOICE AI — PERFORMANCE PLAN AT A GLANCE                ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  Primary Target:    Mobile 4G · Mid-range Android · India           ║
║                                                                      ║
║  Core Web Vitals:                                                    ║
║    LCP:  < 2.5s    FCP:  < 1.8s    CLS:   < 0.1                   ║
║    TTFB: < 600ms   TBT:  < 200ms   INP:   < 200ms                  ║
║                                                                      ║
║  Lighthouse Targets:                                                 ║
║    Performance: ≥ 85 mobile · ≥ 95 desktop                         ║
║    Accessibility: ≥ 95   Best Practices: ≥ 95                       ║
║                                                                      ║
║  Bundle Budget:                                                      ║
║    Initial JS:  ≤ 100 KB gzipped                                    ║
║    Total JS:    ≤ 600 KB gzipped                                    ║
║    Total CSS:   ≤ 20 KB gzipped                                     ║
║                                                                      ║
║  API Targets:                                                        ║
║    Standard endpoints:  < 300ms                                     ║
║    AI endpoints:        < 2000ms (with cache)                       ║
║    Risk detection:      < 10ms (keyword layer — always)             ║
║                                                                      ║
║  Real-Time Consultation:                                             ║
║    Speech → display:    < 2000ms end-to-end                        ║
║    Risk alert:          < 50ms (patient safety critical)            ║
║                                                                      ║
║  Optimization Cost:   $0.00 — all free techniques                   ║
║  Monitoring Cost:     $0.00 — web-vitals + console logs             ║
║  Testing Cost:        $0.00 — Lighthouse CLI (free)                 ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Performance Plan v1.0**

*Fast healthcare is safe healthcare.*

![LCP](https://img.shields.io/badge/LCP%20Target-%3C2.5s-brightgreen?style=flat)
![Mobile](https://img.shields.io/badge/Mobile%20First-4G%20India-blue?style=flat)
![Bundle](https://img.shields.io/badge/Initial%20Bundle-%3C100KB-orange?style=flat)
![Lighthouse](https://img.shields.io/badge/Lighthouse-≥85%20Mobile-green?style=flat)
![Cost](https://img.shields.io/badge/Optimization%20Cost-$0.00-purple?style=flat)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
