import { GraphQLBoolean, GraphQLInputObjectType, GraphQLString } from "graphql";
import { SignatureTypeEnum } from "./SignatureTypeEnum";

export const AgreementInputType = new GraphQLInputObjectType({
    name: "AgreementInputType",
    fields: () => ({
        _id: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        content: {
            type: GraphQLString
        },
        requireSignature: {
            type: GraphQLBoolean
        },
        signatureType: {
            type: SignatureTypeEnum
        }
    })
})