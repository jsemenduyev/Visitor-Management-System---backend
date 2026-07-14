import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { OfficeLocation } from "./type/OfficeLocation";
import OfficeLocationResolver from "./resolver/OfficeLocationResolver";
import { isAdminOrManager } from "../../middleware/isAuthenticated";
import AddOfficeLocationResolver from "./resolver/AddOfficeLocationResolver";
import DeleteOfficeLocationResolver from "./resolver/DeleteOfficeLocationResolver";
import { LocationPayload } from "./type/LocationPayload";
import GetOffceLocationResolver from "./resolver/GetOffceLocationResolver";

export const officeLocationsQuery = {
  getOfficeLocations: {
    type: new GraphQLList(OfficeLocation),
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, OfficeLocationResolver),
  },
  getOfficeLocation: {
    type: OfficeLocation,
    args: {
      locationId: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, GetOffceLocationResolver),
  },
};

export const officeLocationsMutation = {
  addLocation: {
    type: LocationPayload,
    args: {
      _id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
      address: {
        type: GraphQLString,
      },
      customHeading: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, AddOfficeLocationResolver),
  },
  deleteLocation: {
    type: LocationPayload,
    args: {
      locationId: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, DeleteOfficeLocationResolver),
  },
};
