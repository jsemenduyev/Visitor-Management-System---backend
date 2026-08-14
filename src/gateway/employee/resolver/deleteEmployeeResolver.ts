import { UserModel } from "../../../../database/models/user";
import DepartmentModel from "../../../../database/models/department";
import { MutationDeleteEmployeeArgs } from "../../../generated/graphql";

export default async (args: MutationDeleteEmployeeArgs, ctx) => {
  try {
    const { employeeId } = args;
    const company = ctx?.user?.company;

    if (!employeeId) {
      throw new Error("Employee ID is required");
    }

    if (!company) {
      throw new Error("User does not belong to any company");
    }

    const user = await UserModel.findOne({ _id: employeeId, company });

    if (!user) {
      throw new Error("Employee not found");
    }

    if (user.role === "admin") {
      return {
        error: {
          message: "Admin accounts can't be archived",
          code: "ARCHIVE_ERROR",
        },
      };
    }

    /** ✅ REMOVE USER FROM DEPARTMENTS (same company) */
    await DepartmentModel.updateMany(
      { user: employeeId, company },
      { $pull: { user: employeeId } }
    );

    /** ✅ SOFT DELETE — mark archived instead of removing */
    const archivedUser = await UserModel.findOneAndUpdate(
      { _id: employeeId, company },
      { isArchived: true, archivedAt: new Date() },
      { new: true }
    );

    return {
      user: archivedUser,
    };
  } catch (error) {
    console.error("Delete Employee Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete employee"
    );
  }
};
