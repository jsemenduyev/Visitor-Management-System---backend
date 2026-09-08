import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { buildContactLessQr } from "../../../utils/contactLessQr";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
// 🧩 Nested object type: SelectHostType
export const AddressType = new GraphQLObjectType({
  name: "AddressType",
  fields: () => ({
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    pincode: { type: GraphQLString },
  }),
});
export const SelectHostType = new GraphQLObjectType({
  name: "SelectHostType",
  fields: () => ({
    requireVisitors: { type: GraphQLBoolean },
    showList: { type: GraphQLBoolean },
    displayHostStatus: { type: GraphQLBoolean },
    allowOnStaticQR: { type: GraphQLBoolean },
  }),
});

// 🧩 Nested object type: ReturningVisitorsType
export const ReturningVisitorsType = new GraphQLObjectType({
  name: "ReturningVisitorsType",
  fields: () => ({
    saveDetails: { type: GraphQLBoolean },
    displayNameMatches: { type: GraphQLBoolean },
  }),
});

export const GeneralEmployeeSettingType = new GraphQLObjectType({
  name: "GeneralEmployeeSetting",
  fields: () => ({
    workRemotely: { type: GraphQLBoolean },
    signOutTime: { type: GraphQLString },
    updatePicture: { type: GraphQLBoolean },
    verifyPhoto: { type: GraphQLBoolean },
  }),
});

export const EmployeePocketType = new GraphQLObjectType({
  name: "EmployeePocket",
  fields: () => ({
    signIn: { type: GraphQLBoolean },
    verifyEmployee: { type: GraphQLString }, // enum can be added later
    preRegister: { type: GraphQLBoolean },
  }),
});
export const SignInQueueItemType = new GraphQLObjectType({
  name: "SignInQueueItem",
  fields: () => ({
    _id: { type: GraphQLString },
    label: { type: GraphQLString },
    type: { type: GraphQLString },
    required: { type: GraphQLBoolean },
    disabled: { type: GraphQLBoolean },
    priority: { type: GraphQLInt },
  }),
});
export const MsgType = new GraphQLObjectType({
  name: "msgType",
  fields: () => ({
    _id: { type: GraphQLString },
    msg: {
      type: GraphQLString,
    },
    required: { type: GraphQLBoolean },
  }),
});
export const SignOutMessageType = new GraphQLObjectType({
  name: "SignOutMessage",
  fields: () => ({
    required: { type: GraphQLBoolean },
    msgs: { type: new GraphQLList(MsgType) },
  }),
});
export const EmployeeSettingsType = new GraphQLObjectType({
  name: "EmployeeSettings",
  fields: () => ({
    generalSetting: { type: GeneralEmployeeSettingType },
    pocket: { type: EmployeePocketType },
    signInQue: { type: new GraphQLList(SignInQueueItemType) },
    signOutMsg: { type: SignOutMessageType },
  }),
});

export const GeneralDeliveryContactType = new GraphQLObjectType({
  name: "GeneralDeliveryContactType",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
  }),
});
export const GeneralDeliveryType = new GraphQLObjectType({
  name: "GeneralDeliveryType",
  fields: () => ({
    scanDelivery: {
      type: GraphQLBoolean,
    },
    allowDelivery: {
      type: GraphQLBoolean,
    },
    deliveryContact: {
      type: new GraphQLList(GeneralDeliveryContactType),
    },
  }),
});

export const RecipientDeliveryType = new GraphQLObjectType({
  name: "RecipientDeliveryType",
  fields: () => ({
    noSignature: {
      type: GraphQLString,
    },
    signatureRquired: {
      type: GraphQLString,
    },
    recipientOut: {
      type: GraphQLString,
    },
  }),
});
export const GeneralDeliveryInstType = new GraphQLObjectType({
  name: "GeneralDeliveryInstType",
  fields: () => ({
    noSignature: {
      type: GraphQLString,
    },
    signatureRquired: {
      type: GraphQLString,
    },
  }),
});
export const DeliveryInstType = new GraphQLObjectType({
  name: "DeliveryInstType",
  fields: () => ({
    recipientDelivery: {
      type: RecipientDeliveryType,
    },
    generalDelivery: {
      type: GeneralDeliveryInstType,
    },
  }),
});
export const DeliveriesType = new GraphQLObjectType({
  name: "DeliveriesType",
  fields: () => ({
    general: {
      type: GeneralDeliveryType,
    },
    deliveryInst: {
      type: DeliveryInstType,
    },
  }),
});

