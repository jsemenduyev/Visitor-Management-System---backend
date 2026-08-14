import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationUpdateCompanyImgsArgs } from "../../../generated/graphql";

export default async (args: MutationUpdateCompanyImgsArgs, ctx: any) => {
  try {
    const authUser = ctx?.user;
    if (!authUser?._id || !authUser?.company) {
      throw new Error("Access denied");
    }

    const location = await OfficeLocationModel.findOne({
      _id: args.locationId,
      company: authUser.company,
      createdBy: authUser._id,
    }).lean();

    if (!location) {
      throw new Error("Location not found");
    }

    await OfficeLocationModel.updateOne({ _id: location._id }, {
      $set: { [`settingsByAdmin.${String(authUser._id)}.savedImgs`]: args.imgs },
    });

    return "Imgs updated";
  } catch (error) {
    console.log(error);
    throw error;
  }
};
