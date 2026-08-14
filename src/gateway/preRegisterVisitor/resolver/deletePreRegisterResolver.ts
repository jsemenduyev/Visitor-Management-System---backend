import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";

export default async (args: { id: string }, ctx) => {
  try {
    const { user } = ctx;

    const visitor = await PreRegisterVisitorModel.findOneAndDelete({
      _id: args.id,
      company: user.company,
    });

    if (!visitor) {
      return {
        error: {
          message: "Pre-registered visitor not found",
          code: "NOT_FOUND",
        },
      };
    }

    return { visitor };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
