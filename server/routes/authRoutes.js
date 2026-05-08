const express = require('express');
const router = express.Router();
const {
  signup,
  verifySignup,
  login,
  getMe,
  logout,
  resendOTP,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const {
  signupValidator,
  loginValidator,
  otpValidator,
  resendOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, otpLimiter } = require('../middleware/rateLimitMiddleware');

// Public routes
router.post('/signup', authLimiter, signupValidator, validate, signup);
router.post('/signup/verify', otpLimiter, otpValidator, validate, verifySignup);
router.post('/otp/resend', otpLimiter, resendOtpValidator, validate, resendOTP);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/forgot-password', otpLimiter, forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', otpLimiter, resetPasswordValidator, validate, resetPassword);

// Private routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
