import { Company } from "./../../../generated/graphql";
import { Types } from "mongoose";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { MutationCreatePreRegisterArgs } from "../../../generated/graphql";
import DepartmentModel from "../../../../database/models/department";
import { UserModel } from "../../../../database/models/user";

export default async (args: MutationCreatePreRegisterArgs, ctx) => {
  try {
    const { user } = ctx;
    const { input } = args;

    let department: any = null;
    let notifyTargets: any[] = [];
    let employees: Types.ObjectId[] = [];

    /**
     * -----------------------------------
     * CASE 1: Department
     * -----------------------------------
     */
    if (input.department) {
      department = await DepartmentModel.findById(input.department)
        .populate("user")
        .lean();

      if (!department) {
        return {
          error: {
            message: "Selected department not found",
            code: "INVALID_DEPARTMENT",
          },
        };
      }

      notifyTargets = department.user || [];
      employees = notifyTargets.map((u: any) => u._id);
    } else if (input.employee) {
      /**
       * -----------------------------------
       * CASE 2: Employee (ID only)
       * -----------------------------------
       */
      const employee = await UserModel.findById(input.employee).lean();

      if (!employee) {
        return {
          error: {
            message: "Selected employee not found",
            code: "INVALID_EMPLOYEE",
          },
        };
      }

      notifyTargets = [employee];
      employees = [employee._id];
    }
    const newInput = {
      ...input,
      employees,
      company: user.company,
      createdBy: user._id,
    };

    const visitor = await PreRegisterVisitorModel.create(newInput);

    return { visitor };
  } catch (error) {
    console.error("Error creating pre-registered visitor:", error);
    throw new Error(error.message || "Failed to create pre-registered visitor");
  }
};
