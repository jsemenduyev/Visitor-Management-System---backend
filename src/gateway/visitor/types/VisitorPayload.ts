import { GraphQLInt, GraphQLObjectType } from "graphql";
import { VisitorType } from "./Visitor";
import ErrorType from "../../category/types/Error";

export const VisitorPayload = new GraphQLObjectType({
  name: "VisitorPaylaod",
  fields: () => ({
    visitor: {
      type: VisitorType,
    },
    count: {
      type: GraphQLInt,
    },
    error: {
      type: ErrorType,
    },
  }),
});
