import { UserModel } from "../../../../database/models/user";

export default async (args: { search?: string; limit?: number; offset?: number }, ctx) => {
  try {
    const { search, limit = 10, offset = 0 } = args;
    const { user } = ctx;

    let companyId = user?.company;
    if (!companyId && user?._id) {
      const dbUser = await UserModel.findById(user._id).select("company").lean();
      companyId = dbUser?.company;
    }

    const query: any = {
      company: companyId,
      isArchived: true,
    };

    if (search && search.trim() !== "") {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await UserModel.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ archivedAt: -1 })
      .lean();

    const count = await UserModel.countDocuments(query);

    return { user: users, count };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch archived employees");
  }
};
