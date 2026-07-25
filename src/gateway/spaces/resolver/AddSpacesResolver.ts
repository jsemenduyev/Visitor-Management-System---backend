import SpaceModel from "../../../../database/models/spaces";
import { MutationAddSpacesArgs } from "../../../generated/graphql";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: MutationAddSpacesArgs, ctx) => {
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company
  );
  if (!ownedLocation) {
    return {
      space: null,
      error: {
        message: "Location not found",
        code: "NOT_FOUND",
      },
    };
  }

  const findSpace = await SpaceModel.findOne({
    location: input?.location,
    name: input?.name,
  });
  if (findSpace) {
    return {
      space: null,
      error: {
        message: "Same Name Space Already Exist to this Location",
        code: "SPACE_EXIST",
      },
    };
  }

  const space = await SpaceModel.create(input);
  return {
    space,
    error: null,
  };
};
