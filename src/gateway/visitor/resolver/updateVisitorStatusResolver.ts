import VisitorModel from "../../../../database/models/visitor";
import { MutationUpdateVisitorStatusArgs } from "../../../generated/graphql";
import { dashboardOwnerFilter } from "../../utils/ownerScope";

export default async (
  _: any,
  args: MutationUpdateVisitorStatusArgs,
  ctx?: any,
) => {
  try {
    const { visitorId } = args;
    const authUser = ctx?.user;

    const filter: Record<string, any> = { _id: visitorId };
    if (authUser) {
      Object.assign(filter, dashboardOwnerFilter(authUser));
    }

    const visitor = await VisitorModel.findOneAndUpdate(
      filter,
      {
        signedType: "Out",
        signedOut: new Date().toISOString(),
        signedOutDevice: "Mobile",
      },
      { new: true },
    ).lean();

    if (!visitor) {
      return {
        error: { message: "Visitor not found", code: "NOT_FOUND" },
      };
    }
    return { visitor };
  } catch (error) {
    console.error("Error updating visitor:", error);
    throw new Error("Failed to update visitor");
  }
};
