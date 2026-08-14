import BookingSpaceModel from "../../../../database/models/bookingSpace";

/** Bookings that overlap [start, end): start < rangeEnd AND end > rangeStart */
export function overlapTimeQuery(start: Date | string, end: Date | string) {
  return {
    start: { $lt: new Date(end) },
    end: { $gt: new Date(start) },
  };
}

export function peopleOf(booking: { people?: number | null }) {
  const n = booking?.people;
  return typeof n === "number" && n > 0 ? n : 1;
}

export async function findOverlappingBookings(filter: {
  location?: string;
  resource?: string;
  space?: string;
  createdBy?: string;
  start: Date | string;
  end: Date | string;
}) {
  const query: any = {
    ...overlapTimeQuery(filter.start, filter.end),
  };
  if (filter.location) query.location = filter.location;
  if (filter.resource) query.resource = filter.resource;
  if (filter.space) query.space = filter.space;
  if (filter.createdBy) query.createdBy = filter.createdBy;

  return BookingSpaceModel.find(query)
    .select("resource space start end people")
    .lean();
}

export function resourceBookedCount(
  bookings: Array<{ resource?: any }>,
  resourceId: string
) {
  return bookings.filter((b) => {
    if (!b.resource) return false;
    const id = b.resource._id
      ? b.resource._id.toString()
      : b.resource.toString();
    return id === resourceId;
  }).length;
}

export function spaceBookedPeople(
  bookings: Array<{ space?: any; people?: number | null }>,
  spaceId: string
) {
  return bookings
    .filter((b) => {
      if (!b.space) return false;
      const id = b.space._id ? b.space._id.toString() : b.space.toString();
      return id === spaceId;
    })
    .reduce((sum, b) => sum + peopleOf(b), 0);
}

/** Max concurrent unit bookings (each booking = 1 unit) over a timeline */
export function maxConcurrentUnits(
  bookings: Array<{ start: Date | string; end: Date | string }>
) {
  const events: Array<{ t: number; d: number }> = [];
  for (const b of bookings) {
    events.push({ t: new Date(b.start).getTime(), d: 1 });
    events.push({ t: new Date(b.end).getTime(), d: -1 });
  }
  events.sort((a, b) => (a.t === b.t ? a.d - b.d : a.t - b.t));
  let cur = 0;
  let max = 0;
  for (const e of events) {
    cur += e.d;
    if (cur > max) max = cur;
  }
  return max;
}

/** Max concurrent people over a timeline */
export function maxConcurrentPeople(
  bookings: Array<{
    start: Date | string;
    end: Date | string;
    people?: number | null;
  }>
) {
  const events: Array<{ t: number; d: number }> = [];
  for (const b of bookings) {
    const p = peopleOf(b);
    events.push({ t: new Date(b.start).getTime(), d: p });
    events.push({ t: new Date(b.end).getTime(), d: -p });
  }
  events.sort((a, b) => (a.t === b.t ? a.d - b.d : a.t - b.t));
  let cur = 0;
  let max = 0;
  for (const e of events) {
    cur += e.d;
    if (cur > max) max = cur;
  }
  return max;
}

export function bookingsForResource(
  bookings: Array<{
    resource?: any;
    start: any;
    end: any;
    people?: number | null;
  }>,
  resourceId: string
) {
  return bookings.filter((b) => {
    if (!b.resource) return false;
    const id = b.resource._id
      ? b.resource._id.toString()
      : b.resource.toString();
    return id === resourceId;
  });
}

export function bookingsForSpace(
  bookings: Array<{
    space?: any;
    start: any;
    end: any;
    people?: number | null;
  }>,
  spaceId: string
) {
  return bookings.filter((b) => {
    if (!b.space) return false;
    const id = b.space._id ? b.space._id.toString() : b.space.toString();
    return id === spaceId;
  });
}
