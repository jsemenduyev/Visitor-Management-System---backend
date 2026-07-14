import { GraphQLEnumType } from "graphql";

export const SignatureTypeEnum = new GraphQLEnumType({
  name: "SignatureTypeEnum",
  values: {
    SIGNATURE: { value: "SIGNATURE" },
    CHECKBOX: { value: "CHECKBOX" },
  },
});
