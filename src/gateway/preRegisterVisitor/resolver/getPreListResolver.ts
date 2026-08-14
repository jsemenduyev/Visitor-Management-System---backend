import moment from "moment-timezone";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { QueryGetPreVisitorsArgs } from "../../../generated/graphql";
const US_TIMEZONE = "America/New_York"; // change if needed

export default async (_, args: QueryGetPreVisitorsArgs) => {
  try {
    const {
      startDate,
      endDate,
      search,
      category,
      limit = 10,
      offset = 0,
      company,
      sorted,
      location,
    } = args;

    const filter: any = { company };
    // "All locations" sends null, so leave location out of the query.
    if (location) {
      filter.location = location;
    }
    // Date filter
    if (startDate && endDate) {
      const start = moment
        .tz(startDate, US_TIMEZONE)
        .startOf("day")
        .utc()
        .toDate();

      const end = moment.tz(endDate, US_TIMEZONE).endOf("day").utc().toDate();
      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }
    let sort = {};
    // Category filter
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter["data.fullName"] = { $regex: search, $options: "i" }; // case-insensitive
    }

    if (sorted) {
      if (sorted?.columnId === "visitor") {
        sort["data.fullName"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "date") {
        sort["endDate"] = sorted.direction === "asc" ? 1 : -1;
      }
    }

    const visitors = await PreRegisterVisitorModel.find(filter)
      .populate("category")
      .populate("employees")
      .populate("department")
      .sort(sorted?.columnId ? sort : { createdAt: -1 })
      .lean();

    const count = await PreRegisterVisitorModel.countDocuments();
    return { visitors, count };
  } catch (error) {
    console.error("Error fetching pre visitors:", error);
    throw new Error("Failed to fetch pre visitors");
  }
};
