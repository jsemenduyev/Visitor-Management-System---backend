import DeviceModel from "../../../../database/models/devices";
import { QueryGetDevicesArgs } from "../../../generated/graphql";

export default async (args: QueryGetDevicesArgs, ctx) => {
  try {
    const { user } = ctx;

    const devices = await DeviceModel.find({
      company: user.company,
      location: args.location,
    })
      .populate("department")
      .populate("categoryType")
      .populate("location")
      .lean();
    return devices;
  } catch (error) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
