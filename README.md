# 🎙️ MediVoice AI

**AI-Powered Healthcare Communication Platform**  
*Built for the next generation of digital clinical workflows.*

---

## 🚀 Overview
MediVoice AI is a full-stack clinical communication platform that leverages AI to bridge the gap between doctors and patients. It features real-time multilingual transcription, automated medical note generation (SOAP), and a high-security administrative core—all running on 100% free-tier infrastructure.

### 🌟 Key Features
- **Multilingual STT**: Real-time transcription in 10+ languages using Web Speech API.
- **AI Diagnosis Support**: Named Entity Recognition (NER) for symptoms and medications via HuggingFace.
- **Auto-SOAP Notes**: Automated summarization of consultations into structured medical records.
- **Secure Portals**: Dedicated workspaces for Patients, Doctors, and Administrators.
- **Professional Reports**: One-click professional prescription PDF generation.
- **PWA Ready**: Installable on mobile and desktop with offline support.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js 20, Express, Socket.io (Real-time).
- **Database**: MongoDB Atlas (M0 Free Tier).
- **AI Layer**: HuggingFace Inference API (mBART-50, FLAN-T5).
- **Security**: JWT (Access/Refresh), Helmet, MongoSanitize, RBAC Middleware.

---

## 📦 Local Setup

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (Atlas account or local instance)
- HuggingFace API Token (Free)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/medivoice-ai.git

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Create `.env` files in both `server/` and `client/` folders using the provided `.env.example` templates.

### 4. Database Seeding
```bash
cd server
npm run seed # Seeds 40+ doctors, admins, and specialties
```

### 5. Start Development
```bash
# In server folder
npm run dev

# In client folder
npm run dev
```

---

## 🛡️ Security & Compliance
- **RBAC**: Strict Role-Based Access Control on every API endpoint.
- **Data Protection**: Sensitive health data is handled with production-grade sanitization.
- **Encryption**: JWT-based stateless authentication with secure refresh logic.

---

## 📜 License
*Research Basis: ICSADL-2025 | Zero Cost Infrastructure | April 2026*  
Developed for Advanced Agentic Coding research.

---

## 🤝 Support
For clinical workflow updates or AI model adjustments, refer to the `MAINTENANCE_GUIDE.md`.
