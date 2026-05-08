const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Consultation = require('../models/Consultation');
const SecurityLog = require('../models/SecurityLog');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalDoctors, totalPatients, totalConsultations, totalAppointments, recentSecurityEvents] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'doctor' }),
    User.countDocuments({ role: 'patient' }),
    Consultation.countDocuments({ status: 'completed' }),
    Appointment.countDocuments(),
    SecurityLog.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
  ]);

  // Growth data (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  return apiResponse.success(res, {
    totalUsers, totalDoctors, totalPatients,
    totalConsultations, totalAppointments,
    recentSecurityEvents, userGrowth
  }, 'Admin dashboard stats');
});

// ─── List All Users ──────────────────────────────────────────────────────────
const getUsers = asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;
  if (status === 'banned') query.isBanned = true;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);
  return apiResponse.success(res, { users, total, page: parseInt(page) }, 'Users fetched');
});

// ─── Toggle User Active Status ───────────────────────────────────────────────
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return apiResponse.error(res, 'User not found', 404);
  if (user.role === 'admin') return apiResponse.error(res, 'Cannot modify admin accounts', 403);

  user.isActive = !user.isActive;
  await user.save();
  return apiResponse.success(res, { id: user._id, isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
});

// ─── Ban / Unban User ────────────────────────────────────────────────────────
const toggleBanUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return apiResponse.error(res, 'User not found', 404);
  if (user.role === 'admin') return apiResponse.error(res, 'Cannot ban admin accounts', 403);

  user.isBanned = !user.isBanned;
  if (user.isBanned) {
    user.isActive = false;
    user.currentSessionToken = null;
  }
  await user.save();
  return apiResponse.success(res, { id: user._id, isBanned: user.isBanned }, `User ${user.isBanned ? 'banned' : 'unbanned'}`);
});

// ─── Get Unverified Doctors ──────────────────────────────────────────────────
const getUnverifiedDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({ isVerified: false })
    .populate('userId', 'firstName lastName email createdAt city');
  return apiResponse.success(res, doctors, 'Unverified doctors fetched');
});

// ─── Verify Doctor ───────────────────────────────────────────────────────────
const verifyDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { approved } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return apiResponse.error(res, 'Doctor profile not found', 404);

  if (approved) {
    doctor.isVerified = true;
    doctor.status = 'available';
    await doctor.save();
    await User.findByIdAndUpdate(doctor.userId, { isVerified: true });
    return apiResponse.success(res, doctor, 'Doctor verified and approved');
  } else {
    await Doctor.findByIdAndDelete(doctorId);
    await User.findByIdAndDelete(doctor.userId);
    return apiResponse.success(res, null, 'Doctor application rejected and removed');
  }
});

// ─── Security Logs ───────────────────────────────────────────────────────────
const getSecurityLogs = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 20 } = req.query;
  const query = {};
  if (type) query.eventType = type;

  const logs = await SecurityLog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await SecurityLog.countDocuments(query);
  return apiResponse.success(res, { logs, total, page: parseInt(page) }, 'Security logs fetched');
});

// ─── Unlock Locked Account ───────────────────────────────────────────────────
const unlockAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return apiResponse.error(res, 'User not found', 404);

  user.failedLoginAttempts = 0;
  user.lockoutUntil = null;
  await user.save();
  return apiResponse.success(res, { id: user._id }, 'Account unlocked');
});

// ─── Platform Analytics ──────────────────────────────────────────────────────
const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [registrationTrend, consultationTrend, cityDistribution, roleDistribution] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Consultation.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'completed' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    User.aggregate([
      { $match: { city: { $exists: true } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])
  ]);

  return apiResponse.success(res, {
    registrationTrend, consultationTrend,
    cityDistribution, roleDistribution
  }, 'Platform analytics fetched');
});

module.exports = {
  getDashboardStats, getUsers, toggleUserStatus, toggleBanUser,
  getUnverifiedDoctors, verifyDoctor, getSecurityLogs,
  unlockAccount, getPlatformAnalytics
};
