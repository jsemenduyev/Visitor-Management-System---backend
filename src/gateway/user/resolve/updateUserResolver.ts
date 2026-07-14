import DepartmentModel from "../../../../database/models/department";
import { UserModel } from "../../../../database/models/user";
import { MutationUpdateUserArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateUserArgs) => {
  try {
    const { input } = args;
    const { _id, department, ...updateFields } = input;

    // Find user by ID
    const user:any = await UserModel.findById(_id);
    if (!user) {
      return {
        error: { message: "user Not Found", code: "NOT_EXIST" },
      };
    }

    // If department is changing, remove user from old department
    if (department && user.department && user.department.toString() !== department) {
      await DepartmentModel.findByIdAndUpdate(user.department, {
        $pull: { user: user._id },
      });
    }

    // Update user fields
    if (department) {
      user.department = department;
    }
    Object.assign(user, updateFields);
    await user.save();

    // Add user to new department if not already there
    if (department) {
      await DepartmentModel.findByIdAndUpdate(department, {
        $addToSet: { user: user._id }, // $addToSet avoids duplicates
      });
    }

    return {user: user };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      error: { message: "Internal Server Error", code: "INTERNAL_ERROR" },
    };
  }
};
