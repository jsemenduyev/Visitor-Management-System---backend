import { AgreementModel } from "../../../../database/models/agreements";

export default async (args: any, ctx: any) => {
  try {
    const companyId = ctx?.user?.company;
    const { search } = args;

    // Validate user context
    if (!companyId) {
      return {
        error: {
          message: "User does not belong to any company",
          code: "NO_COMPANY_FOUND",
        },
      };
    }

    // Base query
    const query: any = {
      company: companyId,
      createdBy: ctx.user._id,
    };

    // Add search filter if provided
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Fetch agreements
    const agreements = await AgreementModel.find(query);

    return agreements;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch agreements");
  }
};
