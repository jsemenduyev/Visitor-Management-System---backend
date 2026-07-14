import { CompanyModel } from "../../../../database/models/company";
import { MutationRemoveIntegrationArgs } from "../../../generated/graphql";

export default async (args: MutationRemoveIntegrationArgs, ctx) => {
  try {
    const { webhookId, name } = args; // name = "googleChat" | "msTeams"
    const { user } = ctx;

    if (!name) throw new Error("Integration name is required");

    // Build dynamic path
    const path = `${name}.webhooks`;

    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      user.company,
      {
        $pull: {
          [path]: {
            _id: webhookId, // assuming each webhook has _id
          },
        },
      },
      { new: true }
    );

    return updatedCompany;
  } catch (error) {
    console.error("Error removing webhook:", error);
    throw new Error("Failed to remove webhook");
  }
};