import DeviceModel from "../../../../database/models/devices";
import { locationForAdmin } from "../../utils/adminLocationSettings";

export default async (_: any, args: { sessionKey: string }) => {
  try {
    const { sessionKey } = args;

    if (!sessionKey) {
      return {
        error: {
          message: "Unauthorized: No session key provided",
          code: "UNAUTHORIZED",
        },
      };
    }

    const device = await DeviceModel.findOne({ sessionKey })
      .populate("department")
      .populate("categoryType")
      .populate("company")
      .populate({
        path: "location",
        select: "+settingsByAdmin",
      })
      .lean();

    if (!device) {
      return {
        error: {
          message: "Unauthorized: Invalid session",
          code: "UNAUTHORIZED",
        },
      };
    }

    if (device.location) {
      const location = device.location as Record<string, any>;
      const merged = locationForAdmin(location, location.createdBy);
      delete merged.settingsByAdmin;
      device.location = merged as any;
    }

    console.log("Visitor device:", {
      visitor: device.deviceTypes?.join(", ") || "visitor",
      deviceName: device.deviceName,
    });

    // session is valid
    return { device };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "SERVER_ERROR",
      },
    };
  }
};
