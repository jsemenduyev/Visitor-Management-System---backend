import SpaceResourceModel from "../../../../database/models/spacesResources";

export default async (args: any, ctx: any) => {
  const { location, space, resourceCategory, features } = args;

  const query: any = {};

  if (location) query.location = location;
  if (space) query.space = space;
  if (resourceCategory) query.resourceCategory = resourceCategory;
  if (features && features.length > 0) query.features = { $in: features };

  const resources = await SpaceResourceModel.find(query).populate('location').populate('resourceCategory').populate('space').lean();
  return resources;
};