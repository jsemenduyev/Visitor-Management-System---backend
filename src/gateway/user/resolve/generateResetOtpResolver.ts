import nodemailer from "nodemailer";
import { UserModel } from "../../../../database/models/user";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

export default async (_, args) => {
  try {
    const { email } = args;
    const normalizedEmail = normalizeEmail(email);

    const users = await UserModel.find({ email: normalizedEmail });
    if (!users.length) {
      return {
        error: {
          message: "User not found with this email.",
          code: "NOT_FOUND",
        },
      };
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    await UserModel.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $set: { otp, otpExpiry } },
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.5;">
          <h2>Password Reset Request</h2>
          <p>Hello ${users[0].firstName || ""},</p>
          <p>We received a request to reset your password. Use the OTP below to continue:</p>
          <h1 style="color:#2b6cb0;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { user: users[0] };
  } catch (error) {
    console.error("Error sending reset OTP:", error);
    return { success: false, message: error.message };
  }
};
