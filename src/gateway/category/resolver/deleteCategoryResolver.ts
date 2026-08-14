import visitorCategory from "../../../../database/models/visitorCategory";
import { MutationDeleteCategoryArgs } from "../../../generated/graphql";

export default async (_, args: MutationDeleteCategoryArgs, ctx: any) => {
  try {
    const { categoryId } = args;

    if (!categoryId) {
      throw new Error("CategoryId  are required");
    }

    const category = await visitorCategory.findOne({
      _id: categoryId,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    });
    if (!category) {
      throw new Error("Category not found");
    }
    await visitorCategory.deleteOne({ _id: categoryId, createdBy: ctx.user._id });
    return "Category deleted successfully";
  } catch (error) {
    console.error("Error deleting ficategoryeld:", error);
    return {
      success: false,
      error: { message: error.message || "Internal server error" },
    };
  }
};
