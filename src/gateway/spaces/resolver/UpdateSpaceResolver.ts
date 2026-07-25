import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;
  const company = ctx?.user?.company;

  const existing = await SpaceModel.findById(_id).lean();
  if (!existing) {
    return {
      spaces: null,
      error: {
        message: "Space not found",
        code: "NOT_FOUND",
      },
    };
  }

  const ownedCurrent = await assertLocationBelongsToCompany(
    existing.location?.toString?.() ?? existing.location,
    company
  );
  if (!ownedCurrent) {
    return {
      spaces: null,
      error: {
        message: "Space not found",
        code: "NOT_FOUND",
      },
    };
  }

  // If relocating, new location must also belong to caller's company
  if (input?.location) {
    const ownedNew = await assertLocationBelongsToCompany(
      input.location,
      company
    );
    if (!ownedNew) {
      return {
        spaces: null,
        error: {
          message: "Location not found",
          code: "NOT_FOUND",
        },
      };
    }
  }

  const space = await SpaceModel.findByIdAndUpdate(_id, input, { new: true });

  return {
    spaces: space,
    error: null,
  };
};
