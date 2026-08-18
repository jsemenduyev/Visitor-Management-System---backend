import OfficeLocationModel from "../../../../database/models/officelocations";
import { UserModel } from "../../../../database/models/user";
import { QueryGetOfficeLocationArgs } from "../../../generated/graphql";
import { resolveUserWelcomeSettings } from "../../utils/welcomeSettings";
import { ensureLegacyLocationOwners } from "../../utils/locationOwnerScope";
import {
  getAdminLocationSettings,
  locationForAdmin,
} from "../../utils/adminLocationSettings";

export default async (args: QueryGetOfficeLocationArgs, ctx: any) => {
  try {
    const location = await OfficeLocationModel.findById({
      _id: args.locationId,
    })
      .select("+settingsByAdmin")
      .lean();

    if (!location) return null;

    const authUser = ctx?.user;
    if (!authUser?._id) {
      return location;
    }

    await ensureLegacyLocationOwners(location.company || authUser.company);

    const ownedLocation = await OfficeLocationModel.findOne({
      _id: args.locationId,
      createdBy: authUser._id,
    })
      .select("+settingsByAdmin")
      .lean();

    if (!ownedLocation) return null;

    const userDoc = await UserModel.findById(authUser._id)
      .select("welcomeSettings company")
      .lean();

    if (
      userDoc?.company &&
      ownedLocation.company &&
      userDoc.company.toString() !== ownedLocation.company.toString()
    ) {
      return null;
    }

    const adminSettings = getAdminLocationSettings(ownedLocation, authUser._id);
    const scopedLocation: any = locationForAdmin(ownedLocation as any, authUser._id);
    // Only fall back to legacy user-level welcome when this location has none saved.
    const legacyWelcome = resolveUserWelcomeSettings(userDoc || {});
    const hasLocationSavedImgs =
      Array.isArray(adminSettings.savedImgs) && adminSettings.savedImgs.length > 0
        ? true
        : Array.isArray(scopedLocation.savedImgs) && scopedLocation.savedImgs.length > 0;
    const hasLocationVisitorButton =
      Boolean(adminSettings.visitorButton) ||
      Boolean(scopedLocation.visitorButton?.buttonRadius);

    if (!hasLocationSavedImgs) {
      scopedLocation.savedImgs = legacyWelcome.savedImgs;
    }
    if (!hasLocationVisitorButton) {
      scopedLocation.visitorButton = legacyWelcome.visitorButton;
    }

    return scopedLocation;
  } catch (error: any) {
    console.error("Error fetching office locations:", error);

    return {
      error: {
        message: error.message || "Failed to fetch office locations",
        code: "SERVER_ERROR",
      },
    };
  }
};
