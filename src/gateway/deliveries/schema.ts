import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql";
import createDeliveryResolver from "./resolver/createDeliveryResolver";
import { DeliveryType } from "./types/Delivery";
import { DeliveryInput, DeviceDeliveryInput } from "./types/DeliveryInput";
import getDeliveriesResolver from "./resolver/getDeliveriesResolver";
import { DeliveryList } from "./types/DeliveryList";
import { DeliveryPayload } from "./types/DeliveryPayload";
import { isAdminOrManager } from "../../middleware/isAuthenticated";
import createDeviceDelivery from "./resolver/createDeviceDelivery";
import { UpdateDeliveryInput } from "./types/UpdateDeliveryInput";
import updateDeliveryResolver from "./resolver/updateDeliveryResolver";
import getDeviceDeliveries from "./resolver/getDeviceDeliveries";
import deleteDeliveryResolver from "./resolver/deleteDeliveryResolver";
import { SortedInput } from "../visitor/types/SortedInput";

export const deliveryQuery = {
  getDeliveries: {
    type: DeliveryList,
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
      collected: {
        type: GraphQLBoolean,
      },
      sorted: {
        type: SortedInput,
      },
      location:{
        type: GraphQLID,
      }
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getDeliveriesResolver),
  },
  getDeviceDeliveries: {
    type: new GraphQLList(DeliveryType),
    args: {
      sessionKey: {
        type: GraphQLString,
      },
    },
    resolve: getDeviceDeliveries,
  },
};
export const deliveryMutation = {
  createDelivery: {
    type: DeliveryPayload,
    args: {
      input: { type: DeliveryInput },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, createDeliveryResolver),
  },
  createDeviceDelivery: {
    type: DeliveryPayload,
    args: {
      input: { type: DeviceDeliveryInput },
    },
    resolve: createDeviceDelivery,
  },
  updateDelivery: {
    type: DeliveryPayload,
    args: {
      input: { type: UpdateDeliveryInput },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, updateDeliveryResolver),
  },
  deleteDelivery: {
    type: GraphQLString,
    args: {
      _id: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, deleteDeliveryResolver),
  },
};
