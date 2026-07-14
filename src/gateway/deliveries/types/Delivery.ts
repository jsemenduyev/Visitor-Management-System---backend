import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserType } from "../../user/types/UserType";
import { CompanyType } from "../../company/types/CompanyType";
import { GraphQLDateTime } from "graphql-scalars";
import { OfficeLocation } from "../../locations/type/OfficeLocation";

export const DeliveryType = new GraphQLObjectType({
  name: "DeliveryType",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (src) => src._id,
    },
    reciepient: {
      type: UserType,
    },
    location: {
      type: OfficeLocation,
    },
    company: {
      type: CompanyType,
    },
    deliveryType: {
      type: GraphQLString,
    },
    delivered: {
      type: GraphQLDateTime,
      resolve: (src) => src.createdAt,
    },
    note: {
      type: GraphQLString,
    },
    signature: {
      type: GraphQLBoolean,
    },
    collected: {
      type: GraphQLBoolean,
    },
    collectedAt: {
      type: GraphQLDateTime,
      resolve: (src) => src.updatedAt,
    },
    createdAt: {
      type: GraphQLDateTime,
      resolve: (src) => src.createdAt,
    },
  }),
});
