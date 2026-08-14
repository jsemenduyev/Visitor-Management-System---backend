import { UserModel } from "../../../../database/models/user";
import { sendOtpEmail } from "../../../../utils/otpEmail";

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
          message: "Employee Not Found",
          code: "NOT_FOUND",
        },
      };
    }

    const verifiedUsers = users.filter((user) => user.status);
    if (!verifiedUsers.length) {
      return {
        error: {
          message: "Employee Not Verified",
          code: "NOT_FOUND",
        },
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1 * 60 * 1000;

    await UserModel.updateMany(
      { _id: { $in: verifiedUsers.map((user) => user._id) } },
      { $set: { otp, otpExpiry } },
    );

    await sendOtpEmail(verifiedUsers[0].firstName || "User", otp, normalizedEmail);

    return {
      user: verifiedUsers[0],
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
