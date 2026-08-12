import twilio from "twilio";
import { CompanyModel } from "../../database/models/company";
import axios from "axios";
export const sendTwilioMessage = async (to, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  console.log("SMS log sending", { to, from, hasSid: !!accountSid, hasToken: !!authToken });

  if (!accountSid || !authToken || !from) {
    const error = "Twilio env missing (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER)";
    console.error("SMS log error:", error);
    return { success: false, error };
  }

  const client = twilio(accountSid, authToken);
  try {
    const response = await client.messages.create({
      body: message,
      from,
      to,
    });

    console.log("SMS log success", { to, sid: response.sid, status: response.status });
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("SMS log error:", error.message, { to, from });
    return { success: false, error: error.message };
  }
};

// Helper function — reuse across your app
export async function sendTeamsNotification(
  companyId: string,
  message: string,
) {
  const company = await CompanyModel.findById(companyId).select(
    "+msteams.accessToken +msteams.teamId +msteams.enabled",
  );

  if (!company?.msteams?.enabled || !company?.msteams?.accessToken) return;
  if (!company?.msteams?.teamId || !company?.msteams?.channels?.length) return;

  // ✅ Send to all selected channels in parallel
  await Promise.allSettled(
    company.msteams.channels.map((channel: any) =>
      axios.post(
        `https://graph.microsoft.com/v1.0/teams/${company.msteams.teamId}/channels/${channel.channelId}/messages`,
        {
          body: {
            contentType: "html",
            content: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${company.msteams.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      ),
    ),
  );
}
