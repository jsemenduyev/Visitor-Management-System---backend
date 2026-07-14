import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { VisitorType } from "./Visitor";
import ErrorType from "../../category/types/Error";

export const VisitorList = new GraphQLObjectType({
  name: "VisitorList",
  fields: () => ({
    visitor: {
      type: new GraphQLList(VisitorType),
    },
    count: {
      type: GraphQLInt,
    },
    error: {
      type: ErrorType,
    },
  }),
});
