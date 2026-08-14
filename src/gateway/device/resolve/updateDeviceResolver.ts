import DeviceModel from "../../../../database/models/devices";
import { MutationUpdateDeviceArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateDeviceArgs) => {
  try {
    const { input } = args;

    const updatedDevice = await DeviceModel.findByIdAndUpdate(
      { _id: input._id },
      { $set: input },
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
