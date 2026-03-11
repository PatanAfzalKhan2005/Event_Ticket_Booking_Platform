const nodemailer = require('nodemailer');
const { email } = require('../config/env');

let transporter;
if (email.host) {
  transporter = nodemailer.createTransport({
    host: email.host,
    port: email.port,
    secure: false,
    auth: { user: email.user, pass: email.pass }
  });
}

async function sendMail(opts) {
  if (!transporter) {
    console.log('Email transporter not configured, skipping send', opts);
    return;
  }
  return transporter.sendMail(opts);
}

async function sendVerification(emailTo, token) {
  const url = `${process.env.BASE_URL || 'http://localhost:4000'}/api/auth/verify/${token}`;
  return sendMail({ to: emailTo, subject: 'Verify your email', html: `Click <a href="${url}">here</a>` });
}

async function sendReset(emailTo, token) {
  const url = `${process.env.BASE_URL || 'http://localhost:4000'}/api/auth/reset-password?token=${token}`;
  return sendMail({ to: emailTo, subject: 'Reset password', html: `Reset link: <a href="${url}">link</a>` });
}

module.exports = { sendMail, sendVerification, sendReset };
