import SpaceCategoryModel from "../../../../database/models/spaceCategory";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { location } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(location, company);
  if (!ownedLocation) {
    return [];
  }

  const categories = await SpaceCategoryModel.find({ location }).lean();
  return categories;
};
