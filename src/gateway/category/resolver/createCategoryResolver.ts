import visitorCategory from "../../../../database/models/visitorCategory";
import { MutationCreateCategoryArgs } from "../../../generated/graphql";

export default async (_: any, args: MutationCreateCategoryArgs) => {
  try {
    const { input } = args;
    // Check if category already exists
    const existing = await visitorCategory
      .findOne({
        name: input.name,
        company: input.company,
        location: input?.location,
      })
      .lean();

    if (existing) {
      return {
        error: {
          message: "Category already exists",
          code: "ALREADY_EXIST",
        },
      };
    }

    // Create new category (with just name for now)
    const savedCategory = await visitorCategory.create(input);

    return {
      category: savedCategory,
    };
  } catch (error) {
    console.error("Error in createCategory:", error);
    throw new Error("Failed to create category");
  }
};
