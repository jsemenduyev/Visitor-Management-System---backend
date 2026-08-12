import VisitorModel from "../../../../database/models/visitor";
import { resolveVisitorFullName } from "../../../../utils/visitorData";

export default async (_, args) => {
  try {
    const { search, company, signedType, remembered, location } = args;

    const filter: any = {
      company: company,
      location,
    };

    if (search) {
      filter["data.fullName"] = { $regex: search, $options: "i" }; // case-insensitive
    }
    if (remembered) {
      filter.remembered = remembered;
    }
    if (signedType) {
      filter.signedType = signedType;
    }

    let visitors = await VisitorModel.find(filter)
      .sort({ updatedAt: -1 })
      .limit(search ? 50 : 200)
      .lean();

    // Autocomplete should show one entry per remembered visitor name.
    if (search && remembered) {
      const seen = new Set<string>();
      visitors = visitors.filter((visitor) => {
        const name = resolveVisitorFullName(visitor.data).toLowerCase();
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      });
    }

    const count = await VisitorModel.countDocuments(filter);

    return { visitor: visitors, count };
  } catch (error) {
    console.error("Error fetching visitors:", error);
    throw new Error("Failed to fetch visitors");
  }
};
