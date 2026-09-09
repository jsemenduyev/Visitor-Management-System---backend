import express from "express";
import OfficeLocationModel from "../../database/models/officelocations";
import visitorCategory from "../../database/models/visitorCategory";
import { AgreementModel } from "../../database/models/agreements";
import { UserModel } from "../../database/models/user";
import PreRegisterVisitorModel from "../../database/models/preRegisterVisitor";
import VisitorModel from "../../database/models/visitor";
import DepartmentModel from "../../database/models/department";
import { sendVisitorArrivalEmail } from "../../utils/VisitorEmail";
import { sendVisitorApprovalEmail } from "../../utils/approvalEmail";
import {
  getUserNotificationEmails,
  getUserNotificationPhones,
} from "../../utils/userNotificationContacts";
import {
  getDataObject,
  normalizeVisitorData,
  resolveVisitorFullName,
} from "../../utils/visitorData";
import { sendTwilioMessage } from "./sendMessage";
import { locationForAdmin } from "../gateway/utils/adminLocationSettings";
import { Types } from "mongoose";

const visitUsRouter = express.Router();

const iterSettingsByAdmin = (
  settingsByAdmin: unknown,
): Array<[string, Record<string, any>]> => {
  if (!settingsByAdmin || typeof settingsByAdmin !== "object") return [];
  if (settingsByAdmin instanceof Map) {
    return [...settingsByAdmin.entries()];
  }
  return Object.entries(settingsByAdmin as Record<string, Record<string, any>>);
};

type TokenLocationContext = {
  location: Record<string, any>;
  ownerId: string;
};

const findLocationByToken = async (
  token: unknown,
): Promise<TokenLocationContext | null> => {
  if (!token || typeof token !== "string") return null;

  // Admin-scoped QR settings are authoritative. Check them before the legacy
  // top-level contactLess value; otherwise a reused legacy token can resolve
  // to the location owner and leak that admin's branding into another admin's
  // visitor flow.
  const candidates = await OfficeLocationModel.find({
    settingsByAdmin: { $exists: true, $ne: {} },
  })
    .select("+settingsByAdmin")
    .lean();

  const scopedMatches: TokenLocationContext[] = [];
  for (const location of candidates) {
    for (const [adminId, adminSettings] of iterSettingsByAdmin(
      location.settingsByAdmin,
    )) {
      const contactLess = adminSettings?.contactLess;
      if (contactLess?.token === token && contactLess?.enabled) {
        scopedMatches.push({
          location: locationForAdmin(location as any, adminId),
          ownerId: adminId,
        });
      }
    }
  }

  if (scopedMatches.length === 1) return scopedMatches[0];
  if (scopedMatches.length > 1) {
    console.error("Ambiguous admin-scoped visit-us token", {
      tokenSuffix: token.slice(-6),
      matches: scopedMatches.length,
    });
    return null;
  }

  // Fall back only for old locations whose QR configuration predates
  // settingsByAdmin.
  const topLevelMatches = await OfficeLocationModel.find({
    "contactLess.token": token,
    "contactLess.enabled": true,
  })
    .select("+settingsByAdmin")
    .limit(2)
    .lean();

  if (topLevelMatches.length !== 1) {
    if (topLevelMatches.length > 1) {
      console.error("Ambiguous legacy visit-us token", {
        tokenSuffix: token.slice(-6),
        matches: topLevelMatches.length,
      });
    }
    return null;
  }

  const topLevel = topLevelMatches[0];
  if (!topLevel.createdBy) return null;

  return {
    location: locationForAdmin(topLevel as any, topLevel.createdBy),
    ownerId: String(topLevel.createdBy),
  };

};

const buildDepartmentFilter = (
  ctx: TokenLocationContext,
  searchStr: string,
): Record<string, any> => {
  const filter: Record<string, any> = {
    company: ctx.location.company,
    location: ctx.location._id,
    createdBy: ctx.ownerId,
  };

  if (searchStr) {
    filter.name = { $regex: searchStr, $options: "i" };
  }

  return filter;
};

type VisitUsHostType = "department" | "admin" | "manager" | "employee";

