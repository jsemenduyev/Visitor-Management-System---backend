import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} from "graphql";
import GraphQLJSON from "graphql-type-json";

export const PreRegisterInput = new GraphQLInputObjectType({
  name: "PreRegisterInput",
  fields: {
    startDate: { type: new GraphQLNonNull(GraphQLString) },
    endDate: { type: new GraphQLNonNull(GraphQLString) },
    startTime: { type: GraphQLString },
    location: { type: GraphQLString },
    address: { type: GraphQLString },
    category: { type: new GraphQLNonNull(GraphQLID) },
    department: { type: GraphQLID },
    employee: { type: GraphQLID },
    visitorEmail: { type: GraphQLString },
    message: { type: GraphQLString },
    data: { type: GraphQLJSON }, // flexible JSON data
  },
});
