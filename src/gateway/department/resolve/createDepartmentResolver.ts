import DepartmentModel from "../../../../database/models/department";
import { MutationCreateDepartmentArgs } from "../../../generated/graphql";

export default async (args: MutationCreateDepartmentArgs) => {
  try {
    const { input } = args;

    // Duplicate check only for CREATE
    if (!input._id) {
      const existingDepartment = await DepartmentModel.findOne({
        name: input.name,
        company: input.company, // <-- FIXED
      });

      if (existingDepartment) {
        return {
          error: {
            message: "Department Already Exists",
            code: "ALREADY_EXIST",
          },
        };
      }
    }

    // Update existing department
    if (input._id) {
      const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
        input._id,
        input,
        { new: true } // <-- return updated doc
      );

      return {
        department: updatedDepartment,
        error: null,
      };
    }

    // Create new department
    const createdDepartment = await DepartmentModel.create(input);

    return {
      department: createdDepartment,
      error: null,
    };
  } catch (error) {
    console.error("Error creating/updating department:", error);

    return {
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