type VisitUsHostResult = {
  _id: string;
  name: string;
  type: VisitUsHostType;
  role?: string;
  img?: string;
};

const normalizeHostType = (role?: string | null): VisitUsHostType => {
  if (role === "admin") return "admin";
  if (role === "manager") return "manager";
  return "employee";
};

const buildVisitUsHostResults = async (
  ctx: TokenLocationContext,
  searchStr: string,
): Promise<VisitUsHostResult[]> => {
  const baseDeptFilter = {
    company: ctx.location.company,
    location: ctx.location._id,
    createdBy: ctx.ownerId,
  };
  const searchLower = searchStr.toLowerCase();

  // Empty search returns all location departments; non-empty filters by name.
  const matchingDepartments = await DepartmentModel.find(
    buildDepartmentFilter(ctx, searchStr),
  )
    .select("_id name")
    .limit(30)
    .lean();

  const departmentsWithUsers = await DepartmentModel.find(baseDeptFilter)
    .populate({
      path: "user",
      select: "firstName lastName img isArchived role",
      match: { isArchived: { $ne: true } },
    })
    .select("_id name user")
    .lean();

  const hosts: VisitUsHostResult[] = [];
  const seenPersonIds = new Set<string>();

  for (const dept of matchingDepartments) {
    hosts.push({
      _id: String(dept._id),
      name: dept.name || "",
      type: "department",
    });
  }

  const personMatchesSearch = (
    firstName?: string | null,
    lastName?: string | null,
  ) => {
    if (!searchStr) return true;
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      (firstName?.toLowerCase().includes(searchLower) ?? false) ||
      (lastName?.toLowerCase().includes(searchLower) ?? false)
    );
  };

  const addPersonHost = (person: {
    _id: unknown;
    firstName?: string | null;
    lastName?: string | null;
    img?: string | null;
    role?: string | null;
  }) => {
    const personId = String(person._id);
    if (seenPersonIds.has(personId)) return;
    seenPersonIds.add(personId);

    const fullName = [person.firstName, person.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (!fullName) return;

    const hostType = normalizeHostType(person.role);
    hosts.push({
      _id: personId,
      name: fullName,
      type: hostType,
      role: person.role || hostType,
      img: person.img || "",
    });
  };

  for (const dept of departmentsWithUsers) {
    for (const user of dept.user || []) {
      if (!user || typeof user !== "object" || !("_id" in user)) continue;
      const person = user as {
        _id: unknown;
        firstName?: string | null;
        lastName?: string | null;
        img?: string | null;
        role?: string | null;
      };
      if (!personMatchesSearch(person.firstName, person.lastName)) continue;
      addPersonHost(person);
    }
  }

  const directPersonFilter: Record<string, any> = {
    company: ctx.location.company,
    location: ctx.location._id,
    isArchived: { $ne: true },
    role: { $in: ["admin", "manager", "employee"] },
    $and: [
      {
        $or: [{ createdBy: ctx.ownerId }, { _id: ctx.ownerId }],
      },
    ],
  };
  if (searchStr) {
    directPersonFilter.$and.push({
      $or: [
        { firstName: { $regex: searchStr, $options: "i" } },
        { lastName: { $regex: searchStr, $options: "i" } },
      ],
    });
  }

  const directPeople = await UserModel.find(directPersonFilter)
    .select("_id firstName lastName img role")
    .limit(30)
    .lean();

  for (const person of directPeople) {
    if (!personMatchesSearch(person.firstName, person.lastName)) continue;
    addPersonHost(person);
  }

  return hosts.slice(0, 30);
};

