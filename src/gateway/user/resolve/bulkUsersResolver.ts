import { UserModel } from "../../../../database/models/user";
import { MutationCreateBulkUsersArgs } from "../../../generated/graphql";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

export default async (args: MutationCreateBulkUsersArgs, ctx) => {
  try {
    const { input } = args;
    const { user } = ctx;

    const existing = await UserModel.find({
      createdBy: user._id,
      email: { $in: input.map((row) => normalizeEmail(row.email)) },
    })
      .select("email")
      .lean();
    const existingEmails = new Set(existing.map((row) => row.email));
    const seenInBatch = new Set<string>();

    const toCreate = input.flatMap((userData) => {
      const email = normalizeEmail(userData.email);
      if (!email || existingEmails.has(email) || seenInBatch.has(email)) {
        return [];
      }
      seenInBatch.add(email);
      return [
        {
          ...userData,
          email,
          company: user.company,
          createdBy: user._id,
        },
      ];
    });

    if (toCreate.length === 0) {
      return {
        user: [],
        count: 0,
      };
    }

    const createdEmployee = await UserModel.create(toCreate);
    return {
      user: createdEmployee,
      count: createdEmployee.length,
    };
  } catch (error) {
    console.error("Error creating employee:", error);

    return {
      error: {
        message: "Internal Server Error",
        code: "INTERNAL_ERROR",
      },
    };
  }
};
