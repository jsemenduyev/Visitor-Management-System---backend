import { GraphQLObjectType } from "graphql";
import { EmployeeTimeline } from "./EmployeeTimeline";
import ErrorType from "../../category/types/Error";

export const EmployeePayload = new GraphQLObjectType({
  name: "EmployeePaylaod",
  fields: () => ({
    employee: {
      type: EmployeeTimeline,
    },
    error: {
      type: ErrorType,
    },
  }),
});
