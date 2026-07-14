import { UserModel } from "../../../../database/models/user";

export default async (_, args) => {
  try {
    const { otp, email } = args;

    // 1. Find user by email + otp
    const user = await UserModel.findOne({ email, otp: otp });
    if (!user) {
      return {
        error: {
          message: "Invalid OTP",
          code: "Invalid OTP",
        },
      };
    }

    // 2. Check expiry
    if (user.otpExpiry < Date.now()) {
      return {
        error: {
          message: "OTP has expired.",
          code: "OTP has expired.",
        },
      };
    }

    // 3. If valid, clear OTP (optional, for one-time use)
    user.otp = undefined;
    await user.save();

    return { user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: error.message };
  }
};
