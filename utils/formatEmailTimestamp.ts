const EASTERN_TIME_ZONE = "America/New_York";

/** Formats visitor-notification timestamps in US Eastern Time. */
export const formatEmailTimestamp = (date = new Date()): string =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
