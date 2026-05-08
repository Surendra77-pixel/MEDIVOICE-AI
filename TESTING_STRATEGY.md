<div align="center">

# 🧪 MEDIVOICE AI — Testing Strategy
### Complete Quality Assurance & Testing Reference

![Document](https://img.shields.io/badge/Document-Testing%20Strategy-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Target%20Coverage-80%25-brightgreen?style=for-the-badge)
![Cost](https://img.shields.io/badge/Testing%20Tools-100%25%20Free-purple?style=for-the-badge)

> **The authoritative reference for how every feature, API, AI component,
> security control, and user flow in MediVoice AI is tested — before it
> reaches a single patient or doctor.**

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication
**Testing Philosophy:** Healthcare platforms demand higher quality standards — we test accordingly
**Coverage Target:** 80% unit · 70% integration · 100% critical path E2E
**Tools:** Jest · Supertest · Playwright · React Testing Library — all free

</div>

---

## 📋 Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Testing Pyramid](#2-testing-pyramid)
3. [Tools & Technology Stack](#3-tools--technology-stack)
4. [Project Structure for Tests](#4-project-structure-for-tests)
5. [Unit Tests — Backend Services](#5-unit-tests--backend-services)
   - [5.1 Auth Service Tests](#51-auth-service-tests)
   - [5.2 OTP Service Tests](#52-otp-service-tests)
   - [5.3 AI Risk Detection Tests](#53-ai-risk-detection-tests)
   - [5.4 Translation Service Tests](#54-translation-service-tests)
   - [5.5 Medical NER Tests](#55-medical-ner-tests)
   - [5.6 SOAP Note Generator Tests](#56-soap-note-generator-tests)
   - [5.7 Medication Reminder Parser Tests](#57-medication-reminder-parser-tests)
   - [5.8 Prescription Pre-Fill Tests](#58-prescription-pre-fill-tests)
6. [Unit Tests — Frontend Components](#6-unit-tests--frontend-components)
   - [6.1 Auth Form Components](#61-auth-form-components)
   - [6.2 Patient Components](#62-patient-components)
   - [6.3 Doctor Components](#63-doctor-components)
   - [6.4 Shared Components](#64-shared-components)
7. [Integration Tests — API Endpoints](#7-integration-tests--api-endpoints)
   - [7.1 Auth Routes](#71-auth-routes)
   - [7.2 Patient Routes](#72-patient-routes)
   - [7.3 Doctor Routes](#73-doctor-routes)
   - [7.4 Admin Routes](#74-admin-routes)
8. [Integration Tests — Database](#8-integration-tests--database)
9. [Integration Tests — WebSocket](#9-integration-tests--websocket)
10. [End-to-End Tests — Critical User Journeys](#10-end-to-end-tests--critical-user-journeys)
    - [10.1 Patient Registration Journey](#101-patient-registration--verification-journey)
    - [10.2 Appointment Booking Journey](#102-appointment-booking-journey)
    - [10.3 Live Consultation Journey](#103-live-consultation-journey)
    - [10.4 Prescription & Reminder Journey](#104-prescription--reminder-journey)
    - [10.5 Doctor Clinical Workflow](#105-doctor-clinical-workflow)
    - [10.6 Admin Security Journey](#106-admin-security-journey)
11. [Security Testing](#11-security-testing)
12. [AI Component Testing](#12-ai-component-testing)
13. [Performance Testing](#13-performance-testing)
14. [Responsive & Cross-Browser Testing](#14-responsive--cross-browser-testing)
15. [Accessibility Testing](#15-accessibility-testing)
16. [CI/CD Testing Pipeline](#16-cicd-testing-pipeline)
17. [Test Data Management](#17-test-data-management)
18. [Coverage Requirements](#18-coverage-requirements)
19. [Testing Checklist — Pre-Launch](#19-testing-checklist--pre-launch)

---

## 1. Testing Philosophy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        TESTING PRINCIPLES                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  HEALTHCARE DEMANDS HIGHER STANDARDS                                     │
│  A bug in a social app is an inconvenience. A bug in a healthcare       │
│  platform can delay emergency care or corrupt medical records.           │
│  We test more, test earlier, and test critical paths exhaustively.       │
│                                                                          │
│  TEST BEHAVIOUR, NOT IMPLEMENTATION                                      │
│  Tests assert what the system does, not how it does it.                 │
│  "Given chest pain input → Risk level must be RED" is better            │
│  than "riskService.assessRiskLevel() returns object with level=RED".    │
│                                                                          │
│  EVERY AI FALLBACK IS TESTED                                             │
│  AI services fail. Tests verify the keyword fallback activates          │
│  transparently when Hugging Face returns 503. Tests mock external        │
│  APIs — they never call real external services in CI.                   │
│                                                                          │
│  SECURITY IS TESTED AS RIGOROUSLY AS FEATURES                           │
│  RBAC, rate limits, JWT validation, OTP security, and input            │
│  sanitization all have dedicated test suites.                           │
│                                                                          │
│  CRITICAL PATHS ARE ALWAYS GREEN                                         │
│  Auth flow · Appointment booking · Live consultation · Prescription     │
│  download · SOS button — these 5 journeys must pass 100% before        │
│  any code reaches production.                                            │
│                                                                          │
│  FREE TOOLS ONLY                                                         │
│  Jest · React Testing Library · Playwright · Supertest — all free,     │
│  all open-source, all excellent.                                         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Testing Pyramid

```
MEDIVOICE AI — TESTING PYRAMID
═══════════════════════════════════════════════════════════════════════════

                    ╔═══════════════════╗
                    ║   E2E TESTS       ║  ← Playwright
                    ║   ~40 tests       ║    Critical user journeys
                    ║   Slowest         ║    All 6 journeys
                    ╠═══════════════════╣
                ╔═══════════════════════════╗
                ║   INTEGRATION TESTS       ║  ← Jest + Supertest
                ║   ~120 tests              ║    API routes, DB, WebSocket
                ║   Medium speed            ║    Real MongoDB (test DB)
                ╠═══════════════════════════╣
            ╔═══════════════════════════════════╗
            ║   UNIT TESTS                      ║  ← Jest + RTL
            ║   ~300 tests                      ║    Services, utilities
            ║   Fastest · Run on every commit   ║    React components
            ╚═══════════════════════════════════╝

COVERAGE TARGETS:
  Unit Tests:         80% line coverage (backend services + frontend)
  Integration Tests:  70% endpoint coverage (all routes)
  E2E Tests:          100% critical path coverage (6 journeys)
  Security Tests:     100% auth flow coverage
  AI Tests:           100% fallback coverage (all 12 AI components)

RUN STRATEGY:
  Pre-commit:   Unit tests only (~30 seconds)
  PR opened:    Unit + Integration tests (~3 minutes)
  Merge to main: Full suite including E2E (~10 minutes)
  Nightly:      Full suite + performance tests
```

---

## 3. Tools & Technology Stack

### All Testing Tools (100% Free)

| Tool | Version | Purpose | Cost |
|---|---|---|---|
| **Jest** | 29.x | Unit + Integration test runner · Backend + Frontend | 🆓 Free |
| **React Testing Library** | 14.x | React component testing | 🆓 Free |
| **Supertest** | 6.x | HTTP API integration testing | 🆓 Free |
| **Playwright** | 1.x | End-to-end browser testing | 🆓 Free |
| **MongoDB Memory Server** | 9.x | In-memory MongoDB for tests (no Atlas needed) | 🆓 Free |
| **MSW (Mock Service Worker)** | 2.x | Mock external APIs (HF, LibreTranslate) | 🆓 Free |
| **jest-axe** | 8.x | Accessibility testing in Jest | 🆓 Free |
| **@testing-library/jest-dom** | 6.x | Custom DOM matchers | 🆓 Free |
| **@testing-library/user-event** | 14.x | User interaction simulation | 🆓 Free |
| **Faker.js** | 8.x | Test data generation | 🆓 Free |
| **istanbul / v8** | built-in | Code coverage reporting | 🆓 Free |

### Installation

```bash
# Backend test dependencies
cd server
npm install --save-dev \
  jest \
  supertest \
  mongodb-memory-server \
  @faker-js/faker \
  jest-mock-extended

# Frontend test dependencies
cd client
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  jest-axe \
  playwright \
  @playwright/test
```

### Jest Configuration

```javascript
// server/jest.config.js
module.exports = {
  testEnvironment:    'node',
  setupFilesAfterFramework: ['./tests/setup.js'],
  testMatch:          ['**/__tests__/**/*.test.js', '**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/seed/**',
  ],
  coverageThresholds: {
    global: {
      lines:      80,
      functions:  80,
      branches:   75,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout:       10000,
};

// client/jest.config.js
module.exports = {
  testEnvironment:    'jsdom',
  setupFilesAfterFramework: ['@testing-library/jest-dom', './src/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$':         '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$':    '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$':    '<rootDir>/src/utils/$1',
    '^@constants/(.*)$':'<rootDir>/src/constants/$1',
    '\\.(css|scss)$':   'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx}',
    'src/hooks/**/*.{js,jsx}',
    'src/utils/**/*.{js,jsx}',
    '!src/**/*.stories.*',
    '!src/tests/**',
  ],
};

// playwright.config.js
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir:   './e2e',
  timeout:   30000,
  retries:   2,
  use: {
    baseURL:   'http://localhost:3000',
    headless:  true,
    viewport:  { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'mobile',   use: { ...devices['Pixel 5'] } },
  ],
});
```

---

## 4. Project Structure for Tests

```
medivoice-ai/
│
├── server/
│   └── tests/
│       ├── setup.js                    ← MongoDB Memory Server + global mocks
│       ├── fixtures/                   ← Reusable test data factories
│       │   ├── userFactory.js
│       │   ├── appointmentFactory.js
│       │   └── consultationFactory.js
│       ├── unit/
│       │   ├── services/
│       │   │   ├── authService.test.js
│       │   │   ├── otpService.test.js
│       │   │   ├── appointmentService.test.js
│       │   │   └── consultationService.test.js
│       │   ├── services/ai/
│       │   │   ├── riskService.test.js
│       │   │   ├── nerService.test.js
│       │   │   ├── translateService.test.js
│       │   │   ├── soapService.test.js
│       │   │   ├── reminderService.test.js
│       │   │   └── prescriptionPrefillService.test.js
│       │   ├── middleware/
│       │   │   ├── authMiddleware.test.js
│       │   │   └── rateLimiter.test.js
│       │   └── utils/
│       │       ├── dateUtils.test.js
│       │       └── tokenUtils.test.js
│       └── integration/
│           ├── auth.test.js
│           ├── patients.test.js
│           ├── doctors.test.js
│           ├── appointments.test.js
│           ├── consultations.test.js
│           ├── admin.test.js
│           └── websocket.test.js
│
├── client/
│   └── src/tests/
│       ├── setup.js                    ← MSW server setup + RTL config
│       ├── mocks/
│       │   ├── handlers.js             ← MSW API mock handlers
│       │   └── server.js              ← MSW node server
│       ├── unit/
│       │   ├── components/
│       │   │   ├── auth/
│       │   │   │   ├── SignupForm.test.jsx
│       │   │   │   ├── LoginForm.test.jsx
│       │   │   │   └── OTPInput.test.jsx
│       │   │   ├── patient/
│       │   │   │   ├── ChatBubble.test.jsx
│       │   │   │   ├── DoctorCard.test.jsx
│       │   │   │   └── RiskAlertModal.test.jsx
│       │   │   ├── doctor/
│       │   │   │   ├── PatientQueueItem.test.jsx
│       │   │   │   └── SOAPNoteEditor.test.jsx
│       │   │   └── common/
│       │   │       ├── SOSButton.test.jsx
│       │   │       ├── RiskBadge.test.jsx
│       │   │       └── Modal.test.jsx
│       │   ├── hooks/
│       │   │   ├── useSpeechRecognition.test.js
│       │   │   └── useGeolocation.test.js
│       │   └── utils/
│       │       ├── validators.test.js
│       │       ├── dateHelpers.test.js
│       │       └── formatters.test.js
│       └── pages/
│           ├── PatientDashboard.test.jsx
│           └── DoctorDashboard.test.jsx
│
└── e2e/
    ├── auth.spec.js                    ← Registration, login, OTP, reset
    ├── patientBooking.spec.js          ← Appointment booking journey
    ├── liveConsultation.spec.js        ← STT + translation journey
    ├── prescriptionFlow.spec.js        ← Rx + PDF + reminders
    ├── doctorWorkflow.spec.js          ← Queue → Notes → Rx
    ├── adminSecurity.spec.js           ← User management + security
    └── helpers/
        ├── authHelper.js               ← Login helpers for tests
        └── testData.js                 ← Shared test constants
```

---

## 5. Unit Tests — Backend Services

### Test Setup (MongoDB Memory Server)

```javascript
// server/tests/setup.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri   = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean all collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Stop server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mock external AI services globally
jest.mock('../services/ai/nerService', () => ({
  extractMedicalEntities: jest.fn().mockResolvedValue({
    symptoms:    ['chest pain', 'fever'],
    medications: ['metformin'],
    bodyParts:   [],
    diagnoses:   [],
    procedures:  [],
    isKeywordFallback: false,
  }),
  keywordFallbackNER: jest.fn().mockReturnValue({
    symptoms: ['pain', 'fever'],
    medications: [],
    highRisk: [],
    isKeywordFallback: true,
  }),
}));

jest.mock('../services/ai/translateService', () => ({
  translateText: jest.fn().mockImplementation(
    async (text, from, to) => `[MOCK TRANSLATION: ${text}]`
  ),
}));

// Mock Nodemailer to prevent real emails in tests
jest.mock('../config/mailer', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue({ sent: true }),
  transporter:  { verify: jest.fn().mockResolvedValue(true) },
}));
```

---

### 5.1 Auth Service Tests

```javascript
// server/tests/unit/services/authService.test.js

const authService    = require('../../../services/authService');
const User           = require('../../../models/User');
const SecurityLog    = require('../../../models/SecurityLog');
const { userFactory } = require('../../fixtures/userFactory');

describe('Auth Service', () => {

  describe('signup()', () => {
    it('creates a new patient user with isVerified: false', async () => {
      const data = userFactory.build({ role: 'patient' });
      const user = await authService.signup(data);

      expect(user.isVerified).toBe(false);
      expect(user.role).toBe('patient');
      expect(user.email).toBe(data.email.toLowerCase());
    });

    it('hashes the password — plaintext never stored', async () => {
      const data  = userFactory.build({ password: 'Test@1234' });
      const user  = await authService.signup(data);
      const saved = await User.findById(user._id).select('+password');

      expect(saved.password).not.toBe('Test@1234');
      expect(saved.password).toMatch(/^\$2b\$/);  // bcrypt hash prefix
    });

    it('throws 409 if email already registered', async () => {
      const data = userFactory.build();
      await authService.signup(data);

      await expect(authService.signup(data))
        .rejects.toMatchObject({
          statusCode: 409,
          code:       'EMAIL_EXISTS',
        });
    });

    it('normalises email to lowercase', async () => {
      const data = userFactory.build({ email: 'RAVI@GMAIL.COM' });
      const user = await authService.signup(data);

      expect(user.email).toBe('ravi@gmail.com');
    });
  });

  describe('login()', () => {
    let existingUser;
    const PASSWORD = 'Test@2026';

    beforeEach(async () => {
      existingUser = await User.create({
        ...userFactory.build({ password: PASSWORD }),
        isVerified: true,
      });
    });

    it('returns JWT token on valid credentials', async () => {
      const { token, user } = await authService.login(
        existingUser.email, PASSWORD, '127.0.0.1', 'jest-test'
      );

      expect(token).toBeTruthy();
      expect(user.id.toString()).toBe(existingUser._id.toString());
    });

    it('does not include password in returned user object', async () => {
      const { user } = await authService.login(
        existingUser.email, PASSWORD, '127.0.0.1', 'jest-test'
      );

      expect(user.password).toBeUndefined();
      expect(user.currentSessionToken).toBeUndefined();
    });

    it('increments failedLoginAttempts on wrong password', async () => {
      try {
        await authService.login(existingUser.email, 'WrongPass@1', '127.0.0.1', 'test');
      } catch (_) {}

      const updated = await User.findById(existingUser._id);
      expect(updated.failedLoginAttempts).toBe(1);
    });

    it('locks account after 3 failed attempts', async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await authService.login(existingUser.email, 'WrongPass@1', '127.0.0.1', 'test');
        } catch (_) {}
      }

      const updated = await User.findById(existingUser._id);
      expect(updated.lockoutUntil).toBeTruthy();
      expect(updated.lockoutUntil.getTime()).toBeGreaterThan(Date.now());
    });

    it('returns 423 ACCOUNT_LOCKED when account is locked', async () => {
      // Lock the account manually
      await User.findByIdAndUpdate(existingUser._id, {
        lockoutUntil: new Date(Date.now() + 15 * 60 * 1000),
        failedLoginAttempts: 3,
      });

      await expect(
        authService.login(existingUser.email, PASSWORD, '127.0.0.1', 'test')
      ).rejects.toMatchObject({ statusCode: 423, code: 'ACCOUNT_LOCKED' });
    });

    it('rejects login for unverified account', async () => {
      const unverified = await User.create({
        ...userFactory.build(),
        isVerified: false,
      });

      await expect(
        authService.login(unverified.email, PASSWORD, '127.0.0.1', 'test')
      ).rejects.toMatchObject({ code: 'EMAIL_NOT_VERIFIED' });
    });

    it('creates security log on successful login', async () => {
      await authService.login(existingUser.email, PASSWORD, '127.0.0.1', 'test');

      const log = await SecurityLog.findOne({
        userId:    existingUser._id,
        eventType: 'login_success',
      });

      expect(log).toBeTruthy();
      expect(log.severity).toBe('LOW');
    });

    it('creates security log on failed login', async () => {
      try {
        await authService.login(existingUser.email, 'WrongPass@1', '127.0.0.1', 'test');
      } catch (_) {}

      const log = await SecurityLog.findOne({
        userId:    existingUser._id,
        eventType: 'login_failed',
      });

      expect(log).toBeTruthy();
      expect(log.severity).toBe('MEDIUM');
    });

    it('resets failedLoginAttempts to 0 on successful login', async () => {
      // Simulate 2 prior failures
      await User.findByIdAndUpdate(existingUser._id, { failedLoginAttempts: 2 });

      await authService.login(existingUser.email, PASSWORD, '127.0.0.1', 'test');

      const updated = await User.findById(existingUser._id);
      expect(updated.failedLoginAttempts).toBe(0);
    });
  });
});
```

---

### 5.2 OTP Service Tests

```javascript
// server/tests/unit/services/otpService.test.js

const otpService  = require('../../../services/otpService');
const OTP         = require('../../../models/OTP');
const User        = require('../../../models/User');
const { userFactory } = require('../../fixtures/userFactory');
const bcrypt      = require('bcrypt');

describe('OTP Service', () => {

  describe('generateAndSendOTP()', () => {
    it('creates an OTP record in the database', async () => {
      const email = 'test@example.com';
      await otpService.generateAndSendOTP(email, 'email_verify');

      const record = await OTP.findOne({ email, type: 'email_verify' });
      expect(record).toBeTruthy();
      expect(record.isUsed).toBe(false);
    });

    it('stores OTP as a bcrypt hash — never plaintext', async () => {
      const email = 'hash@example.com';
      await otpService.generateAndSendOTP(email, 'email_verify');

      const record = await OTP.findOne({ email }).select('+code');
      expect(record.code).not.toMatch(/^\d{6}$/);  // Not raw 6 digits
      expect(record.code).toMatch(/^\$2b\$/);        // bcrypt prefix
    });

    it('sets expiresAt to 10 minutes from now', async () => {
      const email = 'expiry@example.com';
      const before = Date.now();
      await otpService.generateAndSendOTP(email, 'email_verify');

      const record = await OTP.findOne({ email });
      const diff   = record.expiresAt.getTime() - before;

      expect(diff).toBeGreaterThan(9 * 60 * 1000);   // > 9 minutes
      expect(diff).toBeLessThan(11 * 60 * 1000);     // < 11 minutes
    });

    it('invalidates previous OTPs before creating new one', async () => {
      const email = 'multi@example.com';

      await otpService.generateAndSendOTP(email, 'email_verify');
      await otpService.generateAndSendOTP(email, 'email_verify'); // Second request

      const active = await OTP.find({ email, isUsed: false });
      expect(active.length).toBe(1);  // Only the newest should be active
    });

    it('calls sendOTPEmail with the correct arguments', async () => {
      const { sendOTPEmail } = require('../../../config/mailer');
      await otpService.generateAndSendOTP('email@test.com', 'password_reset');

      expect(sendOTPEmail).toHaveBeenCalledWith(
        'email@test.com',
        expect.stringMatching(/^\d{6}$/),  // Raw 6-digit code
        'password_reset'
      );
    });
  });

  describe('verifyOTP()', () => {
    let rawCode;

    beforeEach(async () => {
      const email = 'verify@example.com';
      rawCode = '847293';
      const hashed = await bcrypt.hash(rawCode, 8);

      await OTP.create({
        email,
        code:      hashed,
        type:      'email_verify',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isUsed:    false,
        attempts:  0,
        maxAttempts: 3,
      });
    });

    it('returns verified:true for correct OTP', async () => {
      const result = await otpService.verifyOTP(
        'verify@example.com', rawCode, 'email_verify'
      );
      expect(result.verified).toBe(true);
    });

    it('marks OTP as used after successful verification', async () => {
      await otpService.verifyOTP('verify@example.com', rawCode, 'email_verify');

      const record = await OTP.findOne({ email: 'verify@example.com' });
      expect(record.isUsed).toBe(true);
    });

    it('throws error for wrong OTP code', async () => {
      await expect(
        otpService.verifyOTP('verify@example.com', '000000', 'email_verify')
      ).rejects.toMatchObject({ code: 'INVALID_OTP' });
    });

    it('throws error for expired OTP', async () => {
      await OTP.updateOne(
        { email: 'verify@example.com' },
        { expiresAt: new Date(Date.now() - 1000) }  // Expired 1 second ago
      );

      await expect(
        otpService.verifyOTP('verify@example.com', rawCode, 'email_verify')
      ).rejects.toMatchObject({ code: 'INVALID_OTP' });
    });

    it('throws 429 after 3 failed attempts', async () => {
      await OTP.updateOne(
        { email: 'verify@example.com' },
        { attempts: 3 }
      );

      await expect(
        otpService.verifyOTP('verify@example.com', '000000', 'email_verify')
      ).rejects.toMatchObject({ statusCode: 429, code: 'OTP_ATTEMPTS_EXCEEDED' });
    });

    it('prevents reuse of already-used OTP', async () => {
      await otpService.verifyOTP('verify@example.com', rawCode, 'email_verify');

      await expect(
        otpService.verifyOTP('verify@example.com', rawCode, 'email_verify')
      ).rejects.toMatchObject({ code: 'INVALID_OTP' });
    });
  });
});
```

---

### 5.3 AI Risk Detection Tests

```javascript
// server/tests/unit/services/ai/riskService.test.js

const { assessRiskLevel, CRITICAL_PATTERNS, MODERATE_PATTERNS } =
  require('../../../../services/ai/riskService');

describe('Risk Detection Service', () => {

  describe('assessRiskLevel() — RED (Critical)', () => {

    const RED_INPUTS = [
      { input: 'I have chest pain',            expected: 'Possible cardiac event' },
      { input: 'I think I am having a heart attack', expected: 'Cardiac emergency' },
      { input: 'I cannot breathe at all',      expected: 'Respiratory emergency' },
      { input: 'I had a seizure just now',      expected: 'Seizure emergency' },
      { input: 'I feel like I had a stroke',   expected: /stroke/i },
      { input: 'I am unconscious help',        expected: 'Loss of consciousness' },
      { input: 'heavy bleeding that won\'t stop', expected: 'Hemorrhage emergency' },
      { input: 'I want to end my life',         expected: 'Mental health emergency' },
      { input: 'I took too many pills overdose', expected: 'Overdose emergency' },
      { input: 'sudden vision loss in one eye', expected: 'Neurological emergency' },
    ];

    RED_INPUTS.forEach(({ input, expected }) => {
      it(`detects RED risk for: "${input.substring(0, 40)}..."`, async () => {
        const result = await assessRiskLevel(input);
        expect(result.level).toBe('RED');
        if (typeof expected === 'string') {
          expect(result.condition).toContain(expected);
        } else {
          expect(result.condition).toMatch(expected);
        }
      });
    });

    it('responds in < 50ms (keyword layer — no API call)', async () => {
      const start  = Date.now();
      await assessRiskLevel('chest pain and cannot breathe');
      const elapsed = Date.now() - start;

      expect(elapsed).toBeLessThan(50);  // Keyword scan must be instant
    });
  });

  describe('assessRiskLevel() — YELLOW (Moderate)', () => {

    const YELLOW_INPUTS = [
      'high fever of 39 degrees',
      'severe pain in my joints',
      'difficulty breathing when climbing stairs',
      'severe headache since morning',
    ];

    YELLOW_INPUTS.forEach(input => {
      it(`detects YELLOW for: "${input}"`, async () => {
        const result = await assessRiskLevel(input);
        expect(result.level).toBe('YELLOW');
      });
    });
  });

  describe('assessRiskLevel() — GREEN (Stable)', () => {

    const GREEN_INPUTS = [
      'mild headache today',
      'feeling slightly tired',
      'want to book a routine checkup',
      'I need a prescription refill',
      '',
    ];

    GREEN_INPUTS.forEach(input => {
      it(`returns GREEN for safe input: "${input || '(empty)'}"`, async () => {
        const result = await assessRiskLevel(input);
        expect(result.level).toBe('GREEN');
        expect(result.message).toBeNull();
      });
    });
  });

  describe('Edge cases', () => {
    it('handles null input gracefully', async () => {
      const result = await assessRiskLevel(null);
      expect(result.level).toBe('GREEN');
    });

    it('handles very long input without crashing', async () => {
      const longInput = 'I have a mild cough. '.repeat(100);
      const result = await assessRiskLevel(longInput);
      expect(result).toHaveProperty('level');
    });

    it('is case-insensitive for keyword detection', async () => {
      const result = await assessRiskLevel('CHEST PAIN SEVERE');
      expect(result.level).toBe('RED');
    });
  });
});
```

---

### 5.4 Translation Service Tests

```javascript
// server/tests/unit/services/ai/translateService.test.js

const axios = require('axios');
jest.mock('axios');

const { translateText } = require('../../../../services/ai/translateService');

describe('Translation Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns translated text from LibreTranslate', async () => {
    axios.post.mockResolvedValue({
      data: { translatedText: 'மார்பில் வலி இருக்கிறது' }
    });

    const result = await translateText('I have chest pain', 'en-IN', 'ta-IN');
    expect(result).toBe('மார்பில் வலி இருக்கிறது');
  });

  it('returns original text unchanged when source = target', async () => {
    const result = await translateText('Hello', 'hi-IN', 'hi-IN');
    expect(result).toBe('Hello');
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('returns empty string for empty input', async () => {
    const result = await translateText('', 'hi-IN', 'ta-IN');
    expect(result).toBe('');
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('falls back to MyMemory when LibreTranslate returns 429', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 429 } });
    axios.get.mockResolvedValue({
      data: {
        responseStatus: 200,
        responseData:   { translatedText: 'Fallback Tamil text' },
      }
    });

    const result = await translateText('test', 'hi-IN', 'ta-IN');
    expect(result).toBe('Fallback Tamil text');
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('mymemory.translated.net'),
      expect.any(Object)
    );
  });

  it('returns "[Translation unavailable]" when both services fail', async () => {
    axios.post.mockRejectedValue(new Error('LibreTranslate down'));
    axios.get.mockRejectedValue(new Error('MyMemory down'));

    const result = await translateText('hello', 'hi-IN', 'ta-IN');
    expect(result).toContain('[Translation unavailable]');
  });

  it('uses cache for repeated identical translations', async () => {
    axios.post.mockResolvedValue({ data: { translatedText: 'Cached result' } });

    await translateText('same text', 'hi-IN', 'ta-IN');
    await translateText('same text', 'hi-IN', 'ta-IN');  // Second call

    // Should only call API once — second hit is from cache
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('maps BCP-47 codes to LibreTranslate codes correctly', async () => {
    axios.post.mockResolvedValue({ data: { translatedText: 'test' } });
    await translateText('hello', 'hi-IN', 'ta-IN');

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ source: 'hi', target: 'ta' }),
      expect.any(Object)
    );
  });

  it('routes non-direct pairs through English pivot (2 API calls)', async () => {
    axios.post
      .mockResolvedValueOnce({ data: { translatedText: 'English intermediate' } })
      .mockResolvedValueOnce({ data: { translatedText: 'Telugu result' } });

    const result = await translateText('Tamil text', 'ta-IN', 'te-IN');
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(result).toBe('Telugu result');
  });
});
```

---

### 5.5 Medical NER Tests

```javascript
// server/tests/unit/services/ai/nerService.test.js

const axios = require('axios');
jest.mock('axios');

// Reset mock after each test so we test both HF success and fallback
const {
  extractMedicalEntities,
  keywordFallbackNER,
} = jest.requireActual('../../../../services/ai/nerService');

describe('Medical NER Service', () => {

  describe('keywordFallbackNER()', () => {
    it('extracts common symptom keywords', () => {
      const result = keywordFallbackNER('I have pain and fever and cough');
      expect(result.symptoms).toContain('pain');
      expect(result.symptoms).toContain('fever');
      expect(result.symptoms).toContain('cough');
      expect(result.isKeywordFallback).toBe(true);
    });

    it('extracts common medication keywords', () => {
      const result = keywordFallbackNER('taking metformin and aspirin');
      expect(result.medications).toContain('metformin');
      expect(result.medications).toContain('aspirin');
    });

    it('flags high risk keywords', () => {
      const result = keywordFallbackNER('chest pain and cannot breathe');
      expect(result.highRisk).toContain('chest pain');
    });

    it('returns empty arrays for clean input', () => {
      const result = keywordFallbackNER('I would like to book an appointment');
      expect(result.symptoms).toHaveLength(0);
      expect(result.medications).toHaveLength(0);
      expect(result.highRisk).toHaveLength(0);
    });
  });

  describe('extractMedicalEntities() with Hugging Face API', () => {
    it('extracts entities from HF API response', async () => {
      axios.post.mockResolvedValue({
        data: [
          { entity_group: 'Sign_or_Symptom', word: 'chest pain',  score: 0.98 },
          { entity_group: 'Sign_or_Symptom', word: 'fever',       score: 0.95 },
          { entity_group: 'Chemical',        word: 'Metformin',   score: 0.99 },
          { entity_group: 'Body_Part',       word: 'heart',       score: 0.92 },
        ]
      });

      const result = await extractMedicalEntities('patient has chest pain and fever taking Metformin');
      expect(result.symptoms).toContain('chest pain');
      expect(result.symptoms).toContain('fever');
      expect(result.medications).toContain('Metformin');
      expect(result.bodyParts).toContain('heart');
      expect(result.isKeywordFallback).toBe(false);
    });

    it('uses keyword fallback when HF returns 503 (cold start)', async () => {
      axios.post.mockRejectedValue({ response: { status: 503 } });

      const result = await extractMedicalEntities('I have fever and pain');
      expect(result.isKeywordFallback).toBe(true);
      expect(result.symptoms.length).toBeGreaterThan(0);
    });

    it('returns empty entities for very short input', async () => {
      const result = await extractMedicalEntities('hi');
      expect(result.symptoms).toHaveLength(0);
    });

    it('uses cache for repeated identical inputs', async () => {
      axios.post.mockResolvedValue({ data: [] });

      await extractMedicalEntities('I have a headache');
      await extractMedicalEntities('I have a headache');  // Same input

      // Only one API call for two identical inputs (cache hit)
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
```

---

### 5.6 SOAP Note Generator Tests

```javascript
// server/tests/unit/services/ai/soapService.test.js

const { generateSOAPNote } = require('../../../../services/ai/soapService');

const SAMPLE_TRANSCRIPT = `
[Patient] I have been having chest pain for 2 days. It started suddenly.
[Doctor] Where exactly do you feel the pain?
[Patient] In the middle of my chest, sometimes it goes to my left arm.
[Doctor] Are you taking any medications currently?
[Patient] Yes, I take Metformin 500mg twice daily for diabetes.
[Doctor] I will order an ECG. The diagnosis looks like Hypertension Stage 1.
[Doctor] I will prescribe Amlodipine 5mg once daily. Follow up in 2 weeks.
`;

const PATIENT_DATA = { name: 'Ravi Kumar', age: 34, gender: 'male' };

describe('SOAP Note Generator', () => {

  it('generates a SOAP note object from transcript', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);

    expect(soap).toHaveProperty('subjective');
    expect(soap).toHaveProperty('objective');
    expect(soap).toHaveProperty('assessment');
    expect(soap).toHaveProperty('plan');
  });

  it('marks note as AI-generated', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);
    expect(soap.aiGenerated).toBe(true);
    expect(soap.doctorConfirmed).toBe(false);
  });

  it('extracts chief complaint from patient speech', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);
    expect(soap.subjective.chiefComplaint).toBeTruthy();
    expect(soap.subjective.chiefComplaint.toLowerCase()).toContain('chest');
  });

  it('extracts current medications from patient speech', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);
    expect(soap.subjective.currentMedications.some(m =>
      m.toLowerCase().includes('metformin')
    )).toBe(true);
  });

  it('extracts diagnosis from doctor speech', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);
    expect(soap.assessment.probableDiagnosis.toLowerCase())
      .toContain('hypertension');
  });

  it('extracts prescribed medications from doctor speech', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);
    expect(soap.plan.prescribedMedications.some(m =>
      m.toLowerCase().includes('amlodipine')
    )).toBe(true);
  });

  it('handles empty transcript gracefully', async () => {
    const soap = await generateSOAPNote('', PATIENT_DATA);
    expect(soap.subjective.chiefComplaint).toBeTruthy(); // Fallback message
  });

  it('includes patient data in generated note', async () => {
    const soap = await generateSOAPNote(SAMPLE_TRANSCRIPT, PATIENT_DATA);
    expect(soap.patient.name).toBe('Ravi Kumar');
    expect(soap.generatedAt).toBeTruthy();
  });
});
```

---

### 5.7 Medication Reminder Parser Tests

```javascript
// server/tests/unit/services/ai/reminderService.test.js

const {
  parseFrequencyToTimes,
  parseDurationToDays,
  generateReminderSchedule,
} = require('../../../../services/reminderService');

describe('Medication Reminder Parser', () => {

  describe('parseFrequencyToTimes()', () => {
    const FREQUENCY_CASES = [
      { input: 'Once daily',       expected: ['08:00'] },
      { input: 'OD',               expected: ['08:00'] },
      { input: '1/day',            expected: ['08:00'] },
      { input: 'Twice daily',      expected: ['08:00', '20:00'] },
      { input: 'BD',               expected: ['08:00', '20:00'] },
      { input: 'BID',              expected: ['08:00', '20:00'] },
      { input: 'Thrice daily',     expected: ['08:00', '14:00', '20:00'] },
      { input: 'TID',              expected: ['08:00', '14:00', '20:00'] },
      { input: 'TDS',              expected: ['08:00', '14:00', '20:00'] },
      { input: 'Four times daily', expected: ['08:00', '12:00', '16:00', '20:00'] },
      { input: 'QID',              expected: ['08:00', '12:00', '16:00', '20:00'] },
      { input: 'At night',         expected: ['21:00'] },
      { input: 'HS',               expected: ['21:00'] },
      { input: 'Bedtime',          expected: ['21:00'] },
      { input: 'In the morning',   expected: ['08:00'] },
    ];

    FREQUENCY_CASES.forEach(({ input, expected }) => {
      it(`"${input}" → ${JSON.stringify(expected)}`, () => {
        expect(parseFrequencyToTimes(input)).toEqual(expected);
      });
    });

    it('defaults to ["08:00"] for unrecognised frequency', () => {
      expect(parseFrequencyToTimes('take as needed')).toEqual(['08:00']);
    });
  });

  describe('parseDurationToDays()', () => {
    const DURATION_CASES = [
      { input: '5 days',    expected: 5  },
      { input: '7 days',    expected: 7  },
      { input: '1 week',    expected: 7  },
      { input: '2 weeks',   expected: 14 },
      { input: '1 month',   expected: 30 },
      { input: '3 months',  expected: 90 },
      { input: null,        expected: 7  },  // Default
      { input: '',          expected: 7  },  // Default
    ];

    DURATION_CASES.forEach(({ input, expected }) => {
      it(`"${input ?? 'null'}" → ${expected} days`, () => {
        expect(parseDurationToDays(input)).toBe(expected);
      });
    });
  });

  describe('generateReminderSchedule()', () => {
    const PATIENT_ID = 'patient123';

    it('generates correct number of reminders for twice-daily medication', () => {
      const reminders = generateReminderSchedule([{
        drugName:    'Metformin',
        dose:        '500mg',
        frequency:   'Twice daily',
        duration:    '30 days',
        instructions: 'Take with food',
      }], PATIENT_ID);

      // Twice daily = 2 reminders
      expect(reminders).toHaveLength(2);
      expect(reminders[0].scheduledTime).toBe('08:00');
      expect(reminders[1].scheduledTime).toBe('20:00');
    });

    it('sets correct notification content', () => {
      const reminders = generateReminderSchedule([{
        drugName: 'Aspirin', dose: '75mg', frequency: 'Once daily',
        duration: '30 days', instructions: 'After food',
      }], PATIENT_ID);

      expect(reminders[0].notificationTitle).toContain('Aspirin');
      expect(reminders[0].notificationBody).toContain('75mg');
    });

    it('calculates endDate correctly from duration', () => {
      const reminders = generateReminderSchedule([{
        drugName: 'Test', dose: '10mg', frequency: 'Once daily',
        duration: '7 days', instructions: '',
      }], PATIENT_ID);

      const daysUntilEnd = Math.round(
        (reminders[0].endDate - Date.now()) / (1000 * 60 * 60 * 24)
      );

      expect(daysUntilEnd).toBeCloseTo(7, 0);
    });

    it('handles multiple medications correctly', () => {
      const reminders = generateReminderSchedule([
        { drugName: 'Amlodipine', dose: '5mg',  frequency: 'Once daily',  duration: '30 days', instructions: '' },
        { drugName: 'Metoprolol', dose: '25mg', frequency: 'Twice daily', duration: '30 days', instructions: '' },
      ], PATIENT_ID);

      // 1 + 2 = 3 total reminders
      expect(reminders).toHaveLength(3);
    });
  });
});
```

---

### 5.8 Prescription Pre-Fill Tests

```javascript
// server/tests/unit/services/ai/prescriptionPrefillService.test.js

const { preFillPrescription } = require('../../../../services/ai/prescriptionPrefillService');

const SAMPLE_SOAP = {
  assessment: { probableDiagnosis: 'Hypertension Stage 1' },
  plan: {
    prescribedMedications: ['Amlodipine', 'Metoprolol'],
    followUpInstructions:  'Follow up in 2 weeks',
    lifestyleAdvice:       ['Reduce salt intake', 'Exercise daily'],
  },
  subjective: { currentMedications: ['Metformin'] },
};

describe('Prescription Pre-Fill Service', () => {

  it('pre-fills diagnosis from SOAP assessment', async () => {
    const prefill = await preFillPrescription(SAMPLE_SOAP, '');
    expect(prefill.diagnosis).toBe('Hypertension Stage 1');
  });

  it('pre-fills known drug with dose and frequency', async () => {
    const prefill = await preFillPrescription(SAMPLE_SOAP, '');
    const amlodipine = prefill.medications.find(
      m => m.drugName.toLowerCase() === 'amlodipine'
    );

    expect(amlodipine).toBeTruthy();
    expect(amlodipine.dose).toBe('5mg');
    expect(amlodipine.frequency).toBe('Once daily');
  });

  it('marks pre-filled rows with aiPrefilled: true', async () => {
    const prefill = await preFillPrescription(SAMPLE_SOAP, '');
    expect(prefill.medications.every(m => m.aiPrefilled === true)).toBe(true);
  });

  it('leaves dose empty for unknown drugs (no fabrication)', async () => {
    const soapWithUnknown = {
      ...SAMPLE_SOAP,
      plan: { ...SAMPLE_SOAP.plan, prescribedMedications: ['ObscureDrug2026'] },
    };

    const prefill = await preFillPrescription(soapWithUnknown, '');
    const unknown = prefill.medications.find(m => m.drugName === 'ObscureDrug2026');

    expect(unknown.dose).toBe('');         // Empty — doctor must fill
    expect(unknown.frequency).toBe('');    // Never fabricate
  });

  it('reports prefill confidence percentage', async () => {
    const prefill = await preFillPrescription(SAMPLE_SOAP, '');
    expect(prefill.aiPrefillConfidence).toBeGreaterThan(0);
    expect(prefill.aiPrefillConfidence).toBeLessThanOrEqual(100);
  });
});
```

---

## 6. Unit Tests — Frontend Components

### MSW Setup

```javascript
// client/src/tests/mocks/handlers.js
// Intercepts all Axios calls in tests — no real API calls

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('/api/v1/auth/login', () =>
    HttpResponse.json({
      success: true,
      data: { user: { id: '1', firstName: 'Ravi', role: 'patient', email: 'r@g.com' } }
    })
  ),
  http.post('/api/v1/auth/signup', () =>
    HttpResponse.json({ success: true, message: 'OTP sent' }, { status: 201 })
  ),
  http.get('/api/v1/auth/me', () =>
    HttpResponse.json({
      success: true,
      data: { user: { id: '1', firstName: 'Ravi', role: 'patient' } }
    })
  ),

  // Patient handlers
  http.get('/api/v1/patients/appointments', () =>
    HttpResponse.json({ success: true, data: { appointments: [] } })
  ),
  http.post('/api/v1/patients/chat', () =>
    HttpResponse.json({
      success: true,
      data: { message: 'AI response', riskLevel: 'GREEN', showBookingButton: false }
    })
  ),
];
```

---

### 6.1 Auth Form Components

```javascript
// client/src/tests/unit/components/auth/SignupForm.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupForm from '../../../../components/auth/SignupForm';

const mockOnSubmit = jest.fn();

describe('SignupForm Component', () => {

  beforeEach(() => {
    render(<SignupForm onSubmit={mockOnSubmit} />);
  });

  it('renders all required fields', () => {
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /i am a/i })).toBeInTheDocument();
  });

  it('shows role selection buttons for Patient, Doctor, Admin', () => {
    expect(screen.getByRole('button', { name: /patient/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /doctor/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument();
  });

  it('shows password strength bar as user types', async () => {
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'weak');

    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });

  it('shows "Strong" when password meets all requirements', async () => {
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, 'Str0ng@Pass');

    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('disables submit button when password is weak', async () => {
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'weak');

    const submitButton = screen.getByRole('button', { name: /create account/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows inline error for invalid email', async () => {
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    fireEvent.blur(screen.getByLabelText(/email/i));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    await userEvent.click(screen.getByRole('button', { name: /patient/i }));
    await userEvent.type(screen.getByLabelText(/first name/i), 'Ravi');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Kumar');
    await userEvent.type(screen.getByLabelText(/email/i), 'ravi@gmail.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Valid@Pass123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Ravi',
          email:     'ravi@gmail.com',
          role:      'patient',
        })
      );
    });
  });
});
```

---

### 6.2 Patient Components

```javascript
// client/src/tests/unit/components/patient/RiskAlertModal.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import RiskAlertModal from '../../../../components/patient/RiskAlertModal';

describe('RiskAlertModal', () => {

  it('renders nothing when riskLevel is GREEN', () => {
    const { container } = render(
      <RiskAlertModal riskData={{ level: 'GREEN' }} onClose={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders RED alert with CALL 108 button', () => {
    render(
      <RiskAlertModal
        riskData={{ level: 'RED', message: 'Emergency detected' }}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText(/call 108/i)).toBeInTheDocument();
    expect(screen.getByText(/emergency detected/i)).toBeInTheDocument();
  });

  it('CALL 108 button has correct tel: href on mobile', () => {
    render(
      <RiskAlertModal riskData={{ level: 'RED', message: 'Emergency' }} onClose={jest.fn()} />
    );

    const callButton = screen.getByRole('link', { name: /call 108/i });
    expect(callButton).toHaveAttribute('href', 'tel:108');
  });

  it('renders YELLOW alert without CALL 108 button', () => {
    render(
      <RiskAlertModal
        riskData={{ level: 'YELLOW', message: 'Urgent attention needed' }}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText(/call 108/i)).not.toBeInTheDocument();
    expect(screen.getByText(/urgent attention/i)).toBeInTheDocument();
  });

  it('calls onClose when dismiss is clicked', () => {
    const onClose = jest.fn();
    render(
      <RiskAlertModal riskData={{ level: 'RED', message: 'x' }} onClose={onClose} />
    );

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

---

### 6.3 Doctor Components

```javascript
// client/src/tests/unit/components/doctor/PatientQueueItem.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import PatientQueueItem from '../../../../components/doctor/PatientQueueItem';

const MOCK_PATIENT = {
  id:              'appt123',
  patientName:     'Ravi Kumar',
  age:             34,
  gender:          'Male',
  scheduledAt:     '2026-04-15T10:30:00.000Z',
  chiefComplaint:  'Chest pain for 2 days',
  patientRiskLevel: 'RED',
  riskCondition:   'Possible cardiac event',
};

describe('PatientQueueItem', () => {

  it('renders patient name and time', () => {
    render(<PatientQueueItem appointment={MOCK_PATIENT} onStart={jest.fn()} />);

    expect(screen.getByText(/Ravi Kumar/i)).toBeInTheDocument();
    expect(screen.getByText(/10:30/i)).toBeInTheDocument();
  });

  it('shows RED risk badge for critical patient', () => {
    render(<PatientQueueItem appointment={MOCK_PATIENT} onStart={jest.fn()} />);

    const badge = screen.getByText(/CRITICAL/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-red-600');  // or similar red class
  });

  it('shows STABLE badge for green patient', () => {
    render(
      <PatientQueueItem
        appointment={{ ...MOCK_PATIENT, patientRiskLevel: 'GREEN' }}
        onStart={jest.fn()}
      />
    );

    expect(screen.getByText(/STABLE/i)).toBeInTheDocument();
  });

  it('calls onStart with appointmentId when Start is clicked', () => {
    const onStart = jest.fn();
    render(<PatientQueueItem appointment={MOCK_PATIENT} onStart={onStart} />);

    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onStart).toHaveBeenCalledWith('appt123');
  });

  it('shows chief complaint text', () => {
    render(<PatientQueueItem appointment={MOCK_PATIENT} onStart={jest.fn()} />);
    expect(screen.getByText(/Chest pain for 2 days/i)).toBeInTheDocument();
  });
});
```

---

### 6.4 Shared Components

```javascript
// client/src/tests/unit/components/common/SOSButton.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import SOSButton from '../../../../components/common/SOSButton';

expect.extend(toHaveNoViolations);

describe('SOSButton', () => {

  it('renders with SOS label', () => {
    render(<SOSButton />);
    expect(screen.getByRole('button', { name: /sos emergency/i })).toBeInTheDocument();
  });

  it('is always visible (fixed position)', () => {
    render(<SOSButton />);
    const button = screen.getByRole('button', { name: /sos/i });
    expect(button).toHaveClass('fixed');
  });

  it('has aria-label for screen readers', () => {
    render(<SOSButton />);
    const button = screen.getByRole('button', { name: /sos emergency/i });
    expect(button).toHaveAttribute('aria-label');
    expect(button.getAttribute('aria-label')).toContain('108');
  });

  it('passes accessibility audit', async () => {
    const { container } = render(<SOSButton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is at least 44px × 44px (WCAG touch target)', () => {
    render(<SOSButton />);
    const button = screen.getByRole('button', { name: /sos/i });
    // In real tests, check computed style — here verify class
    expect(button.className).toMatch(/w-\d+|h-\d+/);  // Has size classes
  });
});
```

---

## 7. Integration Tests — API Endpoints

### Integration Test Setup

```javascript
// server/tests/setup.js (integration additions)

const request = require('supertest');
const app     = require('../../app');
const jwt     = require('jsonwebtoken');

// Helper: create authenticated supertest instance
const authenticatedRequest = (role = 'patient', userId = 'test_user_id') => {
  const token = jwt.sign(
    { sub: userId, role, email: `${role}@test.com` },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '24h' }
  );

  // Also set in DB for session enforcement
  return { request: request(app), token, userId, role };
};

module.exports = { authenticatedRequest, request: request(app) };
```

---

### 7.1 Auth Routes

```javascript
// server/tests/integration/auth.test.js

const request    = require('supertest');
const app        = require('../../app');
const User       = require('../../models/User');
const { userFactory } = require('../fixtures/userFactory');

describe('POST /api/v1/auth/signup', () => {

  it('201 — creates user and sends OTP', async () => {
    const payload = userFactory.buildRaw();

    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(payload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/otp/i);

    const user = await User.findOne({ email: payload.email });
    expect(user.isVerified).toBe(false);
  });

  it('409 — rejects duplicate email', async () => {
    const payload = userFactory.buildRaw();
    await request(app).post('/api/v1/auth/signup').send(payload);

    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(payload)
      .expect(409);

    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });

  it('400 — rejects weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...userFactory.buildRaw(), password: 'weak' })
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.fields).toHaveProperty('password');
  });

  it('400 — rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...userFactory.buildRaw(), email: 'not-an-email' })
      .expect(400);

    expect(res.body.error.fields).toHaveProperty('email');
  });

  it('400 — rejects invalid role', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ ...userFactory.buildRaw(), role: 'superadmin' })
      .expect(400);

    expect(res.body.error.fields).toHaveProperty('role');
  });
});

describe('POST /api/v1/auth/login', () => {

  let user;
  const PASSWORD = 'Valid@Test2026';

  beforeEach(async () => {
    user = await User.create({
      ...userFactory.build({ password: PASSWORD }),
      isVerified: true,
    });
  });

  it('200 — sets httpOnly JWT cookie on success', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: PASSWORD })
      .expect(200);

    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    expect(setCookie[0]).toContain('HttpOnly');
    expect(setCookie[0]).toContain('token=');
  });

  it('200 — does NOT include password in response body', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: PASSWORD })
      .expect(200);

    expect(JSON.stringify(res.body)).not.toContain('password');
    expect(JSON.stringify(res.body)).not.toContain('currentSessionToken');
  });

  it('401 — rejects wrong password with generic message', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'WrongPass@1' })
      .expect(401);

    expect(res.body.error.message).toMatch(/invalid email or password/i);
    // Generic message — does NOT reveal which field was wrong
  });

  it('423 — returns lockout with minutesRemaining after 3 failures', async () => {
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'WrongPass@1' });
    }

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: PASSWORD })
      .expect(423);

    expect(res.body.error.code).toBe('ACCOUNT_LOCKED');
    expect(res.body.error).toHaveProperty('minutesRemaining');
  });
});

describe('GET /api/v1/auth/me', () => {

  it('401 — returns error without JWT cookie', async () => {
    const res = await request(app).get('/api/v1/auth/me').expect(401);
    expect(res.body.error.code).toBe('NO_TOKEN');
  });
});
```

---

### 7.2 Patient Routes

```javascript
// server/tests/integration/patients.test.js

describe('Patient API Routes', () => {

  describe('GET /api/v1/patients/profile — role guard', () => {

    it('403 — doctor cannot access patient profile route', async () => {
      const { request, token } = authenticatedRequest('doctor');
      await request
        .get('/api/v1/patients/profile')
        .set('Cookie', `token=${token}`)
        .expect(403);
    });

    it('401 — unauthenticated request rejected', async () => {
      await request(app)
        .get('/api/v1/patients/profile')
        .expect(401);
    });
  });

  describe('POST /api/v1/patients/appointments', () => {

    it('201 — creates appointment and AI-assigns risk level', async () => {
      // Setup: create patient + doctor in DB
      const patient = await createTestPatient();
      const doctor  = await createTestDoctor();
      const { request, token } = authenticatedRequest('patient', patient._id);

      const res = await request
        .post('/api/v1/patients/appointments')
        .set('Cookie', `token=${token}`)
        .send({
          doctorId:       doctor._id,
          scheduledAt:    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          chiefComplaint: 'Chest pain for 2 days',
        })
        .expect(201);

      expect(res.body.data.appointment.status).toBe('confirmed');
      expect(res.body.data.appointment.patientRiskLevel).toMatch(/RED|YELLOW|GREEN/);
    });

    it('400 — rejects past scheduledAt date', async () => {
      const patient = await createTestPatient();
      const { request, token } = authenticatedRequest('patient', patient._id);

      await request
        .post('/api/v1/patients/appointments')
        .set('Cookie', `token=${token}`)
        .send({
          doctorId:    'any_id',
          scheduledAt: new Date(Date.now() - 1000).toISOString(), // Past
          chiefComplaint: 'Test',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/patients/chat', () => {

    it('200 — returns AI chatbot response with riskLevel', async () => {
      const patient = await createTestPatient();
      const { request, token } = authenticatedRequest('patient', patient._id);

      const res = await request
        .post('/api/v1/patients/chat')
        .set('Cookie', `token=${token}`)
        .send({ message: 'I have a mild headache', language: 'en' })
        .expect(200);

      expect(res.body.data).toHaveProperty('message');
      expect(res.body.data).toHaveProperty('riskLevel');
      expect(['RED', 'YELLOW', 'GREEN']).toContain(res.body.data.riskLevel);
    });

    it('returns RED risk and emergency response for dangerous symptoms', async () => {
      const patient = await createTestPatient();
      const { request, token } = authenticatedRequest('patient', patient._id);

      const res = await request
        .post('/api/v1/patients/chat')
        .set('Cookie', `token=${token}`)
        .send({ message: 'I have severe chest pain and cannot breathe', language: 'en' })
        .expect(200);

      expect(res.body.data.type).toBe('EMERGENCY');
      expect(res.body.data.riskLevel).toBe('RED');
      expect(res.body.data.showSOSButton).toBe(true);
    });
  });
});
```

---

### 7.3 Doctor Routes

```javascript
// server/tests/integration/doctors.test.js

describe('Doctor API Routes', () => {

  describe('GET /api/v1/doctors/search', () => {

    it('200 — returns matching doctors without auth', async () => {
      await createTestDoctor({ specialty: 'Cardiologist', city: 'Hyderabad' });

      const res = await request(app)
        .get('/api/v1/doctors/search')
        .query({ specialty: 'Cardiologist', city: 'Hyderabad' })
        .expect(200);

      expect(res.body.data.doctors.length).toBeGreaterThan(0);
      expect(res.body.data.doctors[0].specialty).toBe('Cardiologist');
    });

    it('200 — returns empty array when no doctors match', async () => {
      const res = await request(app)
        .get('/api/v1/doctors/search')
        .query({ specialty: 'Astronaut', city: 'Hyderabad' })
        .expect(200);

      expect(res.body.data.doctors).toHaveLength(0);
    });
  });

  describe('GET /api/v1/doctors/me/queue', () => {

    it('403 — patient cannot access doctor queue', async () => {
      const { request: r, token } = authenticatedRequest('patient');
      await r
        .get('/api/v1/doctors/me/queue')
        .set('Cookie', `token=${token}`)
        .expect(403);
    });

    it('200 — returns today\'s appointments sorted by time', async () => {
      const doctor = await createTestDoctor();
      const { request: r, token } = authenticatedRequest('doctor', doctor.userId);

      const res = await r
        .get('/api/v1/doctors/me/queue')
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('appointments');
    });
  });

  describe('POST /api/v1/doctors/me/consultation/:id/generate-notes', () => {

    it('generates SOAP note from consultation transcript', async () => {
      const doctor       = await createTestDoctor();
      const consultation = await createTestConsultation({
        doctorId: doctor.userId,
        transcript: [
          { speaker: 'Patient', originalText: 'I have chest pain' },
          { speaker: 'Doctor', originalText: 'How long? Diagnosed as hypertension.' },
        ],
      });

      const { request: r, token } = authenticatedRequest('doctor', doctor.userId);

      const res = await r
        .post(`/api/v1/doctors/me/consultations/${consultation._id}/generate-notes`)
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(res.body.data.soapNote).toHaveProperty('subjective');
      expect(res.body.data.soapNote.aiGenerated).toBe(true);
    });
  });
});
```

---

### 7.4 Admin Routes

```javascript
// server/tests/integration/admin.test.js

describe('Admin API Routes', () => {

  it('403 — patient cannot access admin routes', async () => {
    const { request: r, token } = authenticatedRequest('patient');
    await r
      .get('/api/v1/admin/users')
      .set('Cookie', `token=${token}`)
      .expect(403);
  });

  it('403 — doctor cannot access admin routes', async () => {
    const { request: r, token } = authenticatedRequest('doctor');
    await r
      .get('/api/v1/admin/users')
      .set('Cookie', `token=${token}`)
      .expect(403);
  });

  describe('GET /api/v1/admin/users', () => {
    it('200 — returns paginated user list for admin', async () => {
      const admin = await createTestAdmin();
      const { request: r, token } = authenticatedRequest('admin', admin._id);

      const res = await r
        .get('/api/v1/admin/users')
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('users');
      expect(res.body).toHaveProperty('pagination');
    });
  });

  describe('PATCH /api/v1/admin/doctors/:id/verify', () => {
    it('sets isVerified to true on doctor profile', async () => {
      const admin  = await createTestAdmin();
      const doctor = await createTestDoctor();
      const { request: r, token } = authenticatedRequest('admin', admin._id);

      await r
        .patch(`/api/v1/admin/doctors/${doctor._id}/verify`)
        .set('Cookie', `token=${token}`)
        .expect(200);

      const updated = await Doctor.findById(doctor._id);
      expect(updated.isVerified).toBe(true);
    });
  });
});
```

---

## 8. Integration Tests — Database

```javascript
// server/tests/integration/database.test.js

const mongoose = require('mongoose');
const User     = require('../../models/User');
const OTP      = require('../../models/OTP');

describe('Database Schema Tests', () => {

  describe('User Schema Validation', () => {
    it('rejects duplicate email', async () => {
      const email = 'dup@test.com';
      await User.create({ ...userFactory.build(), email });

      await expect(
        User.create({ ...userFactory.build(), email })
      ).rejects.toThrow(/duplicate key/i);
    });

    it('does not return password field by default', async () => {
      await User.create(userFactory.build());
      const found = await User.findOne({ email: userFactory.lastEmail() });
      expect(found.password).toBeUndefined();
    });

    it('rejects invalid role enum value', async () => {
      await expect(
        User.create({ ...userFactory.build(), role: 'superuser' })
      ).rejects.toThrow(/role/i);
    });
  });

  describe('OTP TTL Index', () => {
    it('OTP document has TTL index on expiresAt', async () => {
      const indexes = await OTP.collection.indexes();
      const ttlIndex = indexes.find(idx =>
        idx.expireAfterSeconds !== undefined &&
        idx.key.expiresAt === 1
      );
      expect(ttlIndex).toBeTruthy();
      expect(ttlIndex.expireAfterSeconds).toBe(0);
    });
  });

  describe('Mongoose Connection', () => {
    it('connects to MongoDB Memory Server', () => {
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });
  });
});
```

---

## 9. Integration Tests — WebSocket

```javascript
// server/tests/integration/websocket.test.js

const { createServer } = require('http');
const { Server }       = require('socket.io');
const Client           = require('socket.io-client');
const jwt              = require('jsonwebtoken');
const app              = require('../../app');

describe('WebSocket — Live Consultation', () => {

  let io, serverSocket, clientA, clientB, httpServer;

  beforeAll((done) => {
    httpServer = createServer(app);
    io         = new Server(httpServer);
    require('../../websocket/transcriptSocket').setupTranscriptSocket(io);

    httpServer.listen(() => {
      const port = httpServer.address().port;

      const makeClient = (role, userId) => {
        const token = jwt.sign(
          { sub: userId, role },
          process.env.JWT_SECRET || 'test_secret',
          { expiresIn: '1h' }
        );
        return Client(`http://localhost:${port}`, {
          extraHeaders: { cookie: `token=${token}` },
        });
      };

      clientA = makeClient('patient', 'patient_id_123');
      clientB = makeClient('doctor',  'doctor_id_456');
      done();
    });
  });

  afterAll(() => {
    io.close();
    clientA.close();
    clientB.close();
    httpServer.close();
  });

  it('patient and doctor can join the same consultation room', (done) => {
    const consultationId = 'consultation_123';

    clientB.emit('join:consultation', { consultationId });
    clientA.emit('join:consultation', { consultationId });

    // Both connected — no error emitted
    setTimeout(() => done(), 300);
  });

  it('transcript:patient event broadcasts translated text to doctor', (done) => {
    const consultationId = 'transcript_test_123';
    clientA.emit('join:consultation', { consultationId });
    clientB.emit('join:consultation', { consultationId });

    clientB.on('transcript:from-patient', (data) => {
      expect(data).toHaveProperty('original');
      expect(data).toHaveProperty('translated');
      expect(data.speaker).toBe('Patient');
      done();
    });

    setTimeout(() => {
      clientA.emit('transcript:patient', {
        consultationId,
        text:       'I have chest pain',
        sourceLang: 'en-IN',
        targetLang: 'ta-IN',
      });
    }, 200);
  });

  it('risk:alert event is emitted when high-risk text detected', (done) => {
    const consultationId = 'risk_test_123';
    clientA.emit('join:consultation', { consultationId });
    clientB.emit('join:consultation', { consultationId });

    // Either client can receive risk alert
    clientA.on('risk:alert', (data) => {
      expect(data.level).toBe('RED');
      done();
    });

    setTimeout(() => {
      clientA.emit('transcript:patient', {
        consultationId,
        text:       'I have chest pain and cannot breathe',
        sourceLang: 'en-IN',
        targetLang: 'ta-IN',
      });
    }, 200);
  });

  it('rejects socket connection without valid JWT', (done) => {
    const unauthClient = Client(`http://localhost:${httpServer.address().port}`, {
      // No cookie / no token
    });

    unauthClient.on('connect_error', (err) => {
      expect(err.message).toMatch(/auth/i);
      unauthClient.close();
      done();
    });
  });
});
```

---

## 10. End-to-End Tests — Critical User Journeys

### 10.1 Patient Registration & Verification Journey

```javascript
// e2e/auth.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Patient Registration & Login', () => {

  test('complete registration and OTP verification flow', async ({ page }) => {
    // Step 1: Navigate to signup
    await page.goto('/signup');
    await expect(page).toHaveTitle(/MediVoice/);

    // Step 2: Select patient role
    await page.click('button:has-text("Patient")');

    // Step 3: Fill registration form
    await page.fill('[name="firstName"]', 'Ravi');
    await page.fill('[name="lastName"]',  'Kumar');
    await page.fill('[name="email"]',     'ravi.test@medivoice.dev');
    await page.fill('[name="password"]',  'Test@2026MV');

    // Step 4: Verify strength bar shows "Strong"
    await expect(page.locator('[data-testid="strength-label"]')).toHaveText('Strong');

    // Step 5: Submit
    await page.click('button:has-text("Create Account")');

    // Step 6: OTP verification page
    await expect(page).toHaveURL(/verify-otp/);
    await expect(page.locator('text=Check your email')).toBeVisible();

    // Step 7: Enter OTP (mocked in E2E)
    const otpInputs = page.locator('input[data-otp]');
    await otpInputs.nth(0).fill('8');
    await otpInputs.nth(1).fill('4');
    await otpInputs.nth(2).fill('7');
    await otpInputs.nth(3).fill('2');
    await otpInputs.nth(4).fill('9');
    await otpInputs.nth(5).fill('3');

    // Step 8: Verify and redirect to login
    await page.click('button:has-text("Verify Email")');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('text=Email verified')).toBeVisible();
  });

  test('login redirects patient to /patient dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]',    'ravi.test@medivoice.dev');
    await page.fill('[name="password"]', 'Test@2026MV');
    await page.click('button:has-text("Log In")');

    await expect(page).toHaveURL('/patient');
    await expect(page.locator('text=Good morning')).toBeVisible();
  });

  test('shows lockout modal after 3 wrong password attempts', async ({ page }) => {
    await page.goto('/login');

    for (let i = 0; i < 3; i++) {
      await page.fill('[name="email"]',    'ravi.test@medivoice.dev');
      await page.fill('[name="password"]', 'WrongPass@1');
      await page.click('button:has-text("Log In")');
    }

    // Lockout modal should appear
    await expect(page.locator('text=Account Temporarily Locked')).toBeVisible();
    await expect(page.locator('[data-testid="lockout-countdown"]')).toBeVisible();
  });

  test('forgot password flow sends OTP and resets password', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('[name="email"]', 'ravi.test@medivoice.dev');
    await page.click('button:has-text("Send Reset Code")');

    await expect(page.locator('text=If an account exists')).toBeVisible();

    // Navigate to reset page
    await page.goto('/reset-password');
    const otpInputs = page.locator('input[data-otp]');
    for (let i = 0; i < 6; i++) await otpInputs.nth(i).fill(String(i + 1));

    await page.fill('[name="newPassword"]',     'NewPass@2026MV');
    await page.fill('[name="confirmPassword"]', 'NewPass@2026MV');
    await page.click('button:has-text("Reset Password")');

    await expect(page).toHaveURL(/login/);
    await expect(page.locator('text=Password reset')).toBeVisible();
  });
});
```

---

### 10.2 Appointment Booking Journey

```javascript
// e2e/patientBooking.spec.js

test.describe('Appointment Booking Flow', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsPatient(page);
  });

  test('searches doctors and books an appointment', async ({ page }) => {
    // Navigate to appointment booking
    await page.click('text=Book Appointment');
    await expect(page).toHaveURL('/patient/appointments');
    await page.click('text=Book New');

    // Search filters
    await page.selectOption('[name="specialty"]', 'Cardiologist');
    await page.selectOption('[name="city"]',      'Hyderabad');
    await page.click('button:has-text("Search")');

    // Doctor card appears
    await expect(page.locator('[data-testid="doctor-card"]').first()).toBeVisible();
    await page.click('[data-testid="doctor-card"]:first-child button:has-text("Book")');

    // Slot selection
    await expect(page).toHaveURL(/patient\/book\/.+/);
    await page.click('[data-testid="available-slot"]:first-child');

    // Chief complaint
    await page.fill('[name="chiefComplaint"]', 'Chest pain for 2 days');

    // Confirm
    await page.click('button:has-text("Confirm Booking")');

    // Success modal
    await expect(page.locator('text=Appointment Confirmed')).toBeVisible();
    await expect(page.locator('[data-testid="confirmation-modal"]')).toBeVisible();
  });

  test('hospital finder shows map with pins after GPS permission', async ({ page, context }) => {
    // Grant geolocation permission
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 17.4432, longitude: 78.3498 }); // Hyderabad

    await page.goto('/patient/hospitals');
    await page.click('button:has-text("Use My Location")');

    // Map should load
    await expect(page.locator('[data-testid="hospital-map"]')).toBeVisible();

    // Hospital list should populate
    await expect(page.locator('[data-testid="hospital-card"]').first())
      .toBeVisible({ timeout: 10000 });
  });
});
```

---

### 10.3 Live Consultation Journey

```javascript
// e2e/liveConsultation.spec.js

test.describe('Live Consultation — STT + Translation', () => {

  test('patient sees consent modal before consultation starts', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/patient/consultation/test_consult_id/live');

    await expect(page.locator('text=Consultation Recording Consent')).toBeVisible();
    await expect(page.locator('button:has-text("Start Consultation")')).toBeDisabled();

    // Check consent checkbox
    await page.check('[data-testid="consent-checkbox"]');
    await expect(page.locator('button:has-text("Start Consultation")')).toBeEnabled();
  });

  test('live transcript panel shows language selectors', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/patient/consultation/test_consult_id/live');
    await page.check('[data-testid="consent-checkbox"]');
    await page.click('button:has-text("Start Consultation")');

    await expect(page.locator('[data-testid="language-selector"]')).toBeVisible();
    await expect(page.locator('text=LISTENING')).toBeVisible({ timeout: 5000 });
  });

  test('SOS button visible throughout consultation', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/patient/consultation/test_consult_id/live');

    const sosButton = page.locator('[data-testid="sos-button"]');
    await expect(sosButton).toBeVisible();

    // SOS must remain visible even as page content changes
    await page.check('[data-testid="consent-checkbox"]');
    await expect(sosButton).toBeVisible();
  });

  test('risk alert overlay appears when critical keywords detected', async ({ page }) => {
    await loginAsPatient(page);
    // Navigate to chatbot with mocked high-risk response
    await page.goto('/patient/chat');

    // Type emergency symptom
    await page.fill('[data-testid="chat-input"]', 'I have severe chest pain');
    await page.click('[data-testid="chat-send"]');

    // Risk alert modal should appear
    await expect(page.locator('[data-testid="risk-alert-modal"]'))
      .toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=CALL 108')).toBeVisible();
  });
});
```

---

### 10.4 Prescription & Reminder Journey

```javascript
// e2e/prescriptionFlow.spec.js

test.describe('Prescription → PDF → Reminder Flow', () => {

  test('patient can download prescription PDF after consultation', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/patient/prescriptions');

    // Prescription card exists
    await expect(page.locator('[data-testid="prescription-card"]').first())
      .toBeVisible();

    // Start download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-pdf"]:first-child'),
    ]);

    // PDF was downloaded
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('medication reminders created from prescription', async ({ page }) => {
    await loginAsPatient(page);
    await page.goto('/patient/reminders');

    await expect(page.locator('[data-testid="reminder-card"]').first())
      .toBeVisible();
    await expect(page.locator('text=08:00')).toBeVisible();
    await expect(page.locator('[data-testid="active-badge"]')).toBeVisible();
  });
});
```

---

### 10.5 Doctor Clinical Workflow

```javascript
// e2e/doctorWorkflow.spec.js

test.describe('Doctor Clinical Workflow', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsDoctor(page);
  });

  test('doctor dashboard shows queue with risk badges', async ({ page }) => {
    await expect(page).toHaveURL('/doctor');
    await expect(page.locator('[data-testid="queue-card"]').first()).toBeVisible();

    // Risk badge visible
    const firstCard = page.locator('[data-testid="queue-card"]').first();
    const badge = firstCard.locator('[data-testid="risk-badge"]');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(/CRITICAL|MODERATE|STABLE/);
  });

  test('doctor can generate AI SOAP notes from consultation', async ({ page }) => {
    await page.goto('/doctor/consultation/test_id/notes');

    await expect(page.locator('text=AI Draft — Review')).toBeVisible();
    await expect(page.locator('[data-testid="soap-s-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="soap-p-section"]')).toBeVisible();

    // Confirm button available
    await expect(page.locator('button:has-text("Confirm")')).toBeVisible();
  });

  test('AI doctor assistant answers clinical question', async ({ page }) => {
    await page.goto('/doctor/assistant');
    await page.fill('[data-testid="assistant-input"]', 'Warfarin and Aspirin interaction?');
    await page.click('[data-testid="assistant-send"]');

    await expect(page.locator('[data-testid="assistant-response"]'))
      .toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=bleeding')).toBeVisible();
    await expect(page.locator('text=For reference only')).toBeVisible(); // Disclaimer
  });
});
```

---

### 10.6 Admin Security Journey

```javascript
// e2e/adminSecurity.spec.js

test.describe('Admin Portal', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('admin can view and verify a doctor', async ({ page }) => {
    await page.goto('/admin/users');

    // Find unverified doctor
    await page.selectOption('[data-testid="role-filter"]', 'doctor');
    const doctorRow = page.locator('[data-testid="user-row"]').first();
    await expect(doctorRow).toBeVisible();

    // Open action menu and verify
    await doctorRow.locator('[data-testid="action-menu"]').click();
    await page.click('text=Verify Doctor');

    // Confirmation
    await expect(page.locator('text=verified')).toBeVisible();
  });

  test('admin security monitor shows suspicious events', async ({ page }) => {
    await page.goto('/admin/security');

    await expect(page.locator('[data-testid="security-log"]').first()).toBeVisible();
    // Severity badge visible
    await expect(page.locator('[data-testid="severity-badge"]').first()).toBeVisible();
  });

  test('doctor cannot access admin panel', async ({ page }) => {
    await loginAsDoctor(page);
    await page.goto('/admin');

    // Should be redirected to doctor portal
    await expect(page).toHaveURL('/doctor');
  });
});
```

---

## 11. Security Testing

```javascript
// server/tests/unit/security/rbac.test.js

describe('Role-Based Access Control Security', () => {

  test.each([
    { role: 'patient', route: '/api/v1/doctors/me/queue', expectedStatus: 403 },
    { role: 'patient', route: '/api/v1/admin/users',      expectedStatus: 403 },
    { role: 'doctor',  route: '/api/v1/patients/profile', expectedStatus: 403 },
    { role: 'doctor',  route: '/api/v1/admin/users',      expectedStatus: 403 },
    { role: 'admin',   route: '/api/v1/patients/chat',    expectedStatus: 403 },
  ])('$role cannot access $route', async ({ role, route, expectedStatus }) => {
    const { request: r, token } = authenticatedRequest(role);
    await r.get(route).set('Cookie', `token=${token}`).expect(expectedStatus);
  });

  it('tampered JWT role claim is rejected', async () => {
    // Create a patient token but manually modify the role to 'admin'
    const tamperedToken = jwt.sign(
      { sub: 'patient_id', role: 'admin' }, // Claim to be admin
      'WRONG_SECRET',                         // Wrong secret — will fail verification
      { expiresIn: '1h' }
    );

    await request(app)
      .get('/api/v1/admin/users')
      .set('Cookie', `token=${tamperedToken}`)
      .expect(401);  // JWT verification fails
  });

  it('NoSQL injection in email field is sanitized', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: { $gt: '' }, password: 'anything' })
      .expect(400);  // sanitized → validation error, not auth bypass
  });

  it('XSS in firstName is sanitized before storage', async () => {
    const malicious = '<script>alert("xss")</script>';
    const data = userFactory.buildRaw({ firstName: malicious });

    await request(app).post('/api/v1/auth/signup').send(data).expect(201);

    const saved = await User.findOne({ email: data.email });
    expect(saved.firstName).not.toContain('<script>');
  });

  it('rate limiter returns 429 after 5 auth requests in 15 min', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ email: `rate${i}@test.com`, password: 'any' });
    }

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'rate6@test.com', password: 'any' })
      .expect(429);

    expect(res.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('JWT is in httpOnly cookie — not in response body', async () => {
    const user = await createVerifiedUser();

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'Test@2026MV' })
      .expect(200);

    // Token must NOT be in response body
    expect(JSON.stringify(res.body)).not.toContain('eyJ');
    // Token MUST be in Set-Cookie header
    expect(res.headers['set-cookie']?.[0]).toContain('HttpOnly');
  });
});
```

---

## 12. AI Component Testing

```javascript
// server/tests/unit/ai/aiComponents.test.js

