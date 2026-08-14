import DepartmentModel from "../../../../database/models/department";
import { UserModel } from "../../../../database/models/user";
import { MutationUpdateUserArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateUserArgs, ctx) => {
  try {
    const { input } = args;
    const company = ctx?.user?.company;

    if (!company) {
      return {
        error: { message: "User does not belong to any company", code: "NO_COMPANY_FOUND" },
      };
    }

    const { _id, department, company: _ignoredCompany, ...updateFields } = input as any;

    // Find user by ID scoped to caller's company
    const user: any = await UserModel.findOne({ _id, company });
    if (!user) {
      return {
        error: { message: "user Not Found", code: "NOT_EXIST" },
      };
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
    Object.assign(user, updateFields);
    await user.save();

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
