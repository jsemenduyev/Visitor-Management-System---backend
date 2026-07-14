import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";
import { EmployeePayload } from "./types/EmployeePayload";
import { EmployeeTimelineInput } from "./types/EmployeeTimelineInput";
import {
  isAdminOrManager,
  isAUthenticated,
} from "../../middleware/isAuthenticated";
import createEmployeeTimeLineResolver from "./resolver/createEmployeeTimeLineResolver.";
import { EmployeeTimelineList } from "./types/EmployeeTimelineList";
import getEmployeeTimelineListResolver from "./resolver/getEmployeeTimelineListResolver";
import getEmployeeTimelineResolver from "./resolver/getEmployeeTimelineResolver";
import { EmployeeTimelineDeviceInput } from "./types/EmployeeTimelineDeviceInput";
import createEmployeeTimelineDeviceResolver from "./resolver/createEmployeeTimelineDeviceResolver";
import deleteEmployeeResolver from "./resolver/deleteEmployeeResolver";
import getArchivedEmployeesResolver from "./resolver/getArchivedEmployeesResolver";
import restoreEmployeeResolver from "./resolver/restoreEmployeeResolver";
import { UserPaylaod } from "../user/types/UserPayload";
import { UserList } from "../user/types/UserList";
import { SortedInput } from "../visitor/types/SortedInput";

export const employeeQuery = {
  getArchivedEmployees: {
    type: UserList,
    args: {
      search: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getArchivedEmployeesResolver),
  },
  getEmployeesTimeline: {
    type: EmployeeTimelineList,
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
      startDate: {
        type: GraphQLString,
      },
      endDate: {
        type: GraphQLString,
      },
      sorted: {
        type: SortedInput,
      },
      location: {
        type: GraphQLID
      },
      signedType: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getEmployeeTimelineListResolver),
  },
  getEmployeeTimeline: {
    type: EmployeeTimelineList,
    args: {
      date: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, getEmployeeTimelineResolver),
  },
};
export const employeeMutation = {
  createEmployeeTimeline: {
    type: EmployeePayload,
    args: {
      input: {
        type: EmployeeTimelineInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, createEmployeeTimeLineResolver),
  },
  createdEmployeeTimelineDevice: {
    type: EmployeePayload,
    args: {
      input: {
        type: EmployeeTimelineDeviceInput,
      },
    },
    resolve: createEmployeeTimelineDeviceResolver,
  },
  deleteEmployee: {
    type: UserPaylaod,
    args: {
      employeeId: {
        type: GraphQLID,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, deleteEmployeeResolver),
  },
  restoreEmployee: {
    type: UserPaylaod,
    args: {
      employeeId: {
        type: GraphQLID,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, restoreEmployeeResolver),
  },
};
