import visitorCategory from "../../../../database/models/visitorCategory";

export default async (_, args, ctx: any) => {
  try {
    const { categoryId } = args;
    const category = await visitorCategory.findOne({
      _id: categoryId,
      company: ctx.user.company,
      createdBy: ctx.user._id,
    }).lean();
    if (!category) return [];
    return category.fields;
  } catch (error) {}
};
