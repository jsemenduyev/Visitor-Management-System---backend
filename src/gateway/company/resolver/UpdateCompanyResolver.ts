import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationUpdateCompanyArgs } from "../../../generated/graphql";
import crypto from "crypto";
import {
  getAdminLocationSettings,
  mergeSettings,
} from "../../utils/adminLocationSettings";
import { buildContactLessQr } from "../../../utils/contactLessQr";

export default async (args: MutationUpdateCompanyArgs, ctx: any) => {
  try {
    const { input } = args;

    const companyId = ctx?.user?.company;
    if (!companyId) {
      throw new Error("User does not belong to any company");
    }

    if (!input || Object.keys(input).length === 0) {
      throw new Error("No input data provided for update");
    }
    const existing = await OfficeLocationModel.findOne({
      _id: input.locationId,
      company: companyId,
      createdBy: ctx.user._id,
    }).select("+settingsByAdmin");

    if (!existing) {
      throw new Error("Location not found");
    }

    let newInput: Record<string, any> = { ...input };
    // Don't persist GraphQL helper field onto the location document
    delete newInput.locationId;

    // Omit null/undefined keys so a partial update (e.g. welcomeScreen only)
    // cannot wipe sibling settings like contactLess via mergeSettings.
    // selectedAgreement is the exception: an explicit null means the admin
    // removed the agreement. It must be stored as an override so that
    // locationForAdmin does not fall back to the location-level default.
    for (const key of Object.keys(newInput)) {
      if (
        (newInput[key] === null || newInput[key] === undefined) &&
        !(key === "selectedAgreement" && newInput[key] === null)
      ) {
        delete newInput[key];
      }
    }

    const authUser = ctx?.user;
    const existingSettings = getAdminLocationSettings(existing, authUser._id);

    if (input.contactLess && typeof input.contactLess.enabled === "boolean") {
      if (input.contactLess.enabled) {
        const token =
          existingSettings?.contactLess?.token ||
          existing?.contactLess?.token ||
          input.contactLess.token ||
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
      } else {
        newInput = {
          ...newInput,
          contactLess: {
            token:
              input.contactLess.token ||
              existingSettings?.contactLess?.token ||
              existing?.contactLess?.token ||
              undefined,
            qrCode:
              input.contactLess.qrCode ||
              existingSettings?.contactLess?.qrCode ||
              existing?.contactLess?.qrCode ||
              undefined,
            enabled: false,
          },
        };
      }
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
        throw new Error("Location not found");
      }
    }

    return "Location data updated successfully";
  } catch (error: any) {
    console.error("Error updating location:", error);
    throw new Error(
      error.message || "Something went wrong while updating location",
    );
  }
};
