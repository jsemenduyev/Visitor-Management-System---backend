import { GraphQLEnumType, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLString } from "graphql";
import { signInQueInput } from "./EmployeeTimelineInput";
export const DeviceType = new GraphQLEnumType({
  name: "DeviceType",
  values: {
    Web: { value: "Web" },
    Mobile: { value: "Mobile" },
  },
});
export const EmployeeTimelineDeviceInput = new GraphQLInputObjectType({
  name: "EmployeeTimelineDeviceInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    employee: {
      type: GraphQLID,
    },
    signedIn: {
      type: GraphQLString,
    },
    signedOut: {
      type: GraphQLString,
    },
    signedInDevice: {
      type: DeviceType,
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
    }, signInQue: {
      type: new GraphQLList(signInQueInput),
    },
  }),
});
