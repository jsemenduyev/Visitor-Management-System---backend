type SettingsRecord = Record<string, any>;

/**
 * Location configuration belongs to the admin who saved it.  The location
 * document remains the shared source of defaults, while `settingsByAdmin`
 * contains only that admin's overrides.
 */
export function getAdminLocationSettings(
  location: SettingsRecord,
  adminId: unknown,
): SettingsRecord {
  const settings = location?.settingsByAdmin;
  if (!settings || !adminId) return {};

  const key = String(adminId);
  return typeof settings.get === "function" ? settings.get(key) || {} : settings[key] || {};
}

export function mergeSettings<T extends SettingsRecord>(
  base: T,
  override: SettingsRecord,
): T {
  const result: SettingsRecord = {};

  for (const [key, value] of Object.entries(base || {})) {
    if (key !== "settingsByAdmin") result[key] = value;
  }

  for (const [key, value] of Object.entries(override || {})) {
    if (
      value &&
      !Array.isArray(value) &&
      typeof value === "object" &&
      result[key] &&
      !Array.isArray(result[key]) &&
      typeof result[key] === "object"
    ) {
      result[key] = mergeSettings(result[key], value as SettingsRecord);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

export function locationForAdmin<T extends SettingsRecord>(
  location: T,
  adminId: unknown,
): T {
  return mergeSettings(location, getAdminLocationSettings(location, adminId));
}
