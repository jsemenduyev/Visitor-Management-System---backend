import { GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "./UserType";
import ErrorType from "../../category/types/Error";

export const UserPaylaod = new GraphQLObjectType({
  name: "UserPaylaod",
  fields: () => ({
    user: {
      type: UserType,
    },
    token: {
      type: GraphQLString,
    },
    error: {
      type: ErrorType,
    },
  }),
});
