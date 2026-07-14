import SpaceCategoryModel from "../../../../database/models/spaceCategory";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;

  const category = await SpaceCategoryModel.findByIdAndUpdate(_id, input, {
    new: true,
  });

  if (!category) {
    return {
      category: null,
      error: {
        message: "Category not found",
        code: "NOT_FOUND",
      },
    };
  }

  return {
    category,
    error: null,
  };
};
