// utils/email.ts
import nodemailer from "nodemailer";

const getMailConfig = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim().replace(/^"|"$/g, "");
  const ownerEmail = process.env.OWNER_EMAIL?.trim();

  if (!user || !pass) {
    throw new Error("EMAIL_USER or EMAIL_PASS is not configured");
  }

  return { user, pass, ownerEmail: ownerEmail || user };
};

const getVerifyLink = (userId: string) => {
  const frontendUrl = (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${frontendUrl}/verify-user/${userId}`;
};

const createTransporter = () => {
  const { user, pass } = getMailConfig();

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });
};
export const sendEmployeeWelcomeOnlyEmail = async (
  name: string,
  email: string,
) => {
  const { user: fromEmail } = getMailConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${fromEmail}>`,
    to: email,
    subject: "Welcome to Maximal Security",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f8f9fa;">
        <h2 style="color: #004175;">Hello ${name || "there"},</h2>

        <p>Welcome to <strong>Maximal Security Visitor Management App</strong>. An employee profile has been created for you.</p>

        <p>You can use the workplace app with this email. No password setup is required for an employee account.</p>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          If you did not expect this email, please disregard this message.
        </p>

        <p style="font-size: 13px; margin-top: 20px;">— Maximal Security Team</p>
      </div>
    `,
  });
};

export const sendEmployeeWelcomeEmail = async (
  userId: string,
  name: string,
  email: string,
  tempPassword: string,
) => {
  const link = getVerifyLink(userId);
  const { user: fromEmail } = getMailConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${fromEmail}>`,
    to: email,
    subject: "Verify your account & temporary password - Maximal Security",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f8f9fa;">
        <h2 style="color: #004175;">Hello ${name || "there"},</h2>

        <p>An account has been created for you on <strong>Maximal Security Visitor Management App</strong>.</p>

        <p>Your temporary password is: <strong style="font-size: 16px; color: #004175;">${tempPassword}</strong></p>

        <p>First, verify your email by clicking the button below. Then sign in with your email and temporary password. You will be asked to set a new password on first login.</p>

        <a href="${link}" style="display: inline-block; margin-top: 12px; background-color: #004175; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify Email
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          If you did not expect this email, please disregard this message.
        </p>

        <p style="font-size: 13px; margin-top: 20px;">— Maximal Security Team</p>
      </div>
    `,
  });
};

export const sendVerificationLinkToOwner = async (
  userId: string,
  name: string,
  email: string,
  companyName: string,
) => {
  const link = getVerifyLink(userId);

  const { user: fromEmail, ownerEmail } = getMailConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${fromEmail}>`,
    to: ownerEmail,
    subject: "New Signup Pending Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f8f9fa;">
        <h2 style="color: #004175;">Hello Admin,</h2>

        <p>A new account has registered on <strong>Maximal Security Visitor Management App</strong> and is awaiting your verification:</p>

        <table style="margin-top: 10px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 4px 8px;"><strong>Name:</strong></td>
            <td style="padding: 4px 8px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;"><strong>Email:</strong></td>
            <td style="padding: 4px 8px;">${email}</td>
          </tr>
            <tr>
          <td style="padding: 4px 8px;"><strong>Company Name:</strong></td>
          <td style="padding: 4px 8px;">${companyName}</td>
        </tr>
        </table>

        <p>Click the button below to verify this user:</p>

        <a href="${link}" style="display: inline-block; margin-top: 12px; background-color: #004175; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          ✅ Verify User
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          If you did not expect this email or believe it was sent in error, please disregard this message.
        </p>

        <p style="font-size: 13px; margin-top: 20px;">— Maximal Security Team</p>
      </div>
    `,
  });
};

/** Sends account verification link to the newly created manager/admin email. */
export const sendVerificationLinkToUser = async (
  userId: string,
  name: string,
  email: string,
) => {
  const link = getVerifyLink(userId);
  const { user: fromEmail } = getMailConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${fromEmail}>`,
    to: email,
    subject: "Verify your Maximal Security account",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f8f9fa;">
        <h2 style="color: #004175;">Hello ${name || "there"},</h2>

        <p>An account has been created for you on <strong>Maximal Security Visitor Management App</strong>. Please verify your email to activate your account and sign in.</p>

        <a href="${link}" style="display: inline-block; margin-top: 12px; background-color: #004175; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify Email
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          If you did not expect this email, please disregard this message.
        </p>

        <p style="font-size: 13px; margin-top: 20px;">— Maximal Security Team</p>
      </div>
    `,
  });
};

export const sendTemporaryPasswordEmail = async (
  name: string,
  email: string,
  tempPassword: string,
) => {
  const { user: fromEmail } = getMailConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${fromEmail}>`,
    to: email,
    subject: "Your Temporary Password - Maximal Security",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f8f9fa;">
        <h2 style="color: #004175;">Hello ${name || "there"},</h2>

        <p>An account has been created for you on <strong>Maximal Security Visitor Management App</strong>.</p>
        
        <p>Your temporary password is: <strong style="font-size: 16px; color: #004175;">${tempPassword}</strong></p>

        <p>Please log in using this email and your temporary password. You will be prompted to set your own password upon your first sign-in.</p>

        <p style="font-size: 13px; margin-top: 20px;">— Maximal Security Team</p>
      </div>
    `,
  });
};
