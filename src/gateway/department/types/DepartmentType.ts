import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";
import { UserType } from "../../user/types/UserType";
import { OfficeLocation } from "../../locations/type/OfficeLocation";

export const DepartmentType = new GraphQLObjectType({
  name: "Department",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    name: { type: GraphQLString },
    location: { type: OfficeLocation },
    user: { type: new GraphQLList(UserType) },
  }),
});
