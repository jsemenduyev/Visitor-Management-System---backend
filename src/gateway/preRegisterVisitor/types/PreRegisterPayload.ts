import { GraphQLObjectType } from "graphql";
import { PreRegisterType } from "./PreRegister";
import ErrorType from "../../category/types/Error";

export const PreRegisterPayload = new GraphQLObjectType({
  name: "PreRegisterPayload",
  fields: () => ({
    visitor: {
      type: PreRegisterType,
    },
    error: {
      type: ErrorType,
    },
  }),
});
