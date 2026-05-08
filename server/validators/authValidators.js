const { body } = require('express-validator');

const signupValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('role').isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
  body('city').notEmpty().withMessage('City is required')
];

const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const otpValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('type').isIn(['email_verify', 'password_reset']).withMessage('Invalid OTP type')
];

const resetPasswordValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

const resendOtpValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('type').isIn(['email_verify', 'password_reset']).withMessage('Invalid OTP type')
];

const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Please provide a valid email')
];

module.exports = {
  signupValidator,
  loginValidator,
  otpValidator,
  resendOtpValidator,
  resetPasswordValidator,
  forgotPasswordValidator
};
