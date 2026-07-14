import GraphQLJSON from "graphql-type-json";
import {
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";

export const UpdateVisitorInput = new GraphQLInputObjectType({
  name: "UpdateVisitorInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    category: { type: GraphQLID }, // pass ID of the category
    data: { type: GraphQLJSON }, // flexible JSON data
    department: { type: GraphQLID }, // pass ID of department
    signedType: { type: GraphQLString },
    img: { type: GraphQLString }, // optional image URL/base64
    signedInDevice: {
      type: GraphQLString,
    },
    signedOutDevice: {
      type: GraphQLString,
    },
    note: {
      type: GraphQLString,
    },
    preRegistered: {
      type: GraphQLBoolean,
    },
    remembered: {
      type: GraphQLBoolean,
    },
    anonymize: {
      type: GraphQLBoolean,
    },
  }),
});
