import {
  isAdminOrManager,
  isAUthenticated,
} from "../../middleware/isAuthenticated";
import AddSpacesResolver from "./resolver/AddSpacesResolver";
import { Spaces, SpacesInput, SpacesPayload } from "./types/Spaces";
import GetSpacesResolver from "./resolver/GetSpacesResolver";
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import {
  SpacesCategory,
  SpacesCategoryInput,
  SpacesCategoryPayload,
} from "./types/SpacesCategory";
import {
  SpacesResource,
  SpacesResourceInput,
  SpacesResourcePayload,
} from "./types/SpacesResource";
import AddSpaceResourcesResolver from "./resolver/AddSpaceResourcesResolver";
import GetSpacesResourceResolver from "./resolver/GetSpacesResourceResolver";
import UpdateSpaceResolver from "./resolver/UpdateSpaceResolver";
import UpdateSpaceResourceResolver from "./resolver/UpdateSpaceResourceResolver";
import GetSpaceCategoriesResolver from "./resolver/GetSpaceCategoriesResolver";
import AddSpaceCategoryResolver from "./resolver/AddSpaceCategoryResolver";
import UpdateSpaceCategoryResolver from "./resolver/UpdateSpaceCategoryResolver";
import {
  BookingSpaceType,
  BookingSpaceInput,
  BookingSpacePayload,
} from "./types/BookingSpace";
import GetBookingSpacesResolver from "./resolver/GetBookingSpacesResolver";
import AddBookingSpaceResolver from "./resolver/AddBookingSpaceResolver";
import { ResourceScheduleType } from "./types/ResourceSchedule";
import GetResourceScheduleResolver from "./resolver/GetResourceScheduleResolver";

export const spacesQuery = {
  getSpaces: {
    type: new GraphQLList(Spaces),
    args: {
      location: { type: new GraphQLNonNull(GraphQLID) },
      space: { type: GraphQLID },
      resourceCategory: { type: GraphQLID },
    },
    resolve: (_, args, ctx) => isAUthenticated(args, ctx, GetSpacesResolver),
  },

  getSpaceResource: {
    type: new GraphQLList(SpacesResource),
    args: {
      location: { type: new GraphQLNonNull(GraphQLID) },
      space: { type: GraphQLID },
      resourceCategory: {
        type: GraphQLID,
      },
      features: {
        type: new GraphQLList(GraphQLString),
      },
    },
    resolve: (_, args, ctx) =>
      isAUthenticated(args, ctx, GetSpacesResourceResolver),
  },

  getSpaceCategories: {
    type: new GraphQLList(SpacesCategory),
    args: {
      location: { type: new GraphQLNonNull(GraphQLID) },
    },
    resolve: (_, args, ctx) => isAUthenticated(args, ctx, GetSpaceCategoriesResolver),
  },

  getBookingSpaces: {
    type: new GraphQLList(BookingSpaceType),
    args: {
      location: { type: GraphQLID },
      employee: { type: GraphQLID },
      resource: { type: GraphQLID },
      space: { type: GraphQLID },
      start: { type: GraphQLString },
      end: { type: GraphQLString },
    },
    resolve: (_, args, ctx) => isAUthenticated(args, ctx, GetBookingSpacesResolver),
  },

  getResourceSchedule: {
    type: new GraphQLList(ResourceScheduleType),
    args: {
      location: { type: new GraphQLNonNull(GraphQLID) },
      startDate: { type: new GraphQLNonNull(GraphQLString) },
      endDate: { type: new GraphQLNonNull(GraphQLString) },
      space: { type: GraphQLID },
      resourceCategory: { type: GraphQLID },
    },
    resolve: (_, args, ctx) => isAUthenticated(args, ctx, GetResourceScheduleResolver),
  },
};
export const spacesMutation = {
  addSpaces: {
    type: SpacesPayload,
    args: {
      input: {
        type: SpacesInput,
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, AddSpacesResolver),
  },
  addResources: {
    type: SpacesResourcePayload,
    args: {
      input: {
        type: SpacesResourceInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, AddSpaceResourcesResolver),
  },
  updateSpace: {
    type: SpacesPayload,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
      input: {
        type: SpacesInput,
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, UpdateSpaceResolver),
  },
  updateResource: {
    type: SpacesResourcePayload,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
      input: {
        type: SpacesResourceInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, UpdateSpaceResourceResolver),
  },
  addSpaceCategory: {
    type: SpacesCategoryPayload,
    args: {
      input: {
        type: SpacesCategoryInput,
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, AddSpaceCategoryResolver),
  },
  updateSpaceCategory: {
    type: SpacesCategoryPayload,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLID) },
      input: {
        type: SpacesCategoryInput,
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, UpdateSpaceCategoryResolver),
  },
  addBookingSpace: {
    type: BookingSpacePayload,
    args: {
      input: {
        type: BookingSpaceInput,
      },
    },
    resolve: (_, args, ctx) => isAUthenticated(args, ctx, AddBookingSpaceResolver),
  },
};
