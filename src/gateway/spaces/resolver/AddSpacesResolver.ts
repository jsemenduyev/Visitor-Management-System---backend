import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import { syncSpaceResources } from "../utils/syncSpaceResources";

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
      spaces: null,
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
      spaces: null,
      error: {
        message: "Capacity must be at least 1",
        code: "VALIDATION",
      },
    };
  }

  const findSpace = await SpaceModel.findOne({
    location: input?.location,
    name: input?.name,
  });
  if (findSpace) {
    return {
      spaces: null,
      error: {
        message: "Same Name Space Already Exist to this Location",
        code: "SPACE_EXIST",
      },
    };
  }

  const { resources, ...spaceFields } = input;
  const space = await SpaceModel.create(spaceFields);

  if (resources && resources.length > 0) {
    const syncResult = await syncSpaceResources(
      space._id.toString(),
      resources,
      input.location
    );
    if (syncResult.ok === false) {
      return {
        spaces: null,
        error: {
          message: syncResult.message,
          code: syncResult.code,
        },
      };
    }
  }

  return {
    spaces: space,
    error: null,
  };
};