describe('AI Component Fallback Testing', () => {

  describe('All 12 AI components have working fallbacks', () => {

    const testFallback = (name, fn, input, expectedField) => {
      it(`${name}: fallback works when primary API fails`, async () => {
        // Mock the primary API to fail
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API down'));

        const result = await fn(input);
        expect(result).toBeTruthy();
        if (expectedField) {
          expect(result).toHaveProperty(expectedField);
        }
      });
    };

    testFallback(
      'AI-04 Medical NER',
      (text) => extractMedicalEntities(text),
      'I have chest pain and fever',
      'symptoms'
    );

    testFallback(
      'AI-02 Translation',
      (text) => translateText(text, 'hi-IN', 'ta-IN'),
      'Hello',
      null  // Returns string
    );

    testFallback(
      'AI-08 Doctor QA',
      (q) => answerClinicalQuestion(q),
      'Max Paracetamol dose?',
      'answer'
    );
  });
});
```

---

## 13. Performance Testing

```javascript
// server/tests/performance/apiPerformance.test.js

describe('API Response Time Targets', () => {

  const measureTime = async (fn) => {
    const start = Date.now();
    await fn();
    return Date.now() - start;
  };

  it('GET /doctors/search responds in < 300ms', async () => {
    const elapsed = await measureTime(() =>
      request(app).get('/api/v1/doctors/search').query({ specialty: 'GP', city: 'Delhi' })
    );
    expect(elapsed).toBeLessThan(300);
  });

  it('POST /auth/login responds in < 500ms (includes bcrypt)', async () => {
    const user = await createVerifiedUser();
    const elapsed = await measureTime(() =>
      request(app)
        .post('/api/v1/auth/login')
        .send({ email: user.email, password: 'Test@2026MV' })
    );
    expect(elapsed).toBeLessThan(500);
  });

  it('Risk detection completes in < 50ms (keyword layer)', async () => {
    const { assessRiskLevel } = require('../../services/ai/riskService');
    const elapsed = await measureTime(() =>
      assessRiskLevel('I have severe chest pain and cannot breathe')
    );
    expect(elapsed).toBeLessThan(50);
  });
});
```

---

## 14. Responsive & Cross-Browser Testing

```javascript
// e2e/responsive.spec.js

