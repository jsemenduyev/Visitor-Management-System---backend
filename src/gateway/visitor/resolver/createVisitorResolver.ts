import { Types } from "mongoose";
import DepartmentModel from "../../../../database/models/department";
import OfficeLocationModel from "../../../../database/models/officelocations";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import visitorCategory from "../../../../database/models/visitorCategory";
import { sendVisitorApprovalEmail } from "../../../../utils/approvalEmail";
import { sendVisitorArrivalEmail } from "../../../../utils/VisitorEmail";
import { MutationCreateVisitorArgs } from "../../../generated/graphql";
import { sendTwilioMessage } from "../../../services/sendMessage";

export default async (_: any, args: MutationCreateVisitorArgs) => {
  try {
    const { input } = args;

    // ✅ Remove pre-register entry
    if (input.data?.fullName) {
      await PreRegisterVisitorModel.findOneAndDelete({
        "data.fullName": input.data.fullName,
      });
    }

    // ✅ Prevent duplicate signed-in visitors based on phone or email
    const duplicateConditions: any[] = [];
    if (input.data?.phoneNumber) duplicateConditions.push({ "data.phoneNumber": input.data.phoneNumber });
    if (input.data?.emailAddress) duplicateConditions.push({ "data.emailAddress": input.data.emailAddress });

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

    // ✅ Location settings (for includeAllVisitorResponses)
    const location = await OfficeLocationModel.findById(input.location).lean();
    const includeResponses = location?.approvals?.includeAllVisitorResponses ?? false;
    const visitorData = includeResponses && input.data ? (input.data as Record<string, any>) : undefined;

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

    /**
     * -----------------------------------
     * Notification helper
     * -----------------------------------
     */
    const notifyUsers = async (
      users: any[],
      type: "arrival" | "approval",
      visitorId: string,
    ) => {
      if (!users.length) return;

      await Promise.all(
        users.map(async (user) => {
          // Email
          if (user.notificationPreference?.includes("Email")) {
            if (type === "arrival") {
              await sendVisitorArrivalEmail(
                input.data.fullName,
                category.name,
                new Date().toLocaleString(),
                department?.name || user.name || "N/A",
                input.img,
                user.email,
                visitorData,
              );
            } else {
              await sendVisitorApprovalEmail(
                input.data.fullName,
                category.name,
                new Date().toLocaleString(),
                department?.name || user.name || "N/A",
                input.img,
                `${process.env.SERVER_URL}/approveVisitor?visitorId=${visitorId}`,
                `${process.env.SERVER_URL}/rejectVisitor?visitorId=${visitorId}`,
                user.email,
                visitorData,
              );
            }
          }

          // SMS
          if (user.phone && user.notificationPreference?.includes("SMS")) {
            const msg =
              type === "arrival"
                ? `Hello, A new visitor, ${input.data.fullName}${
                    input.data.companyName ? ` (${input.data.companyName})` : ""
                  }, is here to meet you. — Maximal Security`
                : `Hello, A new visitor, ${input.data.fullName}, requires approval. Please check your email. — Maximal Security`;

            await sendTwilioMessage(user.phone, msg);
          }
        }),
      );
    };

    /**
     * -----------------------------------
     * Create visitor payload
     * -----------------------------------
     */
    const newInput = {
      ...input,
      company: category.company,
      employees,
      signedType: category.approval ? "Pending" : "In",
      ...(category.approval ? {} : { signedIn: new Date().toISOString() }),
    };

    const visitor = await VisitorModel.create(newInput);

    /**
     * -----------------------------------
     * Notifications
     * -----------------------------------
     */
    if (notifyTargets.length > 0) {
      await notifyUsers(
        notifyTargets,
        category.approval ? "approval" : "arrival",
        visitor._id.toString(),
      );
    }

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