visitUsRouter.get("/verifyToken", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ctx = await findLocationByToken(token);
    const location = ctx?.location;

    if (!ctx || !location) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({
      _id: location._id,
      id: location._id,
      name: location.name,
      company: location.company,
      customHeading: location.customHeading,
      visitorPhoto: location.visitorPhoto,
      selectHost: location.selectHost,
      returningVisitors: location.returningVisitors,
      selectedAgreement: location.selectedAgreement,
      agreements: location.agreements,
      branding: location.branding,
      visitorButton: location.visitorButton,
      savedImgs: location.savedImgs,
      contactLess: {
        enabled: location.contactLess?.enabled,
      },
    });
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

    const ctx = await findLocationByToken(token);

    if (!ctx) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { location } = ctx;

    const categories = await visitorCategory
      .find({
        company: location.company,
        location: location._id,
        enabled: true,
      })
      .sort({ priority: 1 })
      .lean();

    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

visitUsRouter.get("/agreement", async (req, res) => {
  try {
    const { token, selectedAgreement } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!selectedAgreement || typeof selectedAgreement !== "string") {
      return res.status(400).json({ message: "selectedAgreement is required" });
    }

    const ctx = await findLocationByToken(token);

    if (!ctx) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { location } = ctx;

    const allowedIds = [
      ...(location.agreements || []).map((id: any) => id.toString()),
      location.selectedAgreement?.agreement?.toString(),
    ].filter(Boolean);

    if (!allowedIds.includes(selectedAgreement)) {
      return res.status(403).json({ message: "Agreement not allowed for this location" });
    }

    const agreement = await AgreementModel.findById(selectedAgreement).lean();
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

    const ctx = await findLocationByToken(token);

    if (!ctx) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const searchStr = typeof search === "string" ? search.trim() : "";
    const hosts = await buildVisitUsHostResults(ctx, searchStr);

    res.json(hosts);
  } catch (error) {
    console.error("Get Departments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

visitUsRouter.get("/rememberedVisitors", async (req, res) => {
  try {
    const { token, search } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ctx = await findLocationByToken(token);

    if (!ctx) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { location } = ctx;

    if (!location.returningVisitors?.saveDetails) {
      return res.json([]);
    }

    const searchStr = typeof search === "string" ? search.trim() : "";
    if (searchStr.length < 2) {
      return res.json([]);
    }

    let visitors = await VisitorModel.find({
      company: location.company,
      location: location._id,
      remembered: true,
      "data.fullName": { $regex: searchStr, $options: "i" },
    })
      .sort({ updatedAt: -1 })
      .limit(50)
      .select("data img")
      .lean();

    const seen = new Set<string>();
    const results: Array<{
      fullName: string;
      data: Record<string, unknown>;
      img?: string;
    }> = [];

    for (const visitor of visitors) {
      const rawData = getDataObject(visitor.data);
      const fullName = resolveVisitorFullName(rawData);
      if (!fullName) continue;

      const dedupeKey = fullName.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      results.push({
        fullName,
        data: normalizeVisitorData(rawData) || rawData,
        img: visitor.img || undefined,
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Get Remembered Visitors Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

visitUsRouter.post("/submitVisitor", async (req, res) => {
  try {
    const { token } = req.query;
    const input = req.body || {};

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ctx = await findLocationByToken(token);

    if (!ctx) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { location } = ctx;

    if (input.data) {
      input.data = normalizeVisitorData(input.data);
    }

    const visitorFullName = resolveVisitorFullName(input.data);

    if (visitorFullName) {
      await PreRegisterVisitorModel.findOneAndDelete({
        "data.fullName": visitorFullName,
      });
    }

    const duplicateConditions: any[] = [];
    if (input.data?.phoneNumber) {
      duplicateConditions.push({ "data.phoneNumber": input.data.phoneNumber });
    }
    if (input.data?.emailAddress) {
      duplicateConditions.push({ "data.emailAddress": input.data.emailAddress });
    }

    if (duplicateConditions.length > 0) {
      const existingVisitor = await VisitorModel.findOne({
        $or: duplicateConditions,
        signedType: "In",
        location: location._id,
      });

      if (existingVisitor) {
        return res.status(409).json({
          error: { message: "Visitor already exists", code: "ALREADY_EXISTS" },
        });
      }
    }

    const category = await visitorCategory.findById(input.category).lean();
    if (!category) {
      return res.status(400).json({
        error: {
          message: "Invalid visitor category",
          code: "INVALID_CATEGORY",
        },
      });
    }

    if (
      category.location?.toString() !== location._id.toString() ||
      category.company?.toString() !== location.company?.toString()
    ) {
      return res.status(400).json({
        error: {
          message: "Category does not belong to this location",
          code: "INVALID_CATEGORY",
        },
      });
    }

    const hostRequired =
      !!location.selectHost?.allowOnStaticQR &&
      (!!category.host || !!location.selectHost?.requireVisitors);

    let department: any = null;
    let notifyTargets: any[] = [];
    let employees: Types.ObjectId[] = [];

    if (input.department) {
      department = await DepartmentModel.findOne({
        _id: input.department,
        company: location.company,
        location: location._id,
        createdBy: ctx.ownerId,
      })
        .populate("user")
        .lean();

      if (!department) {
        return res.status(400).json({
          error: {
            message: "Selected department not found",
            code: "INVALID_DEPARTMENT",
          },
        });
      }

      notifyTargets = department.user || [];
      employees = notifyTargets.map((u: any) => u._id);
    } else if (input.employee) {
      const employee = await UserModel.findById(input.employee).lean();

      if (!employee) {
        return res.status(400).json({
          error: {
            message: "Selected employee not found",
            code: "INVALID_EMPLOYEE",
          },
        });
      }

      notifyTargets = [employee];
      employees = [employee._id];
    } else if (hostRequired) {
      return res.status(400).json({
        error: {
          message: "Host selection is required",
          code: "HOST_REQUIRED",
        },
      });
    }

    const includeResponses =
      location?.approvals?.includeAllVisitorResponses ?? false;
    const visitorData =
      includeResponses && input.data
        ? (input.data as Record<string, any>)
        : undefined;

    const notifyUsers = async (
      users: any[],
      type: "arrival" | "approval",
      visitorId: string,
    ) => {
      if (!users.length) return;

      await Promise.all(
        users.map(async (user) => {
          if (user.notificationPreference?.includes("Email")) {
            const hostLabel =
              department?.name ||
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.name ||
              "N/A";
            const emails = getUserNotificationEmails(user);

            await Promise.all(
              emails.map((email) =>
                type === "arrival"
                  ? sendVisitorArrivalEmail(
                      visitorFullName,
                      category.name,
                      new Date().toLocaleString(),
                      hostLabel,
                      input.img,
                      email,
                      input.signedInDevice || "QR",
                      visitorData,
                    )
                  : sendVisitorApprovalEmail(
                      visitorFullName,
                      category.name,
                      new Date().toLocaleString(),
                      hostLabel,
                      input.img,
                      `${process.env.SERVER_URL}/approveVisitor?visitorId=${visitorId}`,
                      `${process.env.SERVER_URL}/rejectVisitor?visitorId=${visitorId}`,
                      email,
                      input.signedInDevice || "QR",
                      visitorData,
                    ),
              ),
            );
          }

          if (user.notificationPreference?.includes("SMS")) {
            const hostFirstName = user.firstName?.trim() || "there";
            const companySuffix = input.data?.companyName
              ? ` (${input.data.companyName})`
              : "";
            const msg =
              type === "arrival"
                ? `Hello ${hostFirstName}, new visitor, ${visitorFullName}${companySuffix}, is here to meet you. Maximal Security`
                : `Hello, A new visitor, ${visitorFullName}, requires approval. Please check your email. — Maximal Security`;

            await Promise.all(
              getUserNotificationPhones(user).map((phone) =>
                sendTwilioMessage(phone, msg),
              ),
            );
          }
        }),
      );
    };

    const newInput = {
      ...input,
      company: location.company,
      location: location._id,
      employees,
      signedType: category.approval ? "Pending" : "In",
      signedIn: input.signedIn || new Date().toISOString(),
      signedInDevice: input.signedInDevice || "QR",
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
      signedType: visitor.signedType,
    });
  } catch (error) {
    console.error("Submit Visitor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

visitUsRouter.post("/checkOutVisitor", async (req, res) => {
  try {
    const { visitorId } = req.body;

    const visitor = await VisitorModel.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    if (visitor.signedType !== "In") {
      return res
        .status(400)
        .json({ message: "Visitor is not currently signed in" });
    }

    visitor.signedType = "Out";
    visitor.signedOut = new Date().toISOString();
    await visitor.save();

    res.json({ message: "Visitor checked out successfully" });
  } catch (error) {
    console.error("Check Out Visitor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default visitUsRouter;