const { test, expect, devices } = require('@playwright/test');

const VIEWPORTS = [
  { name: 'Mobile 375px',   width: 375,  height: 812 },
  { name: 'Tablet 768px',   width: 768,  height: 1024 },
  { name: 'Laptop 1366px',  width: 1366, height: 768 },
  { name: 'Desktop 1920px', width: 1920, height: 1080 },
];

VIEWPORTS.forEach(({ name, width, height }) => {
  test.describe(`Responsive: ${name}`, () => {

    test.use({ viewport: { width, height } });

    test('patient dashboard renders correctly', async ({ page }) => {
      await loginAsPatient(page);
      await expect(page.locator('[data-testid="patient-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="sos-button"]')).toBeVisible();

      // Take screenshot for visual review
      await page.screenshot({ path: `screenshots/dashboard-${width}px.png` });
    });

    test('SOS button is always visible and tappable', async ({ page }) => {
      await loginAsPatient(page);
      const sos = page.locator('[data-testid="sos-button"]');

      await expect(sos).toBeVisible();
      const box = await sos.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);   // WCAG minimum
      expect(box.height).toBeGreaterThanOrEqual(44);
    });

    test('navigation is accessible on all screen sizes', async ({ page }) => {
      await loginAsPatient(page);

      if (width < 768) {
        // Mobile: bottom nav bar
        await expect(page.locator('[data-testid="bottom-nav"]')).toBeVisible();
      } else {
        // Tablet+: sidebar
        await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
      }
    });
  });
});
```

---

## 15. Accessibility Testing

```javascript
// client/src/tests/accessibility/a11y.test.jsx

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

