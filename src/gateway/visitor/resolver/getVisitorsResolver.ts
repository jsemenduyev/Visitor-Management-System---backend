import moment from "moment-timezone";
import VisitorModel from "../../../../database/models/visitor";
import { QueryGetVistorsArgs } from "../../../generated/graphql";
const US_TIMEZONE = "America/New_York"; // change if needed
export default async (_, args: QueryGetVistorsArgs, ctx) => {
  try {
    const {
      startDate,
      endDate,
      search,
      signedType,
      category,
      remembered,
      limit = 10,
      offset = 0,
      sorted,
      location
    } = args;

    const { user } = ctx;

    const filter: any = {
      company: user.company,
    };
    if (location) {
      filter.location = location;
    }
    let sort = {};
    // Date filter
    if (startDate && endDate) {
      const start = moment.tz(startDate, US_TIMEZONE).startOf("day").utc().toDate();
      const end = moment.tz(endDate, US_TIMEZONE).endOf("day").utc().toDate();

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    
    // Category filter
    if (category) {
      filter.category = category;
    }
    if (remembered) {
      filter.remembered = remembered;
    }

    // Status filter (if status is tied to signedType or something similar)
    if (signedType !== undefined && signedType !== "All") {
      filter.signedType = signedType;
    }

    // Search by fullName inside `data`
    if (search) {
      filter["data.fullName"] = { $regex: search, $options: "i" }; // case-insensitive
    }
    if (sorted) {
      if (sorted?.columnId === "visitor") {
        sort["data.fullName"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "signedIn") {
        sort["signedIn"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "signedOut") {
        sort["signedOut"] = sorted.direction === "asc" ? 1 : -1;
      }
    }
    const visitors = await VisitorModel.find(filter)
      .populate("category")
      .populate("department")
      .populate("employees")
      .populate("location")
      .sort(sorted?.columnId ? sort : { createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await VisitorModel.countDocuments(filter);
    return { visitor: visitors, count };
  } catch (error) {
    console.error("Error fetching visitors:", error);
    throw new Error("Failed to fetch visitors");
  }
};
