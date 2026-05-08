<div align="center">

# 📊 MEDIVOICE AI — Analytics Plan
### Complete Data Analytics, Metrics & Intelligence Reference

![Document](https://img.shields.io/badge/Document-Analytics%20Plan-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Tools](https://img.shields.io/badge/Analytics%20Tools-100%25%20Free-brightgreen?style=for-the-badge)
![Cost](https://img.shields.io/badge/Infrastructure%20Cost-$0.00%2Fmonth-purple?style=for-the-badge)

> **The authoritative reference for every metric, KPI, analytics pipeline,
> and intelligence dashboard in MediVoice AI — enabling data-driven decisions
> for patients, doctors, admins, and platform operators.**

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication
**Analytics Philosophy:** Data serves better healthcare — not vanity metrics
**Tools:** MongoDB Aggregation · Chart.js · web-vitals · Custom dashboards — all free
**Privacy:** Patient health data is never used for analytics without consent

</div>

---

## 📋 Table of Contents

1. [Analytics Philosophy](#1-analytics-philosophy)
2. [Analytics Architecture Overview](#2-analytics-architecture-overview)
3. [Analytics Stack — 100% Free](#3-analytics-stack--100-free)
4. [Key Metrics Framework (North Star)](#4-key-metrics-framework-north-star)
5. [Patient Analytics](#5-patient-analytics)
   - [5.1 Patient Engagement Metrics](#51-patient-engagement-metrics)
   - [5.2 Health Outcome Indicators](#52-health-outcome-indicators)
   - [5.3 Appointment Journey Analytics](#53-appointment-journey-analytics)
   - [5.4 AI Chatbot Effectiveness](#54-ai-chatbot-effectiveness)
   - [5.5 Medication Adherence Analytics](#55-medication-adherence-analytics)
6. [Doctor Analytics Dashboard](#6-doctor-analytics-dashboard)
   - [6.1 Practice Performance Metrics](#61-practice-performance-metrics)
   - [6.2 Clinical Pattern Intelligence](#62-clinical-pattern-intelligence)
   - [6.3 Risk Trend Analysis](#63-risk-trend-analysis)
   - [6.4 Consultation Quality Metrics](#64-consultation-quality-metrics)
7. [Platform Analytics — Admin View](#7-platform-analytics--admin-view)
   - [7.1 Platform Health Metrics](#71-platform-health-metrics)
   - [7.2 User Growth Analytics](#72-user-growth-analytics)
   - [7.3 City Coverage Analytics](#73-city-coverage-analytics)
   - [7.4 Security Analytics](#74-security-analytics)
8. [AI Component Analytics](#8-ai-component-analytics)
   - [8.1 STT Accuracy & Usage](#81-stt-accuracy--usage)
   - [8.2 Translation Quality](#82-translation-quality)
   - [8.3 Risk Detection Analytics](#83-risk-detection-analytics)
   - [8.4 AI API Usage & Quota](#84-ai-api-usage--quota)
9. [Performance Analytics](#9-performance-analytics)
10. [Analytics Data Pipelines](#10-analytics-data-pipelines)
    - [10.1 Event Collection](#101-event-collection)
    - [10.2 MongoDB Aggregation Pipelines](#102-mongodb-aggregation-pipelines)
    - [10.3 Real-Time Metrics](#103-real-time-metrics)
11. [Analytics API Endpoints](#11-analytics-api-endpoints)
12. [Doctor Dashboard Implementation](#12-doctor-dashboard-implementation)
13. [Admin Analytics Implementation](#13-admin-analytics-implementation)
14. [Analytics Privacy & Compliance](#14-analytics-privacy--compliance)
15. [Analytics Testing](#15-analytics-testing)
16. [Analytics Roadmap](#16-analytics-roadmap)

---

## 1. Analytics Philosophy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       ANALYTICS PRINCIPLES                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  DATA SERVES BETTER HEALTHCARE — NOT VANITY METRICS                     │
│  We measure what makes doctors more effective, patients healthier,      │
│  and emergencies caught faster. We do not measure page views or         │
│  "engagement" for engagement's sake.                                    │
│                                                                          │
│  PATIENT PRIVACY IS NON-NEGOTIABLE                                       │
│  Individual patient health data is NEVER aggregated for platform        │
│  analytics without explicit consent. Analytics operate on:              │
│    • Aggregated, anonymized cohort data                                 │
│    • Operational platform data (response times, error rates)            │
│    • Consented doctor practice insights (doctor owns their data)        │
│                                                                          │
│  ANALYTICS ARE OWNED BY THE RIGHT ROLE                                  │
│  Doctors own their practice analytics — no cross-doctor comparison     │
│  without consent. Patients own their health data. Admins see           │
│  platform-level aggregates, never individual medical records.           │
│                                                                          │
│  FREE AND BUILT-IN                                                       │
│  MongoDB aggregation pipelines, Chart.js, and custom dashboards        │
│  deliver production-grade analytics at zero additional cost.            │
│  No Google Analytics. No Mixpanel. No third-party data sharing.        │
│                                                                          │
│  ACTIONABLE METRICS ONLY                                                 │
│  Every metric tracked must answer: "What decision does this enable?"   │
│  If the answer is "nothing" — we don't track it.                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Analytics Architecture Overview

```
MEDIVOICE AI — ANALYTICS ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

                    ┌──────────────────────────────────────┐
                    │         DATA COLLECTION LAYER        │
                    │                                      │
                    │  Client Events  │  Server Events     │
                    │  (React)        │  (Node.js)         │
                    │  • UI actions   │  • API calls       │
                    │  • Page views   │  • DB operations   │
                    │  • Web Vitals   │  • AI API calls    │
                    └──────────────────┬───────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────┐
                    │           STORAGE LAYER              │
                    │                                      │
                    │  MongoDB Atlas (Free M0)             │
                    │  Collections:                        │
                    │  • analytics_events (aggregated)     │
                    │  • platform_metrics (daily snapshots)│
                    │  • ai_usage_logs                     │
                    │  • performance_logs                  │
                    └──────────────────┬───────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────┐
                    │         PROCESSING LAYER             │
                    │                                      │
                    │  MongoDB Aggregation Pipelines       │
                    │  • Daily cron jobs                   │
                    │  • On-demand queries                 │
                    │  • Cached results (node-cache)       │
                    └──────────────────┬───────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────┐
                    │        PRESENTATION LAYER            │
                    │                                      │
                    │  Doctor Dashboard (Chart.js)         │
                    │  • Practice analytics                │
                    │  • Diagnosis trends                  │
                    │  • Risk level heatmaps               │
                    │                                      │
                    │  Admin Dashboard                     │
                    │  • Platform KPIs                     │
                    │  • User growth charts                │
                    │  • Security event trends             │
                    │                                      │
                    │  Internal Monitoring                 │
                    │  • Performance dashboards            │
                    │  • AI health metrics                 │
                    └──────────────────────────────────────┘

ANALYTICS DATA FLOWS:
  Platform ops  → server logs → MongoDB → aggregation → Admin dashboard
  Doctor data   → consultations → aggregation → Doctor dashboard
  Performance   → web-vitals   → beacon  → performance_logs → charts
  AI health     → API wrappers → ai_usage_logs → Admin monitoring
  Security      → SecurityLog  → aggregation → Security dashboard
```

---

## 3. Analytics Stack — 100% Free

| Tool | Version | Purpose | Cost |
|---|---|---|---|
| **MongoDB Aggregation** | Atlas M0 | All backend analytics pipelines | 🆓 Free |
| **Chart.js** | 4.x | Doctor analytics charts (React components) | 🆓 Free |
| **web-vitals** | 3.x | Core Web Vitals measurement (browser) | 🆓 Free |
| **node-cache** | 5.x | Cache expensive analytics queries (15min TTL) | 🆓 Free |
| **node-cron** | 3.x | Scheduled daily aggregation jobs | 🆓 Free |
| **Custom event tracker** | Custom | Lightweight event tracking (no 3rd party) | 🆓 Free |
| **navigator.sendBeacon** | Browser API | Non-blocking metrics reporting | 🆓 Free |

**No third-party analytics services:** No Google Analytics, Mixpanel, Amplitude, or any service that receives user data.

---

## 4. Key Metrics Framework (North Star)

### North Star Metric

```
╔══════════════════════════════════════════════════════════════════════╗
║                    NORTH STAR METRIC                                 ║
║                                                                      ║
║   "Successful Consultations per Month"                               ║
║                                                                      ║
║   Definition:                                                        ║
║   A consultation where:                                              ║
║   ✅ Patient consent was given                                       ║
║   ✅ Live transcript was generated (> 5 lines)                       ║
║   ✅ Doctor confirmed SOAP note                                      ║
║   ✅ Prescription was issued                                         ║
║   ✅ Patient downloaded or acknowledged the prescription             ║
║                                                                      ║
║   Why this metric:                                                   ║
║   It measures the complete, AI-enhanced healthcare delivery         ║
║   journey — not just registrations or logins. A platform that       ║
║   enables 1,000 quality consultations/month is delivering real       ║
║   healthcare value.                                                  ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Tier 1 — Platform Health KPIs

| KPI | Definition | Target (MVP) | Measured By |
|---|---|---|---|
| **Successful Consultations/Month** | Full consultation cycle completed | 100+ | consultations collection |
| **Appointment Completion Rate** | Completed / (Confirmed + No-show) | ≥ 85% | appointments aggregation |
| **Active Users / Month** | Users with ≥ 1 session in 30 days | 200+ | users + session logs |
| **SOS Alert Response Rate** | Patients who called 108 after RED alert | Track only | analytics_events |
| **Doctor Verification Rate** | Verified doctors / total doctor signups | ≥ 80% | doctors collection |

### Tier 2 — Engagement KPIs

| KPI | Definition | Target | Source |
|---|---|---|---|
| **Chatbot Engagement Rate** | Patients using chatbot / total patients | ≥ 60% | analytics_events |
| **Prescription Download Rate** | Downloaded / prescriptions issued | ≥ 90% | analytics_events |
| **Medication Reminder Acknowledgement** | Acknowledged / total reminders | ≥ 70% | reminders collection |
| **Language Pair Usage** | Most used translation pair | Track all | consultations |
| **Multi-Consultation Rate** | Patients with > 1 consultation | ≥ 40% | consultations aggregation |

### Tier 3 — Technical Health KPIs

| KPI | Target | Source |
|---|---|---|
| API p95 Response Time | < 500ms | performance_logs |
| AI Fallback Rate | < 10% (HF success > 90%) | ai_usage_logs |
| Translation Success Rate | > 95% | ai_usage_logs |
| Risk Alert False Positive Rate | < 5% | risk_events in consultations |
| Authentication Success Rate | > 99% | SecurityLog |

---

## 5. Patient Analytics

### 5.1 Patient Engagement Metrics

```javascript
// server/services/analytics/patientAnalyticsService.js

const getPatientEngagementMetrics = async (patientId) => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    appointmentStats,
    consultationStats,
    prescriptionStats,
    reminderStats,
    chatbotStats,
  ] = await Promise.all([

    // ── Appointment behaviour ────────────────────────────────────────────
    Appointment.aggregate([
      { $match: { patientId: mongoose.Types.ObjectId(patientId) }},
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
      }},
    ]),

    // ── Consultation completion ──────────────────────────────────────────
    Consultation.aggregate([
      { $match: { patientId: mongoose.Types.ObjectId(patientId) }},
      { $group: {
        _id:              null,
        totalConsults:    { $sum: 1 },
        completedConsults:{ $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }},
        avgDuration:      { $avg: '$actualDurationMinutes' },
        languagesUsed:    { $addToSet: '$patientLanguage' },
        totalRiskEvents:  { $sum: { $size: '$riskEvents' }},
      }},
    ]),

    // ── Prescription downloads ───────────────────────────────────────────
    Prescription.aggregate([
      { $match: { patientId: mongoose.Types.ObjectId(patientId) }},
      { $group: {
        _id:              null,
        totalPrescriptions:{ $sum: 1 },
        activePrescriptions:{ $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }},
      }},
    ]),

    // ── Medication reminder adherence ────────────────────────────────────
    Reminder.aggregate([
      { $match: { patientId: mongoose.Types.ObjectId(patientId), active: true }},
      { $group: {
        _id:                   null,
        totalReminders:        { $sum: 1 },
        totalAcknowledgements: { $sum: '$totalAcknowledgements' },
        activeDrugs:           { $addToSet: '$drugName' },
      }},
    ]),

    // ── Chatbot usage (from analytics_events) ────────────────────────────
    AnalyticsEvent.aggregate([
      { $match: {
        userId:    patientId.toString(),
        eventType: 'chatbot_message',
        createdAt: { $gte: monthAgo },
      }},
      { $group: {
        _id:            null,
        totalMessages:  { $sum: 1 },
        riskAlertsShown:{ $sum: { $cond: ['$metadata.riskAlert', 1, 0] }},
      }},
    ]),
  ]);

  return {
    appointments: buildAppointmentStats(appointmentStats),
    consultations: consultationStats[0] || {},
    prescriptions: prescriptionStats[0] || {},
    reminders:     reminderStats[0] || {},
    chatbot:       chatbotStats[0] || {},
  };
};
```

### 5.2 Health Outcome Indicators

```
PATIENT HEALTH OUTCOME TRACKING (Privacy-Safe)
═══════════════════════════════════════════════════════════════════════════

We track PATTERNS that indicate better health outcomes — never
individual health data for analytics without consent.

INDICATORS TRACKED (per patient, shown only to that patient):

  Consultation Frequency:
    Patients with regular consultations (> 1/month)
    Patients who re-booked after first consultation
    Average days between consultations

  Medication Adherence Proxy:
    % of medication reminders acknowledged
    Reminders disabled early (prescription completed? patient stopped?)
    Time between prescription issue and first reminder acknowledgement

  Emergency Prevention:
    Number of RED risk alerts received
    How many RED alerts led to SOS 108 calls (via tel: click tracking)
    How many RED alerts led to emergency hospital booking

  Prescription Engagement:
    Time from prescription issue to PDF download (< 5min = good)
    Patients who re-downloaded prescription (viewing it later)
    Patients who set up all reminders from prescription

WHAT WE DO NOT TRACK:
  ❌ Individual diagnosis trends (no "patient cohort by disease")
  ❌ Cross-patient health comparisons
  ❌ "Sicker" vs "healthier" patient segmentation
  ❌ Prescription contents for platform analytics
```

### 5.3 Appointment Journey Analytics

```javascript
// Funnel analytics: appointment booking conversion

// Track these events (anonymized — no PII):
const BOOKING_FUNNEL_EVENTS = [
  'booking_search_started',      // Patient opened doctor search
  'booking_doctor_viewed',       // Patient clicked a doctor card
  'booking_slot_selected',       // Patient picked a time slot
  'booking_complaint_entered',   // Patient typed chief complaint
  'booking_confirmed',           // Patient submitted booking
  'booking_confirmed_success',   // Server confirmed booking
];

// Conversion rates measured:
// search → doctor_viewed:      How compelling is search UX?
// doctor_viewed → slot:        Are doctors' profiles compelling?
// slot → confirmed:            Is the booking form easy?
// confirmed → success:         Any slot conflict errors?

// Target funnel conversion: > 60% from search_started → confirmed_success

const getBookingFunnelStats = async (dateRange) => {
  return AnalyticsEvent.aggregate([
    { $match: {
      eventType: { $in: BOOKING_FUNNEL_EVENTS },
      createdAt: { $gte: dateRange.start, $lte: dateRange.end },
    }},
    { $group: {
      _id:   '$eventType',
      count: { $sum: 1 },
    }},
    { $sort: { count: -1 }},
  ]);
};
```

### 5.4 AI Chatbot Effectiveness

```javascript
// Measure how effective the AI chatbot is at helping patients

const getChatbotEffectivenessMetrics = async (dateRange) => {
  return AnalyticsEvent.aggregate([
    { $match: {
      eventType: { $in: [
        'chatbot_message_sent',
        'chatbot_specialist_suggested',
        'chatbot_appointment_booked',
        'chatbot_risk_alert_triggered',
        'chatbot_sos_clicked',
      ]},
      createdAt: { $gte: dateRange.start, $lte: dateRange.end },
    }},
    { $group: {
      _id:   '$eventType',
      count: { $sum: 1 },
    }},
  ]);

  // Key ratios derived:
  // specialist_suggested / messages_sent = specialisation guidance rate
  // appointment_booked / specialist_suggested = booking conversion from AI
  // risk_alert_triggered / messages_sent = risk detection coverage rate
  // sos_clicked / risk_alert_triggered = emergency escalation rate
};
```

### 5.5 Medication Adherence Analytics

```javascript
// Measure medication reminder effectiveness (platform-level, anonymized)

const getMedicationAdherenceStats = async () => {
  return Reminder.aggregate([
    { $match: { active: true }},
    { $group: {
      _id:                   null,
      totalActiveReminders:  { $sum: 1 },
      totalAcknowledgements: { $sum: '$totalAcknowledgements' },
      // What % of reminders have been acknowledged at least once?
      remindersEngaged:      { $sum: {
        $cond: [{ $gt: ['$totalAcknowledgements', 0] }, 1, 0]
      }},
      // Average days from start to first acknowledgement
      avgFirstEngagementDays: { $avg: {
        $divide: [
          { $subtract: ['$lastAcknowledgedAt', '$startDate'] },
          86400000  // ms per day
        ]
      }},
    }},
    { $project: {
      totalActive:       '$totalActiveReminders',
      engagementRate:    {
        $multiply: [
          { $divide: ['$remindersEngaged', '$totalActiveReminders'] },
          100
        ]
      },
      avgAcknowledgements: { $divide: ['$totalAcknowledgements', '$totalActiveReminders'] },
    }},
  ]);
};
```

---

## 6. Doctor Analytics Dashboard

### 6.1 Practice Performance Metrics

```javascript
// server/services/analytics/doctorAnalyticsService.js
// These analytics belong to the doctor — never shared across doctors

const getDoctorPracticeAnalytics = async (doctorId, period = '30d') => {
  const startDate  = getPeriodStart(period);
  const cacheKey   = `analytics:doctor:${doctorId}:${period}`;

  // Cache for 15 minutes — analytics don't need to be real-time
  return cached('analytics', cacheKey, async () => {

    const [
      appointmentOverview,
      weeklyPatientCount,
      monthlyPatientCount,
      completionRate,
      noShowAnalysis,
      avgConsultDuration,
    ] = await Promise.all([

      // ── Today's overview ────────────────────────────────────────────────
      Appointment.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          scheduledAt: { $gte: getTodayStart() },
        }},
        { $group: {
          _id:       '$status',
          count:     { $sum: 1 },
        }},
      ]),

      // ── Weekly patient count (last 7 days, grouped by day) ──────────────
      Appointment.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          scheduledAt: { $gte: getWeekStart() },
          status:      'completed',
        }},
        { $group: {
          _id:   { $dateToString: { format: '%Y-%m-%d', date: '$scheduledAt' }},
          count: { $sum: 1 },
        }},
        { $sort: { _id: 1 }},
      ]),

      // ── Monthly patient count (last 30 days) ─────────────────────────────
      Appointment.countDocuments({
        doctorId:    mongoose.Types.ObjectId(doctorId),
        scheduledAt: { $gte: startDate },
        status:      'completed',
      }),

      // ── Appointment completion rate ──────────────────────────────────────
      Appointment.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          scheduledAt: { $gte: startDate },
        }},
        { $group: {
          _id:       null,
          total:     { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }},
          noShow:    { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] }},
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }},
        }},
        { $project: {
          total:          1,
          completed:      1,
          noShow:         1,
          cancelled:      1,
          completionRate: {
            $multiply: [
              { $divide: ['$completed', { $max: ['$total', 1] }] },
              100
            ]
          },
        }},
      ]),

      // ── No-show day analysis (which days have highest no-shows?) ─────────
      Appointment.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          status:      'no_show',
          scheduledAt: { $gte: startDate },
        }},
        { $group: {
          _id:   { $dayOfWeek: '$scheduledAt' },
          count: { $sum: 1 },
        }},
        { $sort: { count: -1 }},
        { $limit: 3 },  // Top 3 no-show days
      ]),

      // ── Average consultation duration ─────────────────────────────────────
      Consultation.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          status:      'completed',
          createdAt:   { $gte: startDate },
          actualDurationMinutes: { $exists: true, $gt: 0 },
        }},
        { $group: {
          _id:         null,
          avgDuration: { $avg: '$actualDurationMinutes' },
          minDuration: { $min: '$actualDurationMinutes' },
          maxDuration: { $max: '$actualDurationMinutes' },
        }},
      ]),
    ]);

    return {
      today: buildTodayStats(appointmentOverview),
      weekly: {
        byDay:  weeklyPatientCount,
        chart:  buildWeeklyChartData(weeklyPatientCount),
      },
      monthly: {
        total:          monthlyPatientCount,
        completionRate: completionRate[0]?.completionRate || 0,
        noShow:         completionRate[0]?.noShow || 0,
        cancelled:      completionRate[0]?.cancelled || 0,
      },
      noShowDays:         noShowAnalysis,
      avgConsultDuration: avgConsultDuration[0] || {},
    };
  });
};
```

### 6.2 Clinical Pattern Intelligence

```javascript
// Diagnoses, treatments, and clinical patterns (doctor's own data only)

const getDoctorClinicalPatterns = async (doctorId, period = '30d') => {
  const startDate = getPeriodStart(period);
  const cacheKey  = `analytics:clinical:${doctorId}:${period}`;

  return cached('analytics', cacheKey, async () => {

    const [
      topDiagnoses,
      prescriptionPatterns,
      riskLevelDistribution,
      specialtyInsights,
      languagePairUsage,
    ] = await Promise.all([

      // ── Top 10 diagnoses in period ────────────────────────────────────────
      Consultation.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          createdAt:   { $gte: startDate },
          'soapNote.doctorConfirmed': true,
          'soapNote.assessment.probableDiagnosis': { $exists: true, $ne: '' },
        }},
        { $group: {
          _id:   '$soapNote.assessment.probableDiagnosis',
          count: { $sum: 1 },
          // Anonymized: count only — no patient IDs
        }},
        { $sort: { count: -1 }},
        { $limit: 10 },
        { $project: { diagnosis: '$_id', count: 1, _id: 0 }},
      ]),

      // ── Most prescribed medications ───────────────────────────────────────
      Prescription.aggregate([
        { $match: {
          doctorId:  mongoose.Types.ObjectId(doctorId),
          issuedAt:  { $gte: startDate },
        }},
        { $unwind: '$medications' },
        { $group: {
          _id:   '$medications.drugName',
          count: { $sum: 1 },
          avgDuration: { $push: '$medications.duration' },
        }},
        { $sort: { count: -1 }},
        { $limit: 10 },
      ]),

      // ── Patient risk level distribution ───────────────────────────────────
      Appointment.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          scheduledAt: { $gte: startDate },
        }},
        { $group: {
          _id:   '$patientRiskLevel',
          count: { $sum: 1 },
        }},
      ]),

      // ── Follow-up rate: patients who re-booked ────────────────────────────
      Appointment.aggregate([
        { $match: {
          doctorId:    mongoose.Types.ObjectId(doctorId),
          status:      'completed',
          scheduledAt: { $gte: startDate },
        }},
        { $group: {
          _id:              '$patientId',
          consultCount:     { $sum: 1 },
        }},
        { $group: {
          _id:              null,
          totalPatients:    { $sum: 1 },
          repeatPatients:   { $sum: { $cond: [{ $gt: ['$consultCount', 1] }, 1, 0] }},
        }},
        { $project: {
          repeatRate: {
            $multiply: [
              { $divide: ['$repeatPatients', { $max: ['$totalPatients', 1] }] },
              100
            ]
          },
        }},
      ]),

      // ── Language pair usage in consultations ──────────────────────────────
      Consultation.aggregate([
        { $match: {
          doctorId:  mongoose.Types.ObjectId(doctorId),
          createdAt: { $gte: startDate },
        }},
        { $group: {
          _id: {
            patientLang: '$patientLanguage',
            doctorLang:  '$doctorLanguage',
          },
          count: { $sum: 1 },
        }},
        { $sort: { count: -1 }},
        { $limit: 5 },
      ]),
    ]);

    return {
      topDiagnoses,
      prescriptionPatterns,
      riskDistribution:  buildRiskPieData(riskLevelDistribution),
      followUpRate:      specialtyInsights[0]?.repeatRate || 0,
      languagePairUsage,
    };
  });
};
```

### 6.3 Risk Trend Analysis

```javascript
// Risk level trend over time — helps doctor identify deteriorating patient cohort

