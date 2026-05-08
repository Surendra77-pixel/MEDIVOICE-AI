const express = require('express');
const router = express.Router();
const {
  createPrescription, getPrescription,
  getPatientPrescriptions, getDoctorPrescriptions
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('doctor'), createPrescription);
router.get('/patient', authorize('patient'), getPatientPrescriptions);
router.get('/doctor', authorize('doctor'), getDoctorPrescriptions);
router.get('/:id', getPrescription);

module.exports = router;
