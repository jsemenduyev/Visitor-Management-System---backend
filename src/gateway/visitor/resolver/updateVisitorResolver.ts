import DepartmentModel from "../../../../database/models/department";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import visitorCategory from "../../../../database/models/visitorCategory";
import { sendVisitorApprovalEmail } from "../../../../utils/approvalEmail";
import {
  getUserNotificationEmails,
  getUserNotificationPhones,
} from "../../../../utils/userNotificationContacts";
import { sendVisitorArrivalEmail } from "../../../../utils/VisitorEmail";
import {
  normalizeVisitorData,
  resolveDeviceLabel,
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

  if (!notifyTargets.length) return;

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
  const deviceLabel = await resolveDeviceLabel(visitor);

  await Promise.all(
    notifyTargets.map(async (user) => {
      if (user.notificationPreference?.includes("Email")) {
        const hostLabel = hostLabelForUser(user, department?.name);
        const emails = getUserNotificationEmails(user);

        await Promise.all(
          emails.map((email) =>
            type === "arrival"
              ? sendVisitorArrivalEmail(
                  visitorName,
                  category.name,
                  new Date().toLocaleString(),
                  hostLabel,
                  photoUrl,
                  email,
                  deviceLabel,
                  visitorData,
                )
              : sendVisitorApprovalEmail(
                  visitorName,
                  category.name,
                  new Date().toLocaleString(),
                  hostLabel,
                  photoUrl,
                  `${process.env.SERVER_URL}/approveVisitor?visitorId=${visitorId}`,
                  `${process.env.SERVER_URL}/rejectVisitor?visitorId=${visitorId}`,
                  email,
                  deviceLabel,
                  visitorData,
                ),
          ),
        );
      }

      if (user.notificationPreference?.includes("SMS")) {
        const hostFirstName = user.firstName?.trim() || "there";
        const companySuffix = dataObj.companyName
          ? ` (${dataObj.companyName})`
          : "";
        const msg =
          type === "arrival"
            ? `Hello ${hostFirstName}, new visitor, ${visitorName}${companySuffix}, is here to meet you. Maximal Security`
            : `Hello, A new visitor, ${visitorName}, requires approval. Please check your email. — Maximal Security`;

        await Promise.all(
          getUserNotificationPhones(user).map((phone) =>
            sendTwilioMessage(phone, msg),
          ),
        );
      }
    }),
  );
}
