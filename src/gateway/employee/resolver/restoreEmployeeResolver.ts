import { UserModel } from "../../../../database/models/user";

export default async (args: { employeeId: string }, ctx) => {
  try {
    const { employeeId } = args;

    if (!employeeId) {
      throw new Error("Employee ID is required");
    }

    const user = await UserModel.findOne({ _id: employeeId, isArchived: true });

    if (!user) {
      throw new Error("Archived employee not found");
    }

    const restored = await UserModel.findByIdAndUpdate(
      employeeId,
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
