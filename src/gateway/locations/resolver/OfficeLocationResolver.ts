import OfficeLocationModel from "../../../../database/models/officelocations";

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

    const locations = await OfficeLocationModel.find({ company }).lean();

    return locations;
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
