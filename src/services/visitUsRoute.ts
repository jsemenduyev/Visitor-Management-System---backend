import { SelectedAgreement } from "./../generated/graphql";
import express from "express";
import { CompanyModel } from "../../database/models/company";
import visitorCategory from "../../database/models/visitorCategory";
import { AgreementModel } from "../../database/models/agreements";
import { UserModel } from "../../database/models/user";
import PreRegisterVisitorModel from "../../database/models/preRegisterVisitor";
import VisitorModel from "../../database/models/visitor";
import { sendVisitorArrivalEmail } from "../../utils/VisitorEmail";
import { sendVisitorApprovalEmail } from "../../utils/approvalEmail";
import { sendTwilioMessage } from "./sendMessage";
import { Types } from "mongoose";

const visitUsRouter = express.Router();
visitUsRouter.get("/verifyToken", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const company = await CompanyModel.findOne({
      "contactLess.token": token,
    });

    if (!company) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json(company);
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

visitUsRouter.get("/categories", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const company = await CompanyModel.findOne({
      "contactLess.token": token,
    });

    if (!company) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const categories = await visitorCategory.find({ company: company._id });

    res.json(categories);
  } catch (error) {
    console.error("Get Fields Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

visitUsRouter.get("/agreement", async (req, res) => {
  try {
    const { token, selectedAgreement } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const company = await CompanyModel.findOne({
      "contactLess.token": token,
    });

    if (!company) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const agreement = await AgreementModel.findById({ _id: selectedAgreement });
    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Get Agreement Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
visitUsRouter.get("/departments", async (req, res) => {
  try {
    const { token, search } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const company = await CompanyModel.findOne({
      "contactLess.token": token,
    });

    if (!company) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const employee = await UserModel.find({
      company: company._id,
      firstName: { $regex: search, $options: "i" },
    }).lean();

    res.json(employee);
  } catch (error) {
    console.error("Get Agreement Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
visitUsRouter.post("/submitVisitor", async (req, res) => {
  try {
    const { token } = req.query;

    const input = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const company = await CompanyModel.findOne({
      "contactLess.token": token,
    });

    if (!company) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (input.data?.fullName) {
      await PreRegisterVisitorModel.findOneAndDelete({
        "data.fullName": input.data.fullName,
      });
    }

    // ✅ Prevent duplicate signed-in visitors based on phone or email
    const duplicateConditions: any[] = [];
    if (input.data?.phoneNumber) duplicateConditions.push({ "data.phoneNumber": input.data.phoneNumber });
    if (input.data?.emailAddress) duplicateConditions.push({ "data.emailAddress": input.data.emailAddress });

    if (duplicateConditions.length > 0) {
      const existingVisitor = await VisitorModel.findOne({
        $or: duplicateConditions,
        signedType: "In",
      });

      if (existingVisitor) {
        return {
          error: { message: "Visitor already exists", code: "ALREADY_EXISTS" },
        };
      }
    }

    // ✅ Category
    const category = await visitorCategory.findById(input.category).lean();
    if (!category) {
      return {
        error: {
          message: "Invalid visitor category",
          code: "INVALID_CATEGORY",
        },
      };
    }
    let notifyTargets: any[] = [];
    let employees: Types.ObjectId[] = [];

    const employee = await UserModel.findById(input.employee).lean();

    if (!employee) {
      return {
        error: {
          message: "Selected employee not found",
          code: "INVALID_EMPLOYEE",
        },
      };
    }
    let department: any = null;
    notifyTargets = [employee];
    employees = [employee._id];

    const notifyUsers = async (
      users: any[],
      type: "arrival" | "approval",
      visitorId: string,
    ) => {
      if (!users.length) return;

      await Promise.all(
        users.map(async (user) => {
          // Email
          if (user.notificationPreference?.includes("Email")) {
            if (type === "arrival") {
              await sendVisitorArrivalEmail(
                input.data.fullName,
                category.name,
                new Date().toLocaleString(),
                department?.name || user.name || "N/A",
                input.img,
                user.email,
              );
            } else {
              await sendVisitorApprovalEmail(
                input.data.fullName,
                category.name,
                new Date().toLocaleString(),
                department?.name || user.name || "N/A",
                input.img,
                `${process.env.SERVER_URL}/approveVisitor?visitorId=${visitorId}`,
                `${process.env.SERVER_URL}/rejectVisitor?visitorId=${visitorId}`,
                user.email,
              );
            }
          }

          // SMS
          if (user.phone && user.notificationPreference?.includes("SMS")) {
            const msg =
              type === "arrival"
                ? `Hello, A new visitor, ${input.data.fullName}${
                    input.data.companyName ? ` (${input.data.companyName})` : ""
                  }, is here to meet you. — Maximal Security`
                : `Hello, A new visitor, ${input.data.fullName}, requires approval. Please check your email. — Maximal Security`;

            await sendTwilioMessage(user.phone, msg);
          }
        }),
      );
    };
    const newInput = {
      ...input,
      company: category.company,
      employees,
      signedType: category.approval ? "Pending" : "In",
      // Client-provided ISO datetime (online: now; offline sync: original local time)
      signedIn: input.signedIn,
    };

    const visitor = await VisitorModel.create(newInput);

    if (notifyTargets.length > 0) {
      await notifyUsers(
        notifyTargets,
        category.approval ? "approval" : "arrival",
        visitor._id.toString(),
      );
    }
    res.json({
      message: "Visitor submitted successfully",
      visitorId: visitor._id,
    });
  } catch (error) {}
});
visitUsRouter.post('/checkOutVisitor', async (req, res) => {
  try {
    const { visitorId } = req.body;

    const visitor = await VisitorModel.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (visitor.signedType !== 'In') {
      return res.status(400).json({ message: 'Visitor is not currently signed in' });
    }

    visitor.signedType = 'Out';
    visitor.signedOut = new Date().toISOString();
    await visitor.save();
    
    res.json({ message: 'Visitor checked out successfully' });
  } catch (error) {
    console.error('Check Out Visitor Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default visitUsRouter;
