import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  bookingEmployeeName,
  bookingSpaceName,
  bookingsForResource,
  findOverlappingBookings,
  maxConcurrentUnits,
} from "../utils/overlapStats";
import { resourceLinkedToSpaceFilter } from "../utils/syncSpaceResources";

const parseResourceCapacity = (raw: unknown): number | null => {
  if (raw == null || raw === "") return null;
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return numeric;
};

export default async (args: any, ctx: any) => {
  const { location, startDate, endDate, space, resourceCategory } = args;
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
  if (space) {
    Object.assign(query, resourceLinkedToSpaceFilter(space));
  }
  if (resourceCategory) query.resourceCategory = resourceCategory;

  const resources = await SpaceResourceModel.find(query)
    .populate("resourceCategory", "name")
    .populate("space")
    .populate("spaces")
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
      space: resource.space ?? resource.spaces?.[0] ?? null,
      capacity,
      booked,
      available,
      bookings: occupying.map((b: any) => ({
        _id: b._id,
        start: b.start,
        end: b.end,
        people: b.people ?? 1,
        employeeId: b.employee?._id ?? b.employee ?? null,
        employeeName: bookingEmployeeName(b),
        spaceId: b.space?._id ?? b.space ?? null,
        spaceName:
          bookingSpaceName(b) ||
          resource.space?.name ||
          resource.spaces?.[0]?.name ||
          null,
      })),
    };
  });
};
