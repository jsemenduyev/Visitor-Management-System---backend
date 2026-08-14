import { UserModel } from "../../../../database/models/user";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

export default async (_, args) => {
  try {
    const { otp, email } = args;

    const user = await UserModel.findOne({ email: normalizeEmail(email), otp });
    if (!user) {
      return {
        error: {
          message: "Invalid OTP",
          code: "Invalid OTP",
        },
      };
    }

    if (user.otpExpiry < Date.now()) {
      return {
        error: {
          message: "OTP has expired.",
          code: "OTP has expired.",
        },
      };
    }

    return { user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: error.message };
  }
};
