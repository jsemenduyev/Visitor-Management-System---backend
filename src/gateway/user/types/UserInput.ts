import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString,
} from "graphql";

export const UserInput = new GraphQLInputObjectType({
  name: "UserInput",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    email2: { type: GraphQLString },
    phone: { type: GraphQLString },
    phoneCountryCode: { type: GraphQLString },
    phone2: { type: GraphQLString },
    phoneCountryCode2: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    company: {
      type: GraphQLID,
    },
    department: {
      type: GraphQLID,
    },
    notificationPreference: { type: new GraphQLList(GraphQLString) },
    img: {
      type: GraphQLString,
    },
    status: {
      type: new GraphQLEnumType({
        name: "UserStatusInput",
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
