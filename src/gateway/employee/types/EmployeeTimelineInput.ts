import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
} from "graphql";
import { DeviceType } from "./EmployeeTimelineDeviceInput";
export const signInQueInput = new GraphQLInputObjectType({
  name: "signInQueInput",
  fields: () => ({
    label: {
      type: GraphQLString,
    },
    answer: {
      type: GraphQLString,
    },
    type: { type: GraphQLString },
  }),
});
export const EmployeeTimelineInput = new GraphQLInputObjectType({
  name: "EmployeeTimelineInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    signedIn: {
      type: GraphQLString,
    },
    signedInDevice: {
      type: DeviceType,
    },
    signedOut: {
      type: GraphQLString,
    },
    signedOutDevice: {
      type: DeviceType,
    },
    statusMessage: {
      type: GraphQLString,
    },
    signedType: {
      type: GraphQLString,
    },
    returnTime: {
      type: GraphQLString,
    },
    signInQue: {
      type: new GraphQLList(signInQueInput),
    },
  }),
});
