import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from "graphql";

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
    company: {
      type: GraphQLID,
    },
    fields: { type: new GraphQLList(FieldInput) }, // array of field configs
  }),
});
