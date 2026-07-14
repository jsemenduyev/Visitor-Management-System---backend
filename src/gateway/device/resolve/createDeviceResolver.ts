import DeviceModel from "../../../../database/models/devices";
import { MutationCreateDeviceArgs } from "../../../generated/graphql";

// helper to generate random 6-char alphanumeric string
function generateDeviceId(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async (args: MutationCreateDeviceArgs) => {
  try {
    const { input } = args;

    // check if device already exists by name
    const deviceExist = await DeviceModel.findOne({
      deviceName: input.deviceName,
    });
    if (deviceExist) {
      return {
        error: {
          message: "Device Already Exists",
          code: "ALREADY_EXISTS",
        },
      };
    }

    // generate unique deviceId
    let deviceId: string;
    let isUnique = false;

    while (!isUnique) {
      const tempId = generateDeviceId(6);
      const exists = await DeviceModel.findOne({ deviceId: tempId });
      if (!exists) {
        deviceId = tempId;
        isUnique = true;
      }
    }

    const newInput = {
      ...input,
      deviceId,
    };

    const device = await DeviceModel.create(newInput);

    return {
      data: device,
    };
  } catch (error) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
