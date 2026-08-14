import VisitorCategory from "../../../../database/models/visitorCategory";
import { QueryGetCategoriesArgs } from "../../../generated/graphql";

export default async function getVisitorCategories(
  _: unknown,
  args: QueryGetCategoriesArgs,
  ctx: any,
) {
  try {
    const { user } = ctx;
    const categories = await VisitorCategory.find({
      company: user.company,
      location: args.location,
      createdBy: user._id,
    })
      .sort({ priority: 1 })
      .lean();

    categories.forEach((cat) => {
      if (Array.isArray(cat.fields)) {
        (cat.fields as any[]).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
      }
    });
    return categories;
  } catch (error) {
    console.error("Error fetching visitor categories:", error);
    throw new Error("Failed to fetch visitor categories");
  }
}
