import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { isAdminOrManager } from "../../middleware/isAuthenticated";
import getIntegrationsResolver from "./resolver/getIntegrationsResolver";
import { integrationType } from "./types/IntegrationType";
import updateIntegrationResolver from "./resolver/updateIntegrationResolver";
import { CompanyModel } from "../../../database/models/company";
const msTeamsChannelInput = new GraphQLInputObjectType({
  name: "MsTeamsChannelInput",
  fields: () => ({
    channelId: { type: new GraphQLNonNull(GraphQLString) },
    channelName: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
export const integrationQuery = {
  getIntegrations: {
    type: integrationType,
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getIntegrationsResolver),
  },
};

export const integrationMutation = {
  removeIntegration: {
    type: integrationType,
    args: {
      webhookId: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, updateIntegrationResolver),
  },
  saveMsTeamsChannel: {
    type: integrationType,
    args: {
      teamId: { type: new GraphQLNonNull(GraphQLString) },
      channels: {
        type: new GraphQLNonNull(new GraphQLList(msTeamsChannelInput)),
      }, // ✅ array of channels
    },
    resolve: async (_: any, { teamId, channels }: any, context: any) => {
      const companyId = context.user.company;

      await CompanyModel.findByIdAndUpdate(companyId, {
        $set: {
          "msteams.teamId": teamId,
          "msteams.channels": channels, // ✅ replaces single channelId
          "msteams.enabled": true,
        },
      });

      const company = await CompanyModel.findById(companyId);
      return company;
    },
  },
  removeMsTeamsIntegration: {
    type: integrationType,
    resolve: async (_: any, __: any, context: any) => {
      const companyId = context.user.company;

      await CompanyModel.findByIdAndUpdate(companyId, {
        $set: {
          "msteams.accessToken": null,
          "msteams.refreshToken": null,
          "msteams.expiresAt": null,
          "msteams.teamId": null,
          "msteams.channels": [],
          "msteams.tenantId": null,
          "msteams.enabled": false,
        },
      });

      return await CompanyModel.findById(companyId);
    },
  },
};
