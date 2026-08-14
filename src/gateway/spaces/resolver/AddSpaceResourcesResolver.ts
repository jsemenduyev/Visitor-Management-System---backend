import SpaceResourceModel from "../../../../database/models/spacesResources";
import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

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
      error: {
        message: "Location not found",
        code: "NOT_FOUND",
      },
    };
  }

  if (
    typeof input?.capacity !== "number" ||
    !Number.isFinite(input.capacity) ||
    input.capacity < 1
  ) {
    return {
      error: {
        message: "Total units (capacity) must be at least 1",
        code: "VALIDATION",
      },
    };
  }

  // Ensure space belongs to the same location when provided
  if (input?.space) {
    const space = await SpaceModel.findOne({
      _id: input.space,
      location: input.location,
    }).lean();
    if (!space) {
      return {
        error: {
          message: "Space not found",
          code: "NOT_FOUND",
        },
      };
    }
  }

  const existing = await SpaceResourceModel.findOne({
    name: input?.name,
    resourceCategory: input?.resourceCategory,
    location: input?.location,
    space: input?.space,
  });
  if (existing) {
    return {
      error: {
        message: "Resource Exist",
        code: "EXIST",
      },
    };
  }

  const createResource = await SpaceResourceModel.create(input);
  return {
    resource: createResource,
  };
};
