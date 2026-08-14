import SpaceCategoryModel from "../../../../database/models/spaceCategory";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { input } = args;
  const company = ctx?.user?.company;

  const ownedLocation = await assertLocationBelongsToCompany(
    input?.location,
    company
  );
  if (!ownedLocation) {
    return {
      category: null,
      error: {
        message: "Location not found",
        code: "NOT_FOUND",
      },
    };
  }

  const category = await SpaceCategoryModel.findOne({
    location: input?.location,
    name: input?.name,
    createdBy: ctx.user._id,
  });

  if (category) {
    return {
      category: null,
      error: {
        message: "Category already exists",
        code: "EXIST",
      },
    };
  }

  const createCategory = await SpaceCategoryModel.create({ ...input, createdBy: ctx.user._id });
  return {
    category: createCategory,
    error: null,
  };
};
