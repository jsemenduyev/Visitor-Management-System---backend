import moment from "moment";
import { QueryGetEmployeeTimelineArgs } from "../../../generated/graphql";
import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";

export default async (args: QueryGetEmployeeTimelineArgs, ctx) => {
  try {
    const { date } = args;
    const { user } = ctx;
    // Full-day range
    const startDate = moment.utc(date).startOf("day").toDate(); // 00:00:00 UTC
    const endDate = moment.utc(date).endOf("day").toDate(); // 23:59:59.999 UTC

    const employee = await EmployeeTimelineModel.find({
      employee: user._id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("location").populate("company").sort({ createdAt: -1 })

    const count = await EmployeeTimelineModel.countDocuments({
      employee: user._id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return { employee, count };
  } catch (error) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
