import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";

export const DepartmentInput = new GraphQLInputObjectType({
  name: "DepartmentInput",
  fields: () => ({
    _id: {
      type: GraphQLString,
    },
    name: { type: GraphQLString },
    location: { type: GraphQLString },
    company: {
      type: GraphQLID,
    },
    user: { type: new GraphQLList(GraphQLID) }, // array of Employee IDs
  }),
});
