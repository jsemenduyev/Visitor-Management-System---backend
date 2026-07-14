import express from "express";
import axios from "axios";
import { CompanyModel } from "../../database/models/company";

const googleChatRouter = express.Router();

googleChatRouter.post("/save", async (req: any, res) => {
  try {
    const { webhookUrl, name } = req.body;
    const companyId = req.user?.companyId || req.user?.company;

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!webhookUrl || !webhookUrl.startsWith("https://chat.googleapis.com/")) {
      return res.status(400).json({ message: "Invalid webhook URL" });
    }

    const company = await CompanyModel.findById(companyId);

    const exists = company.googleChat?.webhooks?.some(
      (w) => w.webhookUrl === webhookUrl,
    );

    if (exists) {
      return res.json({ success: true, message: "Webhook already exists" });
    }

    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      companyId,
      {
        $push: {
          "googleChat.webhooks": {
            name: name || "Default",
            webhookUrl,
          },
        },
        $set: {
          "googleChat.enabled": true,
        },
      },
      { new: true },
    );

    res.json({
      success: true,
      data: updatedCompany.googleChat.webhooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save webhook" });
  }
});

// ✅ 2. TEST WEBHOOK
googleChatRouter.post("/test", async (req, res) => {
  try {
    const { webhookUrl } = req.body;

    await axios.post(webhookUrl, {
      text: "✅ Google Chat connected successfully",
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Webhook test failed" });
  }
});

// // ✅ 3. OPTIONAL: SEND MESSAGE (manual trigger)
// googleChatRouter.post("/send", async (req, res) => {
//   try {
//     const { companyId, visitor } = req.body;

//     const company = await CompanyModel.findById(companyId);

//     if (!company?.googleChat?.enabled) {
//       return res.status(400).json({ message: "Google Chat not configured" });
//     }

//     await axios.post(company.googleChat.webhookUrl, {
//       text: `🚪 Visitor Arrived
//   Name: ${visitor.name}
// Purpose: ${visitor.purpose}
// Time: ${new Date().toLocaleTimeString()}`,
//     });

//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to send message" });
//   }
// });

export default googleChatRouter;
