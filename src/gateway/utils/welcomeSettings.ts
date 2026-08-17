import dotenv from "dotenv";

dotenv.config();

const tabImageBaseUrl = (
  process.env.ASSET_PUBLIC_BASE_URL ||
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com"
).replace(/\/$/, "");

const defaultTabUrls = [
  `${tabImageBaseUrl}/tab/Swiped1.png`,
  `${tabImageBaseUrl}/tab/Swiped2.png`,
  `${tabImageBaseUrl}/tab/Swiped3.png`,
  `${tabImageBaseUrl}/tab/Swiped4.png`,
  `${tabImageBaseUrl}/tab/Swiped5.png`,
  `${tabImageBaseUrl}/tab/Swiped6.png`,
  `${tabImageBaseUrl}/tab/Swiped7.png`,
];

export const defaultWelcomeSavedImgs = () =>
  defaultTabUrls.map((url) => ({ url, enabled: true }));

export const defaultVisitorButton = () => ({
  buttonRadius: "pill",
  buttonColor: "#111827",
  buttonBg: "#ffffff",
});

type LegacyWelcomeSettingsDocument = {
  welcomeSettings?: {
    savedImgs?: { url: string; enabled?: boolean }[];
    visitorButton?: {
      buttonRadius?: string;
      buttonColor?: string;
      buttonBg?: string;
    };
  } | null;
};

export function resolveUserWelcomeSettings(userDoc: unknown) {
  const document =
    userDoc && typeof userDoc === "object"
      ? (userDoc as LegacyWelcomeSettingsDocument)
      : {};

  return {
    savedImgs: document.welcomeSettings?.savedImgs?.length
      ? document.welcomeSettings.savedImgs
      : defaultWelcomeSavedImgs(),
    visitorButton:
      document.welcomeSettings?.visitorButton || defaultVisitorButton(),
  };
}
