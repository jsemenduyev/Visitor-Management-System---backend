import { UserModel } from "../../../../database/models/user";

export default async (args: { employeeId: string }, ctx) => {
  try {
    const { employeeId } = args;
    const company = ctx?.user?.company;

    if (!employeeId) {
      throw new Error("Employee ID is required");
    }

    if (!company) {
      throw new Error("User does not belong to any company");
    }

    const user = await UserModel.findOne({
      _id: employeeId,
      company,
      isArchived: true,
    });

    if (!user) {
      throw new Error("Archived employee not found");
    }

    const restored = await UserModel.findOneAndUpdate(
      { _id: employeeId, company, isArchived: true },
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
