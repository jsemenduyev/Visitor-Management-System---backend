import VisitorModel from "../../../../database/models/visitor";

export default async (_, args) => {
  try {
    const { search, company, signedType, remembered,location } = args;
  
    const filter: any = {
      company: company,
      location
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

    const visitors = await VisitorModel.find(filter).lean();

    const count = await VisitorModel.countDocuments();

    return { visitor: visitors, count };
  } catch (error) {
    console.error("Error fetching visitors:", error);
    throw new Error("Failed to fetch visitors");
  }
};
