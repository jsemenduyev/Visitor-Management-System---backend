import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { DeliveryType } from "./Delivery";
import ErrorType from "../../category/types/Error";

export const DeliveryList = new GraphQLObjectType({
    name: "DeliveryList",
    fields: () => ({
        delivery: { type: new GraphQLList(DeliveryType) },
        count: { type: GraphQLInt }
    })
})