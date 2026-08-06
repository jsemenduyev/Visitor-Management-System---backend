import { Types } from "mongoose";
import DepartmentModel from "../../../../database/models/department";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import visitorCategory from "../../../../database/models/visitorCategory";
import { normalizeVisitorData } from "../../../../utils/visitorData";
import { MutationCreateVisitorArgs } from "../../../generated/graphql";

export default async (_: any, args: MutationCreateVisitorArgs) => {
  try {
    const { input } = args;
    const normalizedData = normalizeVisitorData(input.data);

    // ✅ Remove pre-register entry
    if (normalizedData?.fullName) {
      await PreRegisterVisitorModel.findOneAndDelete({
        "data.fullName": normalizedData.fullName,
      });
    }

    // ✅ Prevent duplicate signed-in visitors based on phone or email
    const duplicateConditions: any[] = [];
    if (normalizedData?.phoneNumber) {
      duplicateConditions.push({
        "data.phoneNumber": normalizedData.phoneNumber,
      });
    }
    if (normalizedData?.emailAddress) {
      duplicateConditions.push({
        "data.emailAddress": normalizedData.emailAddress,
      });
    }

    if (duplicateConditions.length > 0) {
      const existingVisitor = await VisitorModel.findOne({
        $or: duplicateConditions,
        signedType: "In",
      });

      if (existingVisitor) {
        return {
          error: { message: "Visitor already exists", code: "ALREADY_EXISTS" },
        };
      }
    }

    // ✅ Category
    const category = await visitorCategory.findById(input.category).lean();
    if (!category) {
      return {
        error: {
          message: "Invalid visitor category",
          code: "INVALID_CATEGORY",
        },
      };
    }

    let employees: Types.ObjectId[] = [];

    /**
     * -----------------------------------
     * CASE 1: Department
     * -----------------------------------
     */
    if (input.department) {
      const department = await DepartmentModel.findById(input.department)
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

      employees = (department.user || []).map((u: any) => u._id);
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

      employees = [employee._id];
    }

    /**
     * -----------------------------------
     * Create visitor payload
     * Notifications are sent from updateVisitor (after photo is attached).
     * -----------------------------------
     */
    const newInput = {
      ...input,
      data: normalizedData,
      company: category.company,
      employees,
      signedType: category.approval ? "Pending" : "In",
      // Client-provided ISO datetime (online: now; offline sync: original local time)
      signedIn: input.signedIn,
      notificationSent: false,
    };

    const visitor = await VisitorModel.create(newInput);

    return { visitor };
  } catch (error: any) {
    console.error("Create Visitor Error:", error);
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "SERVER_ERROR",
      },
    };
  }
};
