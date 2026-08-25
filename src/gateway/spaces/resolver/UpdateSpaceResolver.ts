import SpaceModel from "../../../../database/models/spaces";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";
import { syncSpaceResources } from "../utils/syncSpaceResources";

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
    company,
    ctx.user._id
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

  if (input?.location) {
    const ownedNew = await assertLocationBelongsToCompany(
      input.location,
      company,
      ctx.user._id
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

  const { resources, ...spaceFields } = input ?? {};
  const space = await SpaceModel.findByIdAndUpdate(_id, spaceFields, {
    new: true,
  });

  if (resources !== undefined) {
    const location =
      input?.location?.toString?.() ??
      existing.location?.toString?.() ??
      existing.location;
    const syncResult = await syncSpaceResources(
      _id,
      resources,
      String(location)
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
