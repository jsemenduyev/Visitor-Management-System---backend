import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";

export const SimpleBookingTimeType = new GraphQLObjectType({
  name: "SimpleBookingTime",
  fields: () => ({
    start: { type: GraphQLDateTime },
    end: { type: GraphQLDateTime },
  }),
});

export const ResourceScheduleType = new GraphQLObjectType({
  name: "ResourceSchedule",
  fields: () => ({
    _id: { type: GraphQLID },
    resourceName: { type: GraphQLString },
    categoryName: { type: GraphQLString },
    bookings: { type: new GraphQLList(SimpleBookingTimeType) },
  }),
});
