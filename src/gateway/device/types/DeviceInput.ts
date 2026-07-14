import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
export const VisitorNotificationsInput = new GraphQLInputObjectType({
  name: "VisitorNotificationsInput",
  fields: () => ({
    checkIn: { type: GraphQLString },
    checkOut: { type: GraphQLString },
    checkInPending: { type: GraphQLString },
  }),
});
export const DeviceInput = new GraphQLInputObjectType({
  name: "DeviceInput",
  fields: () => ({
    deviceName: { type: new GraphQLNonNull(GraphQLString) },
    department: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
    deviceTypes: { type: new GraphQLList(GraphQLString) }, // ["visitor", "employee", "deliveries"]
    categoryType: {
      type: new GraphQLList(GraphQLID),
    },
    company: {
      type: new GraphQLList(GraphQLID),
    },
    location: {
      type: GraphQLID,
    },
    visitorNotifications: {
      type: VisitorNotificationsInput,
    }
  }),
});
