import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { SpacesCategory } from "./SpacesCategory";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
import { Spaces } from "./Spaces";
import { UserType } from "../../user/types/UserType";
import ErrorType from "../../category/types/Error";

export const SpacesResource = new GraphQLObjectType({
  name: "SpacesResourceType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    resourceCategory: {
      type: SpacesCategory,
    },
    location: {
      type: OfficeLocation,
    },
    space: {
      type: Spaces,
    },
    capacity: {
      type: GraphQLInt,
    },
    features: {
      type: new GraphQLList(GraphQLString),
    },
    photo: {
      type: GraphQLString,
    },
    notes: {
      type: GraphQLString,
    },
    employees: {
      type: new GraphQLList(UserType),
    },
  }),
});

export const SpacesResourcePayload = new GraphQLObjectType({
  name: "SpacesResourcePayload",
  fields: () => ({
    resource: {
      type: SpacesResource,
    },
    error: {
      type: ErrorType,
    },
  }),
});

export const SpacesResourceInput = new GraphQLInputObjectType({
  name: "SpacesResourceInput",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    resourceCategory: {
      type: GraphQLID,
    },
    location: {
      type: GraphQLID,
    },
    space: {
      type: GraphQLID,
    },
    capacity: {
      type: GraphQLInt,
    },
    features: {
      type: new GraphQLList(GraphQLString),
    },
    photo: {
      type: GraphQLString,
    },
    notes: {
      type: GraphQLString,
    },
    employees: {
      type: new GraphQLList(GraphQLID),
    },
  }),
});