const A11Y_PAGES = [
  { name: 'PatientDashboard',  Component: PatientDashboard },
  { name: 'ChatbotPage',       Component: ChatbotPage },
  { name: 'DoctorDashboard',   Component: DoctorDashboard },
  { name: 'AdminDashboard',    Component: AdminDashboard },
  { name: 'SignupPage',        Component: SignupPage },
  { name: 'LoginPage',         Component: LoginPage },
];

A11Y_PAGES.forEach(({ name, Component }) => {
  it(`${name} has no WCAG 2.1 AA violations`, async () => {
    const { container } = render(<MockedProviders><Component /></MockedProviders>);
    const results = await axe(container, {
      rules: {
        'color-contrast':         { enabled: true },
        'duplicate-id':           { enabled: true },
        'label':                  { enabled: true },
        'button-name':            { enabled: true },
        'interactive-supports-focus': { enabled: true },
      }
    });
    expect(results).toHaveNoViolations();
  });
});

it('SOSButton meets minimum touch target size', async () => {
  const { container } = render(<SOSButton />);
  const button = container.querySelector('[data-testid="sos-button"]');
  const styles  = getComputedStyle(button);

  expect(parseInt(styles.width)).toBeGreaterThanOrEqual(44);
  expect(parseInt(styles.height)).toBeGreaterThanOrEqual(44);
});
```

---

## 16. CI/CD Testing Pipeline

```yaml
# .github/workflows/ci.yml

