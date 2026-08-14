import visitorCategory from "../../../../database/models/visitorCategory";
import { MutationDeleteCategoryArgs } from "../../../generated/graphql";

export default async (_, args: MutationDeleteCategoryArgs) => {
  try {
    const { categoryId } = args;

    if (!categoryId) {
      throw new Error("CategoryId  are required");
    }

    const category = await visitorCategory.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    await visitorCategory.findByIdAndDelete(categoryId);
    return "Category deleted successfully";
  } catch (error) {
    console.error("Error deleting ficategoryeld:", error);
    return {
      success: false,
      error: { message: error.message || "Internal server error" },
    };
  }
};
