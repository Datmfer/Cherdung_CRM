import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@cherdung.com',
        to,
        subject,
        html,
      });
      return;
    } catch (error) {
      console.error('Failed to send email via SMTP, falling back to console:', error);
    }
  }

  // Fallback log for local development
  console.log('\n=================== EMAIL SIMULATION ===================');
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`CONTENT:\n${html}`);
  console.log('=======================================================\n');
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Welcome to Cherdung CRM</h2>
      <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #6b7280; word-break: break-all;">${verifyUrl}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af;">If you did not create an account, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Cherdung CRM',
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Password Reset Request</h2>
      <p>You requested to reset your password for your Cherdung CRM account. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
      <p style="color: #ef4444; font-size: 14px;">This link will expire in 1 hour.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af;">If you did not request a password reset, please ignore this email or contact support.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request - Cherdung CRM',
    html,
  });
}
