import OfficeLocationModel from "../../../../database/models/officelocations";
import { locationForAdmin } from "../../utils/adminLocationSettings";
import {
  dashboardLocationFilter,
  ensureLegacyLocationOwners,
} from "../../utils/locationOwnerScope";

export default async (args, ctx) => {
  try {
    const { user } = ctx;
    const company = user.company

    if (!company) {
      return {
        error: {
          message: "Company ID is required",
          code: "MISSING_COMPANY_ID",
        },
      };
    }

    await ensureLegacyLocationOwners(company);

    const locations = await OfficeLocationModel.find(dashboardLocationFilter(user))
      .select("+settingsByAdmin")
      .lean();

    return locations.map((location) =>
      locationForAdmin(location as any, user._id),
    );
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
