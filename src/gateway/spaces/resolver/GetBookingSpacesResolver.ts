import BookingSpaceModel from "../../../../database/models/bookingSpace";

export default async (args: any, ctx: any) => {
  const { location, employee, resource, space, start, end } = args;

  const query: any = {};
  if (location) query.location = location;
  if (employee) query.employee = employee;
  if (resource) query.resource = resource;
  if (space) query.space = space;

  if (start) {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    query.end = { $gte: startDate };
  }
  if (end) {
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    query.start = { $lte: endDate };
  }

  const bookings = await BookingSpaceModel.find(query)
    .populate("employee")
    .populate("resource")
    .populate("category")
    .populate("location")
    .populate("space")
    .lean();
  return bookings;
};
