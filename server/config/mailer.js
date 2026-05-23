const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Diagnostic verify only in development/non-Vercel
if (!process.env.VERCEL) {
  transporter.verify((error, success) => {
    if (error) {
      logger.error(`Email server connection error: ${error.message}`);
    } else {
      logger.info('Email server is ready to take our messages');
    }
  });
}

module.exports = transporter;
