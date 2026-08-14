import moment from "moment-timezone";
import { Types } from "mongoose";
import DeliveryModel from "../../../../database/models/deliveries";
import { QueryGetDeliveriesArgs } from "../../../generated/graphql";
import { UserModel } from "../../../../database/models/user";
const US_TIMEZONE = "America/New_York"; // change if needed

export default async (args: QueryGetDeliveriesArgs, ctx) => {
  try {
    const {
      search,
      limit = 10,
      offset = 0,
      startDate,
      endDate,
      collected,
      sorted,
      location,
    } = args;
    const { user } = ctx;

    let query: any = {
      company: user.company,
    };

    if (location) {
      query.location = new Types.ObjectId(location);
    }

    if (collected !== undefined) {
      query.collected = collected;
    }

    // 📅 Date filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = moment
          .tz(startDate, US_TIMEZONE)
          .startOf("day")
          .utc()
          .toDate();
      }
      if (endDate) {
        query.createdAt.$lte = moment
          .tz(endDate, US_TIMEZONE)
          .endOf("day")
          .utc()
          .toDate();
      }
    }
    let sort: any = { createdAt: -1 }; // default sort

    if (sorted) {
      const direction = sorted.direction === "asc" ? 1 : -1;

      if (sorted.columnId === "delivered") {
        sort = { createdAt: direction };
      }

      if (sorted.columnId === "collected") {
        sort = { collected: direction };
      }
    }

    // 🔍 Search Users First
    if (search) {
      const users = await UserModel.find(
        {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        { _id: 1 },
      )

        .lean();

      const userIds = users.map((u) => u._id);

      // If no users match, return empty result fast
      if (userIds.length === 0) {
        return {
          delivery: [],
          count: 0,
          error: null,
        };
      }

      query.reciepient = { $in: userIds };
    }

    // 📦 Fetch deliveries
    const delivery = await DeliveryModel.find(query)
      .populate("company")
      .populate("reciepient")
      .populate("location")
      .sort(sorted?.columnId ? sort : { createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // 🔢 Count
    const count = await DeliveryModel.countDocuments(query);

    return {
      delivery,
      count,
      error: null,
    };
  } catch (error) {
    return {
      delivery: [],
      count: 0,
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
