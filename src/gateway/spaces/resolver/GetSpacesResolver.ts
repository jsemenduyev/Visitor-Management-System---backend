import SpaceModel from "../../../../database/models/spaces";
import { QueryGetSpacesArgs } from "../../../generated/graphql";

export default async (args: QueryGetSpacesArgs, ctx) => {
  const { location, space, resourceCategory } = args;
  const query: any = { location };
  if (space) query._id = space;
  if (resourceCategory) query.resourceCategory = resourceCategory;
  const getSpaces = await SpaceModel.find(query).lean();
  return getSpaces;
};
