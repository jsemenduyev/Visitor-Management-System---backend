import { UserModel } from "../../../../database/models/user";
import { MutationCreateBulkUsersArgs } from "../../../generated/graphql";

export default async (args: MutationCreateBulkUsersArgs, ctx) => {
  try {
    const { input } = args;
    const { user } = ctx;
    const newInput = input.map((userData) => ({
      ...userData,
      company: user.company,
    }));

    const createdEmployee = await UserModel.create(newInput);
    return {
      user: createdEmployee,
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
