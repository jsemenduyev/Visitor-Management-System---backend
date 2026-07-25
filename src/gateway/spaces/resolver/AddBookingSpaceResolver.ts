import BookingSpaceModel from "../../../../database/models/bookingSpace";
import { UserModel } from "../../../../database/models/user";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company
  );
  if (!ownedLocation) {
    return {
      booking: null,
      error: {
        message: "Location not found",
        code: "NOT_FOUND",
      },
    };
  }

  // If employee is provided, ensure they belong to the caller's company
  if (input?.employee) {
    const employee = await UserModel.findOne({
      _id: input.employee,
      company,
    }).lean();
    if (!employee) {
      return {
        booking: null,
        error: {
          message: "Employee not found",
          code: "NOT_FOUND",
        },
      };
    }
  }

  // Build the match conditions for availability
  const matchConditions: any[] = [];

  if (input.resource) matchConditions.push({ resource: input.resource });
  if (input.space) matchConditions.push({ space: input.space });

  const query: any = {
    $and: [
      { start: { $lt: new Date(input.end) } },
      { end: { $gt: new Date(input.start) } },
    ],
  };

  if (matchConditions.length > 0) {
    query.$or = matchConditions;
  }

  const overlappingBooking = await BookingSpaceModel.findOne(query);

  if (overlappingBooking) {
    return {
      booking: null,
      error: {
        message:
          "The requested space or resource is not available for the selected time.",
        code: "UNAVAILABLE",
      },
    };
  }

  const booking = await BookingSpaceModel.create(input);
  return {
    booking,
    error: null,
  };
};
