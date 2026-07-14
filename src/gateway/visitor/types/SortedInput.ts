import { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";

export const SortedInput = new GraphQLInputObjectType({
  name: "SortedInput",
  fields: () => ({
    direction: {
      type: GraphQLString,
    },
    columnId: {
      type: GraphQLString,
    },
  }),
});
