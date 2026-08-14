import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationUpdateCompanyArgs } from "../../../generated/graphql";
import QRCode from "qrcode";
import crypto from "crypto";
import {
  getAdminLocationSettings,
  mergeSettings,
} from "../../utils/adminLocationSettings";

const contactLessBaseUrl = () =>
  (process.env.CONTACTLESS_URL || process.env.FRONTEND_URL || "").replace(
    /\/$/,
    "",
  );

async function buildContactLessQr(token: string) {
  const base = contactLessBaseUrl();
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

export default async (args: MutationUpdateCompanyArgs, ctx: any) => {
  try {
    const { input } = args;

    const companyId = ctx?.user?.company;
    if (!companyId) {
      return {
        error: {
          message: "User does not belong to any company",
          code: "NO_COMPANY_FOUND",
        },
      };
    }

    if (!input || Object.keys(input).length === 0) {
      return {
        error: {
          message: "No input data provided for update",
          code: "EMPTY_INPUT",
        },
      };
    }
    const existing = await OfficeLocationModel.findOne({
      _id: input.locationId,
      company: companyId,
      createdBy: ctx.user._id,
    }).select("+settingsByAdmin");

    if (!existing) {
      return {
        error: { message: "Location not found", code: "NOT_FOUND" },
      };
    }

    let newInput: Record<string, any> = { ...input };
    // Don't persist GraphQL helper field onto the location document
    delete newInput.locationId;

    const authUser = ctx?.user;
    const existingSettings = getAdminLocationSettings(existing, authUser._id);

    if (input.contactLess?.enabled) {
      const token =
        existingSettings?.contactLess?.token ||
        existing?.contactLess?.token ||
        crypto.randomBytes(16).toString("hex");
      const { qrCode } = await buildContactLessQr(token);

      newInput = {
        ...newInput,
        contactLess: {
          token,
          qrCode,
          enabled: true,
        },
      };
    }

    if (Object.keys(newInput).length > 0) {
      const adminId = String(authUser._id);
      const updatedSettings = mergeSettings(existingSettings, newInput);
      const updatedLocation = await OfficeLocationModel.findOneAndUpdate(
        { _id: input.locationId, company: companyId, createdBy: authUser._id },
        { $set: { [`settingsByAdmin.${adminId}`]: updatedSettings } },
        { new: true },
      ).lean();

      if (!updatedLocation) {
        return {
          error: {
            message: "Location not found",
            code: "NOT_FOUND",
          },
        };
      }
    }

    return "Location data updated successfully";
  } catch (error: any) {
    console.error("Error updating location:", error);
    return {
      error: {
        message:
          error.message || "Something went wrong while updating location",
        code: "SERVER_ERROR",
      },
    };
  }
};
