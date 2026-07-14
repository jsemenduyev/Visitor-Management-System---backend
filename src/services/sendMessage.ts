import twilio from "twilio";
import { CompanyModel } from "../../database/models/company";
import axios from "axios";
export const sendTwilioMessage = async (to, message) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`✅ Message sent to ${to}: SID ${response.sid}`);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error(`❌ Failed to send message to ${to}:`, error.message);
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