const getDoctorRiskTrends = async (doctorId, weeks = 4) => {
  const startDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

  return Appointment.aggregate([
    { $match: {
      doctorId:    mongoose.Types.ObjectId(doctorId),
      scheduledAt: { $gte: startDate },
    }},
    { $group: {
      _id: {
        // Group by ISO week number
        week:       { $isoWeek:    '$scheduledAt' },
        year:       { $isoWeekYear:'$scheduledAt' },
        riskLevel:  '$patientRiskLevel',
      },
      count: { $sum: 1 },
    }},
    { $sort: { '_id.year': 1, '_id.week': 1 }},
    { $group: {
      _id:   { week: '$_id.week', year: '$_id.year' },
      risks: { $push: { level: '$_id.riskLevel', count: '$count' }},
    }},
    { $sort: { '_id.year': 1, '_id.week': 1 }},
  ]);

  // Returns data structure ready for Chart.js stacked bar chart:
  // Week 1: RED=3, YELLOW=8, GREEN=15
  // Week 2: RED=5, YELLOW=11, GREEN=18
  // ...
};
```

### 6.4 Consultation Quality Metrics

```javascript
// Quality indicators for doctor self-improvement

const getConsultationQualityMetrics = async (doctorId, period = '30d') => {
  const startDate = getPeriodStart(period);

  const [
    soapQuality,
    transcriptDepth,
    prescriptionCompleteness,
  ] = await Promise.all([

    // ── SOAP note quality ──────────────────────────────────────────────────
    Consultation.aggregate([
      { $match: {
        doctorId:  mongoose.Types.ObjectId(doctorId),
        status:    'completed',
        createdAt: { $gte: startDate },
      }},
      { $project: {
        // Count filled SOAP sections
        soapScore: {
          $add: [
            { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$soapNote.subjective.chiefComplaint', ''] }}, 10] }, 1, 0] },
            { $cond: [{ $gt: [{ $size: { $ifNull: ['$soapNote.subjective.reportedSymptoms', []] }}, 0] }, 1, 0] },
            { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$soapNote.assessment.probableDiagnosis', ''] }}, 5] }, 1, 0] },
            { $cond: [{ $gt: [{ $size: { $ifNull: ['$soapNote.plan.prescribedMedications', []] }}, 0] }, 1, 0] },
          ]
        },
        doctorEdited:   '$soapNote.doctorEdited',
        doctorConfirmed:'$soapNote.doctorConfirmed',
      }},
      { $group: {
        _id:            null,
        avgSoapScore:   { $avg: '$soapScore' },
        confirmRate:    { $avg: { $cond: ['$doctorConfirmed', 1, 0] }},
        doctorEditRate: { $avg: { $cond: ['$doctorEdited', 1, 0] }},
        totalNotes:     { $sum: 1 },
      }},
    ]),

    // ── Transcript depth ──────────────────────────────────────────────────
    Consultation.aggregate([
      { $match: {
        doctorId:  mongoose.Types.ObjectId(doctorId),
        status:    'completed',
        createdAt: { $gte: startDate },
      }},
      { $project: {
        transcriptLines: { $size: '$transcript' },
        duration:        '$actualDurationMinutes',
      }},
      { $group: {
        _id:              null,
        avgLines:         { $avg: '$transcriptLines' },
        avgDuration:      { $avg: '$duration' },
        totalConsults:    { $sum: 1 },
      }},
    ]),

    // ── Prescription completeness ─────────────────────────────────────────
    Prescription.aggregate([
      { $match: {
        doctorId:  mongoose.Types.ObjectId(doctorId),
        issuedAt:  { $gte: startDate },
      }},
      { $project: {
        medCount:     { $size: '$medications' },
        hasFollowUp:  { $gt: ['$followUpDate', null] },
        hasInstructions: { $gt: [{ $strLenCP: { $ifNull: ['$generalInstructions', ''] }}, 10] },
      }},
      { $group: {
        _id:              null,
        avgMedications:   { $avg: '$medCount' },
        followUpRate:     { $avg: { $cond: ['$hasFollowUp', 1, 0] }},
        instructionRate:  { $avg: { $cond: ['$hasInstructions', 1, 0] }},
      }},
    ]),
  ]);

  return {
    soapQuality:             soapQuality[0] || {},
    transcriptDepth:         transcriptDepth[0] || {},
    prescriptionCompleteness: prescriptionCompleteness[0] || {},
  };
};
```

---

## 7. Platform Analytics — Admin View

### 7.1 Platform Health Metrics

```javascript
// server/services/analytics/platformAnalyticsService.js
// Admin-only — platform operators, not shared with patients or doctors

const getPlatformHealthMetrics = async () => {
  const now      = new Date();
  const today    = new Date(now); today.setHours(0, 0, 0, 0);
  const weekAgo  = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    userStats,
    consultationStats,
    platformActivity,
    cityDistribution,
    specialtyDemand,
  ] = await Promise.all([

    // ── User registration stats ───────────────────────────────────────────
    User.aggregate([
      { $facet: {
        // Total by role
        byRole: [
          { $group: { _id: '$role', count: { $sum: 1 }}},
        ],
        // New this week
        newThisWeek: [
          { $match: { createdAt: { $gte: weekAgo }}},
          { $group: { _id: '$role', count: { $sum: 1 }}},
        ],
        // Verification rate
        verificationStats: [
          { $group: {
            _id:        '$role',
            total:      { $sum: 1 },
            verified:   { $sum: { $cond: ['$isVerified', 1, 0] }},
            active:     { $sum: { $cond: ['$isActive', 1, 0] }},
          }},
        ],
      }},
    ]),

    // ── Consultation platform-wide stats ──────────────────────────────────
    Consultation.aggregate([
      { $facet: {
        // Totals
        overall: [
          { $group: {
            _id:              null,
            total:            { $sum: 1 },
            completed:        { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }},
            withConsent:      { $sum: { $cond: ['$patientConsentGiven', 1, 0] }},
            withRiskEvents:   { $sum: { $cond: [{ $gt: [{ $size: '$riskEvents' }, 0] }, 1, 0] }},
          }},
        ],
        // This month
        thisMonth: [
          { $match: { createdAt: { $gte: monthAgo }, status: 'completed' }},
          { $count: 'count' },
        ],
        // Language pair distribution (anonymized)
        languagePairs: [
          { $match: { status: 'completed' }},
          { $group: {
            _id: {
              p: '$patientLanguage',
              d: '$doctorLanguage',
            },
            count: { $sum: 1 },
          }},
          { $sort: { count: -1 }},
          { $limit: 10 },
        ],
      }},
    ]),

    // ── Daily active usage trend ──────────────────────────────────────────
    Appointment.aggregate([
      { $match: { scheduledAt: { $gte: monthAgo }}},
      { $group: {
        _id:   { $dateToString: { format: '%Y-%m-%d', date: '$scheduledAt' }},
        appts: { $sum: 1 },
        unique_doctors:  { $addToSet: '$doctorId' },
        unique_patients: { $addToSet: '$patientId' },
      }},
      { $project: {
        date:     '$_id',
        appts:    1,
        doctors:  { $size: '$unique_doctors' },
        patients: { $size: '$unique_patients' },
      }},
      { $sort: { date: 1 }},
    ]),

    // ── City distribution ─────────────────────────────────────────────────
    User.aggregate([
      { $match: { role: 'patient', city: { $exists: true }}},
      { $group: { _id: '$city', count: { $sum: 1 }}},
      { $sort: { count: -1 }},
    ]),

    // ── Specialty demand vs supply ─────────────────────────────────────────
    Appointment.aggregate([
      { $match: { scheduledAt: { $gte: monthAgo }}},
      { $lookup: {
        from:         'doctors',
        localField:   'doctorId',
        foreignField: 'userId',
        as:           'doctorInfo',
      }},
      { $unwind: '$doctorInfo' },
      { $group: {
        _id:   '$doctorInfo.specialty',
        appointmentCount: { $sum: 1 },
      }},
      { $sort: { appointmentCount: -1 }},
      { $limit: 10 },
    ]),
  ]);

  return {
    users:          userStats[0],
    consultations:  consultationStats[0],
    dailyActivity:  platformActivity,
    cityDistribution,
    specialtyDemand,
  };
};
```

### 7.2 User Growth Analytics

```javascript
// User growth tracking — cohort analysis by signup week

