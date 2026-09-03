import DeviceModel from "../../../../database/models/devices";
import crypto from "crypto";

export default async (_, args) => {
  const { deviceId } = args;
  const normalizedDeviceId =
    typeof deviceId === "string" ? deviceId.trim().toUpperCase() : "";
  // generate new session key
  const newSessionKey = crypto.randomBytes(16).toString("hex");

  // replace session key (this logs out previous session automatically)
  const device = normalizedDeviceId
    ? await DeviceModel.findOneAndUpdate(
        { deviceId: normalizedDeviceId },
        { $set: { sessionKey: newSessionKey } },
        { new: true },
      )
    : null;

  if (!device) {
    return {
      error: {
        message:
          "Device not found. Enter the 6-character Device ID from Settings → Devices (not the device name).",
        code: "NOT_FOUND",
      },
    };
  }

  return {
    device: device,
  };
};
