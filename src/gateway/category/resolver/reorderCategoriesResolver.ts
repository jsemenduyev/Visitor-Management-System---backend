import VisitorCategory from "../../../../database/models/visitorCategory";

export default async (_: unknown, args: { items: { id: string; priority: number }[] }, ctx: any) => {
  try {
    await Promise.all(
      args.items.map(({ id, priority }) =>
        VisitorCategory.updateOne({ _id: id, company: ctx.user.company, createdBy: ctx.user._id }, { $set: { priority } }),
      ),
    );
    return "Categories reordered successfully";
  } catch (error: any) {
    throw new Error(error.message || "Failed to reorder categories");
  }
};
