import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  bookingEmployeeName,
  bookingSpaceName,
  bookingsForResource,
  findOverlappingBookings,
  maxConcurrentUnits,
} from "../utils/overlapStats";

const parseResourceCapacity = (raw: unknown): number | null => {
  if (raw == null || raw === "") return null;
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return numeric;
};

export default async (args: any, ctx: any) => {
  const { location, start, end, resourceCategory } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    location,
    company,
    ctx.user._id
  );
  if (!ownedLocation) {
    return [];
  }

  const query: any = { location };
  if (resourceCategory) query.resourceCategory = resourceCategory;

  const resources = await SpaceResourceModel.find(query)
    .populate("resourceCategory", "name")
    .populate("space")
    .lean();

  const bookings = await findOverlappingBookings({
    location,
    start,
    end,
    createdBy: ctx.user._id,
  });

  return resources.map((resource: any) => {
    const capacity = parseResourceCapacity(resource.capacity);
    const occupying = bookingsForResource(bookings, resource._id.toString());
    const booked = maxConcurrentUnits(occupying);
    const available =
      capacity == null ? null : Math.max(0, capacity - booked);

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
      bookings: occupying.map((b: any) => ({
        start: b.start,
        end: b.end,
        people: b.people ?? 1,
        employeeName: bookingEmployeeName(b),
        spaceName:
          bookingSpaceName(b) ||
          resource.space?.name ||
          null,
      })),
    };
  });
};
