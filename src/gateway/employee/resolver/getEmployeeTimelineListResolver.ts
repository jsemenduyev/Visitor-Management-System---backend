import moment from "moment-timezone";
import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";

const US_TIMEZONE = "America/New_York"; // change if needed

export default async (args, ctx) => {
  try {
    const { search, limit = 10, offset = 0, startDate, endDate, sorted, location, signedType } = args;
    const { user } = ctx;

    const query: any = {
      company: user.company,
    };

    let sort = {};

    if (search && search.trim() !== "") {
      query.$or = [{ "employee.firstName": { $regex: search, $options: "i" } }];
    }

    if (location) {
      query.location = location;
    }

    if (signedType) {
      query.signedType = signedType;
    }

    // 🔥 FORCE US TIMEZONE
    if (startDate) {
      query.createdAt = {
        ...query.createdAt,
        $gte: moment
          .tz(startDate, US_TIMEZONE)
          .startOf("day")
          .utc()
          .toDate(),
      };
    }

    if (endDate) {
      query.createdAt = {
        ...query.createdAt,
        $lte: moment
          .tz(endDate, US_TIMEZONE)
          .endOf("day")
          .utc()
          .toDate(),
      };
    }

    if (sorted) {
      if (sorted?.columnId === "employee") {
        sort["firstName"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "signedIn") {
        sort["signedIn"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "signedOut") {
        sort["signedOut"] = sorted.direction === "asc" ? 1 : -1;
      }
    }

    const employee = await EmployeeTimelineModel.find(query)
      .populate("company")
      .populate("employee")
      .populate("location")
      .sort(sorted?.columnId ? sort : { createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await EmployeeTimelineModel.countDocuments(query);

    return { employee, count, error: null };
  } catch (error) {
    return {
      employee: [],
      count: 0,
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};