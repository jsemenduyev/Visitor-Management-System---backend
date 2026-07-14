import { GraphQLList, GraphQLObjectType } from "graphql";
import { DeliveryType } from "./Delivery";
import ErrorType from "../../category/types/Error";

export const DeliveryPayload = new GraphQLObjectType({
    name: "DeliveryPayload",
    fields: () => ({
        delivery: { type: DeliveryType },
        error: { type: ErrorType }
    })
})