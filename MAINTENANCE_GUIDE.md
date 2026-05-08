# 🛠️ MediVoice AI — Maintenance & Handover Guide

> **This guide contains instructions for maintaining the platform, updating AI models, and scaling infrastructure.**

---

## 🔑 1. API Key Rotation
The platform relies on several free-tier API keys. If limits are reached, update these in `server/.env`:

| Service | Variable | Purpose |
|---|---|---|
| HuggingFace | `HUGGINGFACE_API_KEY` | Translation, NER, SOAP generation |
| SMTP | `EMAIL_PASS` | OTP and Welcome emails (App Password) |
| VAPID | `VAPID_PRIVATE_KEY` | Browser push notifications |

## 🧠 2. Updating AI Models
To switch models or adjust parameters, edit `server/services/aiService.js`. 

- **Current Translation**: `facebook/mbart-large-50-many-to-many-mmt`
- **Current SOAP Engine**: `google/flan-t5-base`
- **Current NER Engine**: `dbmdz/bert-large-cased-finetuned-conll03-english`

## 📊 3. Database Management
- **Backups**: Use `mongodump` regularly for the Atlas cluster.
- **Seeding**: To reset the database, run `npm run seed` in the `server` folder. (Note: This clears existing appointments).

## 🚀 4. Scaling Plan
The current architecture is "Microservices-ready".
- **Phase 1**: Move the AI Inference logic to a dedicated FastAPI microservice if HuggingFace JS SDK latency becomes an issue.
- **Phase 2**: Implement Redis caching for the `Doctor Search` and `Analytics` endpoints.

## 🛡️ 5. Security Audit
- Regularly check `SecurityLogs` in the Admin Dashboard for blocked IP patterns.
- Ensure `JWT_ACCESS_EXPIRES_IN` remains low (15m) for maximum security.

---
*Created: May 2026*  
*Version: 1.0.0 (Gold Master)*
