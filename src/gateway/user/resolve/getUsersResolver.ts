import { UserModel } from "../../../../database/models/user";
import { QueryGetUsersArgs } from "../../../generated/graphql";

export default async (args: QueryGetUsersArgs, ctx) => {
  try {
    const { search, limit = 10, offset = 0, sorted, location, role } = args; // default values
    const { user } = ctx;

    let companyId = user?.company;
    if (!companyId && user?._id) {
      const dbUser = await UserModel.findById(user._id).select("company").lean();
      companyId = dbUser?.company;
    }

    // Build search query
    const query: any = {
      company: companyId,
      isArchived: { $ne: true },
    };
    let sort = {};
    if (search && search.trim() !== "") {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (location) {
      query.location = location;
    }

    if (role) {
      query.role = role;
    }
    if (sorted) {
      if (sorted?.columnId === "employee") {
        sort["firstName"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "email") {
        sort["email"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "signedOut") {
        sort["signedOut"] = sorted.direction === "asc" ? 1 : -1;
      }
    }
    const hosts = await UserModel.find(query)
      .populate("company")
      .populate("department")
      .populate("location")
      .skip(offset)
      .limit(limit)
      .sort(sorted?.columnId ? sort : { createdAt: -1 })
      .lean();
    const count = await UserModel.countDocuments(query);

    return {
      user: hosts,
      count,
    };
  } catch (error: any) {
    console.error("Error fetching hosts:", error);
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
      hosts: null,
    };
  }
};
