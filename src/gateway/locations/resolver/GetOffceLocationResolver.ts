import OfficeLocationModel from "../../../../database/models/officelocations";
import { QueryGetOfficeLocationArgs } from "../../../generated/graphql";

export default async (args:QueryGetOfficeLocationArgs) => {
  try {
  
    const locations = await OfficeLocationModel.findById({ _id:args.locationId}).lean();

    return locations;
  } catch (error: any) {
    console.error("Error fetching office locations:", error);

    return {
      error: {
        message: error.message || "Failed to fetch office locations",
        code: "SERVER_ERROR",
      },
    };
  }
};