const getUserGrowthAnalytics = async (weeks = 8) => {
  const startDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

  const [
    weeklySignups,
    retentionByRole,
    verificationFunnel,
    churnIndicators,
  ] = await Promise.all([

    // ── Weekly signups by role ─────────────────────────────────────────────
    User.aggregate([
      { $match: { createdAt: { $gte: startDate }}},
      { $group: {
        _id: {
          week: { $isoWeek:    '$createdAt' },
          year: { $isoWeekYear:'$createdAt' },
          role: '$role',
        },
        count: { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.week': 1 }},
    ]),

    // ── Retention: users active after 7 days ──────────────────────────────
    // Proxy: users who made an appointment within 7 days of signup
    User.aggregate([
      { $match: {
        createdAt:  { $gte: startDate },
        isVerified: true,
        role:       'patient',
      }},
      { $lookup: {
        from:         'appointments',
        localField:   '_id',
        foreignField: 'patientId',
        as:           'appointments',
      }},
      { $project: {
        role:           1,
        createdAt:      1,
        madeAppointment: {
          $gt: [{ $size: '$appointments' }, 0]
        },
      }},
      { $group: {
        _id:             null,
        totalPatients:   { $sum: 1 },
        madeAppt:        { $sum: { $cond: ['$madeAppointment', 1, 0] }},
      }},
      { $project: {
        activationRate: {
          $multiply: [
            { $divide: ['$madeAppt', { $max: ['$totalPatients', 1] }] },
            100
          ]
        },
      }},
    ]),

    // ── Verification funnel ────────────────────────────────────────────────
    User.aggregate([
      { $match: { createdAt: { $gte: startDate }}},
      { $group: {
        _id:               '$role',
        totalSignups:      { $sum: 1 },
        emailVerified:     { $sum: { $cond: ['$isVerified', 1, 0] }},
        currentlyActive:   { $sum: { $cond: ['$isActive', 1, 0] }},
      }},
    ]),

    // ── Churn indicators (accounts inactive > 30 days) ────────────────────
    // Proxy: patients with no appointment in last 30 days
    User.aggregate([
      { $match: {
        role:       'patient',
        isVerified: true,
        isActive:   true,
        createdAt:  { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }},
      { $lookup: {
        from:         'appointments',
        localField:   '_id',
        foreignField: 'patientId',
        pipeline: [{
          $match: {
            scheduledAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        }],
        as: 'recentAppts',
      }},
      { $project: {
        churned: { $eq: [{ $size: '$recentAppts' }, 0] }
      }},
      { $group: {
        _id:          null,
        total:        { $sum: 1 },
        churnedCount: { $sum: { $cond: ['$churned', 1, 0] }},
      }},
      { $project: {
        churnRate: {
          $multiply: [
            { $divide: ['$churnedCount', { $max: ['$total', 1] }] },
            100
          ]
        },
      }},
    ]),
  ]);

  return {
    weeklySignups,
    retentionRate:       retentionByRole[0]?.activationRate || 0,
    verificationFunnel,
    churnRate:           churnIndicators[0]?.churnRate || 0,
  };
};
```

### 7.3 City Coverage Analytics

```javascript
// Geographic distribution analysis for Phase 1 cities

const getCityAnalytics = async () => {
  const PHASE1_CITIES = [
    'Chennai', 'Bangalore', 'Mumbai', 'Vijayawada',
    'Hyderabad', 'Delhi', 'Goa', 'Puducherry'
  ];

  const [
    patientsByCity,
    doctorsByCity,
    appointmentsByCity,
    cityDoctorSpecialtyGap,
  ] = await Promise.all([

    // ── Patient distribution ───────────────────────────────────────────────
    User.aggregate([
      { $match: { role: 'patient', city: { $in: PHASE1_CITIES }}},
      { $group: { _id: '$city', patients: { $sum: 1 }}},
      { $sort: { patients: -1 }},
    ]),

    // ── Doctor supply per city ─────────────────────────────────────────────
    Doctor.aggregate([
      { $match: { city: { $in: PHASE1_CITIES }, isVerified: true }},
      { $group: {
        _id:        '$city',
        doctors:    { $sum: 1 },
        specialties:{ $addToSet: '$specialty' },
      }},
      { $project: {
        city:            '$_id',
        doctors:         1,
        specialtyCount:  { $size: '$specialties' },
      }},
      { $sort: { doctors: -1 }},
    ]),

    // ── Appointment demand by city ─────────────────────────────────────────
    Appointment.aggregate([
      { $match: { scheduledAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }}},
      { $lookup: {
        from:         'users',
        localField:   'patientId',
        foreignField: '_id',
        as:           'patient',
      }},
      { $unwind: '$patient' },
      { $group: {
        _id:          '$patient.city',
        appointments: { $sum: 1 },
      }},
      { $match: { _id: { $in: PHASE1_CITIES }}},
      { $sort: { appointments: -1 }},
    ]),

    // ── Specialty gap: cities with patient demand but no specialist ────────
    Appointment.aggregate([
      { $lookup: {
        from: 'users', localField: 'patientId', foreignField: '_id', as: 'patient',
      }},
      { $unwind: '$patient' },
      { $lookup: {
        from: 'doctors', localField: 'doctorId', foreignField: 'userId', as: 'doctor',
      }},
      { $unwind: '$doctor' },
      { $group: {
        _id: { city: '$patient.city', specialty: '$doctor.specialty' },
        demand: { $sum: 1 },
      }},
      { $group: {
        _id:       '$_id.city',
        topDemand: { $push: { specialty: '$_id.specialty', demand: '$demand' }},
      }},
    ]),
  ]);

  return {
    patientsByCity,
    doctorsByCity,
    appointmentsByCity,
    specialtyGaps: buildSpecialtyGapAnalysis(doctorsByCity, appointmentsByCity),
  };
};
```

### 7.4 Security Analytics

```javascript
// Security event aggregation for Admin security monitor

const getSecurityAnalytics = async (hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [
    eventsBySeverity,
    eventsByType,
    suspiciousIPs,
    lockedAccounts,
    attackTimeline,
  ] = await Promise.all([

    // ── Events grouped by severity ────────────────────────────────────────
    SecurityLog.aggregate([
      { $match: { createdAt: { $gte: since }}},
      { $group: { _id: '$severity', count: { $sum: 1 }}},
      { $sort: { count: -1 }},
    ]),

    // ── Events grouped by type ────────────────────────────────────────────
    SecurityLog.aggregate([
      { $match: { createdAt: { $gte: since }}},
      { $group: { _id: '$eventType', count: { $sum: 1 }}},
      { $sort: { count: -1 }},
    ]),

    // ── IPs with multiple failed attempts ─────────────────────────────────
    SecurityLog.aggregate([
      { $match: {
        eventType: { $in: ['login_failed', 'otp_failed'] },
        createdAt: { $gte: since },
      }},
      { $group: {
        _id:         '$ipAddress',
        attempts:    { $sum: 1 },
        targets:     { $addToSet: '$email' },
        lastSeen:    { $max: '$createdAt' },
      }},
      { $match: { attempts: { $gte: 3 }}},
      { $sort: { attempts: -1 }},
      { $limit: 20 },
      { $project: {
        ip:         '$_id',
        attempts:   1,
        targetCount:{ $size: '$targets' },
        lastSeen:   1,
        suspicious: { $gt: [{ $size: '$targets' }, 2] },
      }},
    ]),

    // ── Currently locked accounts ─────────────────────────────────────────
    User.countDocuments({
      lockoutUntil: { $gt: new Date() },
    }),

    // ── Attack timeline (hourly breakdown) ────────────────────────────────
    SecurityLog.aggregate([
      { $match: {
        severity:  { $in: ['HIGH', 'CRITICAL'] },
        createdAt: { $gte: since },
      }},
      { $group: {
        _id: {
          hour:    { $hour:        '$createdAt' },
          dateStr: { $dateToString: { format: '%H:00', date: '$createdAt' }},
        },
        count: { $sum: 1 },
      }},
      { $sort: { '_id.hour': 1 }},
    ]),
  ]);

  return {
    summary: {
      totalEvents:    eventsBySeverity.reduce((s, e) => s + e.count, 0),
      criticalCount:  eventsBySeverity.find(e => e._id === 'CRITICAL')?.count || 0,
      highCount:      eventsBySeverity.find(e => e._id === 'HIGH')?.count || 0,
      lockedAccounts,
    },
    eventsBySeverity,
    eventsByType,
    suspiciousIPs,
    attackTimeline,
  };
};
```

---

## 8. AI Component Analytics

### 8.1 STT Accuracy & Usage

```javascript
// server/services/analytics/aiAnalyticsService.js

const getSTTUsageMetrics = async (period = '7d') => {
  const startDate = getPeriodStart(period);

  return AnalyticsEvent.aggregate([
    { $match: {
      eventType: { $in: [
        'asr_started',
        'asr_completed',
        'asr_fallback_used',  // Text input used instead of voice
        'asr_error',
      ]},
      createdAt: { $gte: startDate },
    }},
    { $group: {
      _id:              '$eventType',
      count:            { $sum: 1 },
      byLanguage:       { $push: '$metadata.language' },
    }},
  ]);

  // Derived metrics:
  // asr_fallback_used / asr_started = browser incompatibility rate (target < 15%)
  // asr_error / asr_started = error rate (target < 5%)
  // Language distribution: which languages use voice most?
};
```

### 8.2 Translation Quality

```javascript
const getTranslationMetrics = async (period = '7d') => {
  const startDate = getPeriodStart(period);

  return AnalyticsEvent.aggregate([
    { $match: {
      eventType: { $in: [
        'translation_success',
        'translation_fallback',     // LibreTranslate failed → MyMemory
        'translation_unavailable',  // Both failed
        'translation_cache_hit',
      ]},
      createdAt: { $gte: startDate },
    }},
    { $group: {
      _id:      '$eventType',
      count:    { $sum: 1 },
      avgMs:    { $avg: '$metadata.durationMs' },
    }},
  ]);

  // Derived metrics:
  // translation_success / total = success rate (target > 95%)
  // translation_cache_hit / total = cache efficiency (target > 30%)
  // translation_fallback / translation_success = LibreTranslate reliability
  // avgMs by event type = latency by provider
};
```

### 8.3 Risk Detection Analytics

```javascript
const getRiskDetectionAnalytics = async (period = '30d') => {
  const startDate = getPeriodStart(period);

  // Risk events are embedded in consultation documents
  const riskStats = await Consultation.aggregate([
    { $match: {
      createdAt:  { $gte: startDate },
      'riskEvents.0': { $exists: true },  // Has at least one risk event
    }},
    { $unwind: '$riskEvents' },
    { $group: {
      _id:          null,
      totalAlerts:  { $sum: 1 },
      redAlerts:    { $sum: { $cond: [{ $eq: ['$riskEvents.level', 'RED'] }, 1, 0] }},
      yellowAlerts: { $sum: { $cond: [{ $eq: ['$riskEvents.level', 'YELLOW'] }, 1, 0] }},
      topConditions:{ $push: '$riskEvents.condition' },
    }},
  ]);

  // SOS button activations (from analytics_events)
  const sosActivations = await AnalyticsEvent.countDocuments({
    eventType: 'sos_button_clicked',
    createdAt: { $gte: startDate },
  });

  const chatbotRiskAlerts = await AnalyticsEvent.countDocuments({
    eventType: 'chatbot_risk_alert_triggered',
    createdAt: { $gte: startDate },
  });

  return {
    riskStats:        riskStats[0] || {},
    sosActivations,
    chatbotRiskAlerts,
    // Derived: sosActivations / redAlerts = escalation rate
    // If low: RED alerts not being taken seriously? UI review needed
  };
};
```

### 8.4 AI API Usage & Quota

```javascript
// Track free API quota usage to prevent service interruption

const getAIQuotaStatus = async () => {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [hfUsage, translateUsage] = await Promise.all([

    // Hugging Face API calls today
    AnalyticsEvent.aggregate([
      { $match: {
        eventType: { $in: ['ner_api_call', 'qa_api_call'] },
        createdAt: { $gte: today },
      }},
      { $group: {
        _id:         '$eventType',
        count:       { $sum: 1 },
        cacheHits:   { $sum: { $cond: ['$metadata.cacheHit', 1, 0] }},
        apiCalls:    { $sum: { $cond: [{ $not: '$metadata.cacheHit' }, 1, 0] }},
        fallbacks:   { $sum: { $cond: ['$metadata.usedFallback', 1, 0] }},
        avgDurationMs: { $avg: '$metadata.durationMs' },
      }},
    ]),

    // Translation API calls today
    AnalyticsEvent.aggregate([
      { $match: {
        eventType: 'translation_api_call',
        createdAt: { $gte: today },
      }},
      { $group: {
        _id:           '$metadata.provider',
        count:         { $sum: 1 },
        totalChars:    { $sum: '$metadata.charCount' },
        cacheHits:     { $sum: { $cond: ['$metadata.cacheHit', 1, 0] }},
      }},
    ]),
  ]);

  const HF_DAILY_LIMIT         = 1000;   // Conservative: 30K/month ÷ 30
  const MYMEMORY_DAILY_LIMIT   = 10000;  // With email registration

  const hfCallsToday = hfUsage.reduce((sum, e) => sum + (e.apiCalls || 0), 0);
  const mmCharsToday = translateUsage
    .find(t => t._id === 'mymemory')?.totalChars || 0;

  return {
    huggingFace: {
      callsToday:     hfCallsToday,
      limit:          HF_DAILY_LIMIT,
      usagePercent:   Math.round(hfCallsToday / HF_DAILY_LIMIT * 100),
      status:         hfCallsToday > HF_DAILY_LIMIT * 0.8 ? 'WARNING' : 'OK',
      cacheEfficiency: hfUsage.reduce((sum, e) => sum + (e.cacheHits || 0), 0) /
                      Math.max(hfUsage.reduce((sum, e) => sum + (e.count || 0), 0), 1) * 100,
    },
    translation: {
      libretranslateCallsToday: translateUsage.find(t => t._id === 'libretranslate')?.count || 0,
      mymemoryCharsToday:       mmCharsToday,
      mymemoryLimit:            MYMEMORY_DAILY_LIMIT,
      mymemoryUsagePercent:     Math.round(mmCharsToday / MYMEMORY_DAILY_LIMIT * 100),
    },
    summary: hfUsage,
  };
};
```

---

## 9. Performance Analytics

```javascript
// server/routes/metricsRoutes.js — Receives web-vitals from browser

app.post('/api/v1/metrics', express.json(), async (req, res) => {
  // Fire-and-forget — don't block response
  res.status(204).end();

  try {
    const { name, value, rating, id } = req.body;

    // Only store poor performance (reduces storage)
    if (rating !== 'poor') return;

    await PerformanceLog.create({
      metric:   name,
      value:    Math.round(value),
      rating,
      page:     req.headers.referer || 'unknown',
      userAgent:req.headers['user-agent'],
      timestamp: new Date(),
    });
  } catch (err) {
    // Swallow errors — metrics collection must never impact user experience
  }
});

// Admin: get performance summary
const getPerformanceSummary = async (hours = 24) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  return PerformanceLog.aggregate([
    { $match: { timestamp: { $gte: since }}},
    { $group: {
      _id:   '$metric',
      count: { $sum: 1 },
      avg:   { $avg: '$value' },
      p75:   { $percentile: { input: '$value', p: [0.75], method: 'approximate' }},
      p95:   { $percentile: { input: '$value', p: [0.95], method: 'approximate' }},
      worst: { $max: '$value' },
      // Count by page
      byPage:{ $push: '$page' },
    }},
    { $project: {
      metric:  '$_id',
      count:   1,
      avg:     { $round: ['$avg', 0] },
      p75:     { $round: [{ $arrayElemAt: ['$p75', 0] }, 0] },
      p95:     { $round: [{ $arrayElemAt: ['$p95', 0] }, 0] },
      worst:   1,
    }},
  ]);
};
```

---

## 10. Analytics Data Pipelines

### 10.1 Event Collection

```javascript
// server/models/AnalyticsEvent.js — Lightweight event schema

const AnalyticsEventSchema = new mongoose.Schema({
  // Core event data
  eventType:  { type: String, required: true, index: true },
  userId:     { type: String, index: true },  // String not ObjectId — flexibility
  role:       { type: String, enum: ['patient', 'doctor', 'admin', 'anonymous'] },

  // Optional metadata (flexible — different per event type)
  metadata:   { type: mongoose.Schema.Types.Mixed },
  // Examples:
  //   chatbot_message: { language: 'hi', messageLength: 45, riskLevel: 'GREEN' }
  //   asr_completed:   { language: 'ta-IN', durationMs: 180, wordCount: 8 }
  //   translation_api_call: { provider: 'libretranslate', langPair: 'hi-ta', durationMs: 1200 }
  //   booking_confirmed: { city: 'Hyderabad', specialty: 'Cardiologist' }
  //   sos_clicked: { device: 'mobile', page: '/patient/chat' }

  // Privacy: session-level, not user-level tracking
  sessionId:  { type: String },   // Browser session ID (not tied to user PII)
  page:       { type: String },   // Which page triggered the event

  createdAt:  { type: Date, default: Date.now, index: true },
},
{
  timestamps: false,
  // ── TTL: auto-delete raw events after 90 days ──────────────────────────
  // Raw events accumulate quickly — aggregated stats are kept permanently
});

// TTL index: raw events auto-deleted after 90 days (keep aggregates)
AnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Compound index for common queries
AnalyticsEventSchema.index({ eventType: 1, createdAt: -1 });
AnalyticsEventSchema.index({ userId: 1, eventType: 1, createdAt: -1 });
```

```javascript
// server/utils/trackEvent.js — Fire-and-forget event tracker

const AnalyticsEvent = require('../models/AnalyticsEvent');

/**
 * Track an analytics event — fire-and-forget
 * Never awaited — never blocks the main request
 */
const trackEvent = (eventType, userId, role, metadata = {}) => {
  // Async — don't await, don't catch (non-critical)
  AnalyticsEvent.create({
    eventType,
    userId:   userId?.toString(),
    role,
    metadata,
    createdAt: new Date(),
  }).catch(() => {});  // Silent fail — analytics must never break the app
};

// ── Track AI events ────────────────────────────────────────────────────
const trackAIEvent = (type, metadata) => {
  trackEvent(type, null, 'system', metadata);
};

// ── Track user events (anonymised where possible) ──────────────────────
const trackUserEvent = (type, userId, role, metadata) => {
  // Strip PII from metadata before storing
  const cleanMeta = {
    ...metadata,
    email:    undefined,
    name:     undefined,
    phone:    undefined,
  };
  trackEvent(type, userId, role, cleanMeta);
};

module.exports = { trackEvent, trackAIEvent, trackUserEvent };
```

### 10.2 MongoDB Aggregation Pipelines

```javascript
// server/jobs/dailyAggregation.js — Runs every night at midnight

const cron = require('node-cron');

// Run at 00:05 every day (5 minutes after midnight)
cron.schedule('5 0 * * *', async () => {
  console.log('[Analytics Cron] Starting daily aggregation...');

  try {
    await Promise.all([
      aggregateDailyPlatformStats(),
      aggregateDailyAIStats(),
      deactivateExpiredReminders(),
      generateCityHealthReport(),
    ]);

    console.log('[Analytics Cron] Daily aggregation complete');
  } catch (err) {
    console.error('[Analytics Cron] Failed:', err.message);
  }
});

const aggregateDailyPlatformStats = async () => {
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const dayEnd = new Date(yesterday); dayEnd.setHours(23, 59, 59, 999);

  const [
    consultationsCompleted,
    newSignups,
    appointmentsBooked,
    riskAlertsTriggered,
  ] = await Promise.all([
    Consultation.countDocuments({ status: 'completed', createdAt: { $gte: yesterday, $lte: dayEnd }}),
    User.countDocuments({ createdAt: { $gte: yesterday, $lte: dayEnd }}),
    Appointment.countDocuments({ createdAt: { $gte: yesterday, $lte: dayEnd }}),
    Consultation.aggregate([
      { $match: { createdAt: { $gte: yesterday, $lte: dayEnd }}},
      { $project: { riskCount: { $size: { $ifNull: ['$riskEvents', []] }}}},
      { $group: { _id: null, total: { $sum: '$riskCount' }}},
    ]),
  ]);

  // Save daily snapshot (permanent — not TTL deleted)
  await DailyMetricsSnapshot.create({
    date:                    yesterday,
    consultationsCompleted,
    newSignups,
    appointmentsBooked,
    riskAlertsTriggered:     riskAlertsTriggered[0]?.total || 0,
  });
};

const deactivateExpiredReminders = async () => {
  const result = await Reminder.updateMany(
    { endDate: { $lte: new Date() }, active: true },
    { $set: { active: false }}
  );
  console.log(`[Cron] Deactivated ${result.modifiedCount} expired reminders`);
};
```

### 10.3 Real-Time Metrics

```javascript
// server/websocket/metricsSocket.js — Push real-time stats to admin dashboard

const setupMetricsSocket = (io) => {
  // Admin namespace — only admins connect here
  const adminNS = io.of('/admin-metrics');

  adminNS.use(async (socket, next) => {
    // Same JWT auth as REST API
    const token  = cookie.parse(socket.handshake.headers.cookie || '').token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return next(new Error('Admin only'));
    next();
  });

  adminNS.on('connection', (socket) => {
    console.log('[AdminMetrics] Admin connected to live metrics');

    // Push live stats every 30 seconds to admin dashboard
    const interval = setInterval(async () => {
      try {
        const liveStats = await getLivePlatformStats();
        socket.emit('metrics:update', liveStats);
      } catch (err) {
        socket.emit('metrics:error', { message: 'Stats unavailable' });
      }
    }, 30000);

    // Clean up on disconnect
    socket.on('disconnect', () => clearInterval(interval));
  });
};

const getLivePlatformStats = async () => {
  const [
    activeConsultations,
    todayAppointments,
    onlineDoctors,
  ] = await Promise.all([
    Consultation.countDocuments({ status: 'active' }),
    Appointment.countDocuments({
      scheduledAt: { $gte: getTodayStart() },
      status: { $in: ['confirmed', 'in_progress'] },
    }),
    Doctor.countDocuments({ status: 'available' }),
  ]);

  return {
    activeConsultations,
    todayAppointments,
    onlineDoctors,
    timestamp: Date.now(),
  };
};
```

---

## 11. Analytics API Endpoints

### Analytics Routes

```javascript
// server/routes/analyticsRoutes.js

const router = require('express').Router();
const { authMiddleware, roleGuard } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

// ── Doctor analytics (own data only) ──────────────────────────────────────
router.get(
  '/doctor/practice',
  authMiddleware, roleGuard('doctor'),
  analyticsController.getDoctorPracticeAnalytics
);
router.get(
  '/doctor/clinical',
  authMiddleware, roleGuard('doctor'),
  analyticsController.getDoctorClinicalPatterns
);
router.get(
  '/doctor/risk-trends',
  authMiddleware, roleGuard('doctor'),
  analyticsController.getDoctorRiskTrends
);

// ── Admin analytics (platform-wide) ───────────────────────────────────────
router.get(
  '/admin/platform',
  authMiddleware, roleGuard('admin'),
  analyticsController.getPlatformHealthMetrics
);
router.get(
  '/admin/users/growth',
  authMiddleware, roleGuard('admin'),
  analyticsController.getUserGrowthAnalytics
);
router.get(
  '/admin/cities',
  authMiddleware, roleGuard('admin'),
  analyticsController.getCityAnalytics
);
router.get(
  '/admin/security',
  authMiddleware, roleGuard('admin'),
  analyticsController.getSecurityAnalytics
);
router.get(
  '/admin/ai/quota',
  authMiddleware, roleGuard('admin'),
  analyticsController.getAIQuotaStatus
);
router.get(
  '/admin/performance',
  authMiddleware, roleGuard('admin'),
  analyticsController.getPerformanceSummary
);

module.exports = router;
```

---

## 12. Doctor Dashboard Implementation

```javascript
// client/src/pages/doctor/AnalyticsPage.jsx — Chart.js implementation

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { doctorService } from '@services/doctorService';

// Register Chart.js components (tree-shaken — only import what you use)
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend
);

// ── Color palette ──────────────────────────────────────────────────────
const RISK_COLORS = {
  RED:    { bg: 'rgba(220, 38, 38, 0.8)',  border: '#DC2626' },
  YELLOW: { bg: 'rgba(217, 119, 6, 0.8)', border: '#D97706' },
  GREEN:  { bg: 'rgba(5, 150, 105, 0.8)', border: '#059669' },
};

const CHART_DEFAULTS = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: { mode: 'index', intersect: false },
  },
};

