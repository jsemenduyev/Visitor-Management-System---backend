import { CompanyModel } from "../../../../database/models/company";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationAddTabImgArgs } from "../../../generated/graphql";
import { OfficeLocation } from "../../locations/type/OfficeLocation";

export default async (args: MutationAddTabImgArgs) => {
  try {
    await OfficeLocationModel.findByIdAndUpdate(
      { _id: args.locationId },
      {
        $push: {
          savedImgs: {
            url: args.url,
            enabled: true,
          },
        },
      },
      { new: true },
    );

    return "Image added";
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add image");
  }
};
