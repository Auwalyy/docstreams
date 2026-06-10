import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

export const accountCreatedEmail = (name: string, email: string, tempPassword: string) => ({
  subject: 'DocStream - Account Created',
  html: `<h2>Welcome ${name}</h2><p>Your account has been created.</p><p>Email: ${email}</p><p>Temporary Password: <strong>${tempPassword}</strong></p><p>Please change your password after first login.</p>`,
});

export const passwordResetEmail = (name: string, resetLink: string) => ({
  subject: 'DocStream - Password Reset',
  html: `<h2>Hi ${name}</h2><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>This link expires in 1 hour.</p>`,
});
