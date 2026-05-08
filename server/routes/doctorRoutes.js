const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, getPatientQueue,
  startConsultation, addTranscriptLine, saveSoapNote,
  endConsultation, getConsultation, getDashboardStats, getAnalytics,
  getAllConsultations, getPatientDetails
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('doctor'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/queue', getPatientQueue);
router.get('/consultations', getAllConsultations);
router.post('/consultation/start', startConsultation);
router.post('/consultation/transcript', addTranscriptLine);
router.post('/consultation/soap', saveSoapNote);
router.patch('/consultation/:consultationId/end', endConsultation);
router.get('/consultation/:id', getConsultation);
router.get('/patient/:patientId', getPatientDetails);

module.exports = router;
