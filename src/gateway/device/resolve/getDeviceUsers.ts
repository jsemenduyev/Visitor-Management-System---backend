import DeviceModel from "../../../../database/models/devices";
import { UserModel } from "../../../../database/models/user";

export default async (_: any, args: { sessionKey: string; search: string }) => {
  try {
    const { sessionKey, search } = args;

    if (!sessionKey) {
      return {
        error: {
          message: "Unauthorized: No session key provided",
          code: "UNAUTHORIZED",
        },
      };
    }
    const device = await DeviceModel.findOne({ sessionKey }).lean();

    if (!device) {
      return {
        error: {
          message: "Unauthorized: Invalid session",
          code: "UNAUTHORIZED",
        },
      };
    }

    const query: any = {
      company: device.company,
      location: device.location,
      isArchived: { $ne: true },
      $or: [{ createdBy: device.createdBy }, { _id: device.createdBy }],
    };
    if (search && search.trim() !== "") {
      query.firstName = { $regex: search, $options: "i" };
    }

    const users = await UserModel.find(query).lean();

    return { user: users };
  } catch (error) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "SERVER_ERROR",
      },
    };
  }
};