const AnalyticsPage = () => {
  const [data,   setData]   = useState(null);
  const [period, setPeriod] = useState('30d');
  const [loading,setLoading]= useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [practice, clinical, riskTrends] = await Promise.all([
        doctorService.getPracticeAnalytics(period),
        doctorService.getClinicalPatterns(period),
        doctorService.getRiskTrends(),
      ]);
      setData({ practice, clinical, riskTrends });
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  if (loading) return <AnalyticsSkeleton />;
  if (!data)   return <EmptyState title="No analytics data yet" />;

  // ── Chart 1: Weekly Patient Count ──────────────────────────────────
  const weeklyChartData = {
    labels:   data.practice.weekly.byDay.map(d => d._id),
    datasets: [{
      label:           'Patients Seen',
      data:            data.practice.weekly.byDay.map(d => d.count),
      backgroundColor: 'rgba(26, 86, 219, 0.7)',
      borderColor:     '#1A56DB',
      borderWidth:     2,
      borderRadius:    4,
    }],
  };

  // ── Chart 2: Risk Level Distribution ──────────────────────────────
  const riskChartData = {
    labels:   ['Critical (Red)', 'Moderate (Yellow)', 'Stable (Green)'],
    datasets: [{
      data: [
        data.clinical.riskDistribution.find(r => r._id === 'RED')?.count || 0,
        data.clinical.riskDistribution.find(r => r._id === 'YELLOW')?.count || 0,
        data.clinical.riskDistribution.find(r => r._id === 'GREEN')?.count || 0,
      ],
      backgroundColor: [RISK_COLORS.RED.bg, RISK_COLORS.YELLOW.bg, RISK_COLORS.GREEN.bg],
      borderColor:     [RISK_COLORS.RED.border, RISK_COLORS.YELLOW.border, RISK_COLORS.GREEN.border],
      borderWidth:     2,
    }],
  };

  // ── Chart 3: Risk Trend Over Time ─────────────────────────────────
  const riskTrendLabels = [...new Set(data.riskTrends.map(d => `Wk ${d._id.week}`))];
  const riskTrendData   = {
    labels:   riskTrendLabels,
    datasets: [
      {
        label: '🔴 Critical',
        data:  riskTrendLabels.map(label => {
          const week = parseInt(label.split(' ')[1]);
          return data.riskTrends
            .find(d => d._id.week === week)
            ?.risks.find(r => r.level === 'RED')?.count || 0;
        }),
        backgroundColor: RISK_COLORS.RED.bg,
        borderColor:     RISK_COLORS.RED.border,
        borderWidth: 2,
      },
      {
        label: '🟡 Moderate',
        data:  riskTrendLabels.map(label => {
          const week = parseInt(label.split(' ')[1]);
          return data.riskTrends
            .find(d => d._id.week === week)
            ?.risks.find(r => r.level === 'YELLOW')?.count || 0;
        }),
        backgroundColor: RISK_COLORS.YELLOW.bg,
        borderColor:     RISK_COLORS.YELLOW.border,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Practice Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Patients"    value={data.practice.monthly.total} icon="👥" />
        <KPICard title="Completion Rate"   value={`${Math.round(data.practice.monthly.completionRate)}%`} icon="✅" />
        <KPICard title="No-Shows"          value={data.practice.monthly.noShow} icon="🚫" />
        <KPICard title="Avg. Duration"     value={`${Math.round(data.practice.avgConsultDuration.avgDuration || 0)} min`} icon="⏱️" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Patient Count */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Weekly Patient Count</h3>
          <div style={{ height: 220 }}>
            <Bar data={weeklyChartData} options={CHART_DEFAULTS} />
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Risk Level Distribution</h3>
          <div style={{ height: 220 }}>
            <Doughnut
              data={riskChartData}
              options={{ ...CHART_DEFAULTS, cutout: '60%' }}
            />
          </div>
        </div>

        {/* Top Diagnoses */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Top Diagnoses (Last 30 Days)</h3>
          <div className="space-y-2">
            {data.clinical.topDiagnoses.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1 mr-4">{d.diagnosis}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="bg-blue-200 rounded h-2"
                    style={{
                      width: `${Math.round(d.count / data.clinical.topDiagnoses[0].count * 100)}px`
                    }}
                  />
                  <span className="text-sm font-medium text-gray-800 w-6 text-right">
                    {d.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Trend */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Risk Trend (by Week)</h3>
          <div style={{ height: 220 }}>
            <Bar
              data={riskTrendData}
              options={{
                ...CHART_DEFAULTS,
                scales: { x: { stacked: true }, y: { stacked: true }},
              }}
            />
          </div>
        </div>

      </div>

      {/* Language Pairs Used */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Consultation Language Pairs</h3>
        <div className="flex flex-wrap gap-3">
          {data.clinical.languagePairUsage.map((lp, i) => (
            <div key={i} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <span className="font-medium">{lp._id.p} ↔ {lp._id.d}</span>
              <span className="text-gray-500 ml-2">{lp.count} sessions</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// ── Stat Card component ────────────────────────────────────────────────────
const KPICard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border p-4">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

// ── Loading skeleton ───────────────────────────────────────────────────────
const AnalyticsSkeleton = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-64" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-xl" />
      ))}
    </div>
  </div>
);

export default AnalyticsPage;
```

---

## 13. Admin Analytics Implementation

```javascript
// client/src/pages/admin/AdminDashboard.jsx — Platform KPI dashboard

const AdminDashboard = () => {
  const [metrics, setMetrics]     = useState(null);
  const [aiQuota, setAIQuota]     = useState(null);
  const [security, setSecurity]   = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      const [m, q, s] = await Promise.all([
        adminService.getPlatformMetrics(),
        adminService.getAIQuotaStatus(),
        adminService.getSecurityAnalytics(24),
      ]);
      setMetrics(m); setAIQuota(q); setSecurity(s);
      setLoading(false);
    };
    loadAll();
  }, []);

  if (loading) return <AdminSkeleton />;

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Platform Dashboard</h1>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"           value={metrics.users.byRole.reduce((s, r) => s + r.count, 0)} color="blue" />
        <StatCard label="Total Consultations"   value={metrics.consultations.overall[0]?.total || 0} color="green" />
        <StatCard label="Active Doctors"        value={metrics.users.byRole.find(r => r._id === 'doctor')?.count || 0} color="purple" />
        <StatCard label="🔒 Security Alerts"   value={security.summary.criticalCount} color="red" />
      </div>

      {/* AI Quota Alert */}
      {aiQuota.huggingFace.usagePercent > 80 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800">Hugging Face API at {aiQuota.huggingFace.usagePercent}% daily quota</p>
            <p className="text-sm text-yellow-700">
              {aiQuota.huggingFace.callsToday} / {aiQuota.huggingFace.limit} calls used today.
              Cache efficiency: {Math.round(aiQuota.huggingFace.cacheEfficiency)}%
            </p>
          </div>
        </div>
      )}

      {/* City Coverage */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Patient Distribution by City</h3>
        <div className="grid grid-cols-4 gap-3">
          {metrics.cityDistribution.map((city) => (
            <div key={city._id} className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xl font-bold text-blue-700">{city.count}</p>
              <p className="text-xs text-gray-500">{city._id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Quota Status */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h3 className="font-semibold text-gray-700 mb-4">AI API Quota Status (Today)</h3>
        <div className="space-y-4">

          <QuotaBar
            label="Hugging Face (NER + QA)"
            used={aiQuota.huggingFace.callsToday}
            limit={aiQuota.huggingFace.limit}
            color={aiQuota.huggingFace.status === 'WARNING' ? 'yellow' : 'green'}
          />
          <p className="text-xs text-gray-500">
            Cache hit rate: {Math.round(aiQuota.huggingFace.cacheEfficiency)}%
            (higher = fewer API calls)
          </p>

          <QuotaBar
            label="MyMemory Translation (Fallback)"
            used={aiQuota.translation.mymemoryCharsToday}
            limit={aiQuota.translation.mymemoryLimit}
            color="blue"
            unit="chars"
          />
        </div>
      </div>

    </div>
  );
};

const QuotaBar = ({ label, used, limit, color, unit = 'calls' }) => {
  const pct   = Math.round(used / Math.max(limit, 1) * 100);
  const barColor = color === 'yellow' ? 'bg-yellow-400' : color === 'red' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{used.toLocaleString()} / {limit.toLocaleString()} {unit} ({pct}%)</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
};
```

---

## 14. Analytics Privacy & Compliance

```
ANALYTICS PRIVACY RULES
═══════════════════════════════════════════════════════════════════════════

WHAT IS TRACKED:
  ✅ Event type counts (anonymised: "100 chatbot messages sent today")
  ✅ Performance metrics (LCP, FCP, CLS — no user identity)
  ✅ AI API health (response times, error rates — no content)
  ✅ Platform-level aggregates (signups per week, appointments per city)
  ✅ Doctor's own practice data (they own it, see it only themselves)
  ✅ Security events (IP addresses, event types — admin only)

WHAT IS NEVER TRACKED FOR ANALYTICS:
  ❌ Individual patient health data (diagnosis, symptoms, prescriptions)
  ❌ Consultation content (transcript text never goes to analytics)
  ❌ Cross-patient comparison (no "sicker patients" cohort)
  ❌ Cross-doctor comparison (no doctor performance ranking)
  ❌ Third-party data sharing (no Google Analytics, Mixpanel etc.)
  ❌ Advertising-related data (platform is permanently ad-free)
  ❌ Patient location tracking beyond city level

DATA MINIMIZATION:
  Raw events:        TTL 90 days (auto-deleted by MongoDB index)
  Daily snapshots:   Kept permanently (aggregated, no PII)
  Performance logs:  TTL 30 days (only 'poor' ratings stored)
  Security logs:     TTL 90 days (then auto-deleted)
  NER cache:         TTL 1 hour (medical phrases, not patient data)
  Translation cache: TTL 30 minutes

CONSENT:
  Analytics collection disclosed in Terms of Service
  Patient data for their own dashboards: no separate consent needed
  (Patient seeing their own history is not analytics)
  Aggregate platform analytics: covered in T&C at signup

ADMIN DATA ACCESS:
  Admins see: user metadata, platform aggregates, security events
  Admins CANNOT see: consultation content, prescriptions, transcripts
  RBAC enforced at API level (roleGuard + service-layer scoping)
```

---

## 15. Analytics Testing

```javascript
// server/tests/unit/services/analyticsService.test.js

describe('Analytics Service Tests', () => {

  describe('getDoctorPracticeAnalytics()', () => {
    it('returns correct completion rate', async () => {
      // Seed: 10 completed + 2 no-shows
      await Appointment.insertMany([
        ...Array.from({ length: 10 }, () => appointmentFactory.build({
          doctorId: TEST_DOCTOR_ID, status: 'completed',
          scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        })),
        ...Array.from({ length: 2 }, () => appointmentFactory.build({
          doctorId: TEST_DOCTOR_ID, status: 'no_show',
          scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        })),
      ]);

      const result = await getDoctorPracticeAnalytics(TEST_DOCTOR_ID, '30d');

      expect(result.monthly.completionRate).toBeCloseTo(83.3, 1);
      expect(result.monthly.noShow).toBe(2);
    });

    it('returns empty state for new doctor with no appointments', async () => {
      const result = await getDoctorPracticeAnalytics('new_doctor_id', '30d');
      expect(result.monthly.total).toBe(0);
      expect(result.monthly.completionRate).toBe(0);
    });
  });

  describe('getAIQuotaStatus()', () => {
    it('returns WARNING status when usage exceeds 80% of daily limit', async () => {
      // Seed: 850 NER API calls today
      await AnalyticsEvent.insertMany(
        Array.from({ length: 850 }, () => ({
          eventType: 'ner_api_call',
          metadata:  { cacheHit: false },
          createdAt: new Date(),
        }))
      );

      const quota = await getAIQuotaStatus();
      expect(quota.huggingFace.status).toBe('WARNING');
      expect(quota.huggingFace.usagePercent).toBeGreaterThan(80);
    });
  });

  describe('getPlatformHealthMetrics()', () => {
    it('calculates city distribution correctly', async () => {
      await User.insertMany([
        { ...userFactory.build(), role: 'patient', city: 'Hyderabad', isVerified: true },
        { ...userFactory.build(), role: 'patient', city: 'Hyderabad', isVerified: true },
        { ...userFactory.build(), role: 'patient', city: 'Chennai',   isVerified: true },
      ]);

      const metrics = await getPlatformHealthMetrics();
      const hyd = metrics.cityDistribution.find(c => c._id === 'Hyderabad');
      const che = metrics.cityDistribution.find(c => c._id === 'Chennai');

      expect(hyd.count).toBe(2);
      expect(che.count).toBe(1);
    });
  });

  describe('Analytics Privacy', () => {
    it('trackEvent does not store PII fields', async () => {
      trackUserEvent('test_event', 'user123', 'patient', {
        name:    'Ravi Kumar',   // Should be stripped
        email:   'ravi@g.com',  // Should be stripped
        message: 'chest pain',  // Safe to store
      });

      // Give async insert time to complete
      await new Promise(r => setTimeout(r, 100));

      const stored = await AnalyticsEvent.findOne({ eventType: 'test_event' });
      expect(stored.metadata.name).toBeUndefined();
      expect(stored.metadata.email).toBeUndefined();
      expect(stored.metadata.message).toBe('chest pain');
    });
  });
});
```

---

## 16. Analytics Roadmap

### Phase 1 — MVP Analytics (Built now)

| Feature | Owner | Status |
|---|---|---|
| Doctor practice analytics dashboard (Chart.js) | Doctor | ✅ MVP |
| Weekly patient count + completion rate | Doctor | ✅ MVP |
| Top 10 diagnoses | Doctor | ✅ MVP |
| Risk level distribution | Doctor | ✅ MVP |
| Admin platform KPI dashboard | Admin | ✅ MVP |
| User growth by role | Admin | ✅ MVP |
| AI quota monitoring | Admin | ✅ MVP |
| Security event analytics | Admin | ✅ MVP |
| City distribution analytics | Admin | ✅ MVP |
| Core Web Vitals tracking (web-vitals) | Platform | ✅ MVP |
| Daily aggregation cron | Platform | ✅ MVP |

### Phase 2 — Growth Analytics (Post-MVP)

| Feature | Owner | Priority |
|---|---|---|
| Appointment booking funnel analysis | Platform | 🟠 High |
| Patient medication adherence dashboard | Patient | 🟠 High |
| Doctor follow-up rate tracking | Doctor | 🟡 Medium |
| Language pair effectiveness scoring | Platform | 🟡 Medium |
| City-level doctor supply/demand gap | Admin | 🟡 Medium |
| Consultation quality scoring | Doctor | 🟡 Medium |
| Cohort retention analysis (30/60/90 day) | Admin | 🟡 Medium |

### Phase 3 — AI Analytics (Future)

| Feature | Description | Status |
|---|---|---|
| SOAP note quality scoring | AI scores completeness of doctor notes | 📋 Planned |
| Risk alert effectiveness | Did RED alerts lead to ER visits? | 📋 Planned |
| Translation quality tracking | Patient satisfaction with translations | 📋 Planned |
| Predictive no-show model | Predict patients likely to no-show | 📋 Future |
| Disease trend analytics | City-level health pattern monitoring | 📋 Future |

---

<div align="center">

---

## Analytics Plan Summary

```
╔══════════════════════════════════════════════════════════════════════╗
║            MEDIVOICE AI — ANALYTICS PLAN AT A GLANCE                ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  North Star Metric:   Successful Consultations per Month            ║
║                                                                      ║
║  Analytics Layers:    4 (Patient · Doctor · Admin · Platform)       ║
║                                                                      ║
║  MongoDB Pipelines:   15+ aggregation pipelines                     ║
║  Chart.js Charts:     6 chart types in Doctor Dashboard             ║
║  Real-Time Metrics:   Active consultations · Queue depth            ║
║                                                                      ║
║  Scheduled Jobs:      Daily cron (00:05) — aggregation + cleanup    ║
║  Event TTL:           Raw events: 90 days (auto-deleted)            ║
║  Snapshots:           Daily platform stats (permanent)              ║
║                                                                      ║
║  Analytics Cost:      $0.00 (MongoDB + Chart.js + web-vitals)       ║
║  Third-party:         NONE — no Google Analytics, no Mixpanel       ║
║  Patient PII in analytics: NEVER                                    ║
║                                                                      ║
║  AI Quota Monitoring: Hugging Face + Translation usage tracked      ║
║  Security Analytics:  Event heatmaps · Suspicious IP detection      ║
║  Performance:         Core Web Vitals via web-vitals library         ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Analytics Plan v1.0**

*Data serves better healthcare — not vanity metrics.*

![MongoDB](https://img.shields.io/badge/MongoDB-Aggregation-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat)
![web-vitals](https://img.shields.io/badge/web--vitals-3.x-brightgreen?style=flat)
![Privacy](https://img.shields.io/badge/Privacy-No%20PII%20in%20Analytics-blue?style=flat)
![Cost](https://img.shields.io/badge/Analytics%20Cost-$0.00-purple?style=flat)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
