import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { EvacuationPersonType } from "./EvacuationPerson";

export const EvacuationList = new GraphQLObjectType({
  name: "EvacuationList",
  fields: () => ({
    list: { type: new GraphQLList(EvacuationPersonType) },
    count: { type: GraphQLInt },
  }),
});
