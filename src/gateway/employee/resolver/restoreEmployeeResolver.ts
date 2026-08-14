import { UserModel } from "../../../../database/models/user";
import { dashboardOwnerFilter } from "../../utils/ownerScope";

export default async (args: { employeeId: string }, ctx) => {
  try {
    const { employeeId } = args;
    const authUser = ctx?.user;
    const company = authUser?.company;

    if (!employeeId) {
      throw new Error("Employee ID is required");
    }

    if (!company) {
      throw new Error("User does not belong to any company");
    }

    const user = await UserModel.findOne({
      _id: employeeId,
      ...dashboardOwnerFilter(authUser),
      isArchived: true,
    });

    if (!user) {
      throw new Error("Archived employee not found");
    }

    const restored = await UserModel.findOneAndUpdate(
      { _id: employeeId, ...dashboardOwnerFilter(authUser), isArchived: true },
      { isArchived: false, archivedAt: null },
      { new: true }
    );

    return { user: restored };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
