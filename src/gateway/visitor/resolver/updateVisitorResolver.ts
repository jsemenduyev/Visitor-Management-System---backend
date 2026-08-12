import DepartmentModel from "../../../../database/models/department";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import visitorCategory from "../../../../database/models/visitorCategory";
import { sendVisitorApprovalEmail } from "../../../../utils/approvalEmail";
import { sendVisitorArrivalEmail } from "../../../../utils/VisitorEmail";
import {
  normalizeVisitorData,
  resolveVisitorFullName,
} from "../../../../utils/visitorData";
import { MutationUpdateVisitorArgs } from "../../../generated/graphql";
import { sendTwilioMessage } from "../../../services/sendMessage";

const hostLabelForUser = (user: any, departmentName?: string) =>
  departmentName ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  user?.name ||
  "N/A";

export default async (_: any, args: MutationUpdateVisitorArgs) => {
  try {
    const { input } = args;

    if (!input?._id) {
      return {
        error: {
          message: "Visitor ID is required",
          code: "MISSING_ID",
        },
      };
    }

    const visitor = await VisitorModel.findById(input._id);

    if (!visitor) {
      return {
        error: {
          message: "Visitor does not exist",
          code: "NOT_EXIST",
        },
      };
    }

    // 👇 Type cast input to any so we can safely add Mongo fields
    const updateData: any = { ...input };
    delete updateData._id;

    if (input.data) {
      updateData.data = normalizeVisitorData(input.data);
    }

    if (input.signedType === "In" && !visitor.signedIn) {
      updateData.signedIn = new Date().toISOString();
    }
    if (input.signedType === "Out" && !visitor.signedOut) {
      updateData.signedOut = new Date().toISOString();
    }

    const hasUpdates = Object.keys(updateData).length > 0;
    const updatedVisitor = hasUpdates
      ? await VisitorModel.findByIdAndUpdate(visitor._id, updateData, {
          new: true,
        }).lean()
      : await VisitorModel.findById(visitor._id).lean();

    if (!updatedVisitor) {
      return {
        error: {
          message: "Visitor does not exist",
          code: "NOT_EXIST",
        },
      };
    }

    // Arrival/approval emails fire here (not on create) so photo can be included.
    // Skip reject/out and avoid duplicate sends.
    const shouldNotify =
      !visitor.notificationSent &&
      updatedVisitor.signedType !== "Rejected" &&
      updatedVisitor.signedType !== "Out";

    let notificationSent = !!visitor.notificationSent;

    if (shouldNotify) {
      try {
        await notifyVisitorHosts(updatedVisitor);
        await VisitorModel.findByIdAndUpdate(visitor._id, {
          notificationSent: true,
        });
        notificationSent = true;
      } catch (notifyError) {
        console.error("Visitor notification error:", notifyError);
      }
    }

    return {
      visitor: { ...updatedVisitor, notificationSent },
    };
  } catch (error: any) {
    console.error("Error updating visitor:", error);
    return {
      error: {
        message: error.message || "Something went wrong while updating visitor",
        code: "SERVER_ERROR",
      },
    };
  }
};

async function notifyVisitorHosts(visitor: any) {
  const category = visitor.category
    ? await visitorCategory.findById(visitor.category).lean()
    : null;

  if (!category) return;

  let department: any = null;
  let notifyTargets: any[] = [];

  if (visitor.department) {
    department = await DepartmentModel.findById(visitor.department)
      .populate("user")
      .lean();
    notifyTargets = department?.user || [];
  } else if (visitor.employees?.length) {
    notifyTargets = await UserModel.find({
      _id: { $in: visitor.employees },
    }).lean();
  }

  if (!notifyTargets.length) {
    console.log("SMS log skipped: no host users to notify");
    return;
  }

  const location = visitor.location
    ? await OfficeLocationModel.findById(visitor.location).lean()
    : null;
  const includeResponses =
    location?.approvals?.includeAllVisitorResponses ?? false;

  const dataObj =
    visitor.data instanceof Map
      ? Object.fromEntries(visitor.data.entries())
      : visitor.data || {};
  const visitorName = resolveVisitorFullName(dataObj);
  const visitorData = includeResponses ? dataObj : undefined;
  const photoUrl = visitor.img || "";
  const type: "arrival" | "approval" =
    visitor.signedType === "Pending" ? "approval" : "arrival";
  const visitorId = visitor._id.toString();

  await Promise.all(
    notifyTargets.map(async (user) => {
      const prefs = user.notificationPreference || [];
      console.log("SMS log host", {
        email: user.email,
        phone: user.phone || null,
        prefs,
        type,
      });

      if (prefs.includes("Email")) {
        try {
          const hostLabel = hostLabelForUser(user, department?.name);

          if (type === "arrival") {
            await sendVisitorArrivalEmail(
              visitorName,
              category.name,
              new Date().toLocaleString(),
              hostLabel,
              photoUrl,
              user.email,
              visitorData,
            );
          } else {
            await sendVisitorApprovalEmail(
              visitorName,
              category.name,
              new Date().toLocaleString(),
              hostLabel,
              photoUrl,
              `${process.env.SERVER_URL}/approveVisitor?visitorId=${visitorId}`,
              `${process.env.SERVER_URL}/rejectVisitor?visitorId=${visitorId}`,
              user.email,
              visitorData,
            );
          }
        } catch (emailError: any) {
          console.error(
            "Email notification failed (SMS will still send):",
            emailError?.message || emailError,
          );
        }
      }

      if (!prefs.includes("SMS")) {
        console.log("SMS log skipped: SMS preference not enabled", user.email);
        return;
      }

      if (!user.phone) {
        console.log("SMS log skipped: no phone on user", user.email);
        return;
      }

      const msg =
        type === "arrival"
          ? `Hello, A new visitor, ${visitorName}${
              dataObj.companyName ? ` (${dataObj.companyName})` : ""
            }, is here to meet you. — Maximal Security`
          : `Hello, A new visitor, ${visitorName}, requires approval. Please check your email. — Maximal Security`;

      await sendTwilioMessage(user.phone, msg);
    }),
  );
}
