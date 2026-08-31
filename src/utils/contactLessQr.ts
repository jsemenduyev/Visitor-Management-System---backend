import os from "os";
import QRCode from "qrcode";

function detectLanHost(): string | undefined {
  const configured = process.env.LOCAL_WIFI_HOST?.trim();
  if (configured) return configured;

  const interfaces = os.networkInterfaces();
  const preferred: string[] = [];
  const fallback: string[] = [];

  for (const [name, entries] of Object.entries(interfaces)) {
    if (/^(lo|docker|br-|veth|tun|tap|tailscale|zt|wg)/i.test(name)) {
      continue;
    }

    for (const entry of entries || []) {
      if (entry.family !== "IPv4" || entry.internal) continue;

      if (/^(wlan|wlp|wifi|enp|eth|eno|en\d)/i.test(name)) {
        preferred.push(entry.address);
      } else {
        fallback.push(entry.address);
      }
    }
  }

  return preferred[0] || fallback[0];
}

/** Base URL encoded in contactless / QR codes (never ends with /). */
export function getContactLessBaseUrl(): string {
  const raw = (process.env.CONTACTLESS_URL || process.env.FRONTEND_URL || "").trim();
  if (!raw) return "";

  const normalized = raw.replace(/\/$/, "");

  try {
    const url = new URL(normalized);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      const lanHost = detectLanHost();
      if (lanHost) {
        const portSuffix = url.port ? `:${url.port}` : "";
        return `${url.protocol}//${lanHost}${portSuffix}`;
      }
    }
  } catch {
    return normalized;
  }

  return normalized;
}

export async function buildContactLessQr(token: string) {
  const base = getContactLessBaseUrl();
  if (!base) {
    throw new Error("CONTACTLESS_URL or FRONTEND_URL is not configured");
  }

  const visitorUrl = `${base}/visit-us?token=${token}`;
  const qrCode = await QRCode.toDataURL(visitorUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
  });

  return { visitorUrl, qrCode };
}
