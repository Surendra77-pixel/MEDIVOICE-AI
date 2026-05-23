const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

/**
 * AI Routes
 * Prefix: /api/v1/ai
 */

router.post('/translate', protect, aiController.translateText);
router.post('/analyze', protect, aiController.analyzeConversation);
router.post('/chat', protect, aiController.chat);
router.post('/transcribe', protect, express.raw({ type: '*/*', limit: '10mb' }), aiController.transcribeAudio);
router.get('/tts', protect, aiController.textToSpeech);
router.post('/save-report', protect, aiController.saveReport);
router.get('/reports', protect, aiController.listReports);
router.get('/reports/:filename', protect, aiController.getReportContent);

module.exports = router;
