import VisitorModel from "../../../../database/models/visitor";
import { MutationUpdateVisitorStatusArgs } from "../../../generated/graphql";

export default async (_, args: MutationUpdateVisitorStatusArgs) => {
  try {
    const { visitorId } = args;

    const visitor = await VisitorModel.findByIdAndUpdate(
      visitorId, // ✅ just pass the ID
      { signedType: "Out", signedOut: new Date().toISOString(),signedOutDevice:"Mobile" }, // update object
      { new: true } // return updated document
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
