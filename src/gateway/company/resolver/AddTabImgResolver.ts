import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationAddTabImgArgs } from "../../../generated/graphql";
import { getAdminLocationSettings } from "../../utils/adminLocationSettings";

export default async (args: MutationAddTabImgArgs, ctx: any) => {
  try {
    const authUser = ctx?.user;
    if (!authUser?._id || !authUser?.company) {
      throw new Error("Access denied");
    }

    const location = await OfficeLocationModel.findOne({
      _id: args.locationId,
      company: authUser.company,
      createdBy: authUser._id,
    })
      .select("+settingsByAdmin")
      .lean();

    if (!location) {
      throw new Error("Location not found");
    }

    const current = getAdminLocationSettings(location, authUser._id);
    const savedImgs = [
      ...(current.savedImgs ?? location.savedImgs ?? []),
      { url: args.url, enabled: true },
    ];
    await OfficeLocationModel.updateOne({ _id: location._id }, {
      $set: { [`settingsByAdmin.${String(authUser._id)}.savedImgs`]: savedImgs },
    });

    return "Image added";
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add image");
  }
};
