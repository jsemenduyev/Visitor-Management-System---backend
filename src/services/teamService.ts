import axios from "axios";

const DELEGATED_SCOPE = [
  "openid",
  "profile",
  "offline_access",
  "Team.ReadBasic.All",
  "Channel.ReadBasic.All",
  "ChannelMessage.Send",
].join(" ");

export const getTeamsAuthUrl = (companyId: string) => {
  const params = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.MS_REDIRECT_URI!,
    response_mode: "query",
    scope: DELEGATED_SCOPE,
    state: companyId,
    prompt: "consent",
  });

  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
};

export const getTeamsToken = async (code: string) => {
  try {
    const res = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: process.env.MS_CLIENT_ID!,
        client_secret: process.env.MS_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.MS_REDIRECT_URI!,
        grant_type: "authorization_code",
        scope: DELEGATED_SCOPE,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data;
  } catch (error: any) {
    console.error("getTeamsToken error:", error.response?.data || error.message);
    throw error;
  }
};