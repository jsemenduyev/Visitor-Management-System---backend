import { UserModel } from "../../../../database/models/user";
import { signToken } from "../../../services/authJwt";

export default async (_, args) => {
  try {
    const { email, otp } = args;
    console.log(email, "EMIII", otp);

    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        error: { message: "Employee Not Found", code: "NOT_FOUND" },
      };
    }

    if (user.otp !== otp) {
      return {
        error: { message: "Invalid OTP", code: "INVALID_OTP" },
      };
    }

    if (user.otpExpiry < Date.now()) {
      return {
        error: { message: "OTP expired", code: "OTP_EXPIRED" },
      };
    }

    // OTP Success → clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // 3. Create JWT token
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
