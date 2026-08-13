import GraphQLJSON from "graphql-type-json";
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { VisitorCategoryType } from "../../category/types/VisitorCategory";
import { DepartmentType } from "../../department/types/DepartmentType";
import { GraphQLDateTime, GraphQLTime } from "graphql-scalars";
import { UserType } from "../../user/types/UserType";
import { OfficeLocation } from "../../locations/type/OfficeLocation";

export const VisitorType = new GraphQLObjectType({
  name: "Visitor",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    category: { type: VisitorCategoryType }, // populated category
    data: { type: GraphQLJSON }, // flexible JSON field
    department: {
      type: DepartmentType,
    },
    employees: {
      type: new GraphQLList(UserType),
    },
    signedType: {
      type: GraphQLString,
    },
    img: {
      type: GraphQLString,
    },
    remembered: {
      type: GraphQLBoolean,
    },
    selectedAgreement: {
      type: new GraphQLObjectType({
        name: "VisitorAgreement",
        fields: () => ({
          agreement: { type: GraphQLString },
          signatureImg: { type: GraphQLString },
        }),
      }),
    },
    signedIn: { type: GraphQLDateTime },
    signedOut: { type: GraphQLDateTime },
    signedOutDevice: { type: GraphQLString },
    signedInDevice: { type: GraphQLString },
    deviceId: { type: GraphQLString },
    deviceName: { type: GraphQLString },
    location: {
      type: OfficeLocation,
    },
    anonymize: {
      type: GraphQLBoolean,
    },
    isReturning: {
      type: GraphQLBoolean,
    },
  }),
});
