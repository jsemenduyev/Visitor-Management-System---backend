import DeviceModel from "../../../../database/models/devices";

export default async (args: { id: string }, ctx: any) => {
  try {
    const { id } = args;

    const deletedDevice = await DeviceModel.findOneAndDelete({
      _id: id,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    });

    if (!deletedDevice) {
      return {
        error: {
          message: "Device not found",
          code: "NOT_FOUND",
        },
      };
    }

    return {
      device: deletedDevice,
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
