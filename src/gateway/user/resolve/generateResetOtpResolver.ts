import nodemailer from "nodemailer";
import { UserModel } from "../../../../database/models/user";


export default async (_, args) => {
  try {
    const { email } = args;

    // 1. Verify user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        error: {
          message: "User not found with this email.",
          code: "NOT_FOUND",
        },
      };
    }

    // 2. Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 3. Save OTP & expiry in DB (valid for 10 mins)
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 4. Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Mail template
    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.5;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.firstName || ""},</p>
          <p>We received a request to reset your password. Use the OTP below to continue:</p>
          <h1 style="color:#2b6cb0;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // 6. Send mail
    await transporter.sendMail(mailOptions);

    return { user };
  } catch (error) {
    console.error("Error sending reset OTP:", error);
    return { success: false, message: error.message };
  }
};
