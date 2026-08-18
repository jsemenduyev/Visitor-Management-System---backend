import DeviceModel from "../database/models/devices";

const FULL_NAME_KEYS = ["fullName", "Full Name", "FullName", "name"] as const;

export const getDataObject = (data: any): Record<string, any> => {
  if (!data) return {};
  if (data instanceof Map) return Object.fromEntries(data.entries());
  if (typeof data === "object") return { ...data };
  return {};
};

export const resolveVisitorFullName = (data: any): string => {
  const obj = getDataObject(data);
  for (const key of FULL_NAME_KEYS) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
};

/** Ensure visitor form answers always expose `data.fullName` for emails/search. */
export const normalizeVisitorData = (
  data: any,
): Record<string, any> | undefined => {
  if (!data) return data;

  const normalized = getDataObject(data);
  const fullName = resolveVisitorFullName(normalized);
  if (!fullName) return normalized;

  normalized.fullName = fullName;
  for (const key of FULL_NAME_KEYS) {
    if (key !== "fullName") {
      delete normalized[key];
    }
  }
  return normalized;
};

/** Device label for host emails — prefer saved kiosk name, then lookup by deviceId. */
export const resolveDeviceLabel = async (visitor: {
  deviceName?: string | null;
  deviceId?: string | null;
  signedInDevice?: string | null;
}): Promise<string> => {
  const savedName = visitor.deviceName?.trim();
  if (savedName) return savedName;

  const deviceId = visitor.deviceId?.trim();
  if (deviceId) {
    const device = await DeviceModel.findOne({ deviceId }).select("deviceName").lean();
    if (device?.deviceName?.trim()) return device.deviceName.trim();
  }

  const signedInDevice = visitor.signedInDevice?.trim();
  if (signedInDevice && signedInDevice !== "Mobile") return signedInDevice;

  return "Front Desk";
};
