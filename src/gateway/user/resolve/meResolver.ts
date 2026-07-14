import { UserModel } from "../../../../database/models/user";

export default async (_, args, ctx) => {
  try {
    const { user } = ctx;

    if (!user || !user._id) {
      throw new Error("Unauthorized");
    }

    const userData = await UserModel.findById(user._id).populate('company').populate('department').lean();

    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  } catch (err) {
    console.error("Error fetching user:", err.message);
    throw new Error("Something went wrong");
  }
};
