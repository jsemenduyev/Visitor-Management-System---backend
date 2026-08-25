import SpaceModel from "../../../../database/models/spaces";
import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  bookingEmployeeName,
  bookingSpaceName,
  bookingsForSpace,
  findOverlappingBookings,
  spaceBookedPeople,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { location, start, end, resource } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(location, company, ctx.user._id);
  if (!ownedLocation) {
    return [];
  }

  // Resource filter only narrows which spaces are listed (by assignment),
  // not by whether that resource is currently booked.
  let spaceIds: string[] | null = null;
  if (resource) {
    const resDoc = await SpaceResourceModel.findOne({
      _id: resource,
      location,
    })
      .select("space spaces")
      .lean();
    const linked: string[] = [];
    if (resDoc?.space) linked.push(resDoc.space.toString());
    for (const s of (resDoc as any)?.spaces ?? []) {
      linked.push(s.toString());
    }
    if (linked.length === 0) {
      return [];
    }
    spaceIds = Array.from(new Set(linked));
  }

  const spaceQuery: any = { location };
  if (spaceIds) {
    spaceQuery._id = { $in: spaceIds };
  }

  const spaces = await SpaceModel.find(spaceQuery).lean();

  const bookings = await findOverlappingBookings({
    location,
    start,
    end,
    createdBy: ctx.user._id,
  });

  return spaces.map((space: any) => {
    const capacitySet =
      typeof space.capacity === "number" && Number.isFinite(space.capacity);
    const capacity = capacitySet ? space.capacity : null;
    const spaceBookings = bookingsForSpace(bookings, space._id.toString());
    const bookedPeople = spaceBookedPeople(bookings, space._id.toString());
    const overlappingCount = spaceBookings.length;
    const availablePeople =
      overlappingCount > 0
        ? 0
        : capacitySet
          ? (capacity as number)
          : null;
    return {
      _id: space._id,
      name: space.name,
      capacity,
      bookedPeople,
      availablePeople,
      bookings: spaceBookings.map((b: any) => ({
        start: b.start,
        end: b.end,
        people: b.people ?? 1,
        employeeName: bookingEmployeeName(b),
        spaceName: bookingSpaceName(b) || space.name || null,
      })),
    };
  });
};
