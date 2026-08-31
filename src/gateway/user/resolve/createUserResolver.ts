import bcrypt from "bcrypt";
import crypto from "crypto";
import { CompanyModel } from "../../../../database/models/company";
import { UserModel } from "../../../../database/models/user";
import {
  sendEmployeeWelcomeEmail,
  sendEmployeeWelcomeOnlyEmail,
} from "../../../../utils/email";
import { MutationCreateUserArgs } from "../../../generated/graphql";
import { createHeadOfficeForAdmin } from "../../utils/locationOwnerScope";
import { phonesAreDuplicate } from "../../../../utils/phoneValidation";

const generateTempPassword = () =>
  crypto.randomBytes(5).toString("base64url").slice(0, 10);

const canLoginToWebsite = (role?: string | null) => {
  const normalized = String(role || "").toLowerCase();
  return normalized === "manager" || normalized === "admin";
};

export default async (args: MutationCreateUserArgs, ctx: any) => {
  try {
    const { input } = args;
    const { user } = ctx;
    const company = user.company;
    const email = String(input.email || "").trim().toLowerCase();

    const existingEmployee = await UserModel.findOne({
      email,
      createdBy: user._id,
    });
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

    const requiresWebsiteAccess = canLoginToWebsite(input.role);
    let tempPassword = "";

    const { password, ...rest } = input as typeof input & {
      password?: string | null;
    };

    const createPayload: Record<string, any> = {
      ...rest,
      email,
      company,
      createdBy: user._id,
    };

    if (input.phoneCountryCode) {
      createPayload.phoneCountryCode = String(input.phoneCountryCode)
        .trim()
        .toLowerCase();
    }

    if (input.email2?.trim()) {
      createPayload.email2 = String(input.email2).trim().toLowerCase();
    } else {
      delete createPayload.email2;
    }

    if (input.phone2?.trim()) {
      createPayload.phone2 = String(input.phone2).trim();
      if (input.phoneCountryCode2) {
        createPayload.phoneCountryCode2 = String(input.phoneCountryCode2)
          .trim()
          .toLowerCase();
      }
    } else {
      delete createPayload.phone2;
      delete createPayload.phoneCountryCode2;
    }

    if (
      phonesAreDuplicate(createPayload.phone, createPayload.phone2)
    ) {
      return {
        error: {
          message: "Secondary phone must be different from primary phone",
          code: "DUPLICATE_PHONE",
        },
      };
    }

    if (requiresWebsiteAccess) {
      tempPassword = generateTempPassword();
      createPayload.password = await bcrypt.hash(tempPassword, 10);
      createPayload.status = false;
      createPayload.needPasswordReset = true;
    } else {
      createPayload.status = true;
      createPayload.needPasswordReset = false;
    }

    const createdEmployee = await UserModel.create(createPayload);

    if (String(createdEmployee.role || "").toLowerCase() === "admin") {
      await createHeadOfficeForAdmin({
        userId: createdEmployee._id,
        companyId: company,
      });
    }

    const fullName =
      `${createdEmployee.firstName ?? ""} ${createdEmployee.lastName ?? ""}`.trim() ||
      "User";

    try {
      if (requiresWebsiteAccess && tempPassword) {
        await sendEmployeeWelcomeEmail(
          createdEmployee._id.toString(),
          fullName,
          createdEmployee.email,
          tempPassword,
        );
      } else {
        await sendEmployeeWelcomeOnlyEmail(fullName, createdEmployee.email);
      }
    } catch (emailError) {
      console.error("Failed to send employee welcome email:", emailError);
      return {
        user: createdEmployee,
        error: {
          message:
            "Employee created but welcome email could not be sent. Please contact support.",
          code: "EMAIL_SEND_FAILED",
        },
      };
    }

    return {
      user: createdEmployee,
    };
  } catch (error: any) {
    console.error("Error creating employee:", error);

    if (error?.code === 11000) {
      return {
        error: {
          message: "Employee Already Exists",
          code: "ALREADY_EXIST",
        },
      };
    }

    return {
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
