import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserType } from "../../user/types/UserType";
import { SpacesResource } from "./SpacesResource";
import { SpacesCategory } from "./SpacesCategory";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
import { Spaces } from "./Spaces";
import ErrorType from "../../category/types/Error";
import { GraphQLDateTime } from "graphql-scalars";

export const BookingSpaceType = new GraphQLObjectType({
  name: "BookingSpaceType",
  fields: () => ({
    _id: { type: GraphQLID },
    employee: { type: UserType },
    resource: { type: SpacesResource },
    category: { type: SpacesCategory },
    start: { type: GraphQLDateTime },
    end: { type: GraphQLDateTime },
    location: { type: OfficeLocation },
    space: { type: Spaces },
    people: { type: GraphQLInt },
  }),
});

export const BookingSpacePayload = new GraphQLObjectType({
  name: "BookingSpacePayload",
  fields: () => ({
    booking: { type: BookingSpaceType },
    error: { type: ErrorType },
  }),
});

export const BookingSpaceInput = new GraphQLInputObjectType({
  name: "BookingSpaceInput",
  fields: () => ({
    employee: { type: GraphQLID },
    resource: { type: GraphQLID },
    category: { type: GraphQLID },
    start: { type: GraphQLString },
    end: { type: GraphQLString },
    location: { type: GraphQLID },
    space: { type: GraphQLID },
    people: { type: GraphQLInt },
  }),
});
