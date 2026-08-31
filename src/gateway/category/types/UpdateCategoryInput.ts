import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from "graphql";
import { FieldOptionInput } from "./VisitorCategory";

const UpdateFieldInput = new GraphQLInputObjectType({
  name: "UpdateFieldInput",
  fields: () => ({
    name: { type: GraphQLString },
    label: { type: GraphQLString },
    type: { type: GraphQLString },
    enabled: { type: GraphQLBoolean },
    required: { type: GraphQLBoolean },
    priority: { type: GraphQLInt },
    clearResponseAfterEachVisit: { type: GraphQLBoolean },
    options: { type: new GraphQLList(FieldOptionInput) },
  }),
});

export const ReorderItemInput = new GraphQLInputObjectType({
  name: "ReorderItemInput",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    priority: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const UpdateCategoryInput = new GraphQLInputObjectType({
  name: "UpdateCategoryInput",
  fields: () => ({
    _id: { type: GraphQLString },
    location: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    enabled: { type: GraphQLBoolean },
    host: { type: GraphQLBoolean },
    approval: { type: GraphQLBoolean },
    priority: { type: GraphQLInt },
    fields: { type: new GraphQLList(UpdateFieldInput) },
  }),
});
