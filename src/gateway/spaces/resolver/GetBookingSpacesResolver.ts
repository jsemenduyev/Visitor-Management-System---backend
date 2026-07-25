import BookingSpaceModel from "../../../../database/models/bookingSpace";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { location, employee, resource, space, start, end } = args;
  const company = ctx?.user?.company;

  if (!company) {
    return [];
  }

  const query: any = {};

  if (location) {
    const ownedLocation = await assertLocationBelongsToCompany(location, company);
    if (!ownedLocation) {
      return [];
    }
    query.location = location;
  } else {
    // Constrain to company-owned locations when location is omitted
    const companyLocations = await OfficeLocationModel.find({ company })
      .select("_id")
      .lean();
    const locationIds = companyLocations.map((l: any) => l._id);
    if (locationIds.length === 0) {
      return [];
    }
    query.location = { $in: locationIds };
  }

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
