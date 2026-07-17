// utils/email.ts
import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendVerificationLinkToOwner = async (
  userId: string,
  name: string,
  email: string,
  companyName: string,
) => {
  const link = `${process.env.SERVER_URL}/verify-user/${userId}`;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
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
          If you did not expect this email or believe it was sent in error, please ignore it.
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
  const link = `${process.env.SERVER_URL}/verify-user/${userId}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Maximal Security " <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Maximal Security account",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f8f9fa;">
        <h2 style="color: #004175;">Hello ${name || "there"},</h2>

        <p>An account has been created for you on <strong>Maximal Security</strong>. Please verify your email to activate your account and sign in.</p>

        <a href="${link}" style="display: inline-block; margin-top: 12px; background-color: #004175; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify Email
        </a>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          If you did not expect this email, please ignore it.
        </p>

        <p style="font-size: 13px; margin-top: 20px;">— Maximal Security Team</p>
      </div>
    `,
  });
};
