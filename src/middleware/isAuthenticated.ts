import { UserModel } from "../../database/models/user";

export const isAUthenticated = async (args, ctx, callback) => {
  try {
    const userId = ctx?.user?._id;
    

    if (!userId) throw new Error("Access Denied. Please login to continue");
    const user = await UserModel.findOne({ _id: userId }).lean();
    if (!user) throw new Error("Access Denied. Please login to continue");
    return await callback(args, ctx);
  } catch (error) {
    throw new Error(error);
  }
};
export const isAdminOrManager = async (args, ctx, callback) => {
  try {
    const userId = ctx?.user?._id;

    if (!userId) throw new Error("Access Denied. Please login to continue");

    const user = await UserModel.findOne({
      _id: userId,
      role: { $in: ["admin", "manager"] },
    }).lean();

    if (!user) throw new Error("Access Denied. Please login to continue");

    return await callback(args, ctx);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
