import visitorCategory from "../../../../database/models/visitorCategory";
import { MutationCreateCategoryArgs } from "../../../generated/graphql";

export default async (_: any, args: MutationCreateCategoryArgs, ctx: any) => {
  try {
    const { input } = args;
    // Check if category already exists
    const existing = await visitorCategory
      .findOne({
        name: input.name,
        company: ctx.user.company,
        location: input?.location,
        createdBy: ctx.user._id,
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
    const savedCategory = await visitorCategory.create({
      ...input,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    });

    return {
      category: savedCategory,
    };
  } catch (error) {
    console.error("Error in createCategory:", error);
    throw new Error("Failed to create category");
  }
};
