import { UserModel } from "../../../../database/models/user";
import bcrypt from "bcrypt";
import { signToken } from "../../../services/authJwt";
import { MutationAuthLoginArgs } from "../../../generated/graphql";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

export default async (_, args: MutationAuthLoginArgs) => {
  try {
    const { email, password } = args;
    const normalizedEmail = normalizeEmail(email);
    const candidates = await UserModel.find({ email: normalizedEmail }).lean();

    if (!candidates.length) {
      return {
        error: {
          message: "User not found",
          code: "USER_NOT_FOUND",
        },
        token: null,
        user: null,
      };
    }

    let user: (typeof candidates)[number] | null = null;
    for (const candidate of candidates) {
      if (!candidate.password || candidate.role === "employee") {
        continue;
      }
      const isMatch = await bcrypt.compare(password, candidate.password);
      if (isMatch) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      return {
        error: {
          message: "Invalid credentials",
          code: "INVALID_PASSWORD",
        },
        token: null,
        user: null,
      };
    }

    if (!user.status) {
      return {
        error: {
          message: "User Not Verified",
          code: "USER_NOT_VERIFIED",
        },
      };
    }

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
      error: null,
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
