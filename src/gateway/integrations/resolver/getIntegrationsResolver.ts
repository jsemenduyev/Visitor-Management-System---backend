import { CompanyModel } from "../../../../database/models/company";

export default async (args, ctx) => {
  const { user } = ctx;

  const company = await CompanyModel.findById({ _id: user.company }).lean();

  return {
    googleChat: company.googleChat,
    msTeams: company?.msteams,
  };
};
