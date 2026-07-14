import GraphQLJSON from "graphql-type-json";
import {
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
} from "graphql";
import { DeviceType } from "../../employee/types/EmployeeTimelineDeviceInput";

export const VisitorInput = new GraphQLInputObjectType({
  name: "VisitorInput",
  fields: () => ({
    category: { type: GraphQLID }, // pass ID of the category
    data: { type: GraphQLJSON }, // flexible JSON data
    department: { type: GraphQLID }, // pass ID of department
    employee: { type: GraphQLID },
    signedType: { type: GraphQLString },
    img: { type: GraphQLString }, // optional image URL/base64
    remembered: {
      type: GraphQLBoolean,
    },
    signedInDevice: {
      type: DeviceType,
    },
    signedOutDevice: {
      type: DeviceType,
    },
    selectedAgreement: {
      type: new GraphQLInputObjectType({
        name: "VisitorInputAgreement",
        fields: () => ({
          agreement: { type: GraphQLString },
          signatureImg: { type: GraphQLString },
        }),
      }),
    },
    location: {
      type: new GraphQLNonNull(GraphQLID),
    },
    isReturning: {
      type: GraphQLBoolean,
    },
  }),
});
