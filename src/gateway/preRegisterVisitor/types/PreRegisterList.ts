import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { PreRegisterType } from "./PreRegister";

export const PreRegisterListType = new GraphQLObjectType({
  name: "PreRegisterList",
  fields: () => ({
    visitors: {
      type: new GraphQLList(PreRegisterType),
    },
    count: {
      type: GraphQLInt,
    },
  }),
});
