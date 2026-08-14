import { UserModel } from "../../../../database/models/user";
import { signToken } from "../../../services/authJwt";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

export default async (_, args) => {
  try {
    const { email, otp } = args;

    const user = await UserModel.findOne({ email: normalizeEmail(email), otp });
    if (!user) {
      return {
        error: { message: "Employee Not Found", code: "NOT_FOUND" },
      };
    }

    if (user.otpExpiry < Date.now()) {
      return {
        error: { message: "OTP expired", code: "OTP_EXPIRED" },
      };
    }

    await UserModel.updateMany(
      { email: normalizeEmail(email), otp },
      { $unset: { otp: 1, otpExpiry: 1 } },
    );

    const token = signToken({
      _id: user._id.toString(),
      name: user.firstName,
      email: user.email,
      role: user.role,
      company: user.company.toString(),
    });

    return {
      token,
      user,
    };
  } catch (error) {
    return {
      error: { message: error.message, code: "INTERNAL_SERVER_ERROR" },
    };
  }
};
