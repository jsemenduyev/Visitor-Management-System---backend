import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationUpdateCompanyArgs } from "../../../generated/graphql";
import QRCode from "qrcode";
import crypto from "crypto";
export default async (args: MutationUpdateCompanyArgs, ctx: any) => {
  try {
    const { input } = args;

    const companyId = ctx?.user?.company;
    // ✅ Validate user context
    if (!companyId) {
      return {
        error: {
          message: "User does not belong to any company",
          code: "NO_COMPANY_FOUND",
        },
      };
    }

    // ✅ Validate input
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

    let newInput = input;

    if (input.contactLess?.enabled) {
      if (!existing?.contactLess?.token) {
        const token = crypto.randomBytes(16).toString("hex");

        const base =
          process.env.CONTACTLESS_URL || process.env.FRONTEND_URL;
        const visitorUrl = `${base}/visit-us?token=${token}`;

        const qrDataUrl = await QRCode.toDataURL(visitorUrl, {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 300,
        });

        newInput = {
          ...input,
          contactLess: {
            token,
            qrCode: qrDataUrl,
            enabled: true,
          },
        };
      }
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
