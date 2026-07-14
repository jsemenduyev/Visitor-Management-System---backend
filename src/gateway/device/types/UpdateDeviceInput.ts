import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
import { VisitorNotificationsInput } from "./DeviceInput";

export const UpdateDeviceInput = new GraphQLInputObjectType({
  name: "UpdateDeviceInput",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    deviceName: { type: GraphQLString },
    department: { type: new GraphQLList(GraphQLID) },
    deviceTypes: { type: new GraphQLList(GraphQLString) }, // ["visitor", "employee", "deliveries"]
    categoryType: {
      type: new GraphQLList(GraphQLID),
    }, location: {
      type: GraphQLID,
    },
    visitorNotifications: {
      type: VisitorNotificationsInput,
    }
  }),
});
