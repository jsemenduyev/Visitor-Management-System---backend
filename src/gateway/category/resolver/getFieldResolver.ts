import visitorCategory from "../../../../database/models/visitorCategory";

export default async (_, args) => {
  try {
    const { categoryId } = args;
    const category = await visitorCategory.findById({ _id: categoryId }).lean();
    return category.fields;
  } catch (error) {}
};
