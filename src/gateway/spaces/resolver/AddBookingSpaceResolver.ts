import BookingSpaceModel from "../../../../database/models/bookingSpace";
import SpaceResourceModel from "../../../../database/models/spacesResources";
import SpaceModel from "../../../../database/models/spaces";
import { UserModel } from "../../../../database/models/user";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import {
  findOverlappingBookings,
  resourceBookedCount,
  spaceBookedPeople,
} from "../utils/overlapStats";

export default async (args: any, ctx: any) => {
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company
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

  // When both selected, resource must belong to that space if linked
  if (
    resource?.space &&
    space &&
    resource.space.toString() !== input.space.toString()
  ) {
    return {
      booking: null,
      error: {
        message: "Resource does not belong to the selected space",
        code: "VALIDATION",
      },
    };
  }

  const overlapping = await findOverlappingBookings({
    location: input.location,
    start: input.start,
    end: input.end,
  });

  if (resource) {
    const resourceCapacity =
      typeof resource.capacity === "number" && Number.isFinite(resource.capacity)
        ? resource.capacity
        : null;
    const resourceBooked = resourceBookedCount(
      overlapping,
      resource._id.toString()
    );
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

  if (space) {
    const spaceCapacity =
      typeof space.capacity === "number" && Number.isFinite(space.capacity)
        ? space.capacity
        : null;
    const spaceBooked = spaceBookedPeople(overlapping, space._id.toString());
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
    resource: hasResource ? input.resource : undefined,
    space: hasSpace ? input.space : undefined,
  });
  return {
    booking,
    error: null,
  };
};
