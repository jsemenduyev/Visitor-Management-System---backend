import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {
  ApprovalsType,
  CompanyType,
  ContactLess,
  DeliveriesType,
  EmployeeSettingsType,
  ReturningVisitorsType,
  savedImgsType,
  SelectHostType,
  SignInNotificationsType,
  SignOutSettingsType,
  VisitorButton,
  WelcomeScreen,
} from "../../company/types/CompanyType";
import { DeviceType } from "../../device/types/Device";
import DeviceModel from "../../../../database/models/devices";

export const BrandingType = new GraphQLObjectType({
  name: "BrandingType",
  fields: () => ({
    logo: {
      type: GraphQLString,
    },
    displaysOn: {
      type: new GraphQLList(GraphQLString),
    },

    badgeType: {
      type: GraphQLString,
    },
    allowScanning: {
      type: GraphQLBoolean,
    },
    accentColor: {
      type: GraphQLString,
    },
  }),
});

export const OfficeLocation = new GraphQLObjectType({
  name: "OfficeLocation",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    lat: { type: GraphQLString },
    lng: { type: GraphQLString },
    customHeading: { type: GraphQLString },
    company: {
      type: CompanyType,
    },
    devices: {
      type: new GraphQLList(DeviceType),
      resolve: (src, _args, ctx) =>
        DeviceModel.find({
          location: src._id,
          company: ctx.user.company,
          createdBy: ctx.user._id,
        })
          .populate("department")
          .populate("categoryType")
          .lean()
          .exec(),
    },
    agreements: { type: new GraphQLList(GraphQLID) }, // or new GraphQLList(AgreementType)
    visitorPhoto: { type: GraphQLBoolean },
    selectHost: { type: SelectHostType },
    returningVisitors: { type: ReturningVisitorsType },
    signOutSettings: { type: SignOutSettingsType },
    approvals: { type: ApprovalsType },
    signInNotifications: { type: SignInNotificationsType },
    employees: { type: EmployeeSettingsType }, // ✅ added
    selectedAgreement: {
      type: new GraphQLObjectType({
        name: "SelectedAgreement",
        fields: () => ({
          agreement: { type: GraphQLString },
          signature: { type: GraphQLBoolean },
        }),
      }),
    },
    deliveries: {
      type: DeliveriesType,
    },
    savedImgs: {
      type: new GraphQLList(savedImgsType),
    },
    visitorButton: {
      type: VisitorButton,
    },
    welcomeScreen: {
      type: WelcomeScreen,
    },
    contactLess: {
      type: ContactLess,
    },
    branding: {
      type: BrandingType,
    },
  }),
});
