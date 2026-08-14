import { UserModel } from "../../../../database/models/user";
import { dashboardEmployeeFilter } from "../../utils/ownerScope";

export default async (args: { search?: string; limit?: number; offset?: number }, ctx) => {
  try {
    const { search, limit = 10, offset = 0 } = args;
    const { user } = ctx;

    let companyId = user?.company;
    if (!companyId && user?._id) {
      const dbUser = await UserModel.findById(user._id).select("company").lean();
      companyId = dbUser?.company;
    }

    const employeeScope = dashboardEmployeeFilter(user);

    const query: any = {
      company: employeeScope.company,
      isArchived: true,
      $and: [{ $or: employeeScope.$or }],
    };

    if (search && search.trim() !== "") {
      query.$and.push({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });
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
