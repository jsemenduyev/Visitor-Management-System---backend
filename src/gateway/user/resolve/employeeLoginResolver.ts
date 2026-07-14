import { UserModel } from "../../../../database/models/user";
import { sendOtpEmail } from "../../../../utils/otpEmail";
import { signToken } from "../../../services/authJwt";

export default async (_, args) => {
  try {
    const { email } = args;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        error: {
          message: "Employee Not Found",
          code: "NOT_FOUND",
        },
      };
    }
    if (!user.status) {
      return {
        error: {
          message: "Employee Not Verified",
          code: "NOT_FOUND",
        },
      };
    }

    // Generate 6-digit OTP
    const otp = "123456"
    Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry = 1 minute from now

    // Save OTP + expiry
    user.otp = otp;
    user.otpExpiry = Date.now() + 1 * 60 * 1000; // number ✔
    await user.save();

    // Send OTP email
    await sendOtpEmail(user.firstName || "User", otp, email);

    return {
      user: user,
    };
  } catch (error) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
      token: null,
      user: null,
    };
  }
};
