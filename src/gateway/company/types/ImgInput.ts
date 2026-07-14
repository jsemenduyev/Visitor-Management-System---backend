import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

export const TabImgInput = new GraphQLInputObjectType({
  name: "TabImgInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    url: { type: GraphQLString },
    enabled: { type: GraphQLBoolean },
  }),
});
