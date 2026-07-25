import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLEnumType,
} from "graphql";
import { GraphQLDate } from "graphql-scalars";
import { DepartmentType } from "../../department/types/DepartmentType";
import { CompanyType } from "../../company/types/CompanyType";
import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";
import { EmployeeTimeline } from "../../employee/types/EmployeeTimeline";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
import OfficeLocationModel from "../../../../database/models/officelocations";

export const RoleEnum = new GraphQLEnumType({
  name: "RoleEnum",
  values: () => ({
    Admin: {
      value: "admin",
    },
    Manager: {
      value: "manager",
    },
    Employee: {
      value: "employee",
    },
  }),
});
export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: RoleEnum },
    phone: { type: GraphQLString },
    company: { type: CompanyType },
    location: {
      type: OfficeLocation,
      resolve: async (src) => {
        if (!src.location) return null;
        return OfficeLocationModel.findById(src.location).lean();
      },
    },
    img: {
      type: GraphQLString,
    },
    department: { type: DepartmentType },
    timeline: {
      type: EmployeeTimeline,
      resolve: async (src) => {
        const timeLine = await EmployeeTimelineModel.findOne({
          employee: src._id,
        })
          .sort({ createdAt: -1 }) // newest entry first
          .lean();
        return timeLine;
      },
    },
    notificationPreference: { type: new GraphQLList(GraphQLString) },
    workingRemote: {
      type: GraphQLString,
    },
    isArchived: { type: GraphQLBoolean },
    archivedAt: { type: GraphQLDate },
    needPasswordReset: { type: GraphQLBoolean },

    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
  }),
});
