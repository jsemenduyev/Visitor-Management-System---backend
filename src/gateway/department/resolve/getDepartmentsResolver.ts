import DepartmentModel from "../../../../database/models/department";
import { QueryGetDepartmentsArgs } from "../../../generated/graphql";

export default async (args: QueryGetDepartmentsArgs, ctx) => {
  try {
    const { search, limit = 10, offset = 0, location } = args; // default values
    let query: any = {};
    const { user } = ctx
    if (search && search.trim() !== "") {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (location) {
      query.location = location
    }



    // Fetch department with pagination
    const department = await DepartmentModel.find({ company: user.company, ...query })
      .populate("user")
      .populate("location")
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await DepartmentModel.countDocuments(query);
    return {
      department,
      count,
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return {
      departments: [],
      count: 0,
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
