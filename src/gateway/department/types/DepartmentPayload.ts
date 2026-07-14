import { GraphQLObjectType } from "graphql";
import ErrorType from "../../category/types/Error";
import { DepartmentType } from "./DepartmentType";

export const DepartmentPayload = new GraphQLObjectType({
  name: "DepartmentPayload",
  fields: () => ({
    department: {
      type: DepartmentType,
    },
    error: {
      type: ErrorType,
    },
  }),
});
