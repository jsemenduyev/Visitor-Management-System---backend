import SpaceCategoryModel from "../../../../database/models/spaceCategory";

export default async (args: any, ctx: any) => {
  const { location } = args;
  const categories = await SpaceCategoryModel.find({ location }).lean();
  return categories;
};
