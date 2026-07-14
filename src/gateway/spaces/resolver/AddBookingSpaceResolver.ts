import BookingSpaceModel from "../../../../database/models/bookingSpace";

export default async (args: any, ctx: any) => {
  const { input } = args;

  // Build the match conditions for availability
  const matchConditions: any[] = [];

  if (input.resource) matchConditions.push({ resource: input.resource });
  if (input.space) matchConditions.push({ space: input.space });
  
  // If no specific resource or space is provided, we might be checking at category level or it's invalid.
  // Assuming booking is usually for a specific resource or space.
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
        message: "The requested space or resource is not available for the selected time.",
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
