import SpaceResourceModel from "../../../../database/models/spacesResources";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { location, space, resourceCategory, features } = args;
  const company = ctx?.user?.company;

  if (!location) {
    return [];
  }

  const ownedLocation = await assertLocationBelongsToCompany(location, company);
  if (!ownedLocation) {
    return [];
  }

  const query: any = { location };

  if (space) query.space = space;
  if (resourceCategory) query.resourceCategory = resourceCategory;
  if (features && features.length > 0) query.features = { $in: features };

  const resources = await SpaceResourceModel.find(query)
    .populate("location")
    .populate("resourceCategory")
    .populate("space")
    .lean();
  return resources;
};