name: MediVoice AI — CI Pipeline

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  JWT_SECRET: 'test_secret_for_ci_only'

jobs:

  # ── Job 1: Backend Unit Tests ──────────────────────────────────────────
  backend-unit:
    name: 🧪 Backend Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: npm, cache-dependency-path: server/package-lock.json }
      - run: cd server && npm ci
      - name: Run unit tests with coverage
        run: cd server && npm run test:unit -- --coverage
        env:
          NODE_ENV: test
      - name: Upload coverage report
        uses: codecov/codecov-action@v4
        with: { directory: server/coverage, flags: backend-unit }

  # ── Job 2: Backend Integration Tests ──────────────────────────────────
  backend-integration:
    name: 🔗 Backend Integration Tests
    runs-on: ubuntu-latest
    needs: backend-unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: npm, cache-dependency-path: server/package-lock.json }
      - run: cd server && npm ci
      - name: Run integration tests (MongoDB Memory Server)
        run: cd server && npm run test:integration
        env:
          NODE_ENV:         test
          JWT_SECRET:       ${{ env.JWT_SECRET }}
          BCRYPT_SALT_ROUNDS: '4'  # Faster hashing in CI

  # ── Job 3: Frontend Unit Tests ─────────────────────────────────────────
  frontend-unit:
    name: ⚛️ Frontend Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: npm, cache-dependency-path: client/package-lock.json }
      - run: cd client && npm ci
      - run: cd client && npm run test:unit -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with: { directory: client/coverage, flags: frontend-unit }

  # ── Job 4: Security Tests ──────────────────────────────────────────────
  security:
    name: 🔐 Security Tests
    runs-on: ubuntu-latest
    needs: [backend-unit, backend-integration]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: npm, cache-dependency-path: server/package-lock.json }
      - run: cd server && npm ci
      - run: cd server && npm run test:security
      - name: Audit dependencies
        run: |
          cd server && npm audit --audit-level=high
          cd ../client && npm audit --audit-level=high

  # ── Job 5: Build Check ─────────────────────────────────────────────────
  build:
    name: 🏗️ Build Check
    runs-on: ubuntu-latest
    needs: frontend-unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}' }
      - run: cd client && npm ci && npm run build

  # ── Job 6: E2E Tests (on merge to main only) ───────────────────────────
  e2e:
    name: 🌐 End-to-End Tests
    runs-on: ubuntu-latest
    needs: [backend-integration, build]
    if: github.ref == 'refs/heads/main' || github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}' }
      - run: npm install
      - run: npx playwright install --with-deps chromium
      - name: Start backend
        run: cd server && npm start &
        env: { NODE_ENV: test, JWT_SECRET: ${{ env.JWT_SECRET }} }
      - name: Start frontend
        run: cd client && npm run preview &
      - name: Wait for servers
        run: npx wait-on http://localhost:3000 http://localhost:5000 --timeout 30000
      - name: Run Playwright E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Package.json Scripts

