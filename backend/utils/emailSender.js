const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `Farm App <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

const sendWelcomeEmail = async (email, name) => {
  const html = `
    <h1>Welcome to Farm App, ${name}!</h1>
    <p>Thank you for joining our farming community.</p>
    <p>Start managing your farm efficiently with our comprehensive tools.</p>
  `;

  return await sendEmail({
    email,
    subject: 'Welcome to Farm App',
    html
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link expires in 30 minutes.</p>
  `;

  return await sendEmail({
    email,
    subject: 'Password Reset Request',
    html
  });
};

const sendNotificationEmail = async (email, subject, message) => {
  return await sendEmail({
    email,
    subject,
    html: message
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendNotificationEmail
};
