import { GraphQLObjectType } from "graphql";
import { VisitorCategoryType } from "./VisitorCategory";
import ErrorType from "./Error";

export const categoryPayload = new GraphQLObjectType({
  name: "CategoryType",
  fields: () => ({
    category: {
      type: VisitorCategoryType,
    },
    error: {
      type: ErrorType,
    },
  }),
});
