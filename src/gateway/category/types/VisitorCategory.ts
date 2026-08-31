import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLInputObjectType,
} from "graphql";

export const FieldOptionType = new GraphQLObjectType({
  name: "FieldOption",
  fields: () => ({
    label: { type: GraphQLString },
    value: { type: GraphQLString },
  }),
});

export const FieldOptionInput = new GraphQLInputObjectType({
  name: "FieldOptionInput",
  fields: () => ({
    label: { type: GraphQLString },
    value: { type: GraphQLString },
  }),
});

export const FieldType = new GraphQLObjectType({
  name: "Field",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (src) => src._id,
    },
    name: { type: GraphQLString },
    label: { type: GraphQLString },
    type: { type: GraphQLString },
    enabled: { type: GraphQLBoolean },
    required: { type: GraphQLBoolean },
    priority: { type: GraphQLInt },
    clearResponseAfterEachVisit: { type: GraphQLBoolean },
    options: { type: new GraphQLList(FieldOptionType) },
  }),
});

export const VisitorCategoryType = new GraphQLObjectType({
  name: "VisitorCategory",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    name: { type: GraphQLString },
    approval: { type: GraphQLBoolean },
    enabled: { type: GraphQLBoolean },
    host: { type: GraphQLBoolean },
    priority: { type: GraphQLInt },
    fields: { type: new GraphQLList(FieldType) },
  }),
});
