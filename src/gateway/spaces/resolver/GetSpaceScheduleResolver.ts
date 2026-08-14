import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  bookingsForSpace,
  findOverlappingBookings,
  maxConcurrentPeople,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { location, startDate, endDate, space } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(location, company, ctx.user._id);
  if (!ownedLocation) {
    return [];
  }

  const query: any = { location };
  if (space) query._id = space;

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

  return spaces.map((s: any) => {
    const capacitySet =
      typeof s.capacity === "number" && Number.isFinite(s.capacity);
    const capacity = capacitySet ? s.capacity : null;
    const spaceBookings = bookingsForSpace(bookings, s._id.toString());
    const bookedPeople = maxConcurrentPeople(spaceBookings);
    // Missing capacity = unset (legacy); do not treat as fully booked
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
        start: b.start,
        end: b.end,
        people: b.people ?? 1,
      })),
    };
  });
};
