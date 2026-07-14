import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLID,
} from "graphql";

export const HostInput = new GraphQLInputObjectType({
  name: "HostInput",
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    company: { type: GraphQLID },
    notificationPreferences: {
      type: new GraphQLInputObjectType({
        name: "HostNotificationPreferencesInput",
        fields: () => ({
          email: { type: GraphQLBoolean },
          sms: { type: GraphQLBoolean },
          push: { type: GraphQLBoolean },
        }),
      }),
    },
    password: { type: GraphQLString }, // needed if you want host login
  }),
});
