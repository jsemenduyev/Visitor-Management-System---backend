import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
import ErrorType from "../../category/types/Error";
import { SpacesResource } from "./SpacesResource";

export const Spaces = new GraphQLObjectType({
  name: "SpacesType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    capacity: {
      type: GraphQLInt,
    },
    photo: {
      type: GraphQLString,
    },
    resource: {
      type: new GraphQLList(SpacesResource),
    },
    location: {
      type: OfficeLocation,
    },
  }),
});
export const SpacesPayload = new GraphQLObjectType({
  name: "SpacesPaylaod",
  fields: () => ({
    spaces: {
      type: Spaces,
    },
    error: {
      type: ErrorType,
    },
  }),
});

export const SpacesInput = new GraphQLInputObjectType({
  name: "SpacesInputType",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    capacity: {
      type: GraphQLInt,
    },
    photo: {
      type: GraphQLString,
    },
    resource: {
      type: GraphQLString,
    },
    resources: {
      type: new GraphQLList(GraphQLID),
    },
    location: {
      type: GraphQLID,
    },
  }),
});
