import DeviceModel from "../../../../database/models/devices";
import { MutationUpdateDeviceArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateDeviceArgs, ctx: any) => {
  try {
    const { input } = args;
    const { _id, ...updates } = input as any;

    const ownedDevice = await DeviceModel.exists({
      _id,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    });

    if (!ownedDevice) {
      return {
        error: {
          message: "Device not found",
          code: "NOT_FOUND",
        },
      };
    }

    if (updates.deviceName) {
      const deviceExist = await DeviceModel.findOne({
        _id: { $ne: _id },
        deviceName: updates.deviceName,
        createdBy: ctx.user._id,
      });

      if (deviceExist) {
        return {
          error: {
            message: "Device Already Exists",
            code: "ALREADY_EXISTS",
          },
        };
      }
    }

    const updatedDevice = await DeviceModel.findOneAndUpdate(
      {
        _id,
        company: ctx.user.company,
        createdBy: ctx.user._id,
      },
      { $set: updates },
      { new: true, runValidators: true }
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
    if (error?.code === 11000) {
      return {
        error: {
          message: "Device Already Exists",
          code: "ALREADY_EXISTS",
        },
      };
    }

    return {
      error: {
        message: error.message || "Something went wrong",
        code: "SERVER_ERROR",
      },
    };
  }
};
