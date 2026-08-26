import BookingSpaceModel from "../../../../database/models/bookingSpace";
import SpaceResourceModel from "../../../../database/models/spacesResources";
import SpaceModel from "../../../../database/models/spaces";
import { UserModel } from "../../../../database/models/user";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  findOverlappingBookings,
  maxConcurrentUnits,
  bookingsForResource,
  spaceBookedPeople,
  bookingsForSpace,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { id, input } = args;
  const company = ctx?.user?.company;

  const existing = await BookingSpaceModel.findOne({
    _id: id,
    createdBy: ctx.user._id,
  }).lean();

  if (!existing) {
    return {
      booking: null,
      error: { message: "Booking not found", code: "NOT_FOUND" },
    };
  }

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location ?? existing.location,
    company,
    ctx.user._id
  );
  if (!ownedLocation) {
    return {
      booking: null,
      error: { message: "Location not found", code: "NOT_FOUND" },
    };
  }

  const hasResource = Boolean(input?.resource);
  const hasSpace = Boolean(input?.space);

  if (!hasResource && !hasSpace) {
    return {
      booking: null,
      error: {
        message: "Space or resource is required",
        code: "VALIDATION",
      },
    };
  }

  const people =
    typeof input.people === "number" && input.people > 0
      ? input.people
      : hasSpace
        ? 0
        : 1;

  if (hasSpace && people < 1) {
    return {
      booking: null,
      error: {
        message: "People count must be at least 1",
        code: "VALIDATION",
      },
    };
  }

  if (input?.employee) {
    const employee = await UserModel.findOne({
      _id: input.employee,
      company,
    }).lean();
    if (!employee) {
      return {
        booking: null,
        error: { message: "Employee not found", code: "NOT_FOUND" },
      };
    }
  }

  let resource: any = null;
  if (hasResource) {
    resource = await SpaceResourceModel.findOne({
      _id: input.resource,
      location: input.location,
    }).lean();
    if (!resource) {
      return {
        booking: null,
        error: { message: "Resource not found", code: "NOT_FOUND" },
      };
    }
  }

  let space: any = null;
  if (hasSpace) {
    space = await SpaceModel.findOne({
      _id: input.space,
      location: input.location,
    }).lean();
    if (!space) {
      return {
        booking: null,
        error: { message: "Space not found", code: "NOT_FOUND" },
      };
    }
  }

  const overlapping = (
    await findOverlappingBookings({
      location: input.location,
      start: input.start,
      end: input.end,
      createdBy: ctx.user._id,
    })
  ).filter((b: any) => b._id.toString() !== id.toString());

  if (resource) {
    const resourceCapacity =
      typeof resource.capacity === "number" && Number.isFinite(resource.capacity)
        ? resource.capacity
        : null;
    const occupying = bookingsForResource(
      overlapping,
      resource._id.toString()
    );
    const resourceBooked = maxConcurrentUnits(occupying);
    if (resourceCapacity != null && resourceBooked + 1 > resourceCapacity) {
      return {
        booking: null,
        error: {
          message:
            "The requested resource is not available for the selected time.",
          code: "UNAVAILABLE",
        },
      };
    }
  }

  if (space && !hasResource) {
    const overlappingForSpace = bookingsForSpace(
      overlapping,
      space._id.toString()
    );
    const spaceCapacity =
      typeof space.capacity === "number" && Number.isFinite(space.capacity)
        ? space.capacity
        : null;
    const spaceBooked = spaceBookedPeople(overlapping, space._id.toString());
    if (overlappingForSpace.length > 0) {
      return {
        booking: null,
        error: {
          message: "Space is not available for the selected date and time",
          code: "UNAVAILABLE",
        },
      };
    }
    if (spaceCapacity != null && spaceBooked + people > spaceCapacity) {
      return {
        booking: null,
        error: {
          message: `Space capacity exceeded. Available people: ${Math.max(
            0,
            spaceCapacity - spaceBooked
          )}.`,
          code: "UNAVAILABLE",
        },
      };
    }
  }

  const booking = await BookingSpaceModel.findOneAndUpdate(
    { _id: id, createdBy: ctx.user._id },
    {
      start: input.start,
      end: input.end,
      location: input.location,
      employee: input.employee,
      category: input.category ?? null,
      people: people >= 1 ? people : 1,
      resource: hasResource ? input.resource : null,
      space: hasSpace ? input.space : null,
    },
    { new: true }
  );

  return { booking, error: null };
};
