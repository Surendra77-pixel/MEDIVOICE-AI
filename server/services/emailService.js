const transporter = require('../config/mailer');
const logger = require('../config/logger');

const sendOTPEmail = async (email, otp, type) => {
  const isVerify = type === 'email_verify';
  const subject = isVerify ? 'MediVoice AI — Verify Your Email' : 'MediVoice AI — Reset Your Password';

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="background: #16a34a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎙️ MediVoice AI</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111928; font-size: 18px;">
            ${isVerify ? 'Verify Your Email Address' : 'Reset Your Password'}
          </h2>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            ${isVerify
              ? 'Use the code below to verify your email and activate your MediVoice AI account.'
              : 'Use the code below to reset your MediVoice AI password.'}
          </p>
          <div style="background: white; border: 2px solid #16a34a;
                      border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="font-size: 36px; font-weight: bold; letter-spacing: 12px;
                      color: #16a34a; margin: 0; font-family: monospace;">
              ${otp}
            </p>
          </div>
          <p style="color: #E02424; font-size: 13px; font-weight: bold;">
            ⏰ This code expires in 10 minutes.
          </p>
          <p style="color: #6B7280; font-size: 13px;">
            If you did not request this, please ignore this email.
            Your account remains secure.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9CA3AF; font-size: 11px; text-align: center;">
            MediVoice AI · AI-Powered Healthcare Communication · India
          </p>
        </div>
      </body>
    </html>
  `;

  // PROMINENT DEV LOG: Always show OTP in terminal for development ease
  console.log(`\n\n[OTP GENERATED] -------------------------`);
  console.log(`Email: ${email}`);
  console.log(`Code:  ${otp}`);
  console.log(`Type:  ${type}`);
  console.log(`-----------------------------------------\n\n`);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'MediVoice AI <noreply@medivoice.ai>',
      to: email,
      subject,
      html,
    });
    logger.info(`OTP email sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending OTP email: ${error.message}`);
    
    // Prominent failure alert
    console.log(`\n\n❌ [SMTP FAILURE] ------------------------`);
    console.log(`SMTP Error: ${error.message}`);
    console.log(`Check your EMAIL_USER/EMAIL_PASS in .env`);
    console.log(`USE THIS OTP TO BYPASS: ${otp}`);
    console.log(`-----------------------------------------\n\n`);
  }
};

const sendWelcomeEmail = async (email, name, role) => {
  const subject = 'Welcome to MediVoice AI';
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Welcome ${name}!</h2>
      <p>Thank you for joining MediVoice AI as a <strong>${role}</strong>.</p>
      <p>Our platform helps bridge the language gap in healthcare using AI.</p>
      <p>Login to your dashboard to get started.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    logger.error(`Error sending welcome email: ${error.message}`);
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
