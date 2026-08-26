import BookingSpaceModel from "../../../../database/models/bookingSpace";

export default async (args: any, ctx: any) => {
  const { id } = args;

  const booking = await BookingSpaceModel.findOneAndDelete({
    _id: id,
    createdBy: ctx.user._id,
  });

  if (!booking) {
    return {
      booking: null,
      error: { message: "Booking not found", code: "NOT_FOUND" },
    };
  }

  return { booking, error: null };
};
