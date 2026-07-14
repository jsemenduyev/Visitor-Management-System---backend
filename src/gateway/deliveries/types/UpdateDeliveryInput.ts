import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { DeliveryEnum } from "./DeliveryInput";

export const UpdateDeliveryInput = new GraphQLInputObjectType({
  name: "UpdateDeliveryInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
      required: true,
    },
    reciepient: {
      type: GraphQLID,
      required: true,
    },

    deliveryType: {
      type: DeliveryEnum,
      required: true,
    },
    signature: {
      type: GraphQLBoolean,
    },
    collected: {
      type: GraphQLBoolean,
    },
    packages: {
      type: GraphQLInt,
    },
    note: {
      type: GraphQLString,
    },
    notify: {
      type: GraphQLBoolean,
    },
    location: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});
