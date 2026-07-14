import nodemailer from "nodemailer";

export const sendOtpEmail = async (
  name: string,
  otpCode: string,
  toEmail: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  await transporter.sendMail({
    from: `"Maximal Security " <${process.env.EMAIL_USER as string}>`,
    to: toEmail,
    subject: `🔐 Your OTP Code for Verification`,
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f5f6f8; padding: 40px 0; text-align: center;">
      <table style="max-width: 600px; width: 100%; margin: auto; background: #ffffff; border-radius: 8px;">
        <tr>
          <td style="padding: 30px 40px;">

            <h2 style="margin: 0; font-size: 22px; color: #111;">
              Hello <span style="font-weight: bold;">${name}</span>,
            </h2>

            <p style="margin: 10px 0 20px; font-size: 15px; color: #444;">
              Use the verification code below to complete your sign-in.
            </p>

            <div style="margin: 25px 0;">
              <div style="display: inline-block; font-size: 32px; letter-spacing: 6px; font-weight: bold; background: #f0f4f8; padding: 12px 28px; border-radius: 8px; color: #111;">
                ${otpCode}
              </div>
            </div>

            <p style="margin: 0; font-size: 14px; color: #777;">
              This code is valid for the next <strong>1 minutes</strong>.
            </p>

            <p style="margin: 20px 0 0; font-size: 14px; color: #777;">
              If you didn’t request this, please ignore this email.
            </p>

            <p style="margin: 25px 0 0; font-size: 14px; color: #777;">
              Thanks<br />
              Maximal Security Team
            </p>

          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 15px;">
        <img src="https://invoice-builder-two.vercel.app/Logo.jpg" alt="Maximal Logo" width="140" style="margin-bottom: 10px;" />
        <p style="font-size: 12px; color: #999; margin: 0;">by Maximal Security</p>
      </div>
    </div>
    `,
  });
};
