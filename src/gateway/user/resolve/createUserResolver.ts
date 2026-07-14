import bcrypt from "bcrypt";
import { CompanyModel } from "../../../../database/models/company";
import { UserModel } from "../../../../database/models/user";
import { sendVerificationLinkToUser } from "../../../../utils/email";
import { MutationCreateUserArgs } from "../../../generated/graphql";

export default async (args: MutationCreateUserArgs, ctx: any) => {
  try {
    const { input } = args;
    const { user } = ctx;
    const company = user.company;

    // Check if employee exists
    const existingEmployee = await UserModel.findOne({ email: input.email });
    if (existingEmployee) {
      return {
        error: {
          message: "Employee Already Exists",
          code: "ALREADY_EXIST",
        },
      };
    }
    const companyData = await CompanyModel.findById({ _id: company }).lean();

    if (!companyData) {
      return {
        error: {
          message: "Company Not Found",
          code: "NOT_FOUND",
        },
      };
    }
    if (input.department === "") input.department = null;

    const needsPassword =
      String(input.role || "").toLowerCase() === "manager" ||
      String(input.role || "").toLowerCase() === "admin";

    if (needsPassword) {
      if (!input.password || String(input.password).trim().length < 6) {
        return {
          error: {
            message: "Password is required (min 6 characters) for manager/admin",
            code: "PASSWORD_REQUIRED",
          },
        };
      }
    }

    const { password, ...rest } = input as typeof input & {
      password?: string | null;
    };

    const createPayload: Record<string, any> = {
      ...rest,
      company,
      status: false,
    };

    if (needsPassword && password) {
      createPayload.password = await bcrypt.hash(password, 10);
    }

    const createdEmployee = await UserModel.create(createPayload);

    if (needsPassword) {
      try {
        await sendVerificationLinkToUser(
          createdEmployee._id.toString(),
          createdEmployee.firstName || "User",
          createdEmployee.email,
        );
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }
    }

    return {
      user: createdEmployee,
    };
  } catch (error) {
    console.error("Error creating employee:", error);

    return {
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
