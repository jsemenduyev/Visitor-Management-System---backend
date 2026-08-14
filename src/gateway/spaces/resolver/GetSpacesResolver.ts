import SpaceModel from "../../../../database/models/spaces";
import { QueryGetSpacesArgs } from "../../../generated/graphql";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: QueryGetSpacesArgs, ctx) => {
  const { location, space, resourceCategory } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(location, company, ctx.user._id);
  if (!ownedLocation) {
    return [];
  }

  const query: any = { location };
  if (space) query._id = space;
  if (resourceCategory) query.resourceCategory = resourceCategory;
  const getSpaces = await SpaceModel.find(query).lean();
  return getSpaces;
};
