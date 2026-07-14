import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import createDepartmentResolver from "./resolve/createDepartmentResolver";
import { DepartmentInput } from "./types/DepartmentInput";
import { DepartmentList } from "./types/DepartmentListPayload";
import { DepartmentPayload } from "./types/DepartmentPayload";
import getDepartmentsResolver from "./resolve/getDepartmentsResolver";
import { isAdminOrManager } from "../../middleware/isAuthenticated";
import deleteDepartmentResolver from "./resolve/deleteDepartmentResolver";

export const departmentQuery = {
  getDepartments: {
    type: DepartmentList,
    args: {
      search: {
        type: GraphQLString,
      },
      limit: {
        type: GraphQLInt,
      },
      offset: {
        type: GraphQLInt,
      },
      location: {
        type: GraphQLID
      }
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getDepartmentsResolver),
  },
};
export const departmentMutation = {
  createDepartment: {
    type: DepartmentPayload,
    args: {
      input: {
        type: DepartmentInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, createDepartmentResolver),
  },
  deleteDepartment: {
    type: GraphQLString,
    args: {
      departmentId: {
        type: GraphQLID,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, deleteDepartmentResolver),
  },
};
