import SpaceModel from "../../../../database/models/spaces";
import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  bookingEmployeeName,
  bookingSpaceName,
  bookingsForSpace,
  findOverlappingBookings,
  maxConcurrentPeople,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { location, startDate, endDate, space, minCapacity, resourceIds } =
    args;
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
  if (space) query._id = space;
  if (
    typeof minCapacity === "number" &&
    Number.isFinite(minCapacity) &&
    minCapacity > 0
  ) {
    query.capacity = { $gte: minCapacity };
  }

  const spaces = await SpaceModel.find(query).lean();

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

  const spaceIds = spaces.map((s: any) => s._id);
  const allResources = await SpaceResourceModel.find({
    location,
    $or: [
      { spaces: { $in: spaceIds } },
      { space: { $in: spaceIds } },
    ],
  })
    .populate("resourceCategory")
    .lean();

  const resourcesBySpace = new Map<string, any[]>();
  for (const resource of allResources) {
    const linked = new Set<string>();
    if (resource.space) {
      linked.add(
        resource.space._id?.toString?.() ?? String(resource.space),
      );
    }
    for (const s of resource.spaces ?? []) {
      linked.add(s?._id?.toString?.() ?? String(s));
    }
    for (const spaceKey of linked) {
      if (!resourcesBySpace.has(spaceKey)) {
        resourcesBySpace.set(spaceKey, []);
      }
      resourcesBySpace.get(spaceKey)!.push(resource);
    }
  }

  const requiredResourceIds = (resourceIds ?? [])
    .filter(Boolean)
    .map((id: any) => String(id));

  const mapped = spaces.map((s: any) => {
    const capacitySet =
      typeof s.capacity === "number" && Number.isFinite(s.capacity);
    const capacity = capacitySet ? s.capacity : null;
    const spaceBookings = bookingsForSpace(bookings, s._id.toString());
    const bookedPeople = maxConcurrentPeople(spaceBookings);
    const availablePeople = capacitySet
      ? Math.max(0, (capacity as number) - bookedPeople)
      : null;
    return {
      _id: s._id,
      name: s.name,
      capacity,
      bookedPeople,
      availablePeople,
      bookings: spaceBookings.map((b: any) => ({
        _id: b._id,
        start: b.start,
        end: b.end,
        people: b.people ?? 1,
        employeeId: b.employee?._id ?? b.employee ?? null,
        employeeName: bookingEmployeeName(b),
        spaceId: b.space?._id ?? b.space ?? s._id ?? null,
        spaceName: bookingSpaceName(b) || s.name || null,
      })),
      resources: resourcesBySpace.get(s._id.toString()) ?? [],
    };
  });

  if (requiredResourceIds.length === 0) {
    return mapped;
  }

  return mapped.filter((s: any) => {
    const spaceResourceIds = (s.resources ?? []).map((r: any) =>
      String(r?._id),
    );
    return requiredResourceIds.every((id: string) =>
      spaceResourceIds.includes(id),
    );
  });
};
