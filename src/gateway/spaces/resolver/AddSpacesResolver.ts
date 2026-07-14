import SpaceModel from "../../../../database/models/spaces";
import { MutationAddSpacesArgs } from "../../../generated/graphql";

export default async (args: MutationAddSpacesArgs) => {
  const { input } = args;
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
