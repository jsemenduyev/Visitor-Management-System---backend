import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-scalars";

export const EvacuationPersonType = new GraphQLObjectType({
  name: "EvacuationPerson",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    name: { type: GraphQLString },
    contact: { type: GraphQLString },
    type: { type: GraphQLString }, // "Visitor" or "Employee"
    img: { type: GraphQLString },
    signedType: { type: GraphQLString }, // "In" or "Out"
    signedIn: { type: GraphQLDateTime },
    anonymize: { type: GraphQLBoolean },
  }),
});
