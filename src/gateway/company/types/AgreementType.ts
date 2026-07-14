import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { SignatureTypeEnum } from "./SignatureTypeEnum";

export const AgreementType = new GraphQLObjectType({
  name: "AgreementType",
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    requireSignature: {
      type: GraphQLBoolean,
    },
    signatureType: {
      type: SignatureTypeEnum,
    },
    updatedAt: {
      type: GraphQLDateTime,
    },
  }),
});
