const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getUsers, toggleUserStatus, toggleBanUser,
  getUnverifiedDoctors, verifyDoctor, getSecurityLogs,
  unlockAccount, getPlatformAnalytics
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getPlatformAnalytics);
router.get('/users', getUsers);
router.patch('/users/:userId/toggle-status', toggleUserStatus);
router.patch('/users/:userId/toggle-ban', toggleBanUser);
router.patch('/users/:userId/unlock', unlockAccount);
router.get('/doctors/unverified', getUnverifiedDoctors);
router.patch('/doctors/:doctorId/verify', verifyDoctor);
router.get('/security-logs', getSecurityLogs);

module.exports = router;
