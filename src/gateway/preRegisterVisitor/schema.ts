import { GraphQLString, GraphQLInt, GraphQLID, GraphQLNonNull } from "graphql";
import {
  isAdminOrManager,
  isAUthenticated,
} from "../../middleware/isAuthenticated";
import createPreRegisterResolver from "./resolver/createPreRegisterResolver";
import deletePreRegisterResolver from "./resolver/deletePreRegisterResolver";
import { PreRegisterInput } from "./types/PreRegisterInput";
import { PreRegisterListType } from "./types/PreRegisterList";
import { PreRegisterPayload } from "./types/PreRegisterPayload";
import getPreListResolver from "./resolver/getPreListResolver";
import { SortedInput } from "../visitor/types/SortedInput";

export const PreRegisterQuery = {
  getPreVisitors: {
    type: PreRegisterListType,
    args: {
      location: {
        type: GraphQLID,
      },
      startDate: {
        type: GraphQLString,
      },
      endDate: {
        type: GraphQLString,
      },
      search: {
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
      company: {
        type: new GraphQLNonNull(GraphQLID),
      },
      sorted: {
        type: SortedInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, getPreListResolver),
  },
};
export const PreRegisterMutation = {
  createPreRegister: {
    type: PreRegisterPayload,
    args: {
      input: {
        type: PreRegisterInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, createPreRegisterResolver),
  },
  deletePreRegister: {
    type: PreRegisterPayload,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, deletePreRegisterResolver),
  },
};
