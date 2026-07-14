import SpaceResourceModel from "../../../../database/models/spacesResources";
import {
  MutationAddResourcesArgs,
  MutationAddSpacesArgs,
} from "../../../generated/graphql";

export default async (args: MutationAddResourcesArgs, ctx) => {
  const { input } = args;

  const space = await SpaceResourceModel.findOne({
    name: input?.name,
    resourceCategory: input?.resourceCategory,
    location: input?.location,
    space: input?.space,
  });
  if (space) {
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
