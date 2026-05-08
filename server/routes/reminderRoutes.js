const express = require('express');
const router = express.Router();
const {
  createReminder, getReminders, acknowledgeReminder,
  updateReminder, deleteReminder
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('patient'));

router.post('/', createReminder);
router.get('/', getReminders);
router.patch('/:id/acknowledge', acknowledgeReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
