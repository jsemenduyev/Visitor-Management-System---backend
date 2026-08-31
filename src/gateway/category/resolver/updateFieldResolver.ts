import visitorCategory from "../../../../database/models/visitorCategory";
import { MutationUpdateFieldArgs } from "../../../generated/graphql";
export default async (_: any, args: MutationUpdateFieldArgs) => {
  try {
    const {
      categoryId,
      fieldId,
      required,
      enabled,
      clearResponseAfterEachVisit,
      options,
    } = args;

    if (!categoryId || !fieldId) {
      throw new Error("CategoryId and FieldId are required");
    }

    const category = await visitorCategory.findById(categoryId);
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
    if (Array.isArray(options)) {
      category.fields[fieldIndex].options = options
        .filter((option) => option?.label?.trim() || option?.value?.trim())
        .map((option) => ({
          label: option?.label?.trim() || option?.value?.trim() || "",
          value: option?.value?.trim() || option?.label?.trim() || "",
        }));
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
