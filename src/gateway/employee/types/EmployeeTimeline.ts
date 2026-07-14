import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserType } from "../../user/types/UserType";
import { CompanyType } from "../../company/types/CompanyType";
import { OfficeLocation } from "../../locations/type/OfficeLocation";

const SignInQue = new GraphQLObjectType({
  name: "SignInQue",
  fields: () => ({
    label: {
      type: GraphQLString,
    },
    answer: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
  }),
});
export const EmployeeTimeline = new GraphQLObjectType({
  name: "EmployeeTimeline",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (src) => src._id
    },
    location:{
      type: OfficeLocation,
    },
    employee: {
      type: UserType,
    },
    signedIn: {
      type: GraphQLString,
    },
    signedOut: {
      type: GraphQLString,
    },
    statusMessage: {
      type: GraphQLString,
    },
    company: {
      type: CompanyType,
    },
    signedType: {
      type: GraphQLString,
    },
    signedInDevice: {
      type: GraphQLString,
    },
    signedOutDevice: {
      type: GraphQLString,
    },
    returnTime: {
      type: GraphQLString,
    },
    signInQue: {
      type: new GraphQLList(SignInQue),
    },
  }),
});
