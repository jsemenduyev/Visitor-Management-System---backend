import bcrypt from "bcrypt";
import { CompanyModel } from "../../../../database/models/company";
import { UserModel } from "../../../../database/models/user";
import { sendVerificationLinkToUser, sendTemporaryPasswordEmail } from "../../../../utils/email";
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

    let tempPassword = "";
    if (needsPassword) {
      tempPassword = Math.random().toString(36).slice(-8); // 8 character random string
    }

    const { password, ...rest } = input as typeof input & {
      password?: string | null;
    };

    const createPayload: Record<string, any> = {
      ...rest,
      company,
      status: needsPassword ? true : false, // managers/admins active immediately to login with temp pass
      needPasswordReset: needsPassword ? true : false,
    };

    if (needsPassword && tempPassword) {
      createPayload.password = await bcrypt.hash(tempPassword, 10);
    }

    const createdEmployee = await UserModel.create(createPayload);

    if (needsPassword && tempPassword) {
      try {
        await sendTemporaryPasswordEmail(
          createdEmployee.firstName || "User",
          createdEmployee.email,
          tempPassword
        );
      } catch (emailError) {
        console.error("Failed to send temporary password email:", emailError);
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
