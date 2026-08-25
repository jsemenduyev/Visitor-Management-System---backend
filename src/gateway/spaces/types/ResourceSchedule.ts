import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { Spaces } from "./Spaces";
import { SpacesResource } from "./SpacesResource";

export const SimpleBookingTimeType = new GraphQLObjectType({
  name: "SimpleBookingTime",
  fields: () => ({
    start: { type: GraphQLDateTime },
    end: { type: GraphQLDateTime },
    people: { type: GraphQLInt },
    employeeName: { type: GraphQLString },
    spaceName: { type: GraphQLString },
  }),
});

export const ResourceScheduleType = new GraphQLObjectType({
  name: "ResourceSchedule",
  fields: () => ({
    _id: { type: GraphQLID },
    resourceName: { type: GraphQLString },
    name: { type: GraphQLString },
    categoryName: { type: GraphQLString },
    space: { type: Spaces },
    capacity: { type: GraphQLInt },
    booked: { type: GraphQLInt },
    available: { type: GraphQLInt },
    bookings: { type: new GraphQLList(SimpleBookingTimeType) },
  }),
});

export const SpaceScheduleType = new GraphQLObjectType({
  name: "SpaceSchedule",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    bookedPeople: { type: GraphQLInt },
    availablePeople: { type: GraphQLInt },
    bookings: { type: new GraphQLList(SimpleBookingTimeType) },
    resources: { type: new GraphQLList(SpacesResource) },
  }),
});
