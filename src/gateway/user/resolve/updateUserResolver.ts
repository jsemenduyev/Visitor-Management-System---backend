import bcrypt from "bcrypt";
import crypto from "crypto";
import DepartmentModel from "../../../../database/models/department";
import { UserModel } from "../../../../database/models/user";
import { sendTemporaryPasswordEmail } from "../../../../utils/email";
import { MutationUpdateUserArgs } from "../../../generated/graphql";
import { dashboardEmployeeFilter } from "../../utils/ownerScope";
import { createHeadOfficeForAdmin } from "../../utils/locationOwnerScope";

const generateTempPassword = () =>
  crypto.randomBytes(5).toString("base64url").slice(0, 10);

export default async (args: MutationUpdateUserArgs, ctx) => {
  try {
    const { input } = args;
    const authUser = ctx?.user;
    const company = authUser?.company;

    if (!company) {
      return {
        error: { message: "User does not belong to any company", code: "NO_COMPANY_FOUND" },
      };
    }

    const { _id, department, company: _ignoredCompany, ...updateFields } = input as any;

    // Find user by ID scoped to caller's company and ownership
    const user: any = await UserModel.findOne({
      _id,
      ...dashboardEmployeeFilter(authUser),
    });
    if (!user) {
      return {
        error: { message: "user Not Found", code: "NOT_EXIST" },
      };
    }

    if (updateFields.email) {
      const email = String(updateFields.email).trim().toLowerCase();
      updateFields.email = email;
      const duplicate = await UserModel.findOne({
        email,
        createdBy: user.createdBy || authUser._id,
        _id: { $ne: user._id },
      }).lean();
      if (duplicate) {
        return {
          error: { message: "Employee Already Exists", code: "ALREADY_EXIST" },
        };
      }
    }

    // If department is changing, remove user from old department (same company)
    if (department && user.department && user.department.toString() !== department) {
      await DepartmentModel.findOneAndUpdate(
        { _id: user.department, company },
        { $pull: { user: user._id } }
      );
    }

    // Update user fields (company cannot be changed via this mutation)
    if (department) {
      user.department = department;
    }
    const previousRole = String(user.role || "").toLowerCase();
    const nextRole = String(updateFields.role ?? user.role ?? "").toLowerCase();
    const promotedToWebsiteAccess =
      previousRole !== "admin" &&
      previousRole !== "manager" &&
      (nextRole === "admin" || nextRole === "manager");
    const promotedToAdmin = previousRole !== "admin" && nextRole === "admin";
    Object.assign(user, updateFields);

    if (promotedToWebsiteAccess) {
      const tempPassword = generateTempPassword();
      user.password = await bcrypt.hash(tempPassword, 10);
      user.needPasswordReset = true;
      await user.save();

      try {
        const fullName =
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User";
        await sendTemporaryPasswordEmail(fullName, user.email, tempPassword);
      } catch (emailError) {
        console.error("Failed to send one-time password email:", emailError);
        return {
          user,
          error: {
            message:
              "Role updated but one-time password email could not be sent. Please contact support.",
            code: "EMAIL_SEND_FAILED",
          },
        };
      }
    } else {
      await user.save();
    }

    if (promotedToAdmin) {
      await createHeadOfficeForAdmin({
        userId: user._id,
        companyId: company,
      });
    }

    // Add user to new department if not already there (same company)
    if (department) {
      await DepartmentModel.findOneAndUpdate(
        { _id: department, company },
        { $addToSet: { user: user._id } }
      );
    }

    return { user: user };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: { message: "Internal Server Error", code: "INTERNAL_ERROR" },
    };
  }
};
