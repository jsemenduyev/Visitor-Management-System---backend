import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationUpdateCompanyArgs } from "../../../generated/graphql";
import QRCode from "qrcode";
import crypto from "crypto";

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
    });

    let newInput: Record<string, any> = { ...input };
    // Don't persist GraphQL helper field onto the location document
    delete newInput.locationId;

    if (input.contactLess?.enabled) {
      const token =
        existing?.contactLess?.token || crypto.randomBytes(16).toString("hex");
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

    const updatedLocation = await OfficeLocationModel.findOneAndUpdate(
      { _id: input.locationId, company: companyId },
      { $set: newInput },
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
