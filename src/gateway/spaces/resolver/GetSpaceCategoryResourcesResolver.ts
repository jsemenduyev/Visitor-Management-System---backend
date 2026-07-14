import SpaceResourceModel from "../../../../database/models/spacesResources";

export default async (parent: any, args: any, ctx: any) => {
  return await SpaceResourceModel.find({ resourceCategory: parent._id }).lean();
};
