const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const SecurityLog = require('../models/SecurityLog');
const authService = require('../services/authService');
const { sendWelcomeEmail } = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Initialize Signup
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, city } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return apiResponse.error(res, 'Email already registered', 400);
  }

  // Create user (unverified)
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    city,
    isVerified: false
  });

  // Send OTP
  await authService.sendAndSaveOTP(email, 'email_verify', user._id);

  return apiResponse.success(res, null, 'OTP sent to your email. Please verify to continue.', 201);
});

/**
 * @desc    Verify Signup OTP
 * @route   POST /api/v1/auth/signup/verify
 * @access  Public
 */
const verifySignup = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const result = await authService.verifyOTP(email, code, 'email_verify');
  if (!result.success) {
    return apiResponse.error(res, result.message, 400);
  }

  const user = await User.findOne({ email });
  user.isVerified = true;
  await user.save();

  // Create Profile based on role
  if (user.role === 'patient') {
    await Patient.create({ userId: user._id });
  } else if (user.role === 'doctor') {
    await Doctor.create({ 
      userId: user._id,
      specialty: 'General Physician', // Default
      qualifications: ['MBBS'], // Placeholder
      city: user.city || 'Hyderabad'
    });
  }

  // Seed initial data to populate the dashboard immediately
  const seedNewUser = require('../utils/seedNewUser');
  await seedNewUser(user);

  await sendWelcomeEmail(user.email, user.firstName, user.role);

  return apiResponse.success(res, null, 'Email verified successfully. You can now login.');
});

/**
 * @desc    Login User
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return apiResponse.error(res, 'Invalid credentials', 401);
  }

  // Ensure the user is logging into the correct portal
  if (req.body.role && user.role !== req.body.role) {
    return apiResponse.error(res, `Account exists but is registered as a ${user.role}. Please use the ${user.role} login portal.`, 403);
  }

  if (!user.isVerified) {
    return apiResponse.error(res, 'Please verify your email first', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Logic for failed attempts and lockout could be added here
    return apiResponse.error(res, 'Invalid credentials', 401);
  }

  const { token, tokenHash } = authService.generateTokenPair(user);
  
  user.currentSessionToken = tokenHash;
  user.lastLoginAt = new Date();
  user.lastLoginIP = req.ip;
  await user.save();

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  await SecurityLog.create({
    userId: user._id,
    email: user.email,
    eventType: 'login_success',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'LOW'
  });

  return apiResponse.success(res, {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    },
    token
  }, 'Login successful');
});

/**
 * @desc    Get Current User
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    city: req.user.city
  };

  return apiResponse.success(res, user);
});

/**
 * @desc    Logout User
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.currentSessionToken = null;
  await user.save();

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  return apiResponse.success(res, null, 'Logged out successfully');
});

/**
 * @desc    Resend OTP
 * @route   POST /api/v1/auth/otp/resend
 * @access  Public
 */
const resendOTP = asyncHandler(async (req, res) => {
  const { email, type } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return apiResponse.error(res, 'User not found', 404);
  }

  if (user.isVerified && type === 'email_verify') {
    return apiResponse.error(res, 'Email already verified', 400);
  }

  await authService.sendAndSaveOTP(email, type, user._id);

  return apiResponse.success(res, null, 'New OTP sent to your email.');
});

/**
 * @desc    Forgot Password - Send OTP
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Return success even if user not found for security (prevent email enumeration)
    return apiResponse.success(res, null, 'If an account exists with this email, an OTP has been sent.');
  }

  await authService.sendAndSaveOTP(email, 'password_reset', user._id);

  return apiResponse.success(res, null, 'Password reset OTP sent to your email.');
});

/**
 * @desc    Reset Password
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  const result = await authService.verifyOTP(email, code, 'password_reset');
  if (!result.success) {
    return apiResponse.error(res, result.message, 400);
  }

  const user = await User.findById(result.userId);
  if (!user) {
    return apiResponse.error(res, 'User not found', 404);
  }

  user.password = newPassword;
  // Clear any existing session to force re-login
  user.currentSessionToken = null;
  await user.save();

  await SecurityLog.create({
    userId: user._id,
    email: user.email,
    eventType: 'password_reset_done',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'MEDIUM'
  });

  return apiResponse.success(res, null, 'Password has been reset successfully. You can now login with your new password.');
});

module.exports = {
  signup,
  verifySignup,
  login,
  getMe,
  logout,
  resendOTP,
  forgotPassword,
  resetPassword
};
