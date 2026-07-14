import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { EmployeeTimeline } from "./EmployeeTimeline";

export const EmployeeTimelineList = new GraphQLObjectType({
  name: "EmployeeTimelineList",
  fields: () => ({
    employee: {
      type: new GraphQLList(EmployeeTimeline),
    },
    count: {
      type: GraphQLInt,
    },
  }),
});
