import SpaceModel from "../../../../database/models/spaces";
import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
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

  let spaceIds: string[] | null = null;
  if (resource) {
    const resDoc = await SpaceResourceModel.findOne({
      _id: resource,
      location,
    })
      .select("space")
      .lean();
    if (!resDoc?.space) {
      return [];
    }
    spaceIds = [resDoc.space.toString()];
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
    const bookedPeople = spaceBookedPeople(bookings, space._id.toString());
    const availablePeople = capacitySet
      ? Math.max(0, (capacity as number) - bookedPeople)
      : null;
    return {
      _id: space._id,
      name: space.name,
      capacity,
      bookedPeople,
      availablePeople,
      bookings: bookings
        .filter((b: any) => {
          if (!b.space) return false;
          const id = b.space._id ? b.space._id.toString() : b.space.toString();
          return id === space._id.toString();
        })
        .map((b: any) => ({
          start: b.start,
          end: b.end,
          people: b.people ?? 1,
        })),
    };
  });
};
