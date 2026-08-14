import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  findOverlappingBookings,
  resourceBookedCount,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { location, start, end, resourceCategory } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(location, company);
  if (!ownedLocation) {
    return [];
  }

  const query: any = { location, createdBy: ctx.user._id };
  if (resourceCategory) query.resourceCategory = resourceCategory;

  const resources = await SpaceResourceModel.find(query)
    .populate("resourceCategory", "name")
    .populate("space")
    .lean();

  const bookings = await findOverlappingBookings({
    location,
    start,
    end,
  });

  return resources.map((resource: any) => {
    const capacity = typeof resource.capacity === "number" ? resource.capacity : 0;
    const booked = resourceBookedCount(bookings, resource._id.toString());
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
      bookings: bookings
        .filter((b: any) => {
          if (!b.resource) return false;
          const id = b.resource._id
            ? b.resource._id.toString()
            : b.resource.toString();
          return id === resource._id.toString();
        })
        .map((b: any) => ({
          start: b.start,
          end: b.end,
          people: b.people ?? 1,
        })),
    };
  });
};
