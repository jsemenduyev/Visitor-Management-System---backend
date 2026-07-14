import SpaceCategoryModel from "../../../../database/models/spaceCategory";

export default async (args: any, ctx: any) => {
  const { input } = args;
  const category = await SpaceCategoryModel.findOne({
    location: input?.location,
    name: input?.name,
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

  const createCategory = await SpaceCategoryModel.create(input);
  return {
    category: createCategory,
    error: null,
  };
};
