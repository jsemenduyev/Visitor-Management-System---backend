import DeviceModel from "../../../../database/models/devices";
import DepartmentModel from "../../../../database/models/department";
import VisitorCategoryModel from "../../../../database/models/visitorCategory";
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

    const [departments, visitorCategories] = await Promise.all([
      DepartmentModel.countDocuments({
        _id: { $in: input.department ?? [] },
        company: ctx.user.company,
        createdBy: ctx.user._id,
        location: input.location,
      }),
      VisitorCategoryModel.countDocuments({
        _id: { $in: input.categoryType ?? [] },
        company: ctx.user.company,
        createdBy: ctx.user._id,
        location: input.location,
      }),
    ]);

    if (
      departments !== (input.department?.length ?? 0) ||
      visitorCategories !== (input.categoryType?.length ?? 0)
    ) {
      return {
        error: {
          message: "Departments and visitor categories must belong to your admin workspace",
          code: "FORBIDDEN_REFERENCE",
        },
      };
    }

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
      company: ctx.user.company,
      createdBy: ctx.user._id,
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
