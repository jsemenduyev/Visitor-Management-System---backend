import visitorCategory from "../../../../database/models/visitorCategory";
import { toCamelCase } from "../../../../utils/toCamelCase";
import { MutationUpdateCategoryArgs } from "../../../generated/graphql";

export default async (_: any, args: MutationUpdateCategoryArgs, ctx: any) => {
  try {
    const { input } = args;

    // Check if category exists
    const category = await visitorCategory.findOne({
      _id: input._id,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    }).lean();
    if (!category) {
      return {
        error: {
          message: "Category does not exist",
          code: "NOT_EXIST",
        },
      };
    }

    // Convert label to name in camelCase for all fields
    if (input.fields && Array.isArray(input.fields)) {
      input.fields = input.fields.map((field: any) => ({
        ...field,
        name: field.label ? toCamelCase(field.label) : "",
      }));
    }

    // Update category
    const updatedCategory = await visitorCategory.findOneAndUpdate(
      { _id: input._id, company: ctx.user.company, createdBy: ctx.user._id },
      input,
      { new: true }
    );

    return {
      category: updatedCategory,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};
