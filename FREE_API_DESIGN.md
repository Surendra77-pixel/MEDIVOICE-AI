<div align="center">

# 🔌 MEDIVOICE AI — Free API Design Plan
### Complete Zero-Cost External API & Service Integration Reference

![Document](https://img.shields.io/badge/Document-Free%20API%20Design%20Plan-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Cost](https://img.shields.io/badge/Total%20API%20Cost-$0.00%2Fmonth-brightgreen?style=for-the-badge)
![APIs](https://img.shields.io/badge/External%20APIs-12-purple?style=for-the-badge)

> **The authoritative reference for every external API, free service, and third-party
> integration used in MediVoice AI — with implementation code, rate limits,
> fallback strategies, and cost proof for every single one.**

---

**Platform:** MediVoice AI — AI-Powered Healthcare Communication  
**Principle:** Every external API used must be permanently free, not a trial  
**Total External APIs:** 12 services · $0.00/month combined cost  
**Strategy:** Primary API + Fallback API for every critical integration

</div>

---

## 📋 Table of Contents

1. [Free API Philosophy](#1-free-api-philosophy)
2. [Complete API Registry](#2-complete-api-registry)
3. [API-01 · Web Speech API (ASR)](#3-api-01--web-speech-api-asr)
4. [API-02 · Web Speech Synthesis API (TTS)](#4-api-02--web-speech-synthesis-api-tts)
5. [API-03 · LibreTranslate API](#5-api-03--libretranslate-api)
6. [API-04 · MyMemory Translation API (Fallback)](#6-api-04--mymemory-translation-api-fallback)
7. [API-05 · Hugging Face Inference API](#7-api-05--hugging-face-inference-api)
8. [API-06 · OpenStreetMap Tile API](#8-api-06--openstreetmap-tile-api)
9. [API-07 · Overpass API (Hospital Data)](#9-api-07--overpass-api-hospital-data)
10. [API-08 · Geolocation API](#10-api-08--geolocation-api)
11. [API-09 · Gmail SMTP via Nodemailer](#11-api-09--gmail-smtp-via-nodemailer)
12. [API-10 · Browser Push Notifications API](#12-api-10--browser-push-notifications-api)
13. [API-11 · MongoDB Atlas (Free Tier)](#13-api-11--mongodb-atlas-free-tier)
14. [API-12 · tel: Protocol (SOS)](#14-api-12--tel-protocol-sos)
15. [Internal REST API Design](#15-internal-rest-api-design)
16. [Internal WebSocket API Design](#16-internal-websocket-api-design)
17. [API Rate Limit Dashboard](#17-api-rate-limit-dashboard)
18. [API Fallback Chain](#18-api-fallback-chain)
19. [API Error Handling Strategy](#19-api-error-handling-strategy)
20. [API Testing Checklist](#20-api-testing-checklist)
21. [Free Tier Upgrade Triggers](#21-free-tier-upgrade-triggers)

---

## 1. Free API Philosophy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      FREE API DESIGN PRINCIPLES                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PERMANENTLY FREE — NOT TRIAL FREE                                       │
│  Every API used must have a permanent free tier, not a time-limited     │
│  trial. Hugging Face free inference, OpenStreetMap, Web Speech API,     │
│  and Gmail SMTP are permanently free — no credit card required.          │
│                                                                          │
│  EVERY CRITICAL API HAS A FALLBACK                                       │
│  If LibreTranslate fails → MyMemory takes over automatically.            │
│  If Hugging Face NER fails → keyword rules handle detection.             │
│  The platform never goes down because one free API is rate-limited.     │
│                                                                          │
│  BROWSER-NATIVE FIRST                                                    │
│  Web Speech API and Speech Synthesis API run entirely in the browser.   │
│  No API key. No server cost. No rate limit. Always free.                 │
│                                                                          │
│  CACHE AGGRESSIVELY                                                      │
│  NER results are cached for 1 hour (node-cache). Repeated symptom       │
│  phrases don't burn Hugging Face free quota. Hospital data is cached    │
│  per session. Translation results are cached by text hash.              │
│                                                                          │
│  FAIL GRACEFULLY                                                         │
│  If an external API is down → the feature degrades, not the platform.  │
│  Translation unavailable → show original text with a notice.            │
│  NER unavailable → keyword rules take over transparently.               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete API Registry

| ID | API | Type | Cost | Rate Limit | Used For | Fallback |
|---|---|---|---|---|---|---|
| API-01 | Web Speech API | Browser-native | 🆓 $0 forever | Unlimited | ASR — speech to text | Text input mode |
| API-02 | Web Speech Synthesis | Browser-native | 🆓 $0 forever | Unlimited | TTS — text to speech | Silent mode |
| API-03 | LibreTranslate | HTTP REST | 🆓 $0 free tier | ~20 req/min | Real-time translation | API-04 MyMemory |
| API-04 | MyMemory | HTTP REST | 🆓 $0 free tier | 10K words/day | Translation fallback | Show original |
| API-05 | Hugging Face Inference | HTTP REST | 🆓 $0 free tier | ~30K req/month | Medical NER + Clinical QA | Keyword rules |
| API-06 | OpenStreetMap Tiles | HTTP REST | 🆓 $0 forever | Fair use | Map tile rendering | Blank map |
| API-07 | Overpass API | HTTP REST | 🆓 $0 forever | Fair use | Hospital data by GPS | Seeded list |
| API-08 | Geolocation API | Browser-native | 🆓 $0 forever | Unlimited | Patient GPS location | Manual city input |
| API-09 | Gmail SMTP (Nodemailer) | SMTP | 🆓 $0 free tier | 500 emails/day | OTP delivery, notifications | Retry queue |
| API-10 | Push Notifications API | Browser-native | 🆓 $0 forever | Unlimited | Appointment + medication alerts | In-app toast |
| API-11 | MongoDB Atlas M0 | Cloud DB | 🆓 $0 forever | 512MB storage | Primary database | N/A |
| API-12 | tel: Protocol | Browser-native | 🆓 $0 forever | Unlimited | SOS 108 emergency call | Copy number |

**Total Monthly Cost: $0.00** ✅

---

## 3. API-01 · Web Speech API (ASR)

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          Web Speech API (SpeechRecognition interface)              │
│  Provider:     Google (via Chrome browser) / OS-native on other browsers│
│  Cost:         $0.00 — Browser-native, no API key required              │
│  Rate Limit:   None — runs entirely in the user's browser               │
│  Latency:      < 300ms (real-time streaming)                            │
│  Best Browser: Chrome (full support · all 6 Indian languages)           │
│  MDN Docs:     https://developer.mozilla.org/en-US/docs/Web/API/       │
│                SpeechRecognition                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Language Support

| Language | BCP-47 Code | Chrome | Edge | Firefox | Safari |
|---|---|---|---|---|---|
| Hindi | `hi-IN` | ✅ Full | ✅ | ❌ | ⚠️ Limited |
| Tamil | `ta-IN` | ✅ Full | ✅ | ❌ | ⚠️ Limited |
| Telugu | `te-IN` | ✅ Full | ✅ | ❌ | ⚠️ Limited |
| Malayalam | `ml-IN` | ✅ Full | ✅ | ❌ | ⚠️ Limited |
| Kannada | `kn-IN` | ✅ Full | ✅ | ❌ | ⚠️ Limited |
| Bengali | `bn-IN` | ✅ Full | ✅ | ❌ | ⚠️ Limited |

### Complete Implementation

```javascript
// client/src/hooks/useSpeechRecognition.js
// Cost: $0.00 — Runs entirely in browser, zero server involvement

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech API integration
 * @param {object} config
 * @param {string}   config.language    - BCP-47 language code (e.g., 'hi-IN')
 * @param {boolean}  config.continuous  - Keep listening after pause
 * @param {Function} config.onResult    - Called with final transcript text
 * @param {Function} config.onError     - Called on recognition error
 * @param {Function} config.onRiskDetected - Called when risk keywords found
 */
const useSpeechRecognition = ({
  language       = 'hi-IN',
  continuous     = true,
  onResult,
  onError,
  onRiskDetected,
}) => {
  const [isListening,   setIsListening]   = useState(false);
  const [transcript,    setTranscript]    = useState('');
  const [interimText,   setInterimText]   = useState('');
  const [isSupported,   setIsSupported]   = useState(false);
  const recognitionRef                    = useRef(null);
  const restartTimerRef                   = useRef(null);

  // ── Browser Support Detection ───────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (!SpeechRecognition) {
      console.warn(
        '[MediVoice ASR] Web Speech API not supported in this browser. ' +
        'Chrome recommended. Falling back to text input mode.'
      );
      return;
    }

    // ── Initialise SpeechRecognition ──────────────────────────────────────
    const recognition           = new SpeechRecognition();
    recognition.lang            = language;
    recognition.continuous      = continuous;
    recognition.interimResults  = true;   // Stream partial results to UI
    recognition.maxAlternatives = 1;

    // ── Result Handler ────────────────────────────────────────────────────
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript   = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update interim text (shown in italic in UI)
      if (interimTranscript) {
        setInterimText(interimTranscript);
      }

      // Process final text
      if (finalTranscript.trim()) {
        const cleaned = finalTranscript.trim();
        setTranscript(prev => prev + cleaned + ' ');
        setInterimText('');

        // Invoke parent callbacks
        onResult && onResult(cleaned, 'final');
        onRiskDetected && checkRiskKeywords(cleaned, onRiskDetected);
      }
    };

    // ── Error Handler ─────────────────────────────────────────────────────
    recognition.onerror = (event) => {
      console.warn('[MediVoice ASR] Error:', event.error);

      // Network errors on mobile — auto-restart
      if (event.error === 'network' || event.error === 'audio-capture') {
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (_) {}
          }
        }, 1000);
      }

      onError && onError(event.error);
    };

    // ── End Handler (auto-restart for continuous mode) ────────────────────
    recognition.onend = () => {
      if (isListening && continuous) {
        // Small delay prevents immediate restart loop
        restartTimerRef.current = setTimeout(() => {
          try { recognition.start(); } catch (_) {}
        }, 300);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(restartTimerRef.current);
      try { recognition.stop(); } catch (_) {}
    };
  }, [language, continuous]);

  // ── Risk Keyword Quick-Scan (Layer 1 detection) ───────────────────────
  const checkRiskKeywords = (text, callback) => {
    const CRITICAL_KEYWORDS = [
      'chest pain', 'heart attack', 'cannot breathe', "can't breathe",
      'seizure', 'stroke', 'unconscious', 'heavy bleeding',
      'suicidal', 'overdose', 'jaw pain', 'sudden vision',
    ];
    const lower = text.toLowerCase();
    const found = CRITICAL_KEYWORDS.find(k => lower.includes(k));
    if (found) callback({ keyword: found, text, level: 'RED' });
  };

  // ── Controls ──────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.warn('[MediVoice ASR] Start error:', err);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    clearTimeout(restartTimerRef.current);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.warn('[MediVoice ASR] Stop error:', err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimText('');
  }, []);

  return {
    isListening,
    transcript,
    interimText,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
```

### Fallback — Text Input Mode

```javascript
// client/src/components/patient/ASRFallback.jsx
// Shown when Web Speech API is not available (non-Chrome browsers)

const ASRFallback = ({ onTextSubmit, placeholder }) => (
  <div className="asr-fallback p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-yellow-600 text-sm font-medium">
        ⚠️ Voice input requires Chrome. Please type below.
      </span>
      <a
        href="https://www.google.com/chrome/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-xs underline"
      >
        Get Chrome
      </a>
    </div>
    <textarea
      className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
      rows={3}
      placeholder={placeholder || 'Type your symptoms or question here...'}
      onChange={(e) => onTextSubmit(e.target.value)}
    />
  </div>
);

export default ASRFallback;
```

---

## 4. API-02 · Web Speech Synthesis API (TTS)

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          Web Speech Synthesis API (SpeechSynthesisUtterance)      │
│  Provider:     OS-native voices (Android/iOS/Windows/macOS)             │
│  Cost:         $0.00 — Browser-native, no API key required              │
│  Rate Limit:   None                                                      │
│  Use Case:     Read translated consultation text aloud to user          │
│  Accessibility: Visually impaired users, elderly patients               │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// client/src/hooks/useTextToSpeech.js
// Cost: $0.00 — Runs entirely in browser

import { useCallback, useRef, useState } from 'react';

/**
 * Text-to-Speech hook using Web Speech Synthesis API
 * @returns {{ speak, stop, pause, resume, isSpeaking, isSupported }}
 */
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef                 = useRef(null);

  const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  /**
   * Speak text in the specified language
   * @param {string} text  - Text to speak
   * @param {string} lang  - BCP-47 code (e.g., 'ta-IN')
   * @param {number} rate  - Speed: 0.5–2.0 (default 0.9 for medical clarity)
   */
  const speak = useCallback((text, lang = 'hi-IN', rate = 0.9) => {
    if (!isSupported || !text?.trim()) return;

    // Cancel any ongoing speech before starting
    window.speechSynthesis.cancel();

    const utterance     = new SpeechSynthesisUtterance(text);
    utterance.lang      = lang;
    utterance.rate      = rate;
    utterance.pitch     = 1.0;
    utterance.volume    = 1.0;

    // Try to find a matching voice for the language
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang.split('-')[0];  // 'hi-IN' → 'hi'
    const matchedVoice = voices.find(v =>
      v.lang.startsWith(langCode) || v.lang === lang
    );
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart  = () => setIsSpeaking(true);
    utterance.onend    = () => setIsSpeaking(false);
    utterance.onerror  = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop    = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const pause   = useCallback(() => window.speechSynthesis?.pause(), []);
  const resume  = useCallback(() => window.speechSynthesis?.resume(), []);

  return { speak, stop, pause, resume, isSpeaking, isSupported };
};

export default useTextToSpeech;
```

---

## 5. API-03 · LibreTranslate API

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          LibreTranslate REST API                                   │
│  Base URL:     https://libretranslate.com                                │
│  Cost:         $0.00 — Free public endpoint (no credit card)            │
│  Rate Limit:   ~20 requests/minute on free public endpoint              │
│  Auth:         API key optional (empty = free public tier)              │
│  Method:       POST /translate                                           │
│  Open Source:  github.com/LibreTranslate/LibreTranslate (MIT license)  │
│  Self-hosting: Free on Render/Railway (Phase 2 upgrade path)           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Supported Language Pairs

```
LIBRETRANSLATE LANGUAGE SUPPORT FOR MEDIVOICE AI
══════════════════════════════════════════════════════════════════════

Supported codes: hi · ta · te · ml · kn · bn · en

Direct pairs (1 API call):
  hi ↔ en   ✅  (Hindi ↔ English — highest accuracy)
  ta ↔ en   ✅  (Tamil ↔ English)
  te ↔ en   ✅  (Telugu ↔ English)
  ml ↔ en   ✅  (Malayalam ↔ English)
  kn ↔ en   ✅  (Kannada ↔ English)
  bn ↔ en   ✅  (Bengali ↔ English)
  hi ↔ ta   ✅  (direct where supported)

Pivot pairs via English (2 API calls):
  ta → en → te   (Tamil to Telugu)
  ml → en → kn   (Malayalam to Kannada)
  bn → en → ta   (Bengali to Tamil)
  [all non-English pairs not directly supported → route through English]
```

### Complete Implementation

```javascript
// server/services/ai/translateService.js
// Cost: $0.00 — LibreTranslate free public API

const axios = require('axios');

const LIBRETRANSLATE_URL     = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || '';  // Empty = free tier
const LIBRETRANSLATE_TIMEOUT = parseInt(process.env.LIBRETRANSLATE_TIMEOUT_MS) || 3000;

// ── Language Code Mapping (BCP-47 → LibreTranslate codes) ────────────────
const LANG_MAP = {
  'hi-IN': 'hi', 'hi': 'hi',
  'ta-IN': 'ta', 'ta': 'ta',
  'te-IN': 'te', 'te': 'te',
  'ml-IN': 'ml', 'ml': 'ml',
  'kn-IN': 'kn', 'kn': 'kn',
  'bn-IN': 'bn', 'bn': 'bn',
  'en-IN': 'en', 'en': 'en',
};

// ── Direct translation pairs (single LibreTranslate call) ─────────────────
const DIRECT_PAIRS = new Set([
  'hi-ta', 'ta-hi', 'hi-te', 'te-hi', 'hi-ml', 'ml-hi',
  'hi-kn', 'kn-hi', 'hi-bn', 'bn-hi', 'hi-en', 'en-hi',
  'ta-en', 'en-ta', 'te-en', 'en-te', 'ml-en', 'en-ml',
  'kn-en', 'en-kn', 'bn-en', 'en-bn',
]);

// ── Translation Result Cache (node-cache, 30 min TTL) ─────────────────────
const NodeCache = require('node-cache');
const translationCache = new NodeCache({ stdTTL: 1800 }); // 30 minutes

/**
 * Translate text between any two supported language codes
 * @param {string} text        - Input text to translate
 * @param {string} sourceLang  - Source language (BCP-47 or LibreTranslate code)
 * @param {string} targetLang  - Target language (BCP-47 or LibreTranslate code)
 * @returns {Promise<string>}  - Translated text
 */
const translateText = async (text, sourceLang, targetLang) => {
  if (!text?.trim())               return '';
  if (sourceLang === targetLang)   return text;  // No-op

  const src = LANG_MAP[sourceLang] || sourceLang;
  const tgt = LANG_MAP[targetLang] || targetLang;

  // ── Cache hit check ───────────────────────────────────────────────────
  const cacheKey = `${src}:${tgt}:${text.substring(0, 100)}`;
  const cached   = translationCache.get(cacheKey);
  if (cached) return cached;

  // ── Determine routing strategy ────────────────────────────────────────
  const pairKey = `${src}-${tgt}`;
  let result;

  if (DIRECT_PAIRS.has(pairKey)) {
    // Direct single-call translation
    result = await callLibreTranslate(text, src, tgt);
  } else {
    // Pivot through English (2 calls)
    const enText = await callLibreTranslate(text, src, 'en');
    result       = await callLibreTranslate(enText, 'en', tgt);
  }

  // ── Cache result ──────────────────────────────────────────────────────
  if (result) translationCache.set(cacheKey, result);

  return result || `[Translation unavailable] ${text}`;
};

/**
 * Single LibreTranslate API call with MyMemory fallback
 */
const callLibreTranslate = async (text, source, target) => {
  try {
    const response = await axios.post(
      `${LIBRETRANSLATE_URL}/translate`,
      {
        q:      text,
        source: source,
        target: target,
        format: 'text',
        ...(LIBRETRANSLATE_API_KEY && { api_key: LIBRETRANSLATE_API_KEY }),
      },
      {
        headers:         { 'Content-Type': 'application/json' },
        timeout:         LIBRETRANSLATE_TIMEOUT,
      }
    );

    return response.data?.translatedText || null;

  } catch (primaryError) {
    // ── Automatic fallback to MyMemory API ────────────────────────────
    console.warn(
      `[LibreTranslate] Failed (${primaryError.response?.status || primaryError.code}). ` +
      `Trying MyMemory fallback...`
    );
    return callMyMemory(text, source, target);
  }
};

module.exports = { translateText, LANG_MAP };
```

---

## 6. API-04 · MyMemory Translation API (Fallback)

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          MyMemory REST API                                         │
│  Base URL:     https://api.mymemory.translated.net                      │
│  Cost:         $0.00 — Free, no API key required                        │
│  Rate Limit:   1,000 words/day per IP                                   │
│                10,000 words/day with registered email address            │
│  Auth:         Optional email in query param (increases limit)          │
│  Method:       GET /get?q=text&langpair=hi|ta                           │
│  Docs:         https://mymemory.translated.net/doc/spec.php             │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation (Fallback Service)

```javascript
// server/services/ai/translateService.js (continued)

const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || '';

/**
 * MyMemory API fallback translation
 * Only called when LibreTranslate fails or is rate-limited
 */
const callMyMemory = async (text, source, target) => {
  try {
    const params = new URLSearchParams({
      q:        text,
      langpair: `${source}|${target}`,
      ...(MYMEMORY_EMAIL && { de: MYMEMORY_EMAIL }),
      // 'de' param with email: increases limit from 1K to 10K words/day
    });

    const response = await axios.get(
      `https://api.mymemory.translated.net/get?${params}`,
      { timeout: 3000 }
    );

    const data = response.data;

    // MyMemory returns responseStatus 200 for success
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    // Handle quota exceeded
    if (data?.responseStatus === 429) {
      console.error('[MyMemory] Daily quota exceeded. Returning original text.');
      return null;
    }

    return null;

  } catch (fallbackError) {
    console.error('[MyMemory] Fallback also failed:', fallbackError.message);
    return null;
  }
};
```

### WebSocket Translation Pipeline

```javascript
// server/websocket/transcriptSocket.js
// Integrates translateText into real-time consultation flow

const { translateText } = require('../services/ai/translateService');
const { assessRiskLevel } = require('../services/ai/riskService');

const setupTranscriptSocket = (io) => {

  io.on('connection', (socket) => {

    // ── Patient speaks → translate for doctor ─────────────────────────────
    socket.on('transcript:patient', async ({
      consultationId,
      text,
      sourceLang,   // e.g., 'hi-IN'
      targetLang,   // e.g., 'ta-IN'
    }) => {
      try {
        // Input validation
        if (!text?.trim() || text.length > 1000) return;

        // Parallel: translate + risk check
        const [translated, riskResult] = await Promise.allSettled([
          translateText(text, sourceLang, targetLang),
          assessRiskLevel(text),
        ]);

        const translatedText = translated.status === 'fulfilled'
          ? translated.value
          : `[Translation pending] ${text}`;

        const riskLevel = riskResult.status === 'fulfilled'
          ? riskResult.value
          : { level: 'GREEN' };

        // Broadcast to consultation room
        socket.to(`consultation:${consultationId}`).emit('transcript:from-patient', {
          original:    text,
          translated:  translatedText,
          speaker:     'Patient',
          sourceLang,
          targetLang,
          timestamp:   new Date().toISOString(),
          isRisky:     riskLevel.level !== 'GREEN',
        });

        // Emit risk alert if detected
        if (riskLevel.level !== 'GREEN') {
          io.to(`consultation:${consultationId}`).emit('risk:alert', riskLevel);
        }

      } catch (err) {
        console.error('[TranscriptSocket] Patient transcript error:', err);
        socket.emit('error:socket', { code: 'TRANSCRIPT_FAILED' });
      }
    });

    // ── Doctor speaks → translate for patient ─────────────────────────────
    socket.on('transcript:doctor', async ({
      consultationId, text, sourceLang, targetLang,
    }) => {
      try {
        if (!text?.trim() || text.length > 1000) return;

        const translated = await translateText(text, sourceLang, targetLang);

        socket.to(`consultation:${consultationId}`).emit('transcript:from-doctor', {
          original:   text,
          translated: translated || text,
          speaker:    'Doctor',
          sourceLang,
          targetLang,
          timestamp:  new Date().toISOString(),
        });
      } catch (err) {
        console.error('[TranscriptSocket] Doctor transcript error:', err);
      }
    });
  });
};

module.exports = { setupTranscriptSocket };
```

---

## 7. API-05 · Hugging Face Inference API

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          Hugging Face Inference API                                │
│  Base URL:     https://api-inference.huggingface.co                     │
│  Cost:         $0.00 — Free inference tier (no credit card needed)      │
│  Rate Limit:   ~30,000 requests/month on free tier                      │
│  Auth:         Bearer token (hf_XXXXX) — free account                  │
│  Get Key:      huggingface.co → Settings → Access Tokens → New token   │
│  Docs:         https://huggingface.co/docs/api-inference                │
└──────────────────────────────────────────────────────────────────────────┘
```

### Models Used

| Model | Task | Endpoint | Used For |
|---|---|---|---|
| `d4data/biomedical-ner-all` | Token Classification | `/models/d4data/biomedical-ner-all` | Medical NER — extract symptoms, drugs, body parts |
| `deepset/roberta-base-squad2` | Question Answering | `/models/deepset/roberta-base-squad2` | Doctor AI Assistant — clinical QA |

### Implementation — Medical NER (AI-04)

```javascript
// server/services/ai/nerService.js
// Cost: $0.00 — Hugging Face free inference tier

const axios    = require('axios');
const NodeCache = require('node-cache');

const HF_API_BASE  = 'https://api-inference.huggingface.co/models';
const HF_API_KEY   = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL_NER = process.env.HF_MODEL_NER || 'd4data/biomedical-ner-all';
const HF_TIMEOUT   = parseInt(process.env.HF_TIMEOUT_MS) || 8000;

// Cache NER results — same symptom phrase shouldn't burn quota twice
const nerCache = new NodeCache({ stdTTL: 3600, maxKeys: 500 }); // 1hr TTL

/**
 * Extract medical entities from English clinical text
 * @param {string} text - English text (translate non-English inputs first)
 * @returns {Promise<object>} Categorized medical entities
 */
const extractMedicalEntities = async (text) => {
  if (!text?.trim() || text.length < 5) {
    return emptyEntities();
  }

  // ── Cache check ───────────────────────────────────────────────────────
  const cacheKey = text.toLowerCase().trim().substring(0, 150);
  const cached   = nerCache.get(cacheKey);
  if (cached) {
    console.log('[NER Cache] Hit for:', cacheKey.substring(0, 30));
    return cached;
  }

  try {
    const response = await axios.post(
      `${HF_API_BASE}/${HF_MODEL_NER}`,
      { inputs: text },
      {
        headers: {
          Authorization:  `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: HF_TIMEOUT,
      }
    );

    const entities = categorizeEntities(response.data);
    nerCache.set(cacheKey, entities);  // Cache for next call
    return entities;

  } catch (err) {
    // ── Cold start (503 Service Unavailable) ──────────────────────────
    if (err.response?.status === 503) {
      console.warn('[NER] Hugging Face model warming up (~20s). Using keyword fallback.');
    } else {
      console.error('[NER] API error:', err.message);
    }

    // ── Keyword fallback — always returns something useful ─────────────
    return keywordFallbackNER(text);
  }
};

/**
 * Organize raw NER token list into categorized entity buckets
 */
const categorizeEntities = (rawTokens) => {
  const result = { symptoms: [], medications: [], bodyParts: [], diagnoses: [], procedures: [] };
  if (!Array.isArray(rawTokens)) return { ...result, rawTokens: [], isKeywordFallback: false };

  let current = '';
  let currentType = '';

  rawTokens.forEach((token) => {
    const entityTag  = token.entity_group || token.entity || '';
    const word       = (token.word || '').replace(/^##/, '');  // Handle sub-words

    if (entityTag.startsWith('B-') || (!entityTag.startsWith('I-') && entityTag !== currentType)) {
      if (current && currentType) pushToCategory(result, currentType, current.trim());
      current     = word;
      currentType = entityTag.replace(/^[BI]-/, '');
    } else {
      current += ' ' + word;
    }
  });

  if (current && currentType) pushToCategory(result, currentType, current.trim());

  return { ...result, rawTokens, isKeywordFallback: false };
};

const pushToCategory = (result, entityType, value) => {
  switch (entityType) {
    case 'Sign_or_Symptom':
    case 'Disease_disorder':    result.symptoms.push(value);    break;
    case 'Chemical':
    case 'Medication':          result.medications.push(value); break;
    case 'Body_Part':
    case 'Anatomical_structure':result.bodyParts.push(value);   break;
    case 'Diagnostic_Procedure':
    case 'Therapeutic_procedure':result.procedures.push(value); break;
    default:                    result.diagnoses.push(value);   break;
  }
};

/**
 * Keyword-based fallback — runs when HF API is unavailable
 * Covers the most critical symptom detection scenarios
 * Cost: $0.00 — pure JavaScript, no external call
 */
const keywordFallbackNER = (text) => {
  const lower = text.toLowerCase();

  const SYMPTOM_KEYWORDS = [
    'pain', 'fever', 'cough', 'nausea', 'vomiting', 'headache',
    'dizziness', 'fatigue', 'weakness', 'swelling', 'rash',
    'bleeding', 'breathe', 'palpitation', 'numbness', 'tingling',
  ];

  const HIGH_RISK_KEYWORDS = [
    'chest pain', 'heart attack', 'stroke', 'cannot breathe',
    'seizure', 'unconscious', 'heavy bleeding', 'suicidal', 'overdose',
  ];

  const MEDICATION_KEYWORDS = [
    'metformin', 'aspirin', 'paracetamol', 'ibuprofen', 'amoxicillin',
    'atorvastatin', 'omeprazole', 'cetirizine', 'azithromycin',
  ];

  return {
    symptoms:          SYMPTOM_KEYWORDS.filter(k => lower.includes(k)),
    medications:       MEDICATION_KEYWORDS.filter(k => lower.includes(k)),
    bodyParts:         [],
    diagnoses:         [],
    procedures:        [],
    highRisk:          HIGH_RISK_KEYWORDS.filter(k => lower.includes(k)),
    isKeywordFallback: true,
  };
};

const emptyEntities = () => ({
  symptoms: [], medications: [], bodyParts: [],
  diagnoses: [], procedures: [], isKeywordFallback: false,
});

module.exports = { extractMedicalEntities, keywordFallbackNER };
```

### Implementation — Clinical QA (AI-08)

```javascript
// server/services/ai/doctorQAService.js
// Cost: $0.00 — Hugging Face free inference tier
// Model: deepset/roberta-base-squad2 (extractive QA)

const HF_MODEL_QA = process.env.HF_MODEL_QA || 'deepset/roberta-base-squad2';

// Medical knowledge base (local — no API cost for context)
const MEDICAL_CONTEXT = {
  drug_interactions: `
    Warfarin combined with aspirin significantly increases bleeding risk.
    Metformin should be avoided with iodinated contrast media.
    SSRIs combined with MAOIs cause serotonin syndrome — life-threatening.
    Statins with fibrates increase myopathy and rhabdomyolysis risk.
    ACE inhibitors with potassium-sparing diuretics can cause hyperkalemia.
    NSAIDs reduce antihypertensive effectiveness and increase renal toxicity.
    Ciprofloxacin raises theophylline levels requiring dose reduction.
    Azithromycin prolongs QT interval — avoid with other QT-prolonging drugs.
  `,
  diabetes: `
    Type 2 Diabetes first-line: Metformin 500mg twice daily, titrate to 2000mg/day.
    For CKD Stage 3 (eGFR 30-60): reduce Metformin dose, monitor renal function.
    Metformin contraindicated when eGFR below 30 mL/min.
    HbA1c target most adults under 7%. Elderly with comorbidities under 8%.
    SGLT2 inhibitors (Dapagliflozin, Empagliflozin) offer cardiovascular protection.
    GLP-1 agonists (Liraglutide) reduce weight and cardiovascular events.
  `,
  dosage: `
    Maximum safe Paracetamol dose adults: 4g per day (1g four times daily).
    Reduce Paracetamol to 2g daily in liver disease or chronic alcohol use.
    Standard Amoxicillin for community-acquired pneumonia: 500mg three times daily 5-7 days.
    Azithromycin for CAP: 500mg day one, then 250mg days two through five.
    Nitrofurantoin for UTI: 100mg twice daily 5-7 days. Avoid if eGFR under 45.
    Atorvastatin usual starting dose: 10-20mg once daily at bedtime.
  `,
};

/**
 * Answer a doctor's clinical question using Hugging Face QA model
 */
const answerClinicalQuestion = async (question) => {
  const context  = selectContext(question);

  try {
    const response = await axios.post(
      `${HF_API_BASE}/${HF_MODEL_QA}`,
      { inputs: { question, context } },
      {
        headers: {
          Authorization:  `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: HF_TIMEOUT,
      }
    );

    const { answer, score } = response.data;

    return {
      answer,
      confidence: score >= 0.7 ? 'HIGH' : score >= 0.4 ? 'MEDIUM' : 'LOW',
      disclaimer: '📋 For reference only. Always apply clinical judgment.',
      source:     'AI Clinical Assistant (Hugging Face)',
    };

  } catch (err) {
    // Keyword-based fallback answer
    return {
      answer:     getKeywordFallbackAnswer(question),
      confidence: 'KEYWORD_MATCH',
      disclaimer: '⚠️ AI service unavailable. Keyword-matched response.',
      source:     'Local Knowledge Base',
    };
  }
};

const selectContext = (question) => {
  const lower = question.toLowerCase();
  if (/interact|combination|together|with/i.test(lower)) return MEDICAL_CONTEXT.drug_interactions;
  if (/diabetes|metformin|insulin|glucose/i.test(lower))  return MEDICAL_CONTEXT.diabetes;
  return Object.values(MEDICAL_CONTEXT).join(' ').substring(0, 2000);
};

const getKeywordFallbackAnswer = (question) => {
  if (/paracetamol.*dose|dose.*paracetamol/i.test(question))
    return 'Max 4g/day in adults (1g QID). Reduce to 2g/day in liver disease.';
  if (/metformin.*ckd|ckd.*metformin/i.test(question))
    return 'Reduce dose for eGFR 30-60. Contraindicated if eGFR < 30.';
  if (/warfarin.*aspirin|aspirin.*warfarin/i.test(question))
    return 'Increased bleeding risk. Monitor INR closely. Use with caution.';
  return 'Please consult clinical guidelines. AI assistant temporarily unavailable.';
};

module.exports = { answerClinicalQuestion };
```

### Hugging Face Rate Limit Management

```javascript
// server/services/ai/hfRateLimiter.js
// Protects free tier quota (~30,000 req/month = ~1,000/day = ~40/hour)

const pThrottle = require('p-throttle');  // npm: p-throttle (free)

// Throttle: max 10 Hugging Face calls per minute (conservative)
const throttledHFCall = pThrottle(
  { limit: 10, interval: 60000 }
)(async (url, body, headers) => {
  return axios.post(url, body, { headers, timeout: HF_TIMEOUT });
});

// Pre-warm the model on server start to avoid cold-start in first consultation
const preWarmNERModel = async () => {
  try {
    console.log('[HF] Pre-warming NER model...');
    await extractMedicalEntities('Patient reports chest pain and fever.');
    console.log('[HF] NER model warm and ready.');
  } catch (_) {
    console.warn('[HF] Pre-warm failed — model will warm on first request (~20s delay).');
  }
};

// Call on server startup
// server/server.js: setTimeout(preWarmNERModel, 5000);

module.exports = { throttledHFCall, preWarmNERModel };
```

---

## 8. API-06 · OpenStreetMap Tile API

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          OpenStreetMap Tile Server                                 │
│  Base URL:     https://tile.openstreetmap.org/{z}/{x}/{y}.png           │
│  Cost:         $0.00 — Free forever (community-maintained)              │
│  Rate Limit:   Fair use policy — max 2 requests/second per IP           │
│  Usage Policy: tile.openstreetmap.org/usage-policy.html                 │
│  Attribution:  Must display "© OpenStreetMap contributors"              │
│  Integration:  Leaflet.js (free, open-source map library)               │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation — Hospital Finder Map

```javascript
// client/src/pages/patient/HospitalFinderPage.jsx
// Cost: $0.00 — Leaflet + OpenStreetMap (both free/open-source)

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { patientService } from '@services/patientService';

const HospitalFinderPage = () => {
  const mapRef       = useRef(null);
  const leafletMap   = useRef(null);
  const [hospitals,  setHospitals]  = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [geoError,   setGeoError]   = useState(null);

  // ── Initialize Leaflet Map ────────────────────────────────────────────
  useEffect(() => {
    if (leafletMap.current) return;  // Already initialized

    leafletMap.current = L.map(mapRef.current, {
      center: [20.5937, 78.9629],  // Centre of India (before GPS is granted)
      zoom:   5,
    });

    // OpenStreetMap tiles (free, attribution required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:     19,
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // ── Request GPS & Load Hospitals ──────────────────────────────────────
  const requestLocationAndLoad = () => {
    setLoading(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setUserCoords({ lat, lng });

        // Centre map on user's location
        leafletMap.current.setView([lat, lng], 14);

        // Add user location marker
        L.marker([lat, lng], {
          icon: L.divIcon({
            html: '<div class="user-pin">📍 You</div>',
            className: '',
          }),
        }).addTo(leafletMap.current);

        // Fetch nearby hospitals from backend (which calls Overpass API)
        try {
          const data = await patientService.getNearbyHospitals({ lat, lng, radius: 5000 });
          setHospitals(data.hospitals);
          renderHospitalPins(data.hospitals);
        } catch (err) {
          console.error('[HospitalFinder] Failed to load hospitals:', err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setGeoError('Location access denied. Please enable GPS and try again.');
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // ── Render Hospital Pins on Map ───────────────────────────────────────
  const renderHospitalPins = (hospitalList) => {
    hospitalList.forEach((hospital) => {
      const popup = L.popup().setContent(`
        <div class="hospital-popup">
          <h3 class="font-bold">${hospital.name}</h3>
          <p>📍 ${hospital.distance}m away</p>
          <p>⭐ ${hospital.rating || 'No rating'}</p>
          <p>⏱️ Est. wait: ${hospital.waitTime || 'Unknown'}</p>
          ${hospital.specialties?.length
            ? `<p>🏥 ${hospital.specialties.slice(0, 3).join(', ')}</p>`
            : ''}
          <button
            onclick="window.open('/patient/book?hospital=${hospital.id}', '_self')"
            class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
          >
            Book Appointment
          </button>
        </div>
      `);

      L.marker([hospital.lat, hospital.lng])
        .bindPopup(popup)
        .addTo(leafletMap.current);
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Nearby Hospitals</h1>
        <button
          onClick={requestLocationAndLoad}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          {loading ? '🔍 Finding hospitals...' : '📍 Use My Location'}
        </button>
        {geoError && <p className="mt-2 text-red-500 text-sm">{geoError}</p>}
      </div>
      <div ref={mapRef} className="flex-1" style={{ minHeight: '400px' }} />
    </div>
  );
};

export default HospitalFinderPage;
```

---

## 9. API-07 · Overpass API (Hospital Data)

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          Overpass API (OpenStreetMap Query API)                   │
│  Base URL:     https://overpass-api.de/api/interpreter                  │
│  Cost:         $0.00 — Free public endpoint                             │
│  Rate Limit:   Fair use — ideally < 1 request every 10 seconds per IP  │
│  Data:         Real hospital and clinic data from OpenStreetMap          │
│  Format:       JSON (QL query language)                                 │
│  Docs:         https://wiki.openstreetmap.org/wiki/Overpass_API         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// server/services/hospitalService.js
// Cost: $0.00 — Overpass API is free (part of OpenStreetMap infrastructure)

const axios     = require('axios');
const NodeCache = require('node-cache');

// Cache hospital results per location (10-minute TTL per coordinate)
const hospitalCache = new NodeCache({ stdTTL: 600 }); // 10 minutes

/**
 * Fetch nearby hospitals and clinics using Overpass API
 * @param {number} lat     - Latitude
 * @param {number} lng     - Longitude
 * @param {number} radius  - Search radius in meters (default 5000m = 5km)
 * @returns {Promise<Array>} List of hospitals with name, coords, amenity type
 */
const getNearbyHospitals = async (lat, lng, radius = 5000) => {
  // Round coordinates to 3dp for cache key (≈ 111m precision)
  const cacheKey = `hospitals:${lat.toFixed(3)}:${lng.toFixed(3)}:${radius}`;
  const cached   = hospitalCache.get(cacheKey);
  if (cached) return cached;

  // ── Overpass QL Query ─────────────────────────────────────────────────
  // Searches for hospitals, clinics, doctors, and health centres nearby
  const overpassQuery = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="doctors"](around:${radius},${lat},${lng});
      node["amenity"="health_centre"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="clinic"](around:${radius},${lat},${lng});
    );
    out center meta;
  `.trim();

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(overpassQuery)}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,  // Overpass can be slow on complex queries
      }
    );

    const facilities = parseOverpassResponse(response.data.elements, lat, lng);

    hospitalCache.set(cacheKey, facilities);
    return facilities;

  } catch (err) {
    console.error('[Overpass] API error:', err.message);
    // Fallback: return seeded hospital data for the nearest Phase 1 city
    return getSeededFallbackHospitals(lat, lng);
  }
};

/**
 * Parse Overpass API response into standardized facility objects
 */
const parseOverpassResponse = (elements, userLat, userLng) => {
  return elements
    .filter(el => el.tags?.name)  // Only named facilities
    .map(el => {
      const facilityLat = el.lat || el.center?.lat;
      const facilityLng = el.lon || el.center?.lon;

      return {
        id:         el.id,
        name:       el.tags.name,
        type:       el.tags.amenity,
        lat:        facilityLat,
        lng:        facilityLng,
        distance:   calculateDistance(userLat, userLng, facilityLat, facilityLng),
        phone:      el.tags.phone || el.tags['contact:phone'] || null,
        website:    el.tags.website || null,
        openingHours: el.tags.opening_hours || null,
        emergency:  el.tags.emergency === 'yes',
        specialties: [],   // Overpass doesn't provide specialties — pulled from DB
        rating:     null,  // OSM doesn't have ratings — could enrich from doctor DB
        waitTime:   null,  // Estimated from appointment data in future
      };
    })
    .sort((a, b) => a.distance - b.distance)  // Nearest first
    .slice(0, 20);  // Max 20 results
};

/**
 * Haversine formula: distance between two GPS coordinates in metres
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R   = 6371000;  // Earth radius in metres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a   = Math.sin(dLat/2) ** 2 +
              Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
              Math.sin(dLng/2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

/**
 * Fallback: seeded hospital data when Overpass is unavailable
 */
const getSeededFallbackHospitals = (lat, lng) => {
  const PHASE1_HOSPITALS = [
    { name: 'Apollo Hospital Chennai', lat: 13.0765, lng: 80.2106,
      city: 'Chennai', type: 'hospital', emergency: true },
    { name: 'Manipal Hospital Bangalore', lat: 12.9698, lng: 77.6499,
      city: 'Bangalore', type: 'hospital', emergency: true },
    { name: 'Kokilaben Hospital Mumbai', lat: 19.1300, lng: 72.8260,
      city: 'Mumbai', type: 'hospital', emergency: true },
    { name: 'KIMS Hospital Hyderabad', lat: 17.4432, lng: 78.3498,
      city: 'Hyderabad', type: 'hospital', emergency: true },
    // ... add more per city
  ];

  return PHASE1_HOSPITALS
    .map(h => ({ ...h, distance: calculateDistance(lat, lng, h.lat, h.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
};

module.exports = { getNearbyHospitals };
```

---

## 10. API-08 · Geolocation API

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          Browser Geolocation API (navigator.geolocation)          │
│  Provider:     Browser-native (device GPS + network positioning)        │
│  Cost:         $0.00 — Browser API, no key required                     │
│  Rate Limit:   None                                                      │
│  Accuracy:     ~10m with GPS · ~100m with WiFi · ~1km with cell towers  │
│  Permission:   Browser prompts user on first request                    │
│  Privacy:      Location NOT stored on MediVoice AI servers              │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// client/src/hooks/useGeolocation.js
// Cost: $0.00 — Browser API

import { useState, useCallback } from 'react';

/**
 * Hook for requesting and managing device GPS location
 * @returns {{ coords, loading, error, requestLocation, clearLocation }}
 */
const useGeolocation = () => {
  const [coords,  setCoords]  = useState(null);  // { lat, lng, accuracy }
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat:      position.coords.latitude,
          lng:      position.coords.longitude,
          accuracy: position.coords.accuracy,  // Metres
        });
        setLoading(false);
      },
      (err) => {
        const MESSAGES = {
          1: 'Location access denied. Please allow location in browser settings.',
          2: 'Location unavailable. Please check GPS is enabled.',
          3: 'Location request timed out. Please try again.',
        };
        setError(MESSAGES[err.code] || 'Unable to determine your location.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,   // Use GPS (more accurate but slower)
        timeout:            10000,  // 10 second timeout
        maximumAge:         60000,  // Accept cached position up to 1 minute old
      }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setError(null);
  }, []);

  return { coords, loading, error, requestLocation, clearLocation };
};

export default useGeolocation;
```

---

## 11. API-09 · Gmail SMTP via Nodemailer

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Service:      Nodemailer + Gmail SMTP                                   │
│  SMTP Host:    smtp.gmail.com:587 (STARTTLS)                            │
│  Cost:         $0.00 — Gmail SMTP free tier                             │
│  Rate Limit:   500 emails/day per Gmail account                         │
│  Auth:         Gmail App Password (NOT your regular Gmail password)     │
│  Setup:        Google Account → Security → 2-Step → App Passwords       │
│  Use Cases:    OTP delivery · Registration confirmation · Password reset │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// server/config/mailer.js
// Cost: $0.00 — Gmail SMTP is free up to 500 emails/day

const nodemailer = require('nodemailer');

// ── Gmail SMTP Transporter ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,          // Use STARTTLS (upgrades to TLS after connect)
  auth: {
    user: process.env.EMAIL_USER,  // Gmail address
    pass: process.env.EMAIL_PASS,  // Gmail App Password (16-char)
  },
  tls: {
    rejectUnauthorized: true,  // Verify Gmail's TLS certificate
  },
  pool:           true,    // Connection pooling for multiple sends
  maxConnections: 3,       // Max concurrent SMTP connections
  maxMessages:    100,     // Max messages per connection before reconnect
  rateDelta:      1000,    // Wait 1s between sends (respect Gmail rate limits)
  rateLimit:      5,       // Max 5 messages per rateDelta window
});

// ── Verify connection on server start ─────────────────────────────────────
const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅ Gmail SMTP connected and ready.');
  } catch (err) {
    console.error('❌ Gmail SMTP connection failed:', err.message);
    console.error('   Check EMAIL_USER and EMAIL_PASS environment variables.');
  }
};

// ── Email Templates ────────────────────────────────────────────────────────
const EMAIL_TEMPLATES = {
  otp_verify: (code) => ({
    subject: 'MediVoice AI — Verify Your Email',
    html: buildOTPEmail(code, 'email verification', '#1A56DB'),
  }),
  otp_reset: (code) => ({
    subject: 'MediVoice AI — Reset Your Password',
    html: buildOTPEmail(code, 'password reset', '#E02424'),
  }),
};

const buildOTPEmail = (code, purpose, accentColor) => `
  <!DOCTYPE html>
  <html lang="en">
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:40px 20px;">
        <table width="480" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr><td style="background:${accentColor};padding:24px 32px;">
            <h1 style="color:white;margin:0;font-size:22px;">🎙️ MediVoice AI</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px;">
              AI-Powered Healthcare Communication
            </p>
          </td></tr>

          <!-- Body -->
          <tr><td style="padding:32px;">
            <h2 style="color:#111928;font-size:18px;margin:0 0 12px;">
              Your ${purpose} code
            </h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Use the code below to complete your ${purpose}.
              This code expires in <strong>10 minutes</strong>.
            </p>

            <!-- OTP Box -->
            <div style="background:#F3F4F6;border:2px solid ${accentColor};border-radius:8px;
                        padding:20px;text-align:center;margin:0 0 24px;">
              <div style="font-size:40px;font-weight:bold;letter-spacing:16px;
                          color:${accentColor};font-family:monospace;">
                ${code}
              </div>
            </div>

            <p style="color:#E02424;font-size:13px;font-weight:bold;margin:0 0 12px;">
              ⏰ Expires in 10 minutes. Do not share this code.
            </p>
            <p style="color:#9CA3AF;font-size:12px;margin:0;">
              If you did not request this, please ignore this email.
            </p>
          </td></tr>

          <!-- Footer -->
          <tr><td style="background:#F9FAFB;padding:16px 32px;border-top:1px solid #E5E7EB;">
            <p style="color:#9CA3AF;font-size:11px;text-align:center;margin:0;">
              MediVoice AI · Connecting Patients and Doctors Across India
            </p>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>
`;

/**
 * Send an OTP email
 * @param {string} to    - Recipient email address
 * @param {string} code  - Raw 6-digit OTP code (never hashed here)
 * @param {string} type  - 'otp_verify' | 'otp_reset'
 */
const sendOTPEmail = async (to, code, type = 'otp_verify') => {
  const template = EMAIL_TEMPLATES[type](code);

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `MediVoice AI <${process.env.EMAIL_USER}>`,
    to,
    subject: template.subject,
    html:    template.html,
  });

  console.log(`[Mailer] OTP email sent to ${to} (type: ${type})`);
};

module.exports = { transporter, sendOTPEmail, verifyMailer };
```

---

## 12. API-10 · Browser Push Notifications API

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  API:          Browser Push Notifications API (Notification interface)  │
│  Provider:     Browser-native (Android Chrome · Desktop Chrome/Edge)    │
│  Cost:         $0.00 — Browser API, no service worker key needed        │
│  Rate Limit:   None                                                      │
│  Coverage:     Chrome (Android + Desktop) · Edge · Firefox              │
│  NOT supported: Safari iOS (use in-app toast as fallback)               │
│  Permission:   User must grant notification permission                  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// client/src/utils/pushNotifications.js
// Cost: $0.00 — Browser Notifications API

/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} true if granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('[Notifications] Not supported in this browser.');
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied')  return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/**
 * Show a browser notification immediately
 * @param {string} title   - Notification title
 * @param {string} body    - Notification body text
 * @param {string} icon    - Icon URL (optional)
 * @param {object} data    - Custom data (optional, for click handling)
 */
export const showNotification = (title, body, icon = '/icons/icon-192x192.png', data = {}) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon,
    badge:     '/icons/icon-72x72.png',
    tag:       data.type || 'medivoice',  // Replaces older notification of same tag
    renotify:  true,
    data,
  });

  // Handle click — navigate to relevant page
  notification.onclick = () => {
    window.focus();
    if (data.url) window.location.href = data.url;
    notification.close();
  };
};

/**
 * Schedule a notification at a future time
 * @param {object} reminder - Reminder object from DB
 * @param {number} delayMs  - Milliseconds until notification fires
 */
export const scheduleReminderNotification = (reminder, delayMs) => {
  if (delayMs < 0 || delayMs > 24 * 60 * 60 * 1000) return; // Skip if > 24 hrs away

  setTimeout(() => {
    showNotification(
      reminder.notificationTitle || `💊 Medication Reminder`,
      reminder.notificationBody  || `Time to take ${reminder.drugName} ${reminder.dose}`,
      '/icons/pill-icon.png',
      { type: 'medication', url: '/patient/reminders' }
    );
  }, delayMs);

  console.log(`[Reminders] Scheduled: ${reminder.drugName} at ${reminder.scheduledTime}`);
};

/**
 * Schedule all active reminders for today
 * Called once on patient login
 */
export const scheduleAllTodayReminders = (reminders) => {
  const now = new Date();

  reminders
    .filter(r => r.active)
    .forEach(reminder => {
      const [hours, minutes] = reminder.scheduledTime.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      const delayMs = reminderTime.getTime() - now.getTime();
      if (delayMs > 0) {
        scheduleReminderNotification(reminder, delayMs);
      }
    });
};
```

---

## 13. API-11 · MongoDB Atlas (Free Tier)

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Service:      MongoDB Atlas M0 Cluster                                  │
│  Cost:         $0.00 forever — M0 is permanently free                   │
│  Storage:      512MB included                                            │
│  RAM:          Shared (adequate for MVP — ~500 users)                   │
│  Region:       Mumbai (ap-south-1) — closest to all 8 Phase 1 cities    │
│  Connections:  Max 500 concurrent (we use pool of 5)                    │
│  Backups:      Automated daily snapshots (included free)                │
│  TLS:          Enabled by default — all connections encrypted           │
│  Docs:         https://www.mongodb.com/atlas/database                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Connection Implementation

```javascript
// server/config/db.js
// Cost: $0.00 — MongoDB Atlas M0 free tier

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // ── Connection Pool ────────────────────────────────────────────────
      maxPoolSize:     5,      // Conservative for M0 shared tier
      minPoolSize:     1,
      maxIdleTimeMS:   30000,  // Close idle connections after 30s

      // ── Timeouts ───────────────────────────────────────────────────────
      serverSelectionTimeoutMS: 5000,   // Fail fast if Atlas unreachable
      socketTimeoutMS:          45000,  // Close idle sockets after 45s
      connectTimeoutMS:         10000,  // Initial connection timeout

      // ── Security ───────────────────────────────────────────────────────
      tls:         true,        // Enforce TLS for all connections
      retryWrites: true,        // Auto-retry on transient write failures
      w:           'majority',  // Wait for majority of nodes to confirm write

      // ── Performance ────────────────────────────────────────────────────
      compressors: ['zlib'],    // Compress data over the wire
    });

    console.log(`✅ MongoDB Atlas connected (${mongoose.connection.host})`);
  } catch (err) {
    console.error('❌ MongoDB Atlas connection failed:', err.message);
    process.exit(1);  // Exit — database is not optional
  }
};

// ── Connection event monitoring ────────────────────────────────────────────
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Mongoose will auto-retry...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

// ── Security: Prevent mongoose prototype pollution ─────────────────────────
mongoose.set('sanitizeFilter', true);   // Strip $ operators from query filters

module.exports = connectDB;
```

---

## 14. API-12 · tel: Protocol (SOS)

### Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Protocol:     tel: URI scheme (RFC 5341)                                │
│  Cost:         $0.00 — Browser-native URI handler                       │
│  Rate Limit:   None — direct device phone call                          │
│  Use Case:     SOS emergency button → direct call to 108 ambulance      │
│  Mobile:       Opens native phone dialer with 108 pre-filled            │
│  Desktop:      Falls back to modal showing 108 number                   │
│  No server:    Zero server involvement — client-only                    │
└──────────────────────────────────────────────────────────────────────────┘
```

### Implementation

```javascript
// client/src/components/common/SOSButton.jsx
// Cost: $0.00 — tel: protocol is browser-native

import { useState } from 'react';

const SOS_NUMBER = '108';  // India National Emergency Ambulance Service

const SOSButton = () => {
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  const handleSOSClick = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: Direct phone call to 108
      window.location.href = `tel:${SOS_NUMBER}`;
    } else {
      // Desktop: Show number prominently in modal
      setShowDesktopModal(true);
    }
  };

  return (
    <>
      {/* Persistent SOS Button — fixed bottom-right on all patient pages */}
      <button
        onClick={handleSOSClick}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full
                   bg-red-600 text-white font-bold text-xs
                   shadow-lg shadow-red-300
                   animate-pulse hover:animate-none hover:scale-110
                   transition-transform duration-150
                   flex flex-col items-center justify-center gap-0.5"
        aria-label="SOS Emergency — Call 108"
        title="Emergency: Call 108"
      >
        <span className="text-lg">🆘</span>
        <span>SOS</span>
      </button>

      {/* Desktop fallback modal */}
      {showDesktopModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border-4 border-red-600">
            <h2 className="text-2xl font-bold text-red-600 text-center mb-2">🚨 Emergency</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Call the National Ambulance Service immediately:
            </p>

            {/* Large prominent number */}
            <div className="text-6xl font-bold text-red-600 text-center tracking-widest mb-6">
              108
            </div>

            <div className="space-y-3">
              {/* Try tel: link even on desktop (some browsers support it) */}
              <a
                href={`tel:${SOS_NUMBER}`}
                className="block w-full py-3 text-center font-bold text-white
                           bg-red-600 rounded-xl text-lg"
              >
                📞 Call 108
              </a>

              <button
                onClick={() => navigator.clipboard.writeText(SOS_NUMBER)}
                className="block w-full py-2 text-center text-gray-600
                           border border-gray-300 rounded-xl text-sm"
              >
                📋 Copy Number
              </button>

              <button
                onClick={() => setShowDesktopModal(false)}
                className="block w-full py-2 text-center text-gray-400 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
```

---

## 15. Internal REST API Design

### API Design Standards

```
REST API CONVENTIONS
═══════════════════════════════════════════════════════════════════════

Base URL:     https://api.medivoice.ai/api/v1   (production)
              http://localhost:5000/api/v1        (development)

Auth:         JWT via httpOnly cookie (withCredentials: true)
Format:       application/json — request and response
Versioning:   URL-based (/v1/) — new versions don't break old clients

URL Naming:
  ✅ GET  /patients/appointments       (list)
  ✅ GET  /patients/appointments/:id   (single)
  ✅ POST /patients/appointments       (create)
  ✅ PATCH /patients/appointments/:id  (update)
  ✅ DELETE /patients/appointments/:id (delete)
  ✅ POST /consultations/:id/generate-notes (action)
  ❌ GET /getPatientAppointments        (no verbs in URL)
  ❌ POST /appointment_create           (no underscores in URL)

Response Envelope:
  Success:
  {
    "success": true,
    "message": "Appointment booked successfully",
    "data": { ... },
    "pagination": {           ← Only when returning lists
      "page": 1,
      "limit": 10,
      "total": 47,
      "pages": 5
    }
  }

  Error:
  {
    "success": false,
    "error": {
      "code":    "SLOT_UNAVAILABLE",
      "message": "This time slot is no longer available.",
      "fields":  { "scheduledAt": "Slot taken" }  ← Only for validation errors
    }
  }
```

### Complete Route Reference

```javascript
// ── AUTH ROUTES (/api/v1/auth) ────────────────────────────────────────────

POST   /auth/signup             → Register (any role)
POST   /auth/verify-otp         → Verify email OTP
POST   /auth/resend-otp         → Resend OTP (rate-limited)
POST   /auth/login              → Login → JWT cookie
POST   /auth/logout             → Clear session
GET    /auth/me                 → Current user (JWT required)
POST   /auth/forgot-password    → Request password reset OTP
POST   /auth/reset-password     → Reset with OTP + new password

// ── PATIENT ROUTES (/api/v1/patients) ────────────────────────────────────
// All require: authMiddleware + roleGuard('patient')

GET    /patients/profile                       → Own profile
PATCH  /patients/profile                       → Update profile
GET    /patients/appointments                  → List appointments (paginated)
GET    /patients/appointments/:id              → Single appointment
POST   /patients/appointments                  → Book new appointment
PATCH  /patients/appointments/:id/cancel       → Cancel appointment
GET    /patients/consultations                 → Medical history (paginated)
GET    /patients/consultations/:id             → Single consultation
GET    /patients/consultations/:id/transcript  → Transcript lines only
GET    /patients/prescriptions                 → All prescriptions (paginated)
GET    /patients/prescriptions/:id             → Single prescription
GET    /patients/reminders                     → Active medication reminders
PATCH  /patients/reminders/:id                 → Update reminder time
DELETE /patients/reminders/:id                 → Delete reminder
POST   /patients/chat                          → AI chatbot message
GET    /patients/hospitals                     → Nearby hospitals (lat/lng query)

// ── DOCTOR ROUTES (/api/v1/doctors) ──────────────────────────────────────

// Public (no auth required):
GET    /doctors/search                         → Search doctors (specialty, city)
GET    /doctors/:id/profile                    → Doctor public profile
GET    /doctors/:id/slots                      → Available booking slots

// Protected (/me - requires auth + doctor role):
GET    /doctors/me/profile                     → Own full profile
PATCH  /doctors/me/profile                     → Update own profile
PATCH  /doctors/me/status                      → Set status (available/busy/leave)
GET    /doctors/me/queue                       → Today's patient queue
GET    /doctors/me/appointments                → All appointments (paginated)
PATCH  /doctors/me/appointments/:id            → Update appointment status
GET    /doctors/me/patients/:id/history        → Scoped patient history
POST   /doctors/me/consultations/:id/generate-notes  → AI SOAP generation
PATCH  /doctors/me/consultations/:id/notes     → Edit + confirm SOAP note
POST   /doctors/me/prescriptions               → Create prescription
PATCH  /doctors/me/prescriptions/:id          → Edit prescription
POST   /doctors/me/assistant                   → AI doctor QA query
GET    /doctors/me/analytics                   → Practice analytics
PATCH  /doctors/me/availability                → Update schedule config

// ── ADMIN ROUTES (/api/v1/admin) ─────────────────────────────────────────
// All require: authMiddleware + roleGuard('admin')

GET    /admin/stats                            → Platform stats
GET    /admin/users                            → All users (paginated, filtered)
GET    /admin/users/:id                        → Single user detail
PATCH  /admin/users/:id/deactivate             → Deactivate account
PATCH  /admin/users/:id/reactivate             → Reactivate account
PATCH  /admin/users/:id/ban                    → Permanently ban
PATCH  /admin/doctors/:id/verify               → Verify doctor credentials
GET    /admin/security-logs                    → Security events (paginated)
POST   /admin/users/:id/force-logout           → Terminate user session
```

### Request/Response Examples

```javascript
// ── POST /api/v1/patients/appointments ────────────────────────────────────

// Request:
{
  "doctorId":       "64abc123def456",
  "scheduledAt":    "2026-05-15T10:30:00.000Z",
  "chiefComplaint": "Persistent chest pain for 3 days"
}

// Success Response (201 Created):
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "appointment": {
      "id":             "64xyz789",
      "doctorId":       "64abc123def456",
      "scheduledAt":    "2026-05-15T10:30:00.000Z",
      "status":         "confirmed",
      "patientRiskLevel": "YELLOW",
      "durationMinutes": 30,
      "doctor": {
        "name":      "Dr. Priya Sharma",
        "specialty": "Cardiologist",
        "city":      "Hyderabad"
      }
    }
  }
}

// Error Response (409 Conflict — slot taken):
{
  "success": false,
  "error": {
    "code":    "SLOT_UNAVAILABLE",
    "message": "This time slot is no longer available. Please choose another."
  }
}

// ── GET /api/v1/doctors/search?specialty=Cardiologist&city=Hyderabad ──────

// Response (200 OK):
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id":           "64abc123",
        "name":         "Dr. Priya Sharma",
        "specialty":    "Cardiologist",
        "city":         "Hyderabad",
        "rating":       4.7,
        "experience":   12,
        "languages":    ["te", "hi", "en"],
        "isVerified":   true,
        "status":       "available",
        "nextSlot":     "2026-05-15T09:00:00.000Z"
      }
    ]
  },
  "pagination": { "page": 1, "limit": 10, "total": 5, "pages": 1 }
}
```

---

## 16. Internal WebSocket API Design

### Socket.io Event Reference

```javascript
// WebSocket API — All events documented

const SOCKET_EVENTS = {

  // ── CLIENT → SERVER ─────────────────────────────────────────────────────
  CLIENT: {

    JOIN_CONSULTATION: {
      event:   'join:consultation',
      payload: { consultationId: 'string' },
      auth:    'JWT cookie (httpOnly)',
      effect:  'socket.join(`consultation:${consultationId}`)',
    },

    TRANSCRIPT_PATIENT: {
      event:   'transcript:patient',
      payload: {
        consultationId: 'string',
        text:           'string (max 1000 chars)',
        sourceLang:     'string (BCP-47 e.g., hi-IN)',
        targetLang:     'string (BCP-47 e.g., ta-IN)',
      },
      effect: 'Server translates → broadcasts transcript:from-patient to room',
    },

    TRANSCRIPT_DOCTOR: {
      event:   'transcript:doctor',
      payload: {
        consultationId: 'string',
        text:           'string (max 1000 chars)',
        sourceLang:     'string (BCP-47)',
        targetLang:     'string (BCP-47)',
      },
      effect: 'Server translates → broadcasts transcript:from-doctor to room',
    },

    CONSULTATION_SAVE: {
      event:   'consultation:save',
      payload: { consultationId: 'string' },
      effect:  'Saves full transcript array to MongoDB',
    },

    CONSULTATION_END: {
      event:   'consultation:end',
      payload: { consultationId: 'string' },
      effect:  'Marks consultation complete → triggers AI SOAP generation',
    },

    JOIN_NOTIFICATIONS: {
      event:   'join:notifications',
      payload: { userId: 'string' },
      effect:  'socket.join(`user:${userId}`) for personal notifications',
    },
  },

  // ── SERVER → CLIENT ─────────────────────────────────────────────────────
  SERVER: {

    TRANSCRIPT_FROM_PATIENT: {
      event:   'transcript:from-patient',
      payload: {
        original:   'string (patient\'s original speech)',
        translated: 'string (in doctor\'s language)',
        speaker:    '"Patient"',
        sourceLang: 'string',
        targetLang: 'string',
        timestamp:  'ISO date string',
        isRisky:    'boolean',
      },
      recipients: 'Doctor only (in consultation room)',
    },

    TRANSCRIPT_FROM_DOCTOR: {
      event:   'transcript:from-doctor',
      payload: {
        original:   'string (doctor\'s original speech)',
        translated: 'string (in patient\'s language)',
        speaker:    '"Doctor"',
        sourceLang: 'string',
        targetLang: 'string',
        timestamp:  'ISO date string',
      },
      recipients: 'Patient only (in consultation room)',
    },

    RISK_ALERT: {
      event:   'risk:alert',
      payload: {
        level:       '"RED" | "YELLOW"',
        condition:   'string (description of detected risk)',
        message:     'string (human-readable alert text)',
        callToAction: '"CALL_108" | "URGENT_APPOINTMENT" | "BOOK_APPOINTMENT"',
      },
      recipients: 'Both patient and doctor in consultation room',
    },

    CONSULTATION_NOTES_READY: {
      event:   'consultation:notes-ready',
      payload: { consultationId: 'string', soapNoteId: 'string' },
      recipients: 'Doctor only',
    },

    NOTIFICATION_PUSH: {
      event:   'notification:push',
      payload: {
        type:    '"appointment_reminder" | "prescription_ready" | "medication_time"',
        title:   'string',
        body:    'string',
        data:    'object (custom payload)',
        url:     'string (navigation target)',
      },
      recipients: 'Specific user (via user:${userId} room)',
    },

    SESSION_INVALIDATED: {
      event:   'session:invalidated',
      payload: { reason: 'string' },
      recipients: 'Previous session device (when new login occurs)',
    },

    ERROR_SOCKET: {
      event:   'error:socket',
      payload: {
        code:    '"ROOM_FORBIDDEN" | "CONSULTATION_NOT_ACTIVE" | "INVALID_INPUT"',
        message: 'string',
      },
      recipients: 'Requesting socket only',
    },
  },
};
```

---

## 17. API Rate Limit Dashboard

### Complete Rate Limit Reference

| API | Free Limit | Our Usage | Safety Buffer | Status |
|---|---|---|---|---|
| Web Speech API | Unlimited | ~20 calls/consultation | ∞ | ✅ Safe |
| Web Speech Synthesis | Unlimited | ~10 calls/consultation | ∞ | ✅ Safe |
| LibreTranslate | ~20 req/min | ~1 req/sentence | 20× headroom | ✅ Safe |
| MyMemory (with email) | 10K words/day | Emergency fallback only | 10K words/day | ✅ Safe |
| Hugging Face (NER) | ~30K req/month | Cached — est. 5K real calls/month | 6× headroom | ✅ Safe |
| Hugging Face (QA) | ~30K req/month | ~500 queries/month | 60× headroom | ✅ Safe |
| OpenStreetMap Tiles | Fair use (~256 tiles/page) | Standard map load | Generous | ✅ Safe |
| Overpass API | Fair use (~1 req/10s) | 1 call per hospital search | Session cached | ✅ Safe |
| Gmail SMTP | 500 emails/day | ~20 emails/day (MVP scale) | 25× headroom | ✅ Safe |
| Browser Push | Unlimited | On events only | ∞ | ✅ Safe |
| MongoDB Atlas M0 | 512MB storage | ~28MB at 500 users | 18× headroom | ✅ Safe |
| tel: Protocol | Unlimited | Only on SOS tap | ∞ | ✅ Safe |

### Quota Monitoring

```javascript
// server/utils/quotaMonitor.js
// Track Hugging Face usage to prevent hitting free tier limit

const NodeCache = require('node-cache');
const quotaCache = new NodeCache({ stdTTL: 86400 }); // Reset daily

const HF_DAILY_LIMIT  = 1000;  // Conservative (30K/month ÷ 30 = 1K/day)
const HF_ALERT_AT     = 800;   // Alert when 80% used

const trackHFCall = (type = 'ner') => {
  const key   = `hf_calls_${type}_${new Date().toDateString()}`;
  const count = (quotaCache.get(key) || 0) + 1;
  quotaCache.set(key, count);

  if (count === HF_ALERT_AT) {
    console.warn(`[QuotaMonitor] ⚠️  Hugging Face ${type.toUpperCase()} at 80% daily quota (${count}/${HF_DAILY_LIMIT})`);
  }

  return count;
};

const getRemainingHFQuota = (type = 'ner') => {
  const key   = `hf_calls_${type}_${new Date().toDateString()}`;
  const count = quotaCache.get(key) || 0;
  return Math.max(0, HF_DAILY_LIMIT - count);
};

const shouldUseHFOrFallback = (type = 'ner') => {
  // If quota < 10% remaining → use fallback for non-critical calls
  return getRemainingHFQuota(type) > HF_DAILY_LIMIT * 0.1;
};

module.exports = { trackHFCall, getRemainingHFQuota, shouldUseHFOrFallback };
```

---

## 18. API Fallback Chain

```
COMPLETE FALLBACK CHAIN — ALL CRITICAL APIS
═══════════════════════════════════════════════════════════════════════

SPEECH-TO-TEXT (ASR):
  Primary:    Web Speech API (Chrome) — unlimited, browser-native
      ↓ fails (non-Chrome browser)
  Fallback:   Text input textarea — always available
  Platform impact: Voice input disabled, text input works

TRANSLATION:
  Primary:    LibreTranslate public API (free, ~20 req/min)
      ↓ fails (rate limit or outage)
  Fallback 1: MyMemory API (free, 10K words/day with email)
      ↓ fails (quota exceeded)
  Fallback 2: Show original text with "[Translation unavailable]" notice
  Platform impact: Text shown in original language — minor degradation

MEDICAL NER:
  Primary:    Hugging Face d4data/biomedical-ner-all (free tier)
      ↓ fails (cold start / rate limit / outage)
  Fallback:   keywordFallbackNER() — local JavaScript, zero API cost
  Platform impact: Slightly less accurate entity extraction — transparent

CLINICAL QA (Doctor Assistant):
  Primary:    Hugging Face deepset/roberta-base-squad2 (free tier)
      ↓ fails
  Fallback:   Local keyword answer map (covers top 10 common queries)
  Platform impact: Limited to pre-loaded answers — notice shown to doctor

HOSPITAL DATA (Map):
  Primary:    Overpass API — real OpenStreetMap hospital data
      ↓ fails
  Fallback:   Seeded hospital list for 8 Phase 1 cities
  Platform impact: Less real-time data, but major hospitals still shown

EMAIL DELIVERY:
  Primary:    Gmail SMTP via Nodemailer (500 emails/day free)
      ↓ fails (SMTP error / quota)
  Fallback:   Retry queue (exponential backoff, 3 attempts)
      ↓ all retries fail
  Fallback 2: Log failure, show "Resend OTP" button to user
  Platform impact: Signup delayed — user can request resend

MAP TILES:
  Primary:    tile.openstreetmap.org (free, no key)
      ↓ fails
  Fallback:   Blank map with hospital list in card view (no tiles)
  Platform impact: Visual degradation only — hospital list still works

DATABASE:
  Primary:    MongoDB Atlas M0 (free, 512MB, Mumbai region)
      ↓ fails
  No fallback: Database is not optional
  Platform impact: 503 Service Unavailable — Mongoose will auto-retry
```

---

## 19. API Error Handling Strategy

### Centralized API Error Handler

```javascript
// server/utils/apiErrorHandler.js
// Standardized error handling for all external API calls

/**
 * Wrap an external API call with logging, retry, and fallback support
 * @param {Function} apiCall         - Async function making the external call
 * @param {Function} fallbackFn      - Function to call if apiCall fails
 * @param {string}   serviceName     - Name for logging (e.g., 'LibreTranslate')
 * @param {number}   maxRetries      - Number of retry attempts (default 1)
 * @returns {Promise<any>}           - API result or fallback result
 */
const withFallback = async (apiCall, fallbackFn, serviceName, maxRetries = 1) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await apiCall();
      if (attempt > 1) {
        console.log(`[${serviceName}] Succeeded on attempt ${attempt}`);
      }
      return result;
    } catch (err) {
      lastError = err;
      const status = err.response?.status;

      // ── Handle specific HTTP errors ────────────────────────────────────
      if (status === 429) {
        console.warn(`[${serviceName}] Rate limited (429). ${maxRetries - attempt + 1} retries left.`);
        if (attempt <= maxRetries) {
          await sleep(attempt * 2000);  // Exponential backoff: 2s, 4s, 6s
          continue;
        }
      }

      if (status === 503) {
        console.warn(`[${serviceName}] Service unavailable (503 — likely cold start).`);
        if (attempt <= maxRetries) {
          await sleep(attempt * 3000);  // Longer wait for cold start
          continue;
        }
      }

      if (status >= 500) {
        console.warn(`[${serviceName}] Server error (${status}). Trying fallback.`);
        break;
      }

      // 4xx errors (except 429) — don't retry, go to fallback
      console.error(`[${serviceName}] Client error (${status}):`, err.message);
      break;
    }
  }

  // ── Execute fallback ──────────────────────────────────────────────────
  if (fallbackFn) {
    console.warn(`[${serviceName}] Using fallback after failure:`, lastError?.message);
    try {
      return await fallbackFn();
    } catch (fallbackErr) {
      console.error(`[${serviceName}] Fallback also failed:`, fallbackErr.message);
      return null;
    }
  }

  console.error(`[${serviceName}] No fallback available. Returning null.`);
  return null;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = { withFallback };
```

### Usage Example

```javascript
// How withFallback is used in translateService.js

const { withFallback } = require('../../utils/apiErrorHandler');

const translateText = async (text, sourceLang, targetLang) => {
  return withFallback(
    () => callLibreTranslate(text, sourceLang, targetLang),  // Primary
    () => callMyMemory(text, sourceLang, targetLang),         // Fallback
    'LibreTranslate',
    2   // Max 2 retries before fallback
  );
};
```

---

## 20. API Testing Checklist

### External API Integration Tests

#### ASR — Web Speech API (API-01)
- [ ] Hindi speech → accurate Hindi text transcription (Chrome)
- [ ] Tamil speech → accurate Tamil text transcription (Chrome)
- [ ] Telugu, Malayalam, Kannada, Bengali speech transcription all working
- [ ] Interim text (streaming) appears within 300ms of speech start
- [ ] Auto-restart after 3-second silence works in continuous mode
- [ ] Non-Chrome browser → text input fallback renders correctly
- [ ] Microphone permission denial → clear error message shown

#### TTS — Web Speech Synthesis (API-02)
- [ ] Hindi text spoken aloud with correct accent
- [ ] Tamil, Telugu, Malayalam text spoken with matching voice
- [ ] `speak()` cancels previous utterance before starting new one
- [ ] `stop()` immediately halts ongoing speech
- [ ] Correct voice selected for each language (not English default)

#### Translation — LibreTranslate (API-03)
- [ ] Hindi → Tamil translation accurate for medical phrases
- [ ] Tamil → Hindi round-trip semantic preservation test
- [ ] All 6 language pairs tested bidirectionally
- [ ] Rate limit hit (429) → automatic switch to MyMemory in < 3s
- [ ] LibreTranslate down → MyMemory fallback activates transparently
- [ ] Translation cache working (second identical call returns cache hit)
- [ ] Pivot routing: Tamil → English → Telugu produces correct result

#### AI — Hugging Face NER (API-05)
- [ ] "I have chest pain and fever" → extracts: symptoms: ["chest pain", "fever"]
- [ ] "Taking Metformin 500mg" → extracts: medications: ["Metformin"]
- [ ] Cold start (503) → keyword fallback activates, user sees no error
- [ ] NER cache: second identical input returns cached result (logs "Cache Hit")
- [ ] Rate limit warning logged at 80% daily quota

#### Hospital Data — Overpass API (API-07)
- [ ] Chennai coordinates return hospitals within 5km radius
- [ ] Hospital pins appear on Leaflet map within 4 seconds
- [ ] Overpass failure → seeded fallback hospitals shown
- [ ] GPS denied → manual city search input shown

#### Email — Gmail SMTP (API-09)
- [ ] OTP email arrives in Gmail inbox within 30 seconds
- [ ] OTP email subject matches template ("MediVoice AI — Verify Your Email")
- [ ] HTML email renders correctly on mobile Gmail
- [ ] SMTP connection pool active (verify Nodemailer pool config)
- [ ] 500+ email/day quota not exceeded in load testing

#### SOS — tel: Protocol (API-12)
- [ ] Mobile: SOS tap opens phone dialer with 108 pre-filled
- [ ] Desktop: SOS click shows modal with 108 number prominently
- [ ] "Copy Number" button copies "108" to clipboard
- [ ] SOS button visible and not obscured on all patient pages

---

## 21. Free Tier Upgrade Triggers

When to consider upgrading from free tiers:

```
UPGRADE DECISION MATRIX
═══════════════════════════════════════════════════════════════════════

MONGODB ATLAS M0 (512MB):
  Current:      ~28MB at 500 users
  Upgrade when: > 400MB used (monitor in Atlas dashboard)
  Next tier:    Atlas M2 — $9/month — 2GB storage
  At M2:        Supports ~9,000 active users

RENDER FREE (Backend hosting):
  Current:      Free tier — spins down after 15min inactivity
  Problem:      First request after spin-down has ~15s cold start
  Upgrade when: Users complain about slow first load consistently
  Next tier:    Render Starter — $7/month — no spin-down, 512MB RAM

HUGGING FACE FREE INFERENCE:
  Current:      ~30,000 requests/month
  Upgrade when: Daily NER quota > 80% consumed consistently
  Strategy 1:   Expand node-cache TTL from 1hr to 24hrs (free)
  Strategy 2:   Self-host Hugging Face model on Render (free)
  Strategy 3:   Hugging Face Pro — $9/month — unlimited

LIBRETRANSLATE:
  Current:      Free public API (~20 req/min)
  Upgrade when: Rate limiting occurs in production regularly
  Strategy 1:   Self-host LibreTranslate on Render (free)
               docker pull libretranslate/libretranslate
  Strategy 2:   LibreTranslate API key — various paid tiers

GMAIL SMTP:
  Current:      500 emails/day
  Upgrade when: > 400 emails/day consistently
  Next tier:    SendGrid free — 100 emails/day (lower limit)
                Mailgun free — 5,000 emails/month
  Best upgrade: Brevo (Sendinblue) — 300 emails/day free (better limit)

VERCEL FREE (Frontend hosting):
  Current:      Free — 100GB bandwidth/month
  Upgrade when: > 80GB bandwidth/month
  Next tier:    Vercel Pro — $20/month — 1TB bandwidth

TOTAL UPGRADE COST AT 500 USERS: Still $0.00 (well within all free limits)
TOTAL UPGRADE COST AT 5,000 USERS: ~$16/month (MongoDB M2 + Render Starter)
TOTAL UPGRADE COST AT 50,000 USERS: ~$50-100/month (selective upgrades)
```

---

<div align="center">

---

## Free API Summary

```
╔══════════════════════════════════════════════════════════════════════╗
║           MEDIVOICE AI — FREE API PLAN AT A GLANCE                  ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  Total External APIs:     12                                        ║
║  Browser-Native APIs:      5  (Web Speech, Synthesis, Geo,         ║
║                               Push, tel:)                           ║
║  Free Tier HTTP APIs:      5  (LibreTranslate, MyMemory,           ║
║                               Hugging Face, Overpass, OSM)         ║
║  Free Cloud Services:      2  (MongoDB Atlas M0, Gmail SMTP)       ║
║                                                                      ║
║  Total Monthly Cost:   $0.00                                        ║
║                                                                      ║
║  APIs with Fallbacks:      4  (Translation, NER, Hospital, Email)  ║
║  APIs without Fallback:    8  (Browser-native — always available)  ║
║                                                                      ║
║  OWASP Top 10 Compliance: All external APIs validated               ║
║  Input Sanitization:      All external API responses sanitized      ║
║  Error Handling:          withFallback() wrapper on all critical    ║
║                           external calls                            ║
║                                                                      ║
║  Headroom at 500 users:   All APIs at < 20% of free limits         ║
║  Upgrade trigger:         ~9,000 users (MongoDB M0 storage limit)  ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

**MEDIVOICE AI — Free API Design Plan v1.0**

*12 APIs · $0.00/month · Zero compromise on capability*

![Web Speech](https://img.shields.io/badge/Web%20Speech%20API-Free-brightgreen?style=flat)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Free%20Tier-FFD21E?style=flat&logo=huggingface&logoColor=black)
![LibreTranslate](https://img.shields.io/badge/LibreTranslate-Free-00A699?style=flat)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Free-7EBC6F?style=flat)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-M0%20Free-4EA94B?style=flat&logo=mongodb&logoColor=white)

*© 2026 MediVoice AI Team. All rights reserved.*

</div>