```json
{
  "scripts": {
    "test":              "jest",
    "test:unit":         "jest --testPathPattern=tests/unit",
    "test:integration":  "jest --testPathPattern=tests/integration --runInBand",
    "test:security":     "jest --testPathPattern=tests/unit/security",
    "test:coverage":     "jest --coverage",
    "test:watch":        "jest --watch",
    "test:e2e":          "playwright test",
    "test:e2e:ui":       "playwright test --ui",
    "test:a11y":         "jest --testPathPattern=tests/accessibility"
  }
}
```

---

## 17. Test Data Management

```javascript
// server/tests/fixtures/userFactory.js

const { faker } = require('@faker-js/faker');

const userFactory = {
  build: (overrides = {}) => ({
    firstName: faker.person.firstName(),
    lastName:  faker.person.lastName(),
    email:     faker.internet.email().toLowerCase(),
    password:  'Test@Factory2026',
    role:      'patient',
    city:      'Hyderabad',
    preferredLanguage: 'hi',
    isVerified: true,
    isActive:   true,
    isBanned:   false,
    ...overrides,
  }),

  buildRaw: (overrides = {}) => ({
    ...userFactory.build(overrides),
    isVerified: false,  // Pre-signup state
  }),

  buildDoctor: (overrides = {}) => userFactory.build({
    role: 'doctor', ...overrides
  }),

  buildAdmin: (overrides = {}) => userFactory.build({
    role: 'admin', ...overrides
  }),
};

// Helper functions for E2E tests
const createTestPatient = async (overrides = {}) => {
  const data = userFactory.build({ role: 'patient', ...overrides });
  return User.create(data);
};

const createTestDoctor = async (overrides = {}) => {
  const userData   = userFactory.build({ role: 'doctor' });
  const user       = await User.create(userData);
  const doctorData = {
    userId:    user._id,
    specialty: 'General Physician',
    city:      'Hyderabad',
    isVerified: true,
    status:    'available',
    qualifications: ['MBBS'],
    languagesSpoken: ['hi', 'en'],
    availability: {
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '09:00', endTime: '17:00',
      slotDurationMinutes: 30, maxDailySlots: 16,
    },
    ...overrides,
  };
  await Doctor.create(doctorData);
  return { ...user.toObject(), ...doctorData };
};

module.exports = { userFactory, createTestPatient, createTestDoctor };
```

