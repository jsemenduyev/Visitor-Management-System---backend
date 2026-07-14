import VisitorModel from "../../../../database/models/visitor";
import { MutationUpdateVisitorArgs } from "../../../generated/graphql";

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

    if (input.signedType === "In" && !visitor.signedIn) {
      updateData.signedIn = new Date().toISOString();
    }
    if (input.signedType === "Out" && !visitor.signedOut) {
      updateData.signedOut = new Date().toISOString();
    }


    const updatedVisitor = await VisitorModel.findByIdAndUpdate(
      visitor._id,
      updateData,
      { new: true }
    ).lean();

    return {
      visitor: updatedVisitor,
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
