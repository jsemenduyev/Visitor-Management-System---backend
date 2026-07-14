import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { DepartmentType } from "./DepartmentType";

export const DepartmentList = new GraphQLObjectType({
  name: "DepartmentList",
  fields: () => ({
    department: {
      type: new GraphQLList(DepartmentType),
    },
    count: {
      type: GraphQLInt,
    },
  }),
});
