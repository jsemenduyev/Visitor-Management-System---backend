import SpaceResourceModel from "../../../../database/models/spacesResources";
import SpaceModel from "../../../../database/models/spaces";
import { MutationAddResourcesArgs } from "../../../generated/graphql";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: MutationAddResourcesArgs, ctx) => {
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company
  );
  if (!ownedLocation) {
    return {
      error: {
        message: "Location not found",
        code: "NOT_FOUND",
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
