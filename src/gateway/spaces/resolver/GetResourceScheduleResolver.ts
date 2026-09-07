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

const bookingSpaceId = (booking: any): string | null => {
  if (!booking?.space) return null;
  return booking.space._id
    ? String(booking.space._id)
    : String(booking.space);
};

const resourceAttachedSpaceIds = (resource: any): string[] => {
  const ids = new Set<string>();
  if (resource?.space) {
    ids.add(
      resource.space._id
        ? String(resource.space._id)
        : String(resource.space)
    );
  }
  for (const s of resource?.spaces ?? []) {
    if (!s) continue;
    ids.add(s._id ? String(s._id) : String(s));
  }
  return [...ids];
};

/** Match booking.space, or null-place bookings that display under the resource's attached space. */
const bookingMatchesSpaceFilter = (
  booking: any,
  spaceFilter: string,
  resource: any
) => {
  const sid = bookingSpaceId(booking);
  if (sid) return sid === spaceFilter;
  return resourceAttachedSpaceIds(resource).includes(spaceFilter);
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

  // Space filter applies to bookings only — always list all resources for the location.
  const query: any = { location };
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

  const spaceFilter = space ? String(space) : null;

  return resources.map((resource: any) => {
    const capacity = parseResourceCapacity(resource.capacity);
    const occupying = bookingsForResource(bookings, resource._id.toString());
    const visible = spaceFilter
      ? occupying.filter((b: any) =>
          bookingMatchesSpaceFilter(b, spaceFilter, resource)
        )
      : occupying;
    const booked = maxConcurrentUnits(visible);
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
      bookings: visible.map((b: any) => ({
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
