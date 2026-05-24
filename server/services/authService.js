const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const OTP = require('../models/OTP');
const SecurityLog = require('../models/SecurityLog');
const { sendOTPEmail } = require('./emailService');
const logger = require('../config/logger');

/**
 * Generate 6-digit random OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP and Save to DB
 */
const sendAndSaveOTP = async (email, type, userId = null) => {
  const rawOTP = generateOTP();
  const hashedOTP = await bcrypt.hash(rawOTP, 8);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate previous OTPs
  await OTP.updateMany({ email, type, isUsed: false }, { isUsed: true });

  await OTP.create({
    email,
    userId,
    code: hashedOTP,
    type,
    expiresAt
  });

  // Fire and forget email sending so it never blocks the API
  sendOTPEmail(email, rawOTP, type).catch(err => {
    console.error('Failed to send OTP email in background:', err.message);
  });

  await SecurityLog.create({
    email,
    userId,
    eventType: 'otp_requested',
    details: `OTP requested for ${type}`,
    severity: 'LOW'
  });

  return true;
};

/**
 * Verify OTP
 */
const verifyOTP = async (email, code, type) => {
  const otpRecord = await OTP.findOne({
    email,
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).select('+code');

  if (!otpRecord) {
    return { success: false, message: 'Invalid or expired OTP' };
  }

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    otpRecord.isUsed = true;
    await otpRecord.save();
    return { success: false, message: 'Too many failed attempts' };
  }

  const isMatch = await bcrypt.compare(code, otpRecord.code);

  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    return { success: false, message: 'Invalid OTP' };
  }

  otpRecord.isUsed = true;
  await otpRecord.save();

  await SecurityLog.create({
    email,
    userId: otpRecord.userId,
    eventType: 'otp_verified',
    details: `OTP verified for ${type}`,
    severity: 'LOW'
  });

  return { success: true, userId: otpRecord.userId };
};

/**
 * Generate Token Pair
 */
const generateTokenPair = (user) => {
  const token = jwt.sign(
    { sub: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  return { token, tokenHash };
};

module.exports = {
  sendAndSaveOTP,
  verifyOTP,
  generateTokenPair
};
