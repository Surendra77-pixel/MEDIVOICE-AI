## MediVoice AI 🩺

MediVoice AI is an advanced, AI-powered medical consultation platform designed to seamlessly connect doctors and patients, breaking down language barriers and automating clinical documentation. The platform provides a rich ecosystem for real-time translation, automated SOAP note generation, patient queue management, and comprehensive clinical analytics.

---

## 🌟 Key Features & Project Flow

### 1. **Authentication & Smart Onboarding**
- **Roles:** Users can register as either a `Patient` or a `Doctor`.
- **Auto-Seeding:** When a Doctor registers, the system intelligently auto-generates a mock "Patient Queue" along with historical consultation data. This ensures the doctor's dashboard and analytics are immediately populated and ready for demonstration.

### 2. **Doctor Dashboard & Patient Queue**
- **Queue Management:** Doctors can view their upcoming appointments, manage their patient queue, and initiate consultations directly from the dashboard.
- **Clinical Analytics:** Beautiful, interactive charts (powered by Recharts) visualize patient demographics, consultation durations, and common diagnoses over time.

### 3. **Live Translator (The Core AI Feature)**
- **Real-Time Bilingual Communication:** Allows a doctor and a patient who speak different languages (e.g., English vs. Hindi, Tamil, Telugu, Malayalam, etc.) to communicate seamlessly.
- **Audio & Text:** Uses speech-to-text, translates the text using Google's Generative AI, and plays it back using Text-to-Speech (TTS).
- **Direct-to-Archive:** Live translation sessions can be instantly saved into the Clinical Notes archive as a complete, formal `Consultation` record, generating a Subjective summary automatically.

### 4. **AI-Assisted Consultation & SOAP Notes**
- **Live Transcription:** During an active consultation, the conversation is transcribed in real-time.
- **Risk Detection:** The AI continuously analyzes the transcript for critical keywords (e.g., "severe chest pain") and flags **Risk Events** on the doctor's screen instantly.
- **Automated SOAP Notes:** Upon completing a consultation, the AI summarizes the entire transcript into a structured **SOAP Note** (Subjective, Objective, Assessment, Plan), saving the doctor valuable documentation time.

### 5. **Clinical Notes Archive**
- **Centralized Records:** Doctors can access a searchable, filterable archive of all past consultations.
- **Manual Notes:** Doctors can manually create "Standalone" clinical notes for walk-in patients or ad-hoc consultations, without requiring a pre-scheduled appointment in the database.

---

## 🛠️ Technology Stack & Libraries

### **Frontend (Client)**
The frontend is a modern Single Page Application (SPA) built for extreme responsiveness and rich user interactions.

- **Core:** React 19, Vite (Fast build tool)
- **Styling:** TailwindCSS (Utility-first CSS), Autoprefixer, PostCSS
- **Animations:** Framer Motion (Fluid micro-animations, modal transitions, and dynamic SVGs)
- **Routing:** React Router DOM (v6)
- **Data Visualization:** Recharts (For dashboard clinical analytics)
- **Real-time Comms:** Socket.io-client (For live consultation sync and queue updates)
- **Maps & Location:** Leaflet & React-Leaflet (For displaying pharmacy or clinic locations)
- **PDF Generation:** jsPDF & jspdf-autotable (For generating downloadable Medical Prescriptions)
- **Icons:** Lucide-React & Google Material Symbols
- **State/Notifications:** React Hot Toast (For elegant popup notifications)

### **Backend (Server)**
The backend is a robust RESTful API built on Node.js, handling complex AI orchestrations and strict data modeling.

- **Core:** Node.js, Express.js
- **Database:** MongoDB & Mongoose (Strict schema validation, nested subdocuments for SOAP notes and transcripts)
- **AI Integration:** `@google/genai` & `@google/generative-ai` (Gemini models power the translation, transcript analysis, and SOAP note generation)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs (For secure password hashing)
- **Security:** Helmet (HTTP headers), CORS, express-rate-limit (Preventing API abuse)
- **Real-time Engine:** Socket.io (Broadcasting consultation events and risk alerts)
- **File Handling:** Multer (For potential file uploads/medical records)
- **Push Notifications:** web-push (For browser-based patient queue alerts)
- **Logging & Monitoring:** Winston & Morgan

---

## 📂 System Architecture & Database Models

- **User Model:** Stores credentials, roles (`doctor`, `patient`), and profile data.
- **Doctor Model:** Extends user data with specialization, clinic details, and lifetime statistics.
- **Appointment Model:** Manages scheduled slots, status (`scheduled`, `completed`, `cancelled`), and queue order.
- **Consultation Model:** The heaviest data structure. It optionally links to an appointment but can be standalone. It contains:
  - `transcript`: Array of every spoken line (original text, translated text, language, timestamp).
  - `soapNote`: Structured object containing Subjective, Objective, Assessment, and Plan fields.
  - `riskEvents`: Array of flagged medical risks triggered during the session.
  - `guestPatientName`: Enables manual entry for unregistered patients.

---

## 🚀 How to Run the Project

1. **Prerequisites:** 
   - Node.js (v18+)
   - MongoDB (Local instance or MongoDB Atlas URI)
   - Google Gemini API Key

2. **Environment Variables:**
   - Create a `.env` file in the `server` directory containing `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.

3. **Start the Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Start the Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. **Usage:**
   - Sign up as a Doctor to automatically trigger the mock data seeding.
   - Navigate the dashboard, start the Live Translator, or manage Clinical Notes!
