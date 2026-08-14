import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;
  const company = ctx?.user?.company;

  const existing = await SpaceModel.findOne({ _id, createdBy: ctx.user._id }).lean();
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

  if (
    input?.capacity != null &&
    (typeof input.capacity !== "number" ||
      !Number.isFinite(input.capacity) ||
      input.capacity < 1)
  ) {
    return {
      spaces: null,
      error: {
        message: "Capacity must be at least 1",
        code: "VALIDATION",
      },
    };
  }

  const space = await SpaceModel.findOneAndUpdate({ _id, createdBy: ctx.user._id }, input, { new: true });

  return {
    spaces: space,
    error: null,
  };
};
