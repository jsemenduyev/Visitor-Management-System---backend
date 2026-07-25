import bcrypt from "bcrypt";
import { UserModel } from "../../../../database/models/user";

export default async (_, args) => {
  try {
    const { email, password } = args;

    // 1. Find user (OTP was already verified in the verify-OTP step)
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        error: {
          message: "User not found.",
          code: "NOT_FOUND",
        },
      };
    }

    // 2. Hash new password and clear any leftover OTP state
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.needPasswordReset = false;
    await user.save();

    return { user };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return { error: { message: error.message || "Something went wrong", code: "INTERNAL_SERVER_ERROR" } };
  }
};
