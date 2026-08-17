import { CompanyModel } from "../../../../database/models/company";
import OfficeLocationModel from "../../../../database/models/officelocations";
import VisitorCategoryModel from "../../../../database/models/visitorCategory";
import { MutationAddLocationArgs } from "../../../generated/graphql";
import { dashboardLocationFilter } from "../../utils/locationOwnerScope";
import mongoose from "mongoose";

const LOCATION_IDENTITY_FIELDS = new Set([
    "_id",
    "name",
    "address",
    "lat",
    "lng",
    "company",
    "createdBy",
    "createdAt",
    "updatedAt",
    "__v",
]);

const BADGE_TYPES = new Set(["standard", "photo", "simple"]);

const sanitizeCopiedSettings = (
    key: string,
    value: unknown,
): unknown => {
    if (key === "contactLess" && value && typeof value === "object") {
        const contactLess = value as { enabled?: boolean };
        return {
            enabled: contactLess.enabled ?? false,
        };
    }

    if (key === "branding" && value && typeof value === "object") {
        const branding = { ...(value as Record<string, unknown>) };
        if (typeof branding.badgeType === "string") {
            const normalized = branding.badgeType.toLowerCase();
            branding.badgeType = BADGE_TYPES.has(normalized)
                ? normalized
                : "standard";
        }
        return branding;
    }

    return value;
};

const copyLocationSettings = (
    source: Record<string, unknown>,
    target: Record<string, unknown>,
) => {
    for (const [key, value] of Object.entries(source)) {
        if (LOCATION_IDENTITY_FIELDS.has(key)) {
            continue;
        }

        target[key] = sanitizeCopiedSettings(key, value);
    }
};

const CATEGORY_IDENTITY_FIELDS = new Set([
    "_id",
    "company",
    "location",
    "createdAt",
    "updatedAt",
    "__v",
]);

const cloneVisitorCategories = async (
    sourceLocationId: string,
    newLocationId: unknown,
    company: unknown,
) => {
    const categories = await VisitorCategoryModel.find({
        location: sourceLocationId,
        company,
    }).lean();

    if (categories.length === 0) {
        return 0;
    }

    await VisitorCategoryModel.insertMany(
        categories.map((category) => {
            const clonedCategory = Object.fromEntries(
                Object.entries(category).filter(
                    ([key]) => !CATEGORY_IDENTITY_FIELDS.has(key),
                ),
            );

            return {
                ...clonedCategory,
                company,
                location: newLocationId,
            };
        }),
    );

    return categories.length;
};

export default async (args: MutationAddLocationArgs, ctx: any) => {
    try {
        const { user } = ctx
        const company = user.company
        
        const updateData: any = {
            name: args.name,
            company,
            createdBy: user._id,
            address: args.address,
            customHeading: args.customHeading,
        };
        
        // Type assertion to handle lat/lng until codegen is run with server running
        const argsWithCoords = args as any;
        if (argsWithCoords.lat) updateData.lat = parseFloat(argsWithCoords.lat);
        if (argsWithCoords.lng) updateData.lng = parseFloat(argsWithCoords.lng);
        
        if (args._id) {
            const { createdBy: _ignoredCreatedBy, ...ownedUpdate } = updateData;
            const location = await OfficeLocationModel.findOneAndUpdate(
                { _id: args._id, ...dashboardLocationFilter(user) },
                ownedUpdate,
                { new: true },
            )

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
            const copyFromLocationId = argsWithCoords.copyFromLocationId as string | undefined;
            let sourceLocation: Record<string, unknown> | null = null;

            if (copyFromLocationId) {
                if (!mongoose.isValidObjectId(copyFromLocationId)) {
                    return {
                        error: {
                            message: "The location selected for copying is invalid",
                            code: "INVALID_COPY_SOURCE",
                        },
                    };
                }

                const source = await OfficeLocationModel.findOne({
                    _id: copyFromLocationId,
                    ...dashboardLocationFilter(user),
                }).lean();

                if (!source) {
                    return {
                        error: {
                            message: "The location selected for copying was not found",
                            code: "COPY_SOURCE_NOT_FOUND",
                        },
                    };
                }

                sourceLocation = source as Record<string, unknown>;
                copyLocationSettings(sourceLocation, updateData);
            }

            const location = new OfficeLocationModel(updateData)
            await location.save()

            if (copyFromLocationId && sourceLocation) {
                try {
                    await cloneVisitorCategories(
                        copyFromLocationId,
                        location._id,
                        company,
                    );
                } catch (copyError) {
                    await OfficeLocationModel.deleteOne({ _id: location._id, company });
                    throw copyError;
                }
            }

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
