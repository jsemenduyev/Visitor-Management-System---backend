import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  bookingsForResource,
  findOverlappingBookings,
  maxConcurrentUnits,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { location, startDate, endDate, space, resourceCategory } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(location, company, ctx.user._id);
  if (!ownedLocation) {
    return [];
  }

  const query: any = { location };
  if (space) query.space = space;
  if (resourceCategory) query.resourceCategory = resourceCategory;

  const resources = await SpaceResourceModel.find(query)
    .populate("resourceCategory", "name")
    .populate("space")
    .lean();

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const bookings = await findOverlappingBookings({
    location,
    start,
    end,
    createdBy: ctx.user._id,
  });

  return resources.map((resource: any) => {
    const capacity =
      typeof resource.capacity === "number" ? resource.capacity : 0;
    const resourceBookings = bookingsForResource(
      bookings,
      resource._id.toString()
    );
    const booked = maxConcurrentUnits(resourceBookings);
    const available = Math.max(0, capacity - booked);

    return {
      _id: resource._id,
      resourceName: resource.name,
      name: resource.name,
      categoryName: resource.resourceCategory
        ? resource.resourceCategory.name
        : null,
      space: resource.space ?? null,
      capacity,
      booked,
      available,
      bookings: resourceBookings.map((b: any) => ({
        start: b.start,
        end: b.end,
        people: b.people ?? 1,
      })),
    };
  });
};
