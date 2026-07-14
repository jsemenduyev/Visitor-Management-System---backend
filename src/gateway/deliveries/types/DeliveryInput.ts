import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

export const DeliveryEnum = new GraphQLEnumType({
  name: "DeliveryEnum",
  values: {
    general: { value: "general" },
    recipient: { value: "recipient" },
  },
});
export const DeliveryInput = new GraphQLInputObjectType({
  name: "DeliveryInput",
  fields: () => ({
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
    location: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});
export const DeviceDeliveryInput = new GraphQLInputObjectType({
  name: "DeviceDeliveryInput",
  fields: () => ({
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
    sessionKey: {
      type: GraphQLString,
    },
    location: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});
