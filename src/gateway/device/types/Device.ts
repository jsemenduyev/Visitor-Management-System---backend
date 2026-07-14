import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from "graphql";
import { DepartmentType } from "../../department/types/DepartmentType";
import { VisitorCategoryType } from "../../category/types/VisitorCategory";
import { CompanyType } from "../../company/types/CompanyType";
import { OfficeLocation } from "../../locations/type/OfficeLocation";

export const DeviceType = new GraphQLObjectType({
  name: "Device",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id }, // MongoDB _id
    deviceId: { type: GraphQLString },
    deviceName: { type: GraphQLString },
    department: { type: new GraphQLList(DepartmentType) }, // or a relation to DepartmentType if you have it
    deviceTypes: { type: new GraphQLList(GraphQLString) }, // ["visitor", "employee", "deliveries"]
    sessionKey: { type: GraphQLString },
    categoryType: {
      type: new GraphQLList(VisitorCategoryType),
    },
    company: {
      type: CompanyType,
    },
    location: {
      type: OfficeLocation
    },
    visitorNotifications: {
      type: new GraphQLObjectType({
        name: "VisitorNotifications",
        fields: () => ({
          checkIn: { type: GraphQLString },
          checkOut: { type: GraphQLString },
          checkInPending: { type: GraphQLString },
        }),
      }),
    }
  }),
});
