import { GraphQLObjectType, GraphQLString } from "graphql";
import { DeviceType } from "./Device";
import ErrorType from "../../category/types/Error";

export const DevicePayload = new GraphQLObjectType({
  name: "DevicePayload",
  fields: () => ({
    device: {
      type: DeviceType,
    },
    token: {
      type: GraphQLString,
    },
    error: {
      type: ErrorType,
    },
  }),
});
