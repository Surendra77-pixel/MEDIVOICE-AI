export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password'
  },
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    CHATBOT: '/patient/chatbot',
    BOOK: '/patient/book',
    HOSPITALS: '/patient/hospitals',
    CONSULTATION: '/patient/consultation',
    HISTORY: '/patient/history',
    PRESCRIPTIONS: '/patient/prescriptions',
    REMINDERS: '/patient/reminders'
  },
  DOCTOR: {
    DASHBOARD: '/doctor/dashboard',
    QUEUE: '/doctor/queue',
    CONSULTATION: '/doctor/consultation',
    NOTES: '/doctor/notes',
    PRESCRIPTIONS: '/doctor/prescriptions',
    SCHEDULE: '/doctor/schedule',
    ASSISTANT: '/doctor/assistant',
    ANALYTICS: '/doctor/analytics',
    PATIENT_PROFILE: '/doctor/patient/:id'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SECURITY: '/admin/security'
  }
};
