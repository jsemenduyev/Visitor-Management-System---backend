import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;
  const company = ctx?.user?.company;

  const existing = await SpaceResourceModel.findById(_id).lean();
  if (!existing) {
    return {
      resource: null,
      error: {
        message: "Resource not found",
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
      resource: null,
      error: {
        message: "Resource not found",
        code: "NOT_FOUND",
      },
    };
  }

  if (input?.location) {
    const ownedNew = await assertLocationBelongsToCompany(
      input.location,
      company
    );
    if (!ownedNew) {
      return {
        resource: null,
        error: {
          message: "Location not found",
          code: "NOT_FOUND",
        },
      };
    }
  }

  const resource = await SpaceResourceModel.findByIdAndUpdate(_id, input, {
    new: true,
  });

  return {
    resource,
    error: null,
  };
};
