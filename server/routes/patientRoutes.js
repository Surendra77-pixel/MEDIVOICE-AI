const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, bookAppointment,
  getAppointments, cancelAppointment, getMedicalHistory,
  getPrescriptions,
  searchDoctors, getDashboardStats, getConsultation,
  addTranscriptLine, updateConsultationLanguage
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are patient-only
router.use(protect);
router.use(authorize('patient'));

router.get('/dashboard', getDashboardStats);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/appointments', getAppointments);
router.post('/appointments', bookAppointment);
router.patch('/appointments/:id/cancel', cancelAppointment);
router.get('/medical-history', getMedicalHistory);
router.get('/prescriptions', getPrescriptions);
router.get('/doctors/search', searchDoctors);
router.get('/consultation/:id', getConsultation);
router.post('/consultation/transcript', addTranscriptLine);
router.patch('/consultation/:consultationId/language', updateConsultationLanguage);

module.exports = router;
