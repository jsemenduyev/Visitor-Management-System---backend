import { AgreementModel } from "../../../../database/models/agreements";

export default async (args: { id: string }, ctx: any) => {
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

        // ✅ Validate agreement ID
        if (!args.id) {
            throw new Error("Agreement ID is required");
        }

        // ✅ Find and delete agreement (ensure it belongs to the company)
        const agreement = await AgreementModel.findOneAndDelete({
            _id: args.id,
            company: companyId,
            createdBy: ctx.user._id,
        });

        if (!agreement) {
            throw new Error("Agreement not found or you don't have permission to delete it");
        }

        return "Agreement deleted successfully";
    } catch (error) {
        throw new Error(error);
    }
};
