import SpaceCategoryModel from "../../../../database/models/spaceCategory";
import { assertLocationBelongsToCompany } from "../utils/assertLocationCompany";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;
  const company = ctx?.user?.company;

  const existing = await SpaceCategoryModel.findOne({ _id, createdBy: ctx.user._id }).lean();
  if (!existing) {
    return {
      category: null,
      error: {
        message: "Category not found",
        code: "NOT_FOUND",
      },
    };
  }

  const ownedCurrent = await assertLocationBelongsToCompany(
    existing.location?.toString?.() ?? existing.location,
    company
  );
  if (!ownedCurrent) {
    return {
      category: null,
      error: {
        message: "Category not found",
        code: "NOT_FOUND",
      },
    };
  }

  if (input?.location) {
    const ownedNew = await assertLocationBelongsToCompany(
      input.location,
      company
    );
    if (!ownedNew) {
      return {
        category: null,
        error: {
          message: "Location not found",
          code: "NOT_FOUND",
        },
      };
    }
  }

  const category = await SpaceCategoryModel.findOneAndUpdate({ _id, createdBy: ctx.user._id }, input, {
    new: true,
  });

  return {
    category,
    error: null,
  };
};