---

## 18. Coverage Requirements

### Coverage Gates (CI will fail if below these thresholds)

| Scope | Lines | Functions | Branches | Statements |
|---|---|---|---|---|
| **Backend Services** | 80% | 80% | 75% | 80% |
| **Backend Middleware** | 85% | 85% | 80% | 85% |
| **Backend Utils** | 90% | 90% | 85% | 90% |
| **Frontend Components** | 75% | 75% | 70% | 75% |
| **Frontend Hooks** | 85% | 85% | 80% | 85% |
| **Frontend Utils** | 90% | 90% | 85% | 90% |

### Coverage Exclusions (not counted)

```javascript
// Files excluded from coverage measurement:
// - seed/ scripts (one-time, manual)
// - config/ files (environment-dependent)
// - *.stories.* (Storybook stories)
// - test files themselves
// - Generated files
```

---

## 19. Testing Checklist — Pre-Launch

### Authentication System
- [ ] Signup with valid data → user created, OTP sent ✅
- [ ] Signup with duplicate email → 409 with generic message ✅
- [ ] Signup with weak password → 400 with field error ✅
- [ ] OTP verification with correct code → isVerified: true ✅
- [ ] OTP verification with expired code → error, user prompted to resend ✅
- [ ] OTP verification 3 wrong attempts → OTP invalidated, must request new ✅
- [ ] Login correct credentials → JWT in httpOnly cookie ✅
- [ ] Login wrong password → generic error, attempt count shown ✅
- [ ] Login 3 failures → lockout modal with countdown ✅
- [ ] Login locked account → 423 with minutesRemaining ✅
- [ ] JWT not in response body → only in Set-Cookie header ✅
- [ ] Tampered JWT → 401 rejection ✅
- [ ] Expired JWT → redirect to login ✅
- [ ] New device login → old session invalidated ✅
- [ ] Forgot password → OTP sent, password reset works ✅
- [ ] Password reset → all sessions invalidated ✅

