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

module.exports = router;
