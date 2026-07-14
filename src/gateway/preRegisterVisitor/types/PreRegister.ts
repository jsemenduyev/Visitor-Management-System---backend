import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";
import { DepartmentType } from "../../department/types/DepartmentType";
import { VisitorCategoryType } from "../../category/types/VisitorCategory";
import GraphQLJSON from "graphql-type-json";
import { CompanyType } from "../../company/types/CompanyType";
import { UserType } from "../../user/types/UserType";

export const PreRegisterType = new GraphQLObjectType({
  name: "PreRegisterType",
  fields: {
    id: { type: GraphQLID, resolve: (src) => src._id },
    data: { type: GraphQLJSON }, // flexible JSON field
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    startTime: { type: GraphQLString },
    location: { type: GraphQLString },
    address: { type: GraphQLString },
    category: { type: VisitorCategoryType },
    department: { type: DepartmentType },
    company: {
      type: CompanyType,
    },
    employees: {
      type: new GraphQLList(UserType),
    },
    visitorEmail: { type: GraphQLString },
    message: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