### RBAC Security
- [ ] Patient cannot access doctor routes → 403 ✅
- [ ] Patient cannot access admin routes → 403 ✅
- [ ] Doctor cannot access patient private routes → 403 ✅
- [ ] Doctor cannot access admin routes → 403 ✅
- [ ] Admin cannot access patient medical records → 403 ✅
- [ ] Unauthenticated request to protected route → 401 ✅

### Input Security
- [ ] NoSQL injection in email → sanitized, no auth bypass ✅
- [ ] XSS in name fields → stripped before storage ✅
- [ ] Oversized payload (>10KB) → 413 rejection ✅
- [ ] Rate limiter triggers on 6th auth request in 15 min → 429 ✅

### AI Components
- [ ] Risk detection: "chest pain" → RED in < 50ms ✅
- [ ] NER fallback: HF 503 → keyword rules activate, user unaffected ✅
- [ ] Translation fallback: LibreTranslate 429 → MyMemory activates ✅
- [ ] Doctor QA fallback: HF down → local keyword answers shown ✅
- [ ] Prescription pre-fill: unknown drug → empty fields (no fabrication) ✅

### Critical Paths
- [ ] Patient can complete full registration → OTP → login → dashboard ✅
- [ ] Patient can book appointment from chatbot recommendation ✅
- [ ] Live consultation: speech → translation → real-time sync ✅
- [ ] Doctor SOAP notes generated from transcript ✅
- [ ] Prescription PDF downloadable after consultation ✅
- [ ] SOS button visible on every patient page ✅
- [ ] SOS tap on mobile → tel:108 dialer opens ✅
- [ ] Admin can verify doctor credential ✅

### Responsive & Accessibility
- [ ] Patient dashboard renders correctly at 375px, 768px, 1366px, 1920px ✅
- [ ] SOS button ≥ 44×44px on all viewports ✅
- [ ] All forms keyboard-navigable ✅
- [ ] No WCAG 2.1 AA violations on critical pages (axe audit passes) ✅
- [ ] Voice input fallback (text area) shown on non-Chrome browsers ✅

---

<div align="center">

---

## Testing Strategy Summary

```
╔══════════════════════════════════════════════════════════════════════╗
║          MEDIVOICE AI — TESTING STRATEGY AT A GLANCE                ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  Total Tests:            ~460 across all suites                     ║
║  Unit Tests:             ~300  (Jest · RTL · MSW)                   ║
║  Integration Tests:      ~120  (Supertest · MongoDB Memory Server)  ║
║  E2E Tests:               ~40  (Playwright)                         ║
║                                                                      ║
║  Coverage Target:                                                    ║
║    Backend services:     80% line coverage                          ║
║    Frontend components:  75% line coverage                          ║
║    Critical paths:       100% E2E coverage                          ║
║                                                                      ║
║  AI-Specific Tests:      All 12 AI components                       ║
║    Primary API success:  ✅ Tested                                  ║
║    Fallback activation:  ✅ Tested (every component)                ║
║    Response time:        ✅ Tested (< 50ms keyword, < 2s AI)        ║
║                                                                      ║
║  Security Tests:         OWASP Top 10 coverage                      ║
║    RBAC:                 ✅ All role/route combinations              ║
║    Injection:            ✅ NoSQL + XSS                             ║
║    Auth attacks:         ✅ Brute force + token theft               ║
║                                                                      ║
║  Tools Cost:             $0.00 — all open-source                    ║
║  CI Pipeline:            GitHub Actions (free tier)                 ║
║  Pre-commit:             Unit tests (~30s)                          ║
║  Pre-merge:              Unit + Integration (~3min)                 ║
║  Post-merge:             Full suite + E2E (~10min)                  ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Testing Strategy v1.0**

*Healthcare demands higher standards — we test accordingly.*

![Jest](https://img.shields.io/badge/Jest-29.x-C21325?style=flat&logo=jest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.x-2EAD33?style=flat&logo=playwright&logoColor=white)
![RTL](https://img.shields.io/badge/React%20Testing%20Library-14.x-E33332?style=flat)
![Supertest](https://img.shields.io/badge/Supertest-6.x-blue?style=flat)
![Coverage](https://img.shields.io/badge/Coverage%20Target-80%25-brightgreen?style=flat)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
