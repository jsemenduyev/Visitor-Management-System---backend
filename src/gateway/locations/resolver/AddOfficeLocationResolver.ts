import { CompanyModel } from "../../../../database/models/company";
import OfficeLocationModel from "../../../../database/models/officelocations";
import { MutationAddLocationArgs } from "../../../generated/graphql";

export default async (args: MutationAddLocationArgs, ctx: any) => {
    try {
        const { user } = ctx
        const company = user.company
        
        const updateData: any = {
            name: args.name,
            company,
            address: args.address,
            customHeading: args.customHeading,
        };
        
        // Type assertion to handle lat/lng until codegen is run with server running
        const argsWithCoords = args as any;
        if (argsWithCoords.lat) updateData.lat = parseFloat(argsWithCoords.lat);
        if (argsWithCoords.lng) updateData.lng = parseFloat(argsWithCoords.lng);
        
        if (args._id) {
            const location = await OfficeLocationModel.findByIdAndUpdate(args._id, updateData, { new: true })

            if (!location) {
                return {
                    error: {
                        message: "Location not found",
                        code: "LOCATION_NOT_FOUND"
                    }
                }
            }
            return { location }
        } else {
            const location = new OfficeLocationModel(updateData)
            await location.save()
            await CompanyModel.findByIdAndUpdate(company, {
                $push: {
                    location: location._id
                }
            })
            return { location }
        }

    } catch (error: any) {
        return {
            error: {
                message: error.message || "Failed to add location",
                code: "SERVER_ERROR",
            },
        }
    }
}