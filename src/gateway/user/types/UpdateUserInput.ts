import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
} from "graphql";

export const UpdateUserInput = new GraphQLInputObjectType({
  name: "UpdateUserInput",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    phoneCountryCode: { type: GraphQLString },
    role: { type: GraphQLString },
    notificationPreference: { type: new GraphQLList(GraphQLString) },
    company: {
      type: GraphQLID,
    },
    img: {
      type: GraphQLString,
    },
    department: {
      type: GraphQLID,
    },
    status: {
      type: new GraphQLEnumType({
        name: "UpdateUserStatusInput",
        values: {
          IN: { value: "In" },
          OUT: { value: "Out" },
        },
      }),
    },
    workingRemote: {
      type: GraphQLString,
    },
    location: {
      type: GraphQLID
    }
  }),
});
