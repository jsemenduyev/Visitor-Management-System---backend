import express from "express";
import axios from "axios";
import { CompanyModel } from "../../database/models/company";
import { getTeamsAuthUrl, getTeamsToken } from "./teamService";
import { authMiddleware } from "../middleware/authMiddleware";

const msTeamRouter = express.Router();

msTeamRouter.get("/auth", (req: any, res) => {
  const companyId = req.query.companyId;
  res.redirect(getTeamsAuthUrl(companyId));
});

msTeamRouter.get("/callback", async (req: any, res) => {
  try {
    const { code, state } = req.query;
    const companyId = state;

    if (!companyId) {
      return res.status(400).send("Missing companyId");
    }

    const tokenData = await getTeamsToken(code);

    await CompanyModel.findByIdAndUpdate(companyId, {
      $set: {
        "msteams.accessToken": tokenData.access_token,
        "msteams.refreshToken": tokenData.refresh_token,
        "msteams.expiresAt": new Date(Date.now() + tokenData.expires_in * 1000),
        "msteams.enabled": true,
      },
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${FRONTEND_URL}/settings/integrations?teams=connected`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Teams connection failed");
  }
});

msTeamRouter.get("/list", authMiddleware, async (req: any, res) => {
  try {
    const company = await CompanyModel.findById(req.user.company).select(
      "+msteams.accessToken +msteams.expiresAt",
    );

    if (!company?.msteams?.accessToken) {
      return res.status(401).json({ message: "Teams not connected", reauth: true });
    }

    if (company.msteams.expiresAt && new Date() > company.msteams.expiresAt) {
      return res.status(401).json({ message: "Teams token expired", reauth: true });
    }

    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/joinedTeams",
      { headers: { Authorization: `Bearer ${company.msteams.accessToken}` } },
    );

    res.json({ teams: response.data.value });
  } catch (error: any) {
    console.error("Teams Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
});

msTeamRouter.get("/channels/:teamId", authMiddleware, async (req: any, res) => {
  try {
    const { teamId } = req.params;

    const company = await CompanyModel.findById(req.user.company).select(
      "+msteams.accessToken",
    );

    if (!company?.msteams?.accessToken) {
      return res.status(401).json({ message: "Teams not connected" });
    }

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
      { headers: { Authorization: `Bearer ${company.msteams.accessToken}` } },
    );

    res.json({ channels: response.data.value });
  } catch (error: any) {
    console.error("Channels Fetch Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch channels" });
  }
});

// ✅ Updated — saves multiple channels
msTeamRouter.post("/save-channel", authMiddleware, async (req: any, res) => {
  try {
    const { teamId, channels } = req.body;
    // channels = [{ channelId: "...", channelName: "..." }]

    if (!teamId || !channels?.length) {
      return res.status(400).json({ message: "teamId and channels are required" });
    }

    await CompanyModel.findByIdAndUpdate(req.user.company, {
      $set: {
        "msteams.teamId": teamId,
        "msteams.channels": channels,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error("Save Channel Error:", error.message);
    res.status(500).json({ message: "Failed to save channels" });
  }
});

// ✅ Updated — sends to all selected channels
msTeamRouter.post("/send-notification", authMiddleware, async (req: any, res) => {
  try {
    const { message } = req.body;

    const company = await CompanyModel.findById(req.user.company).select(
      "+msteams.accessToken +msteams.teamId +msteams.channels",
    );

    if (!company?.msteams?.accessToken) {
      return res.status(401).json({ message: "Teams not connected" });
    }

    if (!company?.msteams?.teamId || !company?.msteams?.channels?.length) {
      return res.status(400).json({ message: "No channels selected" });
    }

    // ✅ Send to all channels in parallel
    const results = await Promise.allSettled(
      company.msteams.channels.map((channel: any) =>
        axios.post(
          `https://graph.microsoft.com/v1.0/teams/${company.msteams.teamId}/channels/${channel.channelId}/messages`,
          { body: { contentType: "html", content: message } },
          {
            headers: {
              Authorization: `Bearer ${company.msteams.accessToken}`,
              "Content-Type": "application/json",
            },
          },
        ),
      ),
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
      console.error("Some channels failed:", failed);
    }

    res.json({
      success: true,
      sent: results.filter((r) => r.status === "fulfilled").length,
      failed: failed.length,
    });
  } catch (error: any) {
    console.error("Send Notification Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to send notification" });
  }
});

export default msTeamRouter;