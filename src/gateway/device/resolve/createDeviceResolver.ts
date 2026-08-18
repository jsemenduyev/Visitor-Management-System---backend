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

export default async (args: MutationCreateDeviceArgs, ctx: any) => {
  try {
    const { input } = args;
    const { _id: createdBy, company } = ctx.user;

    if (!company) {
      return {
        error: {
          message: "User does not belong to any company",
          code: "NO_COMPANY_FOUND",
        },
      };
    }

    // A creator cannot reuse a device name, but another creator can.
    const deviceExist = await DeviceModel.findOne({
      deviceName: input.deviceName,
      createdBy,
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

    // Company and ownership always come from the authenticated user.
    const { company: _ignoredCompany, ...safeInput } = input as any;
    const newInput = {
      ...safeInput,
      deviceId,
      company,
      createdBy,
    };

    const device = await DeviceModel.create(newInput);

    return {
      device,
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
        code: "INTERNAL_ERROR",
      },
    };
  }
};
