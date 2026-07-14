import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from "graphql";
export const AddressInputType = new GraphQLInputObjectType({
  name: "AddressInputType",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    pincode: { type: GraphQLString },
  }),
});
export const SignUpInputType = new GraphQLInputObjectType({
  name: "SignUpInputType",
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNo: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    companyName: {
      type: GraphQLString,
    },
    address: {
      type: AddressInputType, // ✅ nested input object
    },
  }),
});