export const savedImgsType = new GraphQLObjectType({
  name: "SavedImgsType",
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (src) => src._id,
    },
    url: { type: GraphQLString },
    enabled: { type: GraphQLBoolean },
  }),
});
export const VisitorButton = new GraphQLObjectType({
  name: "VisitorButton",
  fields: () => ({
    buttonRadius: {
      type: GraphQLString,
    },
    buttonColor: {
      type: GraphQLString,
    },
    buttonBg: { type: GraphQLString },
  }),
});

export const WelcomeScreen = new GraphQLObjectType({
  name: "WelcomeScreen",
  fields: () => ({
    brandEnabled: { type: GraphQLBoolean },
    brandText: { type: GraphQLString },
    brandFontSize: { type: GraphQLInt },
    brandTopDistance: { type: GraphQLInt },
    brandAlign: { type: GraphQLString },
    welcomeEnabled: { type: GraphQLBoolean },
    welcomeText: { type: GraphQLString },
    welcomeFontSize: { type: GraphQLInt },
    welcomeTopDistance: { type: GraphQLInt },
    welcomeAlign: { type: GraphQLString },
  }),
});
export const ContactLess = new GraphQLObjectType({
  name: "ContactLess",
  fields: () => ({
    enabled: { type: GraphQLBoolean },
    qrCode: {
      type: GraphQLString,
      resolve: async (parent) => {
        if (!parent?.enabled || !parent?.token) {
          return parent?.qrCode ?? null;
        }
        try {
          const { qrCode } = await buildContactLessQr(parent.token);
          return qrCode;
        } catch {
          return parent?.qrCode ?? null;
        }
      },
    },
    token: { type: GraphQLString },
  }),
});
export const SignOutSettingsType = new GraphQLObjectType({
  name: "SignOutSettingsType",
  fields: () => ({
    notifyIfNotSignedOut: {
      type: new GraphQLObjectType({
        name: "NotifyIfNotSignedOutType",
        fields: () => ({
          enabled: { type: GraphQLBoolean },
          hours: { type: GraphQLString },
        }),
      }),
    },
    notifyOnSignOut: { type: GraphQLBoolean },
    autoSignOutTime: {
      type: new GraphQLObjectType({
        name: "AutoSignOutTimeType",
        fields: () => ({
          enabled: { type: GraphQLBoolean },
          time: { type: GraphQLString },
        }),
      }),
    },
  }),
});

export const ApprovalRecipientType = new GraphQLObjectType({
  name: "ApprovalRecipient",
  fields: () => ({
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export const SendApprovalAlertsType = new GraphQLObjectType({
  name: "SendApprovalAlertsType",
  fields: () => ({
    enabled: { type: GraphQLBoolean },
    recipients: { type: new GraphQLList(ApprovalRecipientType) },
  }),
});

export const ApprovalsType = new GraphQLObjectType({
  name: "ApprovalsType",
  fields: () => ({
    includeAllVisitorResponses: { type: GraphQLBoolean },
    allowHostsToApprove: { type: GraphQLBoolean },
    sendApprovalAlerts: { type: SendApprovalAlertsType },
  }),
});

export const SignInNotificationRecipientType = new GraphQLObjectType({
  name: "SignInNotificationRecipient",
  fields: () => ({
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

export const SignInNotificationsType = new GraphQLObjectType({
  name: "SignInNotificationsType",
  fields: () => ({
    enabled: { type: GraphQLBoolean },
    includeAllVisitorResponses: { type: GraphQLBoolean },
    recipients: { type: new GraphQLList(SignInNotificationRecipientType) },
  }),
});

// 🏢 Main Company type
export const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLID, resolve: (src) => src._id },
    name: { type: GraphQLString },
    address: { type: AddressType },
    location: { type: new GraphQLList(OfficeLocation) }, // or type: OfficeLocationType if you populate
  }),
});
