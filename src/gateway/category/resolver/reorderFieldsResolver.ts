import VisitorCategory from "../../../../database/models/visitorCategory";

export default async (
  _: unknown,
  args: { categoryId: string; items: { id: string; priority: number }[] },
  ctx: any,
) => {
  try {
    const category = await VisitorCategory.findOne({
      _id: args.categoryId,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    });

    if (!category) throw new Error("Category not found");

    args.items.forEach(({ id, priority }) => {
      const field = category.fields.id(id);
      if (field) field.priority = priority;
    });

    await category.save();
    return "Fields reordered successfully";
  } catch (error: any) {
    throw new Error(error.message || "Failed to reorder fields");
  }
};
