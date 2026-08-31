import DeviceModel from "../../../../database/models/devices";
import crypto from "crypto";
import fs from "fs";

const debugLog = (payload: Record<string, unknown>) => {
  try {
    fs.appendFileSync(
      "/home/nitish/Documents/GitHub/swiped/.cursor/debug-7e9727.log",
      `${JSON.stringify({ sessionId: "7e9727", timestamp: Date.now(), ...payload })}\n`,
    );
  } catch {
    /* ignore */
  }
};

export default async (_, args) => {
  const { deviceId } = args;
  const normalizedDeviceId =
    typeof deviceId === "string" ? deviceId.trim().toUpperCase() : "";
  // generate new session key
  const newSessionKey = crypto.randomBytes(16).toString("hex");

  const totalDevices = await DeviceModel.countDocuments();

  debugLog({
    location: "deviceLoginResolver.ts",
    message: "deviceLogin lookup",
    hypothesisId: "H2-H5",
    data: {
      rawLength: typeof deviceId === "string" ? deviceId.length : 0,
      normalizedLength: normalizedDeviceId.length,
      normalizedPrefix: normalizedDeviceId.slice(0, 2),
      totalDevices,
      runId: "post-fix",
    },
  });

  // replace session key (this logs out previous session automatically)
  const device = normalizedDeviceId
    ? await DeviceModel.findOneAndUpdate(
        { deviceId: normalizedDeviceId },
        { $set: { sessionKey: newSessionKey } },
        { new: true },
      )
    : null;

  debugLog({
    location: "deviceLoginResolver.ts",
    message: "deviceLogin result",
    hypothesisId: "H3-H4",
    data: {
      normalizedPrefix: normalizedDeviceId.slice(0, 2),
      found: Boolean(device),
      runId: "post-fix",
    },
  });

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
