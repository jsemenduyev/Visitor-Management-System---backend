import { resolve } from "path";
import { DeviceInput } from "./types/DeviceInput";
import { DevicePayload } from "./types/DevicePayload";
import createDeviceResolver from "./resolve/createDeviceResolver";
import { DeviceType } from "./types/Device";
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import getDevicesResolver from "./resolve/getDevicesResolver";
import { UpdateDeviceInput } from "./types/UpdateDeviceInput";
import updateDeviceResolver from "./resolve/updateDeviceResolver";
import deviceLoginResolver from "./resolve/deviceLoginResolver";
import deviceMeResolver from "./resolve/deviceMeResolver";
import { isAdminOrManager } from "../../middleware/isAuthenticated";
import { UserList } from "../user/types/UserList";
import getDeviceUsers from "./resolve/getDeviceUsers";
import getDeviceDepartments from "./resolve/getDeviceDepartments";
import { DepartmentList } from "../department/types/DepartmentListPayload";
import deleteDeviceResolver from "./resolve/deleteDeviceResolver";
export const deviceQuery = {
  deviceMe: {
    type: DevicePayload,
    args: {
      sessionKey: {
        type: GraphQLString,
      },
    },
    resolve: deviceMeResolver,
  },
  getDevices: {
    type: new GraphQLList(DeviceType),
    args: {
      location: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, getDevicesResolver),
  },
  getDeviceUsers: {
    type: UserList,
    args: {
      search: {
        type: GraphQLString,
      },
      sessionKey: {
        type: GraphQLString,
      },
    },
    resolve: getDeviceUsers,
  },
  getDeviceDepartments: {
    type: DepartmentList,
    args: {
      search: {
        type: GraphQLString,
      },
      sessionKey: {
        type: GraphQLString,
      },
    },
    resolve: getDeviceDepartments,
  },
};
export const deviceMutation = {
  deviceLogin: {
    type: DevicePayload,
    args: {
      deviceId: {
        type: GraphQLString,
      },
    },
    resolve: deviceLoginResolver,
  },
  createDevice: {
    type: DevicePayload,
    args: {
      input: {
        type: DeviceInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, createDeviceResolver),
  },
  updateDevice: {
    type: DevicePayload,
    args: {
      input: {
        type: UpdateDeviceInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, updateDeviceResolver),
  },
  deleteDevice: {
    type: DevicePayload,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, deleteDeviceResolver),
  },
};
