import { GraphQLObjectType } from "graphql";
import ErrorType from "../../category/types/Error";
import { OfficeLocation } from "./OfficeLocation";

export const LocationPayload = new GraphQLObjectType({
    name: "LocationPaylaod",
    fields: () => ({
        location: {
            type: OfficeLocation
        },
        error: {
            type: ErrorType
        }
    })
})