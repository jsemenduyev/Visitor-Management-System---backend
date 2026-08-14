import DeviceModel from "../../../../database/models/devices";
import { MutationUpdateDeviceArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateDeviceArgs, ctx: any) => {
  try {
    const { input } = args;

    const { _id, company: _ignoredCompany, createdBy: _ignoredCreatedBy, ...updates } = input as any;
    const updatedDevice = await DeviceModel.findOneAndUpdate(
      { _id, company: ctx.user.company, createdBy: ctx.user._id },
      { $set: updates },
      { new: true } // return updated doc
    );

    if (!updatedDevice) {
      return {
        error: {
          message: "Device not found",
          code: "NOT_FOUND",
        },
      };
    }

    return {
      device: updatedDevice,
    };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "SERVER_ERROR",
      },
    };
  }
};
