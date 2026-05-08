const rateLimit = require('express-rate-limit');

// General limiter for all API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Stricter limiter for auth routes (login, signup)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for testing
  message: 'Too many auth attempts from this IP, please try again after 15 minutes'
});

// Limiter for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for testing
  message: 'Too many OTP requests from this IP, please try again after 15 minutes'
});

module.exports = {
  generalLimiter,
  authLimiter,
  otpLimiter
};
