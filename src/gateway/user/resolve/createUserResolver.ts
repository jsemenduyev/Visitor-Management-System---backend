import bcrypt from "bcrypt";
import crypto from "crypto";
import { CompanyModel } from "../../../../database/models/company";
import { UserModel } from "../../../../database/models/user";
import { sendEmployeeWelcomeEmail } from "../../../../utils/email";
import { MutationCreateUserArgs } from "../../../generated/graphql";

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

    const requiresWebsiteAccess = canLoginToWebsite(input.role);
    let tempPassword = "";

    const { password, ...rest } = input as typeof input & {
      password?: string | null;
    };

    const createPayload: Record<string, any> = {
      ...rest,
      company,
      createdBy: user._id,
    };

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

    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5f6d2e'},body:JSON.stringify({sessionId:'5f6d2e',runId:'post-fix',location:'createUserResolver.ts:afterCreate',message:'employee created',data:{creatorId:String(user?._id||''),newEmployeeId:String(createdEmployee?._id||''),savedCreatedBy:createdEmployee?.createdBy?String(createdEmployee.createdBy):null},timestamp:Date.now(),hypothesisId:'H2-fix'})}).catch(()=>{});
    // #endregion

    if (requiresWebsiteAccess && tempPassword) {
      try {
        const fullName =
          `${createdEmployee.firstName ?? ""} ${createdEmployee.lastName ?? ""}`.trim() ||
          "User";

        await sendEmployeeWelcomeEmail(
          createdEmployee._id.toString(),
          fullName,
          createdEmployee.email,
          tempPassword,
        );
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
