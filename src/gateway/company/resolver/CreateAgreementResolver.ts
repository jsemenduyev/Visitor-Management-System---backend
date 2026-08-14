import { MutationCreateAgreementArgs } from "../../../generated/graphql";
import { AgreementModel } from "../../../../database/models/agreements";

export default async (args: MutationCreateAgreementArgs, ctx) => {
  try {
    const companyId = ctx?.user?.company;

    // ✅ Validate user context
    if (!companyId) {
      return {
        error: {
          message: "User does not belong to any company",
          code: "NO_COMPANY_FOUND",
        },
      };
    }

    if (args.id) {
      const agreement = await AgreementModel.findOne({
        _id: args.id,
        company: companyId,
        createdBy: ctx.user._id,
      });

      if (!agreement) {
        throw new Error("Agreement not found");
      }

      agreement.title = args.title;
      agreement.content = args.content;
      agreement.requireSignature = args.requireSignature ?? false;
      agreement.signatureType = args.signatureType ?? null;
      await agreement.save();
      return agreement;
    }

    const agreement = new AgreementModel({
      company: companyId,
      createdBy: ctx.user._id,
      title: args.title,
      content: args.content,
      requireSignature: args.requireSignature ?? false,
      signatureType: args.signatureType ?? null,
    });

    await agreement.save();

    return agreement;
  } catch (error) {
    throw new Error(error);
  }
};
