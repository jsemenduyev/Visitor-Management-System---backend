import { UserModel } from "../../../../database/models/user";
import bcrypt from "bcrypt";
import { signToken } from "../../../services/authJwt";
import { MutationAuthLoginArgs } from "../../../generated/graphql";
export default async (_, args: MutationAuthLoginArgs) => {
  try {
    const { email, password } = args;

    // 1. Check if user exists
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return {
        error: {
          message: "User not found",
          code: "USER_NOT_FOUND",
        },
        token: null,
        user: null,
      };
    }
    if (!user.password) {
      return {
        error: {
          message: "Invalid credentials",
          code: "INVALID_PASSWORD",
        },
        token: null,
        user: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        error: {
          message: "Invalid credentials",
          code: "INVALID_PASSWORD",
        },
        token: null,
        user: null,
      };
    }

    if (user.role === "employee") {
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
