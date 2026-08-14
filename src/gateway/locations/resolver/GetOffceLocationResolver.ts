import OfficeLocationModel from "../../../../database/models/officelocations";
import { UserModel } from "../../../../database/models/user";
import { QueryGetOfficeLocationArgs } from "../../../generated/graphql";
import { resolveUserWelcomeSettings } from "../../utils/welcomeSettings";
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

    const userDoc = await UserModel.findById(authUser._id)
      .select("welcomeSettings company")
      .lean();

    if (
      userDoc?.company &&
      location.company &&
      userDoc.company.toString() !== location.company.toString()
    ) {
      return null;
    }

    const adminSettings = getAdminLocationSettings(location, authUser._id);
    const scopedLocation: any = locationForAdmin(location as any, authUser._id);
    // Preserve welcome customizations saved by the previous implementation
    // until this admin saves the corresponding setting for this location.
    const legacyWelcome = resolveUserWelcomeSettings(userDoc || {});
    if (!adminSettings.savedImgs) scopedLocation.savedImgs = legacyWelcome.savedImgs;
    if (!adminSettings.visitorButton) {
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
