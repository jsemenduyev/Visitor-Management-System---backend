import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company
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
    createdBy: ctx.user._id,
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

  const space = await SpaceModel.create({ ...input, createdBy: ctx.user._id });
  return {
    spaces: space,
    error: null,
  };
};
