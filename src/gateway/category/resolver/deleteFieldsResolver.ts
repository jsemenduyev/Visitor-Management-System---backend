import visitorCategory from "../../../../database/models/visitorCategory";
import {
  MutationDeleteFieldArgs,
} from "../../../generated/graphql";

export default async (_: any, args: MutationDeleteFieldArgs) => {
  try {
    const { categoryId, fieldId } = args;

    if (!categoryId || !fieldId) {
      throw new Error("CategoryId and FieldId are required");
    }

    const category = await visitorCategory.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    // Find index of the field to delete
    const fieldIndex = category.fields.findIndex(
      (f: any) => f._id.toString() === fieldId
    );

    if (fieldIndex === -1) {
      throw new Error("Field not found in category");
    }

    // Remove the field
    category.fields.splice(fieldIndex, 1);

    await category.save();

    return "Field deleted successfully";
  } catch (err: any) {
    console.error("Error deleting field:", err);
    return {
      success: false,
      error: { message: err.message || "Internal server error" },
    };
  }
};
