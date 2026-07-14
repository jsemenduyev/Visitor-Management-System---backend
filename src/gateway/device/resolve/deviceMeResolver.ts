import DeviceModel from "../../../../database/models/devices";

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
      .populate("location")
      .lean();
console.log("deviceMeResolver: device found", device);
    if (!device) {
      return {
        error: {
          message: "Unauthorized: Invalid session",
          code: "UNAUTHORIZED",
        },
      };
    }

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
