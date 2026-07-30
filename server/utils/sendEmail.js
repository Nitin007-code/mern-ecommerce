const nodemailer = require('nodemailer');

// Configures the connection to Gmail's SMTP server using our credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable function — takes recipient, subject, and HTML content, and sends the email
async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"MERN Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent to', to);
  } catch (err) {
    console.error('Email sending failed:', err.message);
    // We intentionally don't throw here — a failed email shouldn't crash the order flow
  }
}

module.exports = sendEmail;