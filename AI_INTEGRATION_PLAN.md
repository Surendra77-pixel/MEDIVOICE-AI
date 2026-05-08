<div align="center">

# 🤖 MEDIVOICE AI — AI Integration Plan
### Complete Technical Blueprint for Every AI Component

![Document](https://img.shields.io/badge/Document-AI%20Integration%20Plan-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-100%25%20Free-brightgreen?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Pre--Development-orange?style=for-the-badge)

> **This document is the authoritative technical reference for every AI component in MediVoice AI.**
> It defines what each AI does, which model/API powers it, how it connects to the frontend and backend,
> what the data flow looks like, and how to implement it — all at zero cost.

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication  
**Research Basis:** ICSADL-2025 — *Enhancing Healthcare Communication via Automated STT of Doctor-Patient Dialogues*  
**Constraint:** Every AI model, API, and service used must be **100% free**

</div>

---

## 📋 Table of Contents

1. [AI Architecture Overview](#1-ai-architecture-overview)
2. [AI Component Registry](#2-ai-component-registry)
3. [AI-01 · Automated Speech Recognition (ASR)](#3-ai-01--automated-speech-recognition-asr)
4. [AI-02 · Real-Time Multilingual Translation](#4-ai-02--real-time-multilingual-translation)
5. [AI-03 · Text-to-Speech (TTS)](#5-ai-03--text-to-speech-tts)
6. [AI-04 · Medical NLP & Named Entity Recognition](#6-ai-04--medical-nlp--named-entity-recognition)
7. [AI-05 · Patient AI Chatbot Assistant](#7-ai-05--patient-ai-chatbot-assistant)
8. [AI-06 · AI Risk Alert & Symptom Severity Detection](#8-ai-06--ai-risk-alert--symptom-severity-detection)
9. [AI-07 · AI Clinical Note Generator (SOAP)](#9-ai-07--ai-clinical-note-generator-soap)
10. [AI-08 · Doctor AI Assistant (Clinical QA)](#10-ai-08--doctor-ai-assistant-clinical-qa)
11. [AI-09 · AI Prescription Pre-Fill](#11-ai-09--ai-prescription-pre-fill)
12. [AI-10 · AI Medication Reminder Engine](#12-ai-10--ai-medication-reminder-engine)
13. [AI-11 · Patient Risk Level Classifier](#13-ai-11--patient-risk-level-classifier)
14. [AI-12 · Doctor Analytics Intelligence](#14-ai-12--doctor-analytics-intelligence)
15. [Deep Learning Architecture Reference](#15-deep-learning-architecture-reference)
16. [AI Data Flow — End-to-End Consultation](#16-ai-data-flow--end-to-end-consultation)
17. [Free AI Services — Limits & Fallbacks](#17-free-ai-services--limits--fallbacks)
18. [AI Integration Testing Checklist](#18-ai-integration-testing-checklist)
19. [AI Ethics & Disclaimers](#19-ai-ethics--disclaimers)
20. [Environment Variables for AI Services](#20-environment-variables-for-ai-services)

---

## 1. AI Architecture Overview

MediVoice AI's AI layer is a modular pipeline of **12 distinct AI components**, each serving a specific clinical or operational purpose. All components are orchestrated through a shared **AI Service Layer** in the Node.js backend, keeping the React frontend clean and free of direct AI coupling.

### System-Level AI Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MEDIVOICE AI — AI LAYER                            │
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │   PATIENT   │    │   DOCTOR    │    │    ADMIN    │                   │
│   │   PORTAL    │    │   PORTAL    │    │   PORTAL    │                   │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                   │
│          │                  │                  │                           │
│          └──────────────────┼──────────────────┘                           │
│                             │                                               │
│                    ┌────────▼────────┐                                     │
│                    │  React Frontend  │                                     │
│                    │  (AI Hooks &    │                                     │
│                    │   Components)   │                                     │
│                    └────────┬────────┘                                     │
│                             │  REST API + WebSocket                        │
│                    ┌────────▼────────┐                                     │
│                    │  Node.js + Express │                                  │
│                    │  AI SERVICE LAYER  │                                  │
│                    └────────┬────────┘                                     │
│                             │                                               │
│         ┌───────────────────┼──────────────────────────┐                  │
│         │                   │                          │                   │
│  ┌──────▼──────┐   ┌────────▼────────┐   ┌────────────▼──────┐           │
│  │ Web Speech  │   │  Hugging Face   │   │  LibreTranslate   │           │
│  │    API      │   │ Inference API   │   │       API         │           │
│  │  (Browser)  │   │  (Free Tier)    │   │  (Free / FOSS)    │           │
│  │             │   │                 │   │                   │           │
│  │ • ASR/STT   │   │ • Medical NER   │   │ • hi ↔ ta         │           │
│  │ • TTS       │   │ • Symptom NLP   │   │ • hi ↔ te         │           │
│  │ • 6 langs   │   │ • Clinical QA   │   │ • hi ↔ ml         │           │
│  │             │   │ • Risk Scoring  │   │ • hi ↔ kn         │           │
│  │             │   │ • SOAP Notes    │   │ • hi ↔ bn         │           │
│  └─────────────┘   └─────────────────┘   └───────────────────┘           │
│                                                                             │
│                    ┌────────────────────┐                                  │
│                    │   MongoDB Atlas    │                                  │
│                    │  AI Results Cache  │                                  │
│                    │  + Session Store   │                                  │
│                    └────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Three AI Service Providers (All Free)

| Provider | What It Powers | Free Tier Limit | Fallback |
|---|---|---|---|
| **Web Speech API** | ASR (speech → text), TTS (text → speech) | Unlimited (browser-native) | Text input mode |
| **Hugging Face Inference API** | Medical NER, symptom analysis, clinical QA, risk scoring | ~30,000 requests/month free | Cached responses + keyword matching |
| **LibreTranslate** | Real-time multilingual translation (6 Indian languages) | Free public API (rate-limited) | Self-hosted instance |

---

## 2. AI Component Registry

Quick reference for all 12 AI components in MediVoice AI:

| ID | Component | Portal | Free Service | Priority |
|---|---|---|---|---|
| `AI-01` | Automated Speech Recognition (ASR) | Patient + Doctor | Web Speech API | 🔴 Critical |
| `AI-02` | Real-Time Multilingual Translation | Patient + Doctor | LibreTranslate | 🔴 Critical |
| `AI-03` | Text-to-Speech (TTS) | Patient + Doctor | Web Speech Synthesis API | 🟠 High |
| `AI-04` | Medical NLP & Named Entity Recognition | Backend (shared) | Hugging Face — `d4data/biomedical-ner-all` | 🔴 Critical |
| `AI-05` | Patient AI Chatbot Assistant | Patient | Hugging Face NER + Rule engine | 🔴 Critical |
| `AI-06` | AI Risk Alert & Symptom Severity Detection | Patient + Doctor | Hugging Face + Keyword rules | 🔴 Critical |
| `AI-07` | AI Clinical Note Generator (SOAP) | Doctor | Hugging Face NER + Template engine | 🔴 Critical |
| `AI-08` | Doctor AI Assistant (Clinical QA) | Doctor | Hugging Face — `deepset/roberta-base-squad2` | 🟠 High |
| `AI-09` | AI Prescription Pre-Fill | Doctor | NER output pipeline | 🟠 High |
| `AI-10` | AI Medication Reminder Engine | Patient | Rule engine on prescription data | 🟠 High |
| `AI-11` | Patient Risk Level Classifier | Doctor | Hugging Face + Scoring rules | 🔴 Critical |
| `AI-12` | Doctor Analytics Intelligence | Doctor | MongoDB aggregation + trend rules | 🟡 Medium |

---

## 3. AI-01 · Automated Speech Recognition (ASR)

### What It Does
Converts live spoken audio from both the **patient** and the **doctor** into text in real-time during consultations. This is the foundational input layer for the entire live transcription system — the core innovation described in the ICSADL-2025 research paper.

### Free Service Used
**Web Speech API** — browser-native, no API key required, no cost, no server calls.

```
Specification:
  API:           window.SpeechRecognition (Chrome) / window.webkitSpeechRecognition
  Cost:          FREE — runs entirely in browser
  Latency:       < 300ms (real-time streaming)
  Offline:       No — requires internet for Google's speech processing
  Best browser:  Chrome (full support), Edge (partial), Firefox (not supported natively)
  Fallback:      Text input field for non-Chrome browsers
```

### Supported Languages for ASR

| Language | BCP-47 Code | Web Speech API Support |
|---|---|---|
| Hindi | `hi-IN` | ✅ Full |
| Tamil | `ta-IN` | ✅ Full |
| Telugu | `te-IN` | ✅ Full |
| Malayalam | `ml-IN` | ✅ Full |
| Kannada | `kn-IN` | ✅ Full |
| Bengali | `bn-IN` | ✅ Full |

### Implementation

#### Custom React Hook — `useSpeechRecognition.js`

```javascript
// client/src/hooks/useSpeechRecognition.js

import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = ({ language = 'hi-IN', continuous = true, onResult, onError }) => {
  const [isListening, setIsListening]   = useState(false);
  const [transcript, setTranscript]     = useState('');
  const [interimText, setInterimText]   = useState('');
  const recognitionRef                  = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported. Falling back to text input.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang              = language;
    recognition.continuous        = continuous;
    recognition.interimResults    = true;   // Stream partial results
    recognition.maxAlternatives   = 1;

    recognition.onresult = (event) => {
      let interim  = '';
      let final    = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript(prev => prev + final);
        onResult && onResult(final.trim(), 'final');
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.error('ASR Error:', event.error);
      setIsListening(false);
      onError && onError(event.error);
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening (continuous mode)
      if (isListening && continuous) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  }, [language, continuous]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimText('');
  }, []);

  return {
    isListening,
    transcript,
    interimText,       // Streaming partial text (shown in italics in UI)
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
};

export default useSpeechRecognition;
```

#### Usage in Live Transcript Component

```javascript
// client/src/pages/patient/LiveTranscript.jsx (simplified)

import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import { sendToTranslation } from '../../services/translateService';

const LiveTranscript = ({ patientLang = 'hi-IN', doctorLang = 'ta-IN' }) => {
  const { transcript, interimText, isListening, startListening, stopListening } =
    useSpeechRecognition({
      language: patientLang,
      continuous: true,
      onResult: async (finalText) => {
        // Send final text to translation pipeline (AI-02)
        const translated = await sendToTranslation(finalText, patientLang, doctorLang);
        // Broadcast via WebSocket to doctor's screen
        socket.emit('transcript:patient', { original: finalText, translated });
      },
    });

  return (
    <div className="transcript-panel">
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '⏸ Pause' : '🎤 Start Speaking'}
      </button>

      {/* Final transcript */}
      <p className="transcript-final">{transcript}</p>

      {/* Interim streaming text */}
      {interimText && (
        <p className="transcript-interim italic opacity-60">{interimText}...</p>
      )}
    </div>
  );
};
```

### ASR Data Flow

```
PATIENT/DOCTOR SPEAKS
        │
        ▼
[ Browser Microphone ]
  getUserMedia() — browser permission
        │
        ▼
[ Web Speech API — SpeechRecognition ]
  Streams audio to Google's servers
  Returns interim + final text results
        │
        ▼
[ onResult callback ]
  • interim text → shown in italics (streaming UI)
  • final text   → sent to Translation (AI-02)
                 → sent to NER pipeline (AI-04)
                 → emitted via WebSocket to other party
        │
        ▼
[ MongoDB — Consultation.transcript ]
  Final assembled transcript saved on "Save" click
```

### Browser Compatibility & Fallback

```javascript
// Fallback component when Web Speech API not available
const ASRFallback = ({ onTextSubmit }) => (
  <div className="asr-fallback">
    <p className="text-yellow-600">
      ⚠️ Voice input requires Chrome browser.
      Please type your message below.
    </p>
    <textarea
      placeholder="Type your symptoms or questions here..."
      onChange={(e) => onTextSubmit(e.target.value)}
    />
  </div>
);
```

---

## 4. AI-02 · Real-Time Multilingual Translation

### What It Does
Translates live consultation speech in real-time between the patient's language and the doctor's language. When a patient speaks Hindi, the doctor sees Tamil (and vice versa). This solves the language barrier documented as a core problem in the research paper.

### Free Service Used
**LibreTranslate** — free, open-source machine translation API.

```
Options:
  Option A: Public API    → https://libretranslate.com (free, rate-limited ~20 req/min)
  Option B: Self-hosted   → Docker image, unlimited, zero cost on free hosting
  Option C: Fallback      → MyMemory API (free, 1000 words/day per IP)

Recommended for MVP: Option A (public API) with Option C as fallback
```

### Language Translation Matrix

All 6 supported languages can translate to and from each other:

```
         Tamil   Telugu  Malayalam  Kannada  Bengali  Hindi
Tamil      —       ✅       ✅         ✅       ✅       ✅
Telugu     ✅      —        ✅         ✅       ✅       ✅
Malayalam  ✅      ✅       —          ✅       ✅       ✅
Kannada    ✅      ✅       ✅         —        ✅       ✅
Bengali    ✅      ✅       ✅         ✅       —        ✅
Hindi      ✅      ✅       ✅         ✅       ✅       —

Strategy: All non-Hindi languages route through Hindi as pivot language
Example:  Tamil → Hindi (step 1) → Telugu (step 2)
Direct:   Any ↔ Hindi (single step, highest accuracy)
```

### Implementation

#### Translation Service — `translateService.js`

```javascript
// server/services/translateService.js

const axios = require('axios');

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
const LIBRETRANSLATE_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

// BCP-47 to LibreTranslate language code mapping
const LANG_MAP = {
  'hi-IN': 'hi',
  'ta-IN': 'ta',
  'te-IN': 'te',
  'ml-IN': 'ml',
  'kn-IN': 'kn',
  'bn-IN': 'bn',
  'en-IN': 'en',
};

/**
 * Translate text from source language to target language
 * @param {string} text        - Text to translate
 * @param {string} sourceLang  - BCP-47 code (e.g., 'hi-IN')
 * @param {string} targetLang  - BCP-47 code (e.g., 'ta-IN')
 * @returns {Promise<string>}  - Translated text
 */
const translateText = async (text, sourceLang, targetLang) => {
  if (!text || !text.trim()) return '';
  if (sourceLang === targetLang) return text;

  const source = LANG_MAP[sourceLang] || 'hi';
  const target = LANG_MAP[targetLang] || 'en';

  try {
    // Try LibreTranslate first
    const response = await axios.post(
      `${LIBRETRANSLATE_URL}/translate`,
      {
        q:      text,
        source: source,
        target: target,
        format: 'text',
        ...(LIBRETRANSLATE_KEY && { api_key: LIBRETRANSLATE_KEY }),
      },
      { timeout: 3000 }  // 3 second timeout for real-time feel
    );

    return response.data.translatedText;

  } catch (primaryError) {
    console.warn('LibreTranslate failed, trying MyMemory fallback:', primaryError.message);

    // Fallback: MyMemory API (free, no key required for basic use)
    try {
      const fallback = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q:        text,
          langpair: `${source}|${target}`,
        },
        timeout: 3000,
      });

      return fallback.data.responseData.translatedText;

    } catch (fallbackError) {
      console.error('Both translation services failed:', fallbackError.message);
      // Return original text with indicator — better than crashing
      return `[Translation unavailable] ${text}`;
    }
  }
};

module.exports = { translateText, LANG_MAP };
```

#### WebSocket Translation Pipeline

```javascript
// server/websocket/transcriptSocket.js

const { translateText } = require('../services/translateService');

const setupTranscriptSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Consultation socket connected: ${socket.id}`);

    // Patient speaks → translate for doctor
    socket.on('transcript:patient', async ({ consultationId, text, sourceLang, targetLang }) => {
      const translated = await translateText(text, sourceLang, targetLang);

      // Emit translated text to the doctor in the same consultation room
      socket.to(`consultation:${consultationId}`).emit('transcript:from-patient', {
        original:   text,
        translated: translated,
        speaker:    'Patient',
        timestamp:  new Date().toISOString(),
      });
    });

    // Doctor speaks → translate for patient
    socket.on('transcript:doctor', async ({ consultationId, text, sourceLang, targetLang }) => {
      const translated = await translateText(text, sourceLang, targetLang);

      socket.to(`consultation:${consultationId}`).emit('transcript:from-doctor', {
        original:   text,
        translated: translated,
        speaker:    'Doctor',
        timestamp:  new Date().toISOString(),
      });
    });

    // Join consultation room
    socket.on('join:consultation', ({ consultationId }) => {
      socket.join(`consultation:${consultationId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupTranscriptSocket };
```

### Translation Data Flow

```
PATIENT speaks Hindi
        │
        ▼
[ ASR — Web Speech API ]
  Raw Hindi text: "मुझे सीने में दर्द है"
        │
        ▼
[ WebSocket: transcript:patient event ]
  Payload: { text, sourceLang: 'hi-IN', targetLang: 'ta-IN' }
        │
        ▼
[ translateText() — LibreTranslate ]
  Source: 'hi' | Target: 'ta'
  Result: "என்னை மார்பில் வலி இருக்கிறது"
        │
        ▼
[ WebSocket: transcript:from-patient event ]
  Doctor's screen receives translated Tamil text
        │
        ▼
[ Doctor sees on their panel ]
  [Patient]: என்னை மார்பில் வலி இருக்கிறது
  (original Hindi shown in small text beneath)
        │
        ▼
[ Simultaneously fed into AI-04 NER pipeline ]
  Detects: entity=chest pain, severity=unspecified
  Triggers: AI-06 Risk Alert check
```

---

## 5. AI-03 · Text-to-Speech (TTS)

### What It Does
Converts translated text back into spoken audio so users can **hear** the translated consultation instead of (or in addition to) reading it. Especially useful for elderly patients, low-literacy users, and accessibility.

### Free Service Used
**Web Speech Synthesis API** — browser-native, zero cost.

```
API:     window.speechSynthesis + SpeechSynthesisUtterance
Cost:    FREE — runs in browser
Voices:  Depends on OS — Chrome on Android/Windows has the most voices
```

### Implementation

#### TTS Hook — `useTextToSpeech.js`

```javascript
// client/src/hooks/useTextToSpeech.js

import { useCallback, useRef } from 'react';

const useTextToSpeech = () => {
  const utteranceRef = useRef(null);

  /**
   * Speak text in specified language
   * @param {string} text     - Text to speak
   * @param {string} lang     - BCP-47 language code (e.g., 'ta-IN')
   * @param {number} rate     - Speed (0.5–2.0, default 0.9 for medical clarity)
   */
  const speak = useCallback((text, lang = 'hi-IN', rate = 0.9) => {
    if (!window.speechSynthesis || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance       = new SpeechSynthesisUtterance(text);
    utterance.lang        = lang;
    utterance.rate        = rate;
    utterance.pitch       = 1.0;
    utterance.volume      = 1.0;

    // Try to find a matching voice for the language
    const voices = window.speechSynthesis.getVoices();
    const match  = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (match) utterance.voice = match;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  return { speak, stop, isSupported };
};

export default useTextToSpeech;
```

#### Usage Example

```javascript
// Auto-speak incoming translated messages
const { speak } = useTextToSpeech();

socket.on('transcript:from-doctor', ({ translated }) => {
  // Patient hears doctor's Tamil words in Hindi
  speak(translated, 'hi-IN');
});
```

---

## 6. AI-04 · Medical NLP & Named Entity Recognition

### What It Does
The **backbone AI pipeline** shared by the chatbot, risk alert, clinical note generator, and prescription pre-fill. It processes all text (from transcripts and chatbot inputs) to extract structured medical entities: symptoms, body parts, medications, diagnoses, dosages, and severity.

### Free Service Used
**Hugging Face Inference API** — `d4data/biomedical-ner-all` model (free tier).

```
Model:       d4data/biomedical-ner-all
Task:        Token classification (Named Entity Recognition)
Entities:    Disease, Chemical (drugs), Body_Part, Sign_or_Symptom,
             Medical_Procedure, Diagnostic_Procedure
API:         https://api-inference.huggingface.co/models/d4data/biomedical-ner-all
Cost:        FREE (Hugging Face free inference tier)
Rate Limit:  ~30,000 req/month free
Language:    English (translate Indian language input to English first)
```

### Implementation

#### NER Service — `nerService.js`

```javascript
// server/services/nerService.js

const axios = require('axios');

const HF_API_URL = 'https://api-inference.huggingface.co/models/d4data/biomedical-ner-all';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

/**
 * Extract medical entities from clinical text
 * @param {string} text - English clinical text
 * @returns {Promise<object>} - Categorized medical entities
 */
const extractMedicalEntities = async (text) => {
  if (!text || text.trim().length < 3) {
    return { symptoms: [], medications: [], bodyParts: [], diagnoses: [], procedures: [] };
  }

  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );

    const rawEntities = response.data;
    return categorizeEntities(rawEntities);

  } catch (error) {
    // Model loading (cold start) — Hugging Face free tier warms up in ~20 seconds
    if (error.response?.status === 503) {
      console.warn('Hugging Face model warming up. Using keyword fallback.');
      return keywordFallbackNER(text);
    }
    console.error('NER service error:', error.message);
    return keywordFallbackNER(text);
  }
};

/**
 * Organize raw NER tokens into clean category buckets
 */
const categorizeEntities = (rawEntities) => {
  const result = {
    symptoms:    [],
    medications: [],
    bodyParts:   [],
    diagnoses:   [],
    procedures:  [],
    rawEntities: rawEntities,
  };

  let currentEntity = '';
  let currentType   = '';

  rawEntities.forEach((token) => {
    const entityType = token.entity_group || token.entity || '';
    const word       = token.word?.replace(/^##/, '') || '';

    // Handle B- (beginning) and I- (inside) token prefixes
    if (entityType.startsWith('B-') || (!entityType.startsWith('I-') && entityType !== currentType)) {
      if (currentEntity && currentType) {
        pushEntity(result, currentType, currentEntity.trim());
      }
      currentEntity = word;
      currentType   = entityType.replace('B-', '').replace('I-', '');
    } else if (entityType.startsWith('I-')) {
      currentEntity += ' ' + word;
    }
  });

  // Push last entity
  if (currentEntity && currentType) {
    pushEntity(result, currentType, currentEntity.trim());
  }

  return result;
};

const pushEntity = (result, type, value) => {
  const normalized = value.toLowerCase();
  switch (type) {
    case 'Sign_or_Symptom':
    case 'Disease_disorder':
      result.symptoms.push(value); break;
    case 'Chemical':
    case 'Medication':
      result.medications.push(value); break;
    case 'Body_Part':
    case 'Anatomical_structure':
      result.bodyParts.push(value); break;
    case 'Diagnostic_Procedure':
    case 'Therapeutic_procedure':
      result.procedures.push(value); break;
    default:
      result.diagnoses.push(value);
  }
};

/**
 * Keyword-based fallback when Hugging Face API is unavailable
 * Covers the most critical symptom patterns for risk detection
 */
const keywordFallbackNER = (text) => {
  const lower = text.toLowerCase();

  const HIGH_RISK_SYMPTOMS = [
    'chest pain', 'heart attack', 'stroke', 'can\'t breathe',
    'difficulty breathing', 'severe headache', 'unconscious', 'seizure',
    'heavy bleeding', 'coughing blood', 'suicidal', 'self harm',
    'can\'t move', 'sudden vision loss', 'jaw pain', 'arm pain',
  ];

  const SYMPTOM_KEYWORDS = [
    'pain', 'fever', 'cough', 'nausea', 'vomiting', 'dizziness',
    'fatigue', 'headache', 'weakness', 'swelling', 'rash', 'bleeding',
    'shortness', 'breathe', 'palpitation', 'numbness', 'tingling',
  ];

  const MEDICATION_KEYWORDS = [
    'metformin', 'aspirin', 'paracetamol', 'ibuprofen', 'amoxicillin',
    'atorvastatin', 'losartan', 'omeprazole', 'cetirizine', 'azithromycin',
  ];

  return {
    symptoms:    SYMPTOM_KEYWORDS.filter(k => lower.includes(k)),
    medications: MEDICATION_KEYWORDS.filter(k => lower.includes(k)),
    bodyParts:   [],
    diagnoses:   [],
    procedures:  [],
    highRisk:    HIGH_RISK_SYMPTOMS.filter(k => lower.includes(k)),
    isKeywordFallback: true,
  };
};

module.exports = { extractMedicalEntities, keywordFallbackNER };
```

### NER Processing Pipeline

```
Input text (English — translated from any Indian language)
        │
        ▼
[ Hugging Face: d4data/biomedical-ner-all ]
  Token-level NER on each word
        │
        ▼
[ categorizeEntities() ]
  Assembles B-/I- tokens into full entities
        │
  ┌─────┼──────────────┬────────────────┬───────────────┐
  ▼     ▼              ▼                ▼               ▼
Symptoms  Medications  Body Parts  Diagnoses  Procedures
  │
  ▼
[ Downstream AI consumers ]
  AI-05: Chatbot response generation
  AI-06: Risk level scoring
  AI-07: SOAP note population
  AI-09: Prescription pre-fill
  AI-11: Patient risk classification
```

---

## 7. AI-05 · Patient AI Chatbot Assistant

### What It Does
The patient-facing conversational AI that helps patients understand their health issues, guides them to the right doctor specialty, provides health recommendations, and can book appointments — all through natural language conversation.

### Free Services Used
- **Hugging Face NER** (`AI-04`) for symptom extraction
- **Rule engine** (custom Node.js) for specialty mapping and response generation
- **Web Speech API** (`AI-01`) for voice input

### Chatbot Architecture (NLU Dialogue System)

Based directly on the **NLU Module** described in the ICSADL-2025 research paper (Section III, Fig. 2):

```
Patient Message (text or voice)
        │
        ▼
┌─────────────────────────────────────┐
│     INTENT CLASSIFICATION MODULE    │
│  Categorizes patient intent into:   │
│  • SYMPTOM_QUERY                    │
│  • APPOINTMENT_REQUEST              │
│  • MEDICATION_QUERY                 │
│  • EMERGENCY                        │
│  • GENERAL_HEALTH                   │
│  • GREETING / SMALL_TALK            │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
  SYMPTOM_    APPOINTMENT   EMERGENCY
  QUERY       _REQUEST
        │          │          │
        ▼          ▼          ▼
  AI-04 NER   Doctor DB   AI-06 Risk
  extraction  lookup      Alert trigger
        │          │
        ▼          ▼
┌─────────────────────────────────────┐
│     DIALOGUE MANAGEMENT MODULE      │
│  • Tracks conversation history      │
│  • Maintains context between turns  │
│  • Determines response strategy     │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  NATURAL LANGUAGE GENERATION (NLG)  │
│  Builds human-readable response:    │
│  • Symptom summary + suggestion     │
│  • Doctor specialty recommendation  │
│  • Health guidance                  │
│  • Appointment booking CTA          │
└──────────────────┬──────────────────┘
                   │
                   ▼
          Patient sees response
       (text + optional voice TTS)
```

### Implementation

#### Chatbot Controller — `chatbotController.js`

```javascript
// server/controllers/chatbotController.js

const { extractMedicalEntities } = require('../services/nerService');
const { translateText }           = require('../services/translateService');
const Doctor                      = require('../models/Doctor');

// ─── Specialty Mapping Rules ──────────────────────────────────────────────────
const SYMPTOM_TO_SPECIALTY = {
  // Cardiac
  'chest pain':        'Cardiologist',
  'palpitation':       'Cardiologist',
  'irregular heartbeat': 'Cardiologist',
  'shortness of breath': ['Cardiologist', 'Pulmonologist'],
  // Neurological
  'headache':          'Neurologist',
  'migraine':          'Neurologist',
  'seizure':           'Neurologist',
  'dizziness':         ['Neurologist', 'ENT Specialist'],
  // Gastrointestinal
  'stomach pain':      'Gastroenterologist',
  'nausea':            'Gastroenterologist',
  'vomiting':          'Gastroenterologist',
  'diarrhea':          'Gastroenterologist',
  // Respiratory
  'cough':             'Pulmonologist',
  'breathing':         'Pulmonologist',
  // Dermatology
  'rash':              'Dermatologist',
  'skin':              'Dermatologist',
  // Musculoskeletal
  'joint pain':        'Orthopedist',
  'back pain':         'Orthopedist',
  'bone':              'Orthopedist',
  // General
  'fever':             'General Physician',
  'fatigue':           'General Physician',
  'weakness':          'General Physician',
};

// ─── High Risk Patterns ───────────────────────────────────────────────────────
const HIGH_RISK_PATTERNS = [
  'chest pain', 'heart attack', 'stroke', 'cannot breathe',
  'severe headache', 'unconscious', 'seizure', 'heavy bleeding',
  'suicidal', 'self harm', 'overdose', 'jaw pain with arm pain',
];

// ─── Intent Classification ────────────────────────────────────────────────────
const classifyIntent = (message) => {
  const lower = message.toLowerCase();

  if (HIGH_RISK_PATTERNS.some(p => lower.includes(p)))
    return 'EMERGENCY';

  if (['book', 'appointment', 'schedule', 'available', 'when can i see'].some(w => lower.includes(w)))
    return 'APPOINTMENT_REQUEST';

  if (['medicine', 'medication', 'tablet', 'dosage', 'drug', 'take'].some(w => lower.includes(w)))
    return 'MEDICATION_QUERY';

  if (['pain', 'fever', 'cough', 'nausea', 'ache', 'feeling', 'symptom', 'suffer'].some(w => lower.includes(w)))
    return 'SYMPTOM_QUERY';

  return 'GENERAL_HEALTH';
};

// ─── Main Chatbot Handler ─────────────────────────────────────────────────────
const processPatientMessage = async (req, res) => {
  const { message, conversationHistory = [], patientCity = 'Hyderabad', language = 'en' } = req.body;

  try {
    // Step 1: Translate to English if needed (NER works in English)
    const englishText = language !== 'en'
      ? await translateText(message, `${language}-IN`, 'en-IN')
      : message;

    // Step 2: Classify intent
    const intent = classifyIntent(englishText);

    // Step 3: Handle emergency immediately
    if (intent === 'EMERGENCY') {
      return res.json({
        type:         'EMERGENCY',
        message:      generateEmergencyResponse(),
        showSOSButton: true,
        riskLevel:    'RED',
      });
    }

    // Step 4: Extract medical entities
    const entities = await extractMedicalEntities(englishText);

    // Step 5: Determine specialty recommendation
    const specialties = getSpecialtyRecommendations(entities.symptoms);

    // Step 6: Fetch available doctors for recommended specialty in patient's city
    const availableDoctors = specialties.length
      ? await Doctor.find({
          specialty: { $in: specialties },
          city:      patientCity,
          isActive:  true,
        }).limit(3).select('name specialty rating availableSlots')
      : [];

    // Step 7: Generate natural language response
    const responseText = buildChatbotResponse({
      intent, entities, specialties, availableDoctors, originalMessage: message,
    });

    // Step 8: Translate response back to patient's language if needed
    const finalResponse = language !== 'en'
      ? await translateText(responseText, 'en-IN', `${language}-IN`)
      : responseText;

    return res.json({
      type:               intent,
      message:            finalResponse,
      entities,
      specialtyMatches:   specialties,
      suggestedDoctors:   availableDoctors,
      riskLevel:          entities.highRisk?.length ? 'YELLOW' : 'GREEN',
      showBookingButton:  availableDoctors.length > 0,
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'AI assistant is temporarily unavailable. Please try again.' });
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getSpecialtyRecommendations = (symptoms) => {
  const specialtySet = new Set();
  symptoms.forEach(symptom => {
    const lower = symptom.toLowerCase();
    Object.entries(SYMPTOM_TO_SPECIALTY).forEach(([keyword, specialty]) => {
      if (lower.includes(keyword)) {
        const specialties = Array.isArray(specialty) ? specialty : [specialty];
        specialties.forEach(s => specialtySet.add(s));
      }
    });
  });
  return [...specialtySet].slice(0, 2); // Max 2 specialty suggestions
};

const buildChatbotResponse = ({ intent, entities, specialties, availableDoctors }) => {
  const symptomList = entities.symptoms.slice(0, 3).join(', ') || 'the symptoms you described';

  let response = `Based on what you've shared, I noticed you're experiencing ${symptomList}. `;

  if (specialties.length) {
    response += `I'd recommend consulting a **${specialties[0]}**. `;
  }

  if (availableDoctors.length) {
    const top = availableDoctors[0];
    response += `${top.name} (${top.specialty}, ⭐ ${top.rating}) is available in your area. `;
    response += `Would you like me to book an appointment?`;
  } else {
    response += `Please use the search to find available doctors near you.`;
  }

  return response;
};

const generateEmergencyResponse = () =>
  `⚠️ **This sounds like a medical emergency.** Please call 108 immediately or go to your nearest Emergency Room. Do not wait for an appointment. Tap the SOS button below to call 108 now.`;

module.exports = { processPatientMessage };
```

### Chatbot API Route

```javascript
// POST /api/patient/chat
router.post('/chat', authMiddleware(['patient']), processPatientMessage);
```

### Conversation History (Context Window)

```javascript
// Maintain last 10 turns of conversation for context
// Stored in React state (not server — no cost)

const [conversationHistory, setConversationHistory] = useState([]);

const sendMessage = async (userMessage) => {
  const history = conversationHistory.slice(-10); // Last 10 turns

  const response = await axios.post('/api/patient/chat', {
    message: userMessage,
    conversationHistory: history,
    patientCity: user.city,
    language: user.preferredLanguage,
  });

  setConversationHistory(prev => [
    ...prev,
    { role: 'user',      content: userMessage },
    { role: 'assistant', content: response.data.message },
  ]);
};
```

---

## 8. AI-06 · AI Risk Alert & Symptom Severity Detection

### What It Does
Continuously monitors all patient text input (chatbot messages AND live consultation transcripts) for high-risk symptom patterns. When detected, triggers an immediate full-screen alert with the SOS button — a critical patient safety feature.

### Detection Strategy (Two-Layer)

```
Layer 1: KEYWORD RULES (instantaneous, zero API cost)
  → Scans for exact high-risk phrases
  → Response time: < 10ms
  → Used for: all input, all the time

Layer 2: HUGGING FACE NER (accurate, async)
  → Extracts semantic context from symptom description
  → Confirms or escalates keyword detection
  → Used for: borderline cases where keywords are ambiguous
```

### Implementation

#### Risk Detection Service — `riskService.js`

```javascript
// server/services/riskService.js

const { extractMedicalEntities } = require('./nerService');

// ─── HIGH RISK: Immediate ER needed ──────────────────────────────────────────
const CRITICAL_PATTERNS = [
  // Cardiac
  { pattern: /chest\s+pain/i,                      condition: 'Possible cardiac event' },
  { pattern: /heart\s+attack/i,                    condition: 'Cardiac emergency' },
  { pattern: /jaw\s+pain.*arm|arm.*pain.*jaw/i,    condition: 'Cardiac emergency (referred pain)' },
  { pattern: /can.?t\s+breathe|cannot\s+breathe/i, condition: 'Respiratory emergency' },
  // Neurological
  { pattern: /stroke|face\s+drooping|sudden\s+confusion/i, condition: 'Possible stroke' },
  { pattern: /worst\s+headache.*life|thunderclap\s+headache/i, condition: 'Possible subarachnoid hemorrhage' },
  { pattern: /seizure|convulsion/i,                condition: 'Seizure emergency' },
  { pattern: /sudden.*vision\s+loss/i,             condition: 'Neurological emergency' },
  // Trauma / Hemorrhage
  { pattern: /heavy\s+bleeding|uncontrolled\s+bleed/i, condition: 'Hemorrhage emergency' },
  { pattern: /coughing\s+blood|vomiting\s+blood/i, condition: 'Internal bleeding suspected' },
  { pattern: /unconscious|unresponsive|passed\s+out/i, condition: 'Loss of consciousness' },
  // Mental health
  { pattern: /suicid|self.?harm|want to die|end my life/i, condition: 'Mental health emergency' },
  { pattern: /overdose|took too many/i,            condition: 'Overdose emergency' },
];

// ─── MODERATE RISK: Urgent but not immediate ER ───────────────────────────────
const MODERATE_PATTERNS = [
  { pattern: /high\s+fever|fever.*39|fever.*40/i,  condition: 'High fever' },
  { pattern: /severe\s+pain/i,                     condition: 'Severe pain — needs prompt attention' },
  { pattern: /difficulty\s+breathing|shortness\s+of\s+breath/i, condition: 'Breathing difficulty' },
  { pattern: /severe.*headache/i,                  condition: 'Severe headache' },
  { pattern: /severe.*vomiting|vomiting.*blood/i,  condition: 'Severe GI symptoms' },
  { pattern: /chest\s+tightness/i,                 condition: 'Chest tightness — monitor' },
];

/**
 * Assess risk level from patient text input
 * @param {string} text - Patient's message or transcript segment
 * @returns {object}    - { level: 'RED'|'YELLOW'|'GREEN', condition, message }
 */
const assessRiskLevel = async (text) => {
  if (!text) return { level: 'GREEN', condition: null };

  // Layer 1: Instant keyword scan
  for (const { pattern, condition } of CRITICAL_PATTERNS) {
    if (pattern.test(text)) {
      return {
        level:     'RED',
        condition,
        message:   buildRiskMessage('RED', condition),
        callToAction: 'CALL_108',
      };
    }
  }

  for (const { pattern, condition } of MODERATE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        level:     'YELLOW',
        condition,
        message:   buildRiskMessage('YELLOW', condition),
        callToAction: 'URGENT_APPOINTMENT',
      };
    }
  }

  // Layer 2: NER-based check for ambiguous inputs (async, only if Layer 1 found nothing)
  try {
    const entities = await extractMedicalEntities(text);

    // Multiple severe symptoms together = elevated risk
    if (entities.symptoms.length >= 3) {
      return {
        level:     'YELLOW',
        condition: `Multiple symptoms: ${entities.symptoms.slice(0, 3).join(', ')}`,
        message:   buildRiskMessage('YELLOW', 'Multiple symptoms detected'),
        callToAction: 'BOOK_APPOINTMENT',
      };
    }
  } catch (err) {
    // NER failure — log but don't block (keyword scan already passed clean)
    console.warn('NER risk check failed — keyword scan passed clean:', err.message);
  }

  return { level: 'GREEN', condition: null, message: null };
};

const buildRiskMessage = (level, condition) => {
  if (level === 'RED') {
    return `⚠️ HIGH RISK DETECTED: ${condition}. This may be a medical emergency. Please call 108 immediately or go to the nearest Emergency Room. Do NOT wait.`;
  }
  if (level === 'YELLOW') {
    return `⚡ Urgent attention needed: ${condition}. Please book an urgent appointment or visit a clinic today.`;
  }
  return null;
};

module.exports = { assessRiskLevel, CRITICAL_PATTERNS, MODERATE_PATTERNS };
```

### Risk Alert — Frontend Component

```javascript
// client/src/components/patient/RiskAlertModal.jsx

const RiskAlertModal = ({ riskData, onClose }) => {
  if (!riskData || riskData.level === 'GREEN') return null;

  const isRed = riskData.level === 'RED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className={`rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-4
        ${isRed ? 'bg-red-50 border-red-600' : 'bg-yellow-50 border-yellow-500'}`}>

        <div className="text-center">
          <span className="text-6xl">{isRed ? '🚨' : '⚡'}</span>
          <h2 className={`text-2xl font-bold mt-4 ${isRed ? 'text-red-700' : 'text-yellow-700'}`}>
            {isRed ? 'Medical Emergency Detected' : 'Urgent Attention Needed'}
          </h2>
          <p className="mt-3 text-gray-700">{riskData.message}</p>
        </div>

        <div className="mt-6 space-y-3">
          {isRed && (
            <a
              href="tel:108"
              className="block w-full py-4 text-center text-xl font-bold
                         text-white bg-red-600 rounded-xl animate-pulse"
            >
              📞 CALL 108 NOW — AMBULANCE
            </a>
          )}
          <button
            onClick={() => window.open('/patient/hospitals?emergency=true')}
            className="block w-full py-3 text-center font-semibold
                       text-white bg-gray-800 rounded-xl"
          >
            🏥 Find Nearest Emergency Hospital
          </button>
          <button
            onClick={onClose}
            className="block w-full py-2 text-center text-gray-500 underline text-sm"
          >
            I understand — dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 9. AI-07 · AI Clinical Note Generator (SOAP)

### What It Does
After a consultation ends, the doctor clicks "Generate Notes". AI processes the full consultation transcript using NER to auto-populate a structured **SOAP clinical note**. The doctor reviews and edits before saving. This directly addresses the note-taking burden identified in the research paper.

### Free Service Used
- **Hugging Face NER** (`d4data/biomedical-ner-all`) — entity extraction
- **Custom SOAP template engine** — formats entities into SOAP structure

### Implementation

#### SOAP Note Generator Service — `soapService.js`

```javascript
// server/services/soapService.js

const { extractMedicalEntities } = require('./nerService');

/**
 * Generate a structured SOAP note from consultation transcript
 * @param {string} fullTranscript - The complete labeled consultation transcript
 * @param {object} patientData    - Patient name, age, gender
 * @returns {Promise<object>}     - Structured SOAP note object
 */
const generateSOAPNote = async (fullTranscript, patientData) => {
  // Separate patient and doctor speech
  const patientLines = extractSpeakerLines(fullTranscript, 'Patient');
  const doctorLines  = extractSpeakerLines(fullTranscript, 'Doctor');

  const patientText = patientLines.join(' ');
  const doctorText  = doctorLines.join(' ');

  // Run NER on both sides
  const [patientEntities, doctorEntities] = await Promise.all([
    extractMedicalEntities(patientText),
    extractMedicalEntities(doctorText),
  ]);

  // Build SOAP structure
  const soap = {
    // S — Subjective: What the PATIENT reported
    subjective: {
      chiefComplaint:          extractChiefComplaint(patientLines),
      reportedSymptoms:        patientEntities.symptoms,
      symptomDuration:         extractDuration(patientText),
      relevantHistory:         extractHistoryMentions(patientText),
      currentMedications:      patientEntities.medications,
    },

    // O — Objective: What the DOCTOR observed / examined
    objective: {
      doctorObservations:      extractObservations(doctorLines),
      examinationFindings:     doctorEntities.procedures,
      vitalsDiscussed:         extractVitals(doctorText),
    },

    // A — Assessment: Doctor's clinical judgment
    assessment: {
      probableDiagnosis:       extractDiagnosis(doctorText, doctorEntities),
      differentialDiagnoses:   doctorEntities.diagnoses,
      riskFactors:             [...patientEntities.symptoms, ...doctorEntities.symptoms],
    },

    // P — Plan: What was decided
    plan: {
      prescribedMedications:   [...patientEntities.medications, ...doctorEntities.medications],
      investigationsOrdered:   doctorEntities.procedures,
      followUpInstructions:    extractFollowUp(doctorText),
      lifestyleAdvice:         extractLifestyleAdvice(doctorText),
    },

    // Metadata
    generatedAt:   new Date().toISOString(),
    aiGenerated:   true,  // Always flag AI-generated notes for doctor review
    patient:       patientData,
  };

  return soap;
};

// ─── Text Extraction Helpers ──────────────────────────────────────────────────

const extractSpeakerLines = (transcript, speaker) =>
  transcript
    .split('\n')
    .filter(line => line.startsWith(`[${speaker}]`))
    .map(line => line.replace(`[${speaker}]`, '').trim());

const extractChiefComplaint = (patientLines) => {
  // First substantive patient statement usually describes chief complaint
  const firstMeaningfulLine = patientLines.find(l => l.length > 20);
  return firstMeaningfulLine || 'See transcript for chief complaint';
};

const extractDuration = (text) => {
  const durationPatterns = [
    /for\s+(\d+\s+(?:days?|weeks?|months?|years?))/gi,
    /since\s+((?:yesterday|last\s+\w+|\d+\s+\w+\s+ago))/gi,
    /(\d+\s+(?:days?|weeks?|months?)\s+ago)/gi,
  ];
  for (const pattern of durationPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return 'Duration not specified';
};

const extractFollowUp = (doctorText) => {
  const patterns = [
    /follow.?up\s+in\s+(.{5,30})/gi,
    /come\s+back\s+(.{5,30})/gi,
    /review\s+after\s+(.{5,30})/gi,
    /next\s+appointment\s+(.{5,30})/gi,
  ];
  for (const pattern of patterns) {
    const match = doctorText.match(pattern);
    if (match) return match[0];
  }
  return 'Follow-up as advised';
};

const extractDiagnosis = (doctorText, entities) => {
  // Look for diagnostic statements in doctor's speech
  const diagnosisPattern = /(?:diagnosed|diagnosis|you have|this is|presenting with)\s+(.{3,50})/gi;
  const match = doctorText.match(diagnosisPattern);
  if (match) return match[0];
  return entities.diagnoses[0] || 'See full transcript';
};

const extractObservations = (doctorLines) =>
  doctorLines
    .filter(l => /look|appear|exam|check|find|observe|listen|assess/i.test(l))
    .slice(0, 3);

const extractVitals = (text) => {
  const vitalsPattern = /(?:BP|blood pressure|pulse|temperature|SpO2|oxygen|weight|height)[:\s]+[\d\/\.]+/gi;
  return text.match(vitalsPattern) || [];
};

const extractHistoryMentions = (text) =>
  text.match(/(?:history of|had|suffered from|diagnosed with)\s+.{3,40}/gi) || [];

const extractLifestyleAdvice = (text) =>
  text.match(/(?:avoid|reduce|increase|exercise|diet|rest|sleep|drink|eat)\s+.{5,50}/gi) || [];

module.exports = { generateSOAPNote };
```

### SOAP Note API Route

```javascript
// POST /api/doctor/consultation/:id/generate-notes
router.post(
  '/consultation/:consultationId/generate-notes',
  authMiddleware(['doctor']),
  async (req, res) => {
    const consultation = await Consultation.findById(req.params.consultationId);
    const soapNote     = await generateSOAPNote(
      consultation.transcript,
      consultation.patientSnapshot
    );
    consultation.soapNote   = soapNote;
    consultation.noteStatus = 'ai_draft'; // Doctor must review
    await consultation.save();
    res.json({ soapNote, message: 'AI draft generated. Please review and confirm.' });
  }
);
```

---

## 10. AI-08 · Doctor AI Assistant (Clinical QA)

### What It Does
A dedicated AI chatbot for doctors that answers clinical questions in real-time: drug interactions, dosage guidelines, differential diagnoses, contraindications, and treatment protocols.

### Free Service Used
**Hugging Face Inference API** — `deepset/roberta-base-squad2` (extractive QA model, free).

```
Model:       deepset/roberta-base-squad2
Task:        Extractive Question Answering
API:         https://api-inference.huggingface.co/models/deepset/roberta-base-squad2
Cost:        FREE (Hugging Face free tier)
Approach:    Question + medical context → extracted answer
```

### Implementation

#### Doctor QA Service — `doctorQAService.js`

```javascript
// server/services/doctorQAService.js

const axios = require('axios');

const HF_QA_URL = 'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Medical knowledge context — key clinical reference text chunks
// In production, this would be loaded from a structured medical knowledge base
const MEDICAL_CONTEXTS = {
  drug_interactions: `
    Warfarin interacts with aspirin by increasing bleeding risk significantly.
    Metformin should be used cautiously with iodinated contrast media.
    SSRIs combined with MAOIs can cause serotonin syndrome, a life-threatening condition.
    Statins combined with fibrates increase risk of myopathy and rhabdomyolysis.
    ACE inhibitors combined with potassium-sparing diuretics can cause hyperkalemia.
    NSAIDs reduce effectiveness of antihypertensives and increase renal toxicity risk.
    Ciprofloxacin increases theophylline levels; dose reduction needed.
    Azithromycin can prolong QT interval; avoid with other QT-prolonging drugs.
  `,
  diabetes: `
    Type 2 Diabetes first-line treatment is Metformin 500mg twice daily with meals, titrated to 2000mg/day.
    For elderly patients with CKD Stage 3 (eGFR 30-60), reduce Metformin dose and monitor renal function.
    Metformin is contraindicated when eGFR < 30 mL/min (CKD Stage 4-5).
    HbA1c target for most adults is < 7%. For elderly with limited life expectancy, < 8% is acceptable.
    SGLT2 inhibitors (Dapagliflozin, Empagliflozin) have cardiovascular and renal protective benefits.
    GLP-1 agonists (Liraglutide) promote weight loss and have cardiovascular benefits.
  `,
  hypertension: `
    First-line antihypertensives: ACE inhibitors or ARBs for diabetics and CKD patients.
    Calcium channel blockers (Amlodipine) are preferred in elderly and isolated systolic hypertension.
    Target BP for most adults: < 130/80 mmHg. For elderly > 80 years: < 140/90 mmHg.
    Beta-blockers are preferred post-MI and in heart failure with reduced EF.
    Thiazide diuretics are effective add-on therapy but may worsen diabetes and gout.
  `,
  antibiotics: `
    Community-acquired pneumonia first-line: Amoxicillin 500mg TID for 5-7 days.
    For penicillin allergy, use Azithromycin 500mg on day 1, then 250mg days 2-5.
    UTI uncomplicated first-line: Nitrofurantoin 100mg BD for 5-7 days (avoid if eGFR < 45).
    Maximum safe dose of Paracetamol in adults: 4g/day (1g QID). Reduce to 2g/day in liver disease.
    Amoxicillin-clavulanate is used for dental infections, diabetic foot, and animal bites.
  `,
};

/**
 * Answer a doctor's clinical question using extractive QA
 * @param {string} question - Doctor's clinical question
 * @returns {Promise<string>} - AI answer with source context
 */
const answerClinicalQuestion = async (question) => {
  // Select most relevant context based on question keywords
  const context = selectRelevantContext(question);

  try {
    const response = await axios.post(
      HF_QA_URL,
      {
        inputs: {
          question: question,
          context:  context,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );

    const { answer, score } = response.data;

    // Low confidence score → flag for doctor review
    if (score < 0.3) {
      return {
        answer:     answer,
        confidence: 'LOW',
        disclaimer: '⚠️ Low confidence answer. Please verify with clinical guidelines.',
        source:     'AI Clinical Assistant (Beta)',
      };
    }

    return {
      answer:     answer,
      confidence: score > 0.7 ? 'HIGH' : 'MEDIUM',
      disclaimer: '📋 For reference only. Always apply clinical judgment.',
      source:     'AI Clinical Assistant',
    };

  } catch (error) {
    // Fallback: search keyword-based answers
    return {
      answer:     getFallbackAnswer(question),
      confidence: 'KEYWORD_MATCH',
      disclaimer: '⚠️ AI service unavailable. Showing keyword-matched response.',
      source:     'Fallback Knowledge Base',
    };
  }
};

const selectRelevantContext = (question) => {
  const lower = question.toLowerCase();
  if (/interact|combination|together|with/i.test(lower))      return MEDICAL_CONTEXTS.drug_interactions;
  if (/diabetes|metformin|insulin|glucose|hba1c/i.test(lower)) return MEDICAL_CONTEXTS.diabetes;
  if (/blood pressure|hypertension|bp|antihypertensive/i.test(lower)) return MEDICAL_CONTEXTS.hypertension;
  if (/antibiotic|infection|bacteria|amoxicillin|azithromycin/i.test(lower)) return MEDICAL_CONTEXTS.antibiotics;

  // Combine all contexts for general questions (truncated to avoid token limits)
  return Object.values(MEDICAL_CONTEXTS).join(' ').substring(0, 2000);
};

const getFallbackAnswer = (question) => {
  // Simple keyword lookup for most common doctor queries
  if (/paracetamol.*dose|dose.*paracetamol/i.test(question))
    return 'Maximum 4g/day in adults (1g QID). Reduce to 2g/day in liver disease or chronic alcohol use.';
  if (/metformin.*ckd|ckd.*metformin/i.test(question))
    return 'Reduce dose for eGFR 30-60. Contraindicated if eGFR < 30.';
  return 'Please consult clinical guidelines for this query. AI assistant is temporarily unavailable.';
};

module.exports = { answerClinicalQuestion };
```

---

## 11. AI-09 · AI Prescription Pre-Fill

### What It Does
After the AI Clinical Note Generator (`AI-07`) runs, it auto-populates the Prescription Builder (`D-05`) with medications mentioned in the consultation. The doctor reviews, edits, and confirms.

### Implementation

```javascript
// server/services/prescriptionPrefillService.js

const { extractMedicalEntities } = require('./nerService');

// Common drug dosage lookup (lightweight local reference)
const DRUG_DOSAGE_REFERENCE = {
  'metformin':       { defaultDose: '500mg',  frequency: 'Twice daily', instructions: 'Take with meals' },
  'aspirin':         { defaultDose: '75mg',   frequency: 'Once daily',  instructions: 'Take after meals' },
  'paracetamol':     { defaultDose: '500mg',  frequency: 'Thrice daily', instructions: 'Take after meals. Max 4g/day' },
  'amoxicillin':     { defaultDose: '500mg',  frequency: 'Thrice daily', instructions: 'Complete full course' },
  'omeprazole':      { defaultDose: '20mg',   frequency: 'Once daily',  instructions: 'Take 30 min before meals' },
  'atorvastatin':    { defaultDose: '10mg',   frequency: 'Once at night', instructions: 'Take at bedtime' },
  'amlodipine':      { defaultDose: '5mg',    frequency: 'Once daily',  instructions: 'Take at same time daily' },
  'cetirizine':      { defaultDose: '10mg',   frequency: 'Once daily',  instructions: 'Take at night' },
  'azithromycin':    { defaultDose: '500mg',  frequency: 'Once daily for 3 days', instructions: 'Take 1 hour before or 2 hours after food' },
};

/**
 * Pre-fill prescription from SOAP note and transcript
 * @param {object} soapNote  - Generated SOAP note
 * @param {string} transcript - Full consultation transcript
 * @returns {object}         - Pre-filled prescription rows
 */
const preFillPrescription = async (soapNote, transcript) => {
  const mentionedMeds = [
    ...soapNote.plan.prescribedMedications,
    ...soapNote.subjective.currentMedications,
  ];

  const prescriptionRows = mentionedMeds.map(medName => {
    const key     = medName.toLowerCase().trim();
    const ref     = DRUG_DOSAGE_REFERENCE[key];

    return {
      drugName:    medName,
      dose:        ref?.defaultDose    || '',  // Empty if unknown — doctor fills
      frequency:   ref?.frequency      || '',
      duration:    '',                          // Always left for doctor — clinical decision
      instructions: ref?.instructions  || '',
      aiPrefilled: true,                        // Flag so doctor knows this was AI-suggested
    };
  });

  return {
    diagnosis:         soapNote.assessment.probableDiagnosis,
    medications:       prescriptionRows,
    instructions:      soapNote.plan.lifestyleAdvice.join('. '),
    followUpDate:      soapNote.plan.followUpInstructions,
    prefillConfidence: calculatePrefillConfidence(prescriptionRows),
  };
};

const calculatePrefillConfidence = (rows) => {
  const filled = rows.filter(r => r.dose && r.frequency).length;
  const total  = rows.length || 1;
  return Math.round((filled / total) * 100);
};

module.exports = { preFillPrescription };
```

---

## 12. AI-10 · AI Medication Reminder Engine

### What It Does
After a prescription is saved, the AI parses the prescription data and automatically schedules browser push notification reminders at the appropriate times for each medication.

### Implementation

#### Reminder Service — `reminderService.js`

```javascript
// server/services/reminderService.js

/**
 * Parse prescription and generate reminder schedule
 * @param {Array}  medications - Array of prescription medication objects
 * @param {string} patientId   - Patient MongoDB ID
 * @returns {Array}            - Array of scheduled reminder objects
 */
const generateReminderSchedule = (medications, patientId) => {
  const reminders = [];

  medications.forEach(med => {
    const times = parseFrequencyToTimes(med.frequency);
    const days  = parseDurationToDays(med.duration);

    times.forEach(time => {
      reminders.push({
        patientId,
        drugName:        med.drugName,
        dose:            med.dose,
        instructions:    med.instructions,
        scheduledTime:   time,
        daysRemaining:   days,
        notificationBody: buildNotificationText(med),
        active:          true,
      });
    });
  });

  return reminders;
};

// ─── Frequency Parser ─────────────────────────────────────────────────────────
const parseFrequencyToTimes = (frequency) => {
  const lower = frequency.toLowerCase();
  if (/once\s+daily|od|1\/day/i.test(lower))          return ['08:00'];
  if (/twice\s+daily|bd|bid|2\/day/i.test(lower))     return ['08:00', '20:00'];
  if (/thrice\s+daily|tid|tds|3\/day/i.test(lower))   return ['08:00', '14:00', '20:00'];
  if (/four\s+times|qid|4\/day/i.test(lower))         return ['08:00', '12:00', '16:00', '20:00'];
  if (/at\s+night|hs|bedtime/i.test(lower))           return ['21:00'];
  if (/morning/i.test(lower))                          return ['08:00'];
  return ['08:00']; // Default: once daily if unrecognized
};

// ─── Duration Parser ──────────────────────────────────────────────────────────
const parseDurationToDays = (duration) => {
  if (!duration) return 7; // Default 7 days if unspecified
  const lower = duration.toLowerCase();
  const match = lower.match(/(\d+)\s*(day|week|month)/);
  if (!match) return 7;
  const [, num, unit] = match;
  if (unit.startsWith('day'))   return parseInt(num);
  if (unit.startsWith('week'))  return parseInt(num) * 7;
  if (unit.startsWith('month')) return parseInt(num) * 30;
  return 7;
};

const buildNotificationText = (med) => ({
  title: `💊 Medication Reminder — ${med.drugName}`,
  body:  `Time to take ${med.drugName} ${med.dose}. ${med.instructions || ''}`.trim(),
  icon:  '/icons/pill-icon.png',
});

module.exports = { generateReminderSchedule, parseFrequencyToTimes, parseDurationToDays };
```

#### Frontend Push Notification Setup

```javascript
// client/src/utils/pushNotifications.js

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleLocalReminder = (reminder, delayMs) => {
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(reminder.notificationBody.title, {
        body: reminder.notificationBody.body,
        icon: reminder.notificationBody.icon,
      });
    }
  }, delayMs);
};
```

---

## 13. AI-11 · Patient Risk Level Classifier

### What It Does
Classifies each patient in the doctor's queue as **RED (Critical)**, **YELLOW (Moderate)**, or **GREEN (Stable)** based on their chatbot conversation history and reported symptoms. Displayed as color tags in the doctor's Patient Queue Dashboard (`D-01`).

### Implementation

```javascript
// server/services/riskClassifierService.js

const { assessRiskLevel } = require('./riskService');

/**
 * Classify a patient's risk level for the doctor's queue
 * Runs when patient submits chat message or books appointment
 */
const classifyPatientRisk = async (patientChatHistory, appointmentNote) => {
  const fullText = [
    ...patientChatHistory.map(m => m.content),
    appointmentNote || '',
  ].join(' ');

  const riskAssessment = await assessRiskLevel(fullText);

  // Map to doctor-facing label
  const classificationMap = {
    RED:    { label: 'CRITICAL', color: '#DC2626', priority: 1, doctorAlert: true },
    YELLOW: { label: 'MODERATE', color: '#D97706', priority: 2, doctorAlert: false },
    GREEN:  { label: 'STABLE',   color: '#059669', priority: 3, doctorAlert: false },
  };

  const classification = classificationMap[riskAssessment.level];

  return {
    level:        riskAssessment.level,
    label:        classification.label,
    color:        classification.color,
    priority:     classification.priority,
    condition:    riskAssessment.condition,
    doctorAlert:  classification.doctorAlert,
    assessedAt:   new Date().toISOString(),
  };
};

module.exports = { classifyPatientRisk };
```

---

## 14. AI-12 · Doctor Analytics Intelligence

### What It Does
Generates the insights and trend data displayed in the Doctor Analytics Dashboard (`D-09`). Uses MongoDB aggregation pipelines (zero AI API cost) to produce actionable clinical practice metrics.

### Implementation

```javascript
// server/services/analyticsService.js

const Consultation  = require('../models/Consultation');
const Appointment   = require('../models/Appointment');

/**
 * Generate weekly and monthly analytics for a doctor
 */
const getDoctorAnalytics = async (doctorId) => {
  const now       = new Date();
  const weekAgo   = new Date(now - 7  * 24 * 60 * 60 * 1000);
  const monthAgo  = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    weeklyPatients,
    monthlyPatients,
    topDiagnoses,
    riskTrends,
    completionRate,
  ] = await Promise.all([

    // Weekly patient count by day
    Consultation.aggregate([
      { $match: { doctorId, createdAt: { $gte: weekAgo } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]),

    // Monthly patient count
    Consultation.countDocuments({ doctorId, createdAt: { $gte: monthAgo } }),

    // Top 5 diagnoses in last 30 days
    Consultation.aggregate([
      { $match: { doctorId, createdAt: { $gte: monthAgo }, 'soapNote.assessment.probableDiagnosis': { $exists: true } } },
      { $group: { _id: '$soapNote.assessment.probableDiagnosis', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),

    // Risk level trend (Red/Yellow/Green counts per week)
    Appointment.aggregate([
      { $match: { doctorId, scheduledAt: { $gte: monthAgo } } },
      { $group: { _id: { week: { $week: '$scheduledAt' }, risk: '$patientRiskLevel' }, count: { $sum: 1 } } },
      { $sort: { '_id.week': 1 } },
    ]),

    // Completion rate
    Appointment.aggregate([
      { $match: { doctorId, scheduledAt: { $gte: monthAgo } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  // Process completion rate
  const statusCounts = Object.fromEntries(completionRate.map(s => [s._id, s.count]));
  const totalAppts   = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

  return {
    weekly: {
      patientsByDay:  weeklyPatients,
      totalThisWeek:  weeklyPatients.reduce((sum, d) => sum + d.count, 0),
    },
    monthly: {
      totalPatients:  monthlyPatients,
      topDiagnoses:   topDiagnoses.map(d => ({ diagnosis: d._id, count: d.count })),
    },
    riskTrends,
    appointmentStats: {
      completed:        statusCounts['completed']   || 0,
      noShow:           statusCounts['no_show']     || 0,
      cancelled:        statusCounts['cancelled']   || 0,
      completionRate:   Math.round(((statusCounts['completed'] || 0) / totalAppts) * 100),
    },
  };
};

module.exports = { getDoctorAnalytics };
```

---

## 15. Deep Learning Architecture Reference

This section maps the deep learning architectures discussed in the **ICSADL-2025 research paper** to their actual roles in MediVoice AI:

### CNN (Convolutional Neural Network)

```
Paper Reference: Section II.4 — Used for feature extraction from speech signals
MediVoice AI Role: Underlying architecture of Hugging Face speech models
                   used for audio feature extraction before ASR

Formula (from paper):
  (h_k)_ij = (W_k ⊗ q) + b_k
  where:
    (h_k)_ij  = (i,j)th element of kth output feature map
    q         = input feature maps
    W_k       = kth filter
    b_k       = bias term
    ⊗         = 2D convolution operation
```

### RNN / LSTM (Recurrent Neural Network / Long Short-Term Memory)

```
Paper Reference: Section II.5 — Sequential modeling, handles temporal dependencies
MediVoice AI Role: Dialogue context management in the patient chatbot (AI-05)
                   Maintains what was said in previous turns of the conversation

Formula (from paper):
  h_t = H(W_xh * x_t + W_hh * h_{t-1} + b_h)
  y_t = W_yh * h_t + b_y
  where:
    h_t    = current hidden state
    h_{t-1} = previous hidden state (conversation memory)
    x_t    = current input (patient message)
    y_t    = output (chatbot response)
    W      = weight matrices
    b      = bias vector
    H      = hidden layer activation function

Vanishing Gradient Solution: LSTM gates (implemented in Hugging Face models)
  • Input gate:  Controls what new information enters memory
  • Forget gate: Controls what old information is discarded
  • Output gate: Controls what information is passed to next layer
```

### Bidirectional RNN

```
Paper Reference: Section II.5 — Past and future context modeling
MediVoice AI Role: NER entity extraction in AI-04 (reads the full transcript
                   forward AND backward for better medical entity boundaries)
```

### NLU Dialogue System Architecture

```
Paper Reference: Section III — Intent Classification, Response Location, NLG
MediVoice AI Role: Patient chatbot (AI-05) complete architecture

Components:
  IC (Intent Classification)   → classifyIntent() function in chatbotController.js
  RL (Response Location)       → Doctor DB lookup + DRUG_DOSAGE_REFERENCE
  DM (Dialogue Management)     → conversationHistory array + context window
  NLG (Natural Language Gen.)  → buildChatbotResponse() function
```

---

## 16. AI Data Flow — End-to-End Consultation

Complete data flow from patient arriving at the platform to consultation records being saved:

```
═══════════════════════════════════════════════════════════════════════════
                    MEDIVOICE AI — FULL CONSULTATION DATA FLOW
═══════════════════════════════════════════════════════════════════════════

STEP 1: PATIENT DESCRIBES SYMPTOMS
───────────────────────────────────
Patient types/speaks → AI-01 ASR captures voice
                     → AI-05 Chatbot processes message
                     → AI-04 NER extracts: {symptoms: ['chest pain'], ...}
                     → AI-06 Risk check: ⚠️ RED alert triggered
                     → Patient sees: Emergency modal + SOS button

STEP 2: APPOINTMENT BOOKED
──────────────────────────
AI-05 suggests: "Cardiologist in Hyderabad"
Patient confirms → Appointment saved to MongoDB
                 → AI-11 Risk Classifier: tags as RED in doctor's queue
                 → Doctor notified: "New CRITICAL patient in queue"

STEP 3: LIVE CONSULTATION BEGINS
─────────────────────────────────
Doctor selects language: Tamil (ta-IN)
Patient language:        Hindi (hi-IN)

Patient speaks Hindi
  → AI-01: Web Speech API → "mujhe seene mein dard hai"
  → AI-02: LibreTranslate → "என்னை மார்பில் வலி இருக்கிறது"
  → WebSocket → Doctor sees Tamil translation in real-time
  → AI-04: NER on English translation → symptoms: ['chest pain']
  → AI-06: Risk monitor → continues RED status

Doctor speaks Tamil
  → AI-01: Web Speech API → Tamil speech captured
  → AI-02: LibreTranslate → Hindi translation
  → WebSocket → Patient sees Hindi translation in real-time
  → AI-03: TTS → Patient hears Hindi audio (optional)

STEP 4: CONSULTATION ENDS — AI DOCUMENTATION
──────────────────────────────────────────────
Doctor clicks "Generate Notes"
  → AI-07: SOAP generator processes full transcript
  → NER runs on all patient + doctor speech
  → SOAP note auto-populated:
      S: "chest pain for 3 days, radiating to left arm"
      O: "doctor examined, requested ECG"
      A: "Probable: Unstable Angina"
      P: "Aspirin 75mg OD, refer to Cardiologist, ECG, follow-up 2 days"

  → AI-09: Prescription pre-fill
      Medications: [{drug: 'Aspirin', dose: '75mg', freq: 'Once daily', ...}]

Doctor reviews, edits, confirms prescription → Saved

STEP 5: POST-CONSULTATION AI
──────────────────────────────
  → AI-10: Medication Reminder Engine
      Parses: "Aspirin 75mg once daily"
      Schedules: daily 8:00 AM push notification
      Duration: until prescription end date

  → PDF generated: Prescription + Transcript (jsPDF, client-side)
  → Patient notified: "Prescription ready. Tap to download."

  → AI-12: Analytics updated
      Doctor's dashboard: +1 patient today, "Chest Pain" added to top diagnoses
      Risk trend: RED patient count +1 for this week

═══════════════════════════════════════════════════════════════════════════
```

---

## 17. Free AI Services — Limits & Fallbacks

Critical information for operating within free tier constraints:

### Hugging Face Free Tier

| Metric | Limit | MediVoice AI Strategy |
|---|---|---|
| Requests/month | ~30,000 free | Cache repeated NER results for common symptom phrases |
| Cold start delay | 20–30 seconds | Show "AI is warming up..." loader. Pre-warm on server start |
| Rate limit (burst) | ~10 req/second | Queue requests with 200ms throttle between NER calls |
| Model availability | 99%+ uptime | Keyword fallback (`keywordFallbackNER`) always available |

#### Request Caching Strategy

```javascript
// server/services/nerCache.js
// Avoid redundant API calls for common medical phrases

const NodeCache = require('node-cache');
const cache     = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

const cachedNER = async (text) => {
  const key = text.toLowerCase().trim().substring(0, 100);

  const cached = cache.get(key);
  if (cached) return cached;

  const result = await extractMedicalEntities(text);
  cache.set(key, result);
  return result;
};
```

### LibreTranslate Free Tier

| Option | Limit | Latency | Recommendation |
|---|---|---|---|
| `libretranslate.com` (public) | ~20 req/min | 1–3s | Use for MVP |
| Self-hosted on Render | Unlimited | 0.5–1s | Phase 2 upgrade |
| MyMemory fallback | 1000 words/day/IP | 1–2s | Emergency fallback |

#### Rate Limit Handling

```javascript
// Throttle translation requests to stay within free limits
const pThrottle = require('p-throttle');

const throttledTranslate = pThrottle(
  { limit: 15, interval: 60000 }  // 15 requests per minute
)(translateText);
```

### Web Speech API

| Constraint | Detail | Mitigation |
|---|---|---|
| Chrome-only | Firefox/Safari have no support | Text input fallback always available |
| Internet required | Sends audio to Google servers | Warn user; offline text mode available |
| Microphone permission | Browser prompt required | Clear permission request dialog |
| Session timeout | Long silences may end session | Auto-restart in `recognition.onend` handler |

---

## 18. AI Integration Testing Checklist

Complete test checklist before MVP launch:

### AI-01 — ASR
- [ ] Hindi speech → Hindi text transcription (accuracy > 85%)
- [ ] Tamil speech → Tamil text transcription (accuracy > 80%)
- [ ] Telugu speech → Telugu text transcription (accuracy > 80%)
- [ ] Malayalam speech → Malayalam text transcription
- [ ] Kannada speech → Kannada text transcription
- [ ] Bengali speech → Bengali text transcription
- [ ] Interim (streaming) text appears within 300ms of speech
- [ ] Auto-restart works correctly after silence timeout
- [ ] Fallback text input renders when browser ≠ Chrome

### AI-02 — Translation
- [ ] Hindi ↔ Tamil round-trip translation (semantic preservation)
- [ ] Hindi ↔ Telugu round-trip translation
- [ ] Hindi ↔ Malayalam round-trip translation
- [ ] Hindi ↔ Kannada round-trip translation
- [ ] Hindi ↔ Bengali round-trip translation
- [ ] LibreTranslate timeout falls back to MyMemory within 3s
- [ ] Translation shown on doctor screen within 2s of patient speech

### AI-04 — Medical NER
- [ ] "I have chest pain and shortness of breath" → `symptoms: ['chest pain', 'shortness of breath']`
- [ ] "I am taking Metformin 500mg twice daily" → `medications: ['Metformin']`
- [ ] Cold start delay handled (20s loader shown, not blank screen)
- [ ] Keyword fallback returns correct entities when API unavailable

### AI-05 — Patient Chatbot
- [ ] Symptom query returns specialty recommendation
- [ ] Emergency intent triggers immediate risk alert (not delayed)
- [ ] Doctor suggestions populated from correct city
- [ ] Appointment booking CTA functional from chat
- [ ] Conversation history maintained across 5+ turns

### AI-06 — Risk Alert
- [ ] "chest pain" → RED alert within 100ms (keyword, no API call)
- [ ] "severe headache" → YELLOW alert
- [ ] "mild headache" → GREEN (no alert)
- [ ] RED alert modal shows SOS 108 button
- [ ] Risk event logged to MongoDB with timestamp
- [ ] Doctor receives simultaneous notification for RED patient

### AI-07 — SOAP Note Generator
- [ ] Transcript with 5+ patient lines → populated S section
- [ ] Doctor's diagnostic statement → populated A section
- [ ] Medication mention → appears in P section
- [ ] Note flagged as `aiGenerated: true`
- [ ] Doctor can edit all fields before saving

### AI-08 — Doctor QA
- [ ] "What is the max dose of Paracetamol?" → correct answer
- [ ] "Drug interaction between Warfarin and Aspirin?" → bleeding risk response
- [ ] Low confidence answer → disclaimer shown
- [ ] API unavailable → keyword fallback answer displayed

### AI-09 — Prescription Pre-Fill
- [ ] Metformin mention in transcript → dose 500mg, frequency "twice daily" pre-filled
- [ ] Unknown drug → empty fields (not fabricated values)
- [ ] `aiPrefilled: true` flag shown to doctor in UI

### AI-10 — Medication Reminder
- [ ] "Twice daily" → two reminders scheduled at 08:00 and 20:00
- [ ] "Once at night" → 21:00 reminder
- [ ] "For 7 days" → 7-day schedule, then auto-deactivate
- [ ] Push notification delivered on time (±2 min tolerance)
- [ ] Patient can adjust reminder times

### AI-11 — Risk Classifier
- [ ] Patient with chest pain chat → RED tag in doctor queue
- [ ] Patient with mild cough → GREEN tag
- [ ] Risk level updates when patient sends new messages

### AI-12 — Analytics
- [ ] Weekly patient count matches appointment records
- [ ] Top diagnoses correctly aggregated from SOAP notes
- [ ] Risk trend chart reflects actual RED/YELLOW/GREEN counts

---

## 19. AI Ethics & Disclaimers

### Mandatory Disclaimers

The following disclaimers **must** be displayed at the specified touchpoints:

```
1. PATIENT CHATBOT DISCLAIMER (shown before first AI interaction):
   ─────────────────────────────────────────────────────────────
   "MediVoice AI's health assistant provides general guidance only.
   It is NOT a substitute for professional medical diagnosis or treatment.
   Always consult a qualified doctor for medical advice. In an emergency,
   call 108 immediately."

2. SOAP NOTE DISCLAIMER (shown on every AI-generated note):
   ─────────────────────────────────────────────────────────────
   "⚠️ AI-Generated Draft — Review Required
   This clinical note was generated by AI from the consultation transcript.
   It must be reviewed, edited, and confirmed by the treating doctor before
   being treated as an official medical record."

3. DOCTOR AI ASSISTANT DISCLAIMER (shown in sidebar):
   ─────────────────────────────────────────────────────────────
   "AI responses are for reference only. Always verify clinical decisions
   against current medical guidelines. You are solely responsible for
   all clinical decisions."

4. RISK ALERT DISCLAIMER (shown beneath alert):
   ─────────────────────────────────────────────────────────────
   "This alert is AI-generated based on keyword and symptom pattern
   analysis. It is not a clinical diagnosis. When in doubt, seek
   emergency medical care."
```

### Data Privacy

```
Patient medical data:
  • Stored encrypted in MongoDB Atlas
  • Consultation transcripts: accessible only to the patient + treating doctor
  • AI processing: text sent to Hugging Face API is anonymized (no patient name/ID)
  • Translation: text sent to LibreTranslate is not stored server-side
  • Web Speech API: audio processed by Google servers (Chrome) per their privacy policy

Doctor must inform patient:
  • Consultation is being transcribed in real-time
  • Transcript will be stored and can be downloaded
  • AI will analyze content to generate clinical notes

Patient consent:
  • Explicit consent checkbox before first live consultation
  • Consent stored with consultation record
```

### AI Limitations Acknowledgment

| Limitation | Mitigation |
|---|---|
| NER accuracy is ~85% on clean English medical text | Doctor review required for all AI-generated notes |
| Translation accuracy for medical terminology may be lower than general text | Doctor sees both original and translated text |
| Risk detection is keyword/pattern-based — not clinically validated | Disclaimer shown; SOS always accessible independently |
| Chatbot cannot diagnose — it guides and suggests only | Prominent disclaimer before first use |
| Voice recognition accuracy varies by accent and background noise | Text input fallback always available |

---

## 20. Environment Variables for AI Services

```env
# ─── HUGGING FACE ─────────────────────────────────────────────────────────────
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Medical NER model (free, public)
HF_MODEL_NER=d4data/biomedical-ner-all

# Clinical QA model (free, public)
HF_MODEL_QA=deepset/roberta-base-squad2

# Request timeout (ms) — important for cold start handling
HF_TIMEOUT_MS=8000

# ─── LIBRETRANSLATE ───────────────────────────────────────────────────────────
LIBRETRANSLATE_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=

# Throttle: max requests per minute (free tier = 20)
LIBRETRANSLATE_RPM=18

# ─── MYMEMORY FALLBACK ────────────────────────────────────────────────────────
MYMEMORY_EMAIL=your_email@gmail.com

# ─── WEB SPEECH API ───────────────────────────────────────────────────────────
# No keys needed — browser-native
# Default language (BCP-47)
DEFAULT_ASR_LANGUAGE=hi-IN

# ─── RISK DETECTION ───────────────────────────────────────────────────────────
# Minimum NER confidence score to use AI result (vs keyword fallback)
MIN_NER_CONFIDENCE=0.3

# ─── NODE CACHE (NER RESULTS) ─────────────────────────────────────────────────
NER_CACHE_TTL_SECONDS=3600
NER_CACHE_MAX_KEYS=500
```

---

<div align="center">

---

## Summary — All 12 AI Components

| # | Component | Service | Cost | Status |
|---|---|---|---|---|
| AI-01 | Automated Speech Recognition | Web Speech API | 🆓 Free | Implement first |
| AI-02 | Multilingual Translation | LibreTranslate | 🆓 Free | Implement with AI-01 |
| AI-03 | Text-to-Speech | Web Speech Synthesis | 🆓 Free | Layer on AI-02 |
| AI-04 | Medical NER Pipeline | Hugging Face | 🆓 Free tier | Core dependency |
| AI-05 | Patient Chatbot | HF + Rule engine | 🆓 Free | Depends on AI-04 |
| AI-06 | Risk Alert System | Keyword + HF | 🆓 Free | Depends on AI-04 |
| AI-07 | SOAP Note Generator | HF + Templates | 🆓 Free | Depends on AI-04 |
| AI-08 | Doctor QA Assistant | Hugging Face QA | 🆓 Free | Independent |
| AI-09 | Prescription Pre-Fill | NER pipeline | 🆓 Free | Depends on AI-07 |
| AI-10 | Medication Reminders | Rule engine + Push | 🆓 Free | Depends on AI-09 |
| AI-11 | Risk Level Classifier | Keyword + HF | 🆓 Free | Depends on AI-06 |
| AI-12 | Analytics Intelligence | MongoDB aggregation | 🆓 Free | Independent |

---

**MEDIVOICE AI — AI Integration Plan v1.0**

*Grounded in ICSADL-2025 Research · Built on 100% Free AI Services · Zero Infrastructure Cost*

![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat&logo=huggingface&logoColor=black)
![Web Speech API](https://img.shields.io/badge/Web%20Speech%20API-4285F4?style=flat&logo=google-chrome&logoColor=white)
![LibreTranslate](https://img.shields.io/badge/LibreTranslate-00A699?style=flat)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
