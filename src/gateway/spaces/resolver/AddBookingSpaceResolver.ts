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
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company,
    ctx.user._id
  );
  if (!ownedLocation) {
    return {
      booking: null,
      error: {
        message: "Location not found",
        code: "NOT_FOUND",
      },
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
        error: {
          message: "Employee not found",
          code: "NOT_FOUND",
        },
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
        error: {
          message: "Resource not found",
          code: "NOT_FOUND",
        },
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
        error: {
          message: "Space not found",
          code: "NOT_FOUND",
        },
      };
    }
  }

  // Pure space booking may also pick a linked resource; require it belongs to the space
  if (hasSpace && !hasResource && resource && space) {
    const linkedIds = new Set<string>();
    if (resource.space) linkedIds.add(resource.space.toString());
    for (const s of resource.spaces ?? []) {
      linkedIds.add(s.toString());
    }
    if (
      linkedIds.size > 0 &&
      !linkedIds.has(input.space.toString())
    ) {
      return {
        booking: null,
        error: {
          message: "Resource does not belong to the selected space",
          code: "VALIDATION",
        },
      };
    }
  }

  const overlapping = await findOverlappingBookings({
    location: input.location,
    start: input.start,
    end: input.end,
    createdBy: ctx.user._id,
  });

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

  // Space availability only for pure space bookings (not resource bookings with a Place)
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

  const booking = await BookingSpaceModel.create({
    ...input,
    people: people >= 1 ? people : 1,
    // Space bookings never store a resource. Resource bookings may store Place (space).
    resource: hasResource ? input.resource : undefined,
    space: hasSpace ? input.space : undefined,
    createdBy: ctx.user._id,
  });
  return {
    booking,
    error: null,
  };
};
