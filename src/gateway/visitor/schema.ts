import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { VisitorPayload } from "./types/VisitorPayload";
import getVisitorsResolver from "./resolver/getVisitorsResolver";
import { VisitorInput } from "./types/VisitorInput";
import createVisitorResolver from "./resolver/createVisitorResolver";
import { VisitorList } from "./types/VisitorList";
import updateVisitorStatusResolver from "./resolver/updateVisitorStatusResolver";
import { UpdateVisitorInput } from "./types/UpdateVisitorInput";
import updateVisitorResolver from "./resolver/updateVisitorResolver";
import getDeviceVisitorsResolver from "./resolver/getDeviceVisitorsResolver";
import { SortedInput } from "./types/SortedInput";
import { EvacuationList } from "./types/EvacuationList";
import getEvacuationListResolver from "./resolver/getEvacuationListResolver";
import {
  isAdminOrManager,
  isAUthenticated,
} from "../../middleware/isAuthenticated";

export const visitorQuery = {
  getVistors: {
    type: VisitorList,
    args: {
      startDate: {
        type: GraphQLString,
      },
      endDate: {
        type: GraphQLString,
      },
      search: {
        type: GraphQLString,
      },
      signedType: {
        type: GraphQLString,
      },
      category: {
        type: GraphQLString,
      },
      limit: {
        type: GraphQLInt,
      },
      offset: {
        type: GraphQLInt,
      },
      remembered: {
        type: GraphQLBoolean,
      },
      sorted: {
        type: SortedInput,
      },
      location: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getVisitorsResolver),
  },
  getDeviceVisiotr: {
    type: VisitorList,
    args: {
      search: {
        type: GraphQLString,
      },
      company: {
        type: GraphQLString,
      },
      signedType: {
        type: GraphQLString,
      },
      remembered: {
        type: GraphQLBoolean,
      },
      location: {
        type: GraphQLString,
      },
    },
    resolve: getDeviceVisitorsResolver,
  },
  getEvacuationList: {
    type: EvacuationList,
    args: {
      location: { type: GraphQLString },
      search: { type: GraphQLString },
      signedType: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offset: { type: GraphQLInt },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, getEvacuationListResolver),
  },
};

export const visitorMutation = {
  createVisitor: {
    type: VisitorPayload,
    args: {
      input: {
        type: VisitorInput,
      },
    },
    // Device/QR may call without JWT; dashboard JWT stamps createdBy.
    resolve: createVisitorResolver,
  },
  updateVisitor: {
    type: VisitorPayload,
    args: {
      input: {
        type: UpdateVisitorInput,
      },
    },
    resolve: updateVisitorResolver,
  },
  updateVisitorStatus: {
    type: VisitorPayload,
    args: {
      visitorId: {
        type: GraphQLID,
      },
    },
    resolve: updateVisitorStatusResolver,
  },
};
