import { CompanyModel } from "../../../../database/models/company";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationUpdateCompanyImgsArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateCompanyImgsArgs) => {
  try {
    await OfficeLocationModel.findByIdAndUpdate(
      { _id: args.locationId },
      {
        $set: {
          savedImgs: args.imgs,
        },
      },
      { new: true },
    );

    return "Imgs updated";
  } catch (error) {
    console.log(error);
  }
};
