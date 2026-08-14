import bcrypt from "bcrypt";
import { UserModel } from "../../../../database/models/user";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

const hasOtp = (user: { otp?: string | null }) =>
  Boolean(user.otp && String(user.otp).trim());

export default async (_, args) => {
  try {
    const { email, password } = args;
    const normalizedEmail = normalizeEmail(email);

    const candidates = await UserModel.find({ email: normalizedEmail });
    const otpUser = candidates.find((row) => hasOtp(row));
    const firstLoginUser = candidates.find((row) => row.needPasswordReset);
    const user = otpUser || firstLoginUser || null;

    if (!user) {
      return {
        error: {
          message: "User not found.",
          code: "NOT_FOUND",
        },
      };
    }

    if (hasOtp(user) && user.otpExpiry && user.otpExpiry < Date.now() && !user.needPasswordReset) {
      return {
        error: {
          message: "OTP has expired.",
          code: "OTP has expired.",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.needPasswordReset = false;
    await user.save();

    await UserModel.updateMany(
      { email: normalizedEmail, _id: { $ne: user._id } },
      { $unset: { otp: 1, otpExpiry: 1 } },
    );

    return { user };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return { error: { message: error.message || "Something went wrong", code: "INTERNAL_SERVER_ERROR" } };
  }
};
