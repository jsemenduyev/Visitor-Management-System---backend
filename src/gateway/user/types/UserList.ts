import { GraphQLInt, GraphQLList, GraphQLObjectType } from "graphql";
import { UserType } from "./UserType";

export const UserList = new GraphQLObjectType({
  name: "UserList",
  fields: {
    user: {
      type: new GraphQLList(UserType),
    },
    count: {
      type: GraphQLInt,
    },
  },
});
