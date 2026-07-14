import { CompanyModel } from "../../../../database/models/company";

export default async (args: any, ctx: any) => {
  try {
    const companyId = ctx?.user?.company;

    // ✅ Fetch company details
    const company = await CompanyModel.findById(companyId).populate("location").lean();
    if (!company) {
      return {
        error: {
          message: "Company not found",
          code: "NOT_FOUND",
        },
      };
    }

    // ✅ Return data consistently
    return company;
  } catch (error: any) {
    console.error("Error fetching company:", error);

    return {
      error: {
        message: error.message || "Something went wrong while fetching company",
        code: "SERVER_ERROR",
      },
    };
  }
};
