import visitorCategory from "../../../../database/models/visitorCategory";
import { MutationUpdateFieldArgs } from "../../../generated/graphql";
export default async (_: any, args: MutationUpdateFieldArgs, ctx: any) => {
  try {
    const { categoryId, fieldId, required, enabled, clearResponseAfterEachVisit } = args;

    if (!categoryId || !fieldId) {
      throw new Error("CategoryId and FieldId are required");
    }

    const category = await visitorCategory.findOne({
      _id: categoryId,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    });
    if (!category) {
      throw new Error("Category not found");
    }

    // Find the field
    const fieldIndex = category.fields.findIndex(
      (f: any) => f._id.toString() === fieldId,
    );

    if (fieldIndex === -1) {
      return {
        error: {
          message: "Field not found in category",
          code: "NOT_FOUND",
        },
      };
    }

    // Update the field properties
    if (typeof required === "boolean") {
      category.fields[fieldIndex].required = required;
    }
    if (typeof enabled === "boolean") {
      category.fields[fieldIndex].enabled = enabled;
    }
    if (typeof clearResponseAfterEachVisit === "boolean") {
      category.fields[fieldIndex].clearResponseAfterEachVisit = clearResponseAfterEachVisit;
    }

    // Save the category
    await category.save();

    return "Updated!!";
  } catch (err: any) {
    console.error("Error updating field:", err);
    return {
      error: {
        message: err.message || "Internal server error",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
