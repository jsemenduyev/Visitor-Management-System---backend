import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from "graphql";
import { FieldOptionInput } from "./VisitorCategory";

const FieldInput = new GraphQLInputObjectType({
  name: "FieldInput",
  fields: () => ({
    name: { type: GraphQLString }, // e.g. "companyName"
    label: { type: GraphQLString }, // e.g. "Company Name"
    type: { type: GraphQLString }, // e.g. "text", "number"
    enabled: { type: GraphQLBoolean },
    required: {
      type: GraphQLBoolean,
    },
    clearResponseAfterEachVisit: { type: GraphQLBoolean },
    options: { type: new GraphQLList(FieldOptionInput) },
  }),
});

export const CategoryInput = new GraphQLInputObjectType({
  name: "CategoryInput",
  fields: () => ({
    location: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: { type: GraphQLString }, // category name
    approval: {
      type: GraphQLBoolean,
    },
    host: {
      type: GraphQLBoolean,
    },
    allowBadgePrint: {
      type: GraphQLBoolean,
    },
    company: {
      type: GraphQLID,
    },
    fields: { type: new GraphQLList(FieldInput) }, // array of field configs
  }),
});
