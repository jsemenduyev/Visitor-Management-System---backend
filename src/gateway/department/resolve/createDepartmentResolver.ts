import DepartmentModel from "../../../../database/models/department";
import { MutationCreateDepartmentArgs } from "../../../generated/graphql";

export default async (args: MutationCreateDepartmentArgs, ctx) => {
  try {
    const { input } = args;
    const company = ctx?.user?.company;

    if (!company) {
      return {
        error: {
          message: "User does not belong to any company",
          code: "NO_COMPANY_FOUND",
        },
      };
    }

    // Never trust client-provided company — always use caller's company
    const { company: _ignoredCompany, ...restInput } = input as any;
    const scopedInput = { ...restInput, company, createdBy: ctx.user._id };

    // Duplicate check only for CREATE
    if (!input._id) {
      const existingDepartment = await DepartmentModel.findOne({
        name: input.name,
        company,
        createdBy: ctx.user._id,
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

    // Update existing department (scoped to caller's company)
    if (input._id) {
      const updatedDepartment = await DepartmentModel.findOneAndUpdate(
        { _id: input._id, company, createdBy: ctx.user._id },
        scopedInput,
        { new: true }
      );

      if (!updatedDepartment) {
        return {
          error: {
            message: "Department not found",
            code: "NOT_FOUND",
          },
        };
      }

      return {
        department: updatedDepartment,
        error: null,
      };
    }

    // Create new department
    const createdDepartment = await DepartmentModel.create(scopedInput);

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
