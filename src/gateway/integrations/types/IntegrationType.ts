import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from "graphql";

export const hookType = new GraphQLObjectType({
  name: "HookType",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    webhookUrl: {
      type: GraphQLString,
    },
  }),
});

export const googleChatType = new GraphQLObjectType({
  name: "GoogleChatType",
  fields: () => ({
    webhooks: {
      type: new GraphQLList(hookType),
    },
    enabled: {
      type: GraphQLBoolean,
    },
  }),
});

// ✅ New type for each selected channel
export const msTeamsChannelType = new GraphQLObjectType({
  name: "MsTeamsChannelType",
  fields: () => ({
    channelId: {
      type: GraphQLString,
    },
    channelName: {
      type: GraphQLString,
    },
  }),
});

export const msTeamsType = new GraphQLObjectType({
  name: "MsTeamsType",
  fields: () => ({
    teamId: {
      type: GraphQLString,
    },
    channels: {
      type: new GraphQLList(msTeamsChannelType), // ✅ replaces single channelId
    },
    tenantId: {
      type: GraphQLString,
    },
    enabled: {
      type: GraphQLBoolean,
    },
  }),
});

export const integrationType = new GraphQLObjectType({
  name: "IntegrationType",
  fields: () => ({
    googleChat: {
      type: googleChatType,
    },
    msTeams: {
      type: msTeamsType,
    },
  }),
});