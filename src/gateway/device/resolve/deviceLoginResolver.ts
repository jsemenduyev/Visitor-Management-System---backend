import DeviceModel from "../../../../database/models/devices";
import crypto from "crypto";

export default async (_, args) => {
  const { deviceId } = args;
  // generate new session key
  const newSessionKey = crypto.randomBytes(16).toString("hex");

  // replace session key (this logs out previous session automatically)
  const device = await DeviceModel.findOneAndUpdate(
    { deviceId },
    { $set: { sessionKey: newSessionKey } },
    { new: true }
  );

  if (!device) {
    return {
      error: {
        message: "Device not found",
        code: "NOT_FOUND",
      },
    };
  }

  return {
    device: device,
  };
};
