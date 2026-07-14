import { UserModel } from "../../../../database/models/user";

export default async (args: { search?: string; limit?: number; offset?: number }, ctx) => {
  try {
    const { search, limit = 10, offset = 0 } = args;
    const { user } = ctx;

    const query: any = {
      company: user.company,
      isArchived: true,
    };

    if (search && search.trim() !== "") {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await UserModel.find(query)
      .populate("department")
      .populate("location")
      .skip(offset)
      .limit(limit)
      .sort({ archivedAt: -1 })
      .lean();

    const count = await UserModel.countDocuments(query);

    return { user: users, count };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
