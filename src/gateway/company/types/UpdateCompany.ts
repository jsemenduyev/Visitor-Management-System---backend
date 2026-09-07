import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

const SelectHostInput = new GraphQLInputObjectType({
  name: "SelectHostInput",
  fields: () => ({
    requireVisitors: {
      type: GraphQLBoolean,
    },
    showList: {
      type: GraphQLBoolean,
    },
    displayHostStatus: {
      type: GraphQLBoolean,
    },
    allowOnStaticQR: {
      type: GraphQLBoolean,
    },
  }),
});
const ReturningVisitorsInput = new GraphQLInputObjectType({
  name: "ReturningVisitorsInput",
  fields: () => ({
    saveDetails: {
      type: GraphQLBoolean,
    },
    displayNameMatches: {
      type: GraphQLBoolean,
    },
  }),
});
export const GeneralEmployeeSettingInput = new GraphQLInputObjectType({
  name: "GeneralEmployeeSettingInput",
  fields: () => ({
    workRemotely: { type: GraphQLBoolean },
    signOutTime: { type: GraphQLString },
    updatePicture: { type: GraphQLBoolean },
    verifyPhoto: { type: GraphQLBoolean },
  }),
});
export const EmployeePocketInput = new GraphQLInputObjectType({
  name: "EmployeePocketInput",
  fields: () => ({
    signIn: { type: GraphQLBoolean },
    verifyEmployee: { type: GraphQLString }, // enum validated in resolver
    preRegister: { type: GraphQLBoolean },
  }),
});
export const SignInQueueItemInput = new GraphQLInputObjectType({
  name: "SignInQueueItemInput",
  fields: () => ({
    label: { type: GraphQLString },
    type: { type: GraphQLString },
    required: { type: GraphQLBoolean },
    disabled: { type: GraphQLBoolean },
    priority: { type: GraphQLInt },
  }),
});
const MsgTypeInput = new GraphQLInputObjectType({
  name: "msgTypeInput",
  fields: () => ({
    msg: {
      type: GraphQLString,
    },
    required: { type: GraphQLBoolean },
  }),
});
export const SignOutMessageInput = new GraphQLInputObjectType({
  name: "SignOutMessageInput",
  fields: () => ({
    required: { type: GraphQLBoolean },
    msgs: { type: new GraphQLList(MsgTypeInput) },
  }),
});

export const EmployeeSettingsInput = new GraphQLInputObjectType({
  name: "EmployeeSettingsInput",
  fields: () => ({
    generalSetting: { type: GeneralEmployeeSettingInput },
    pocket: { type: EmployeePocketInput },
    signInQue: { type: new GraphQLList(SignInQueueItemInput) },
    signOutMsg: { type: SignOutMessageInput },
  }),
});

const SignOutSettingsInput = new GraphQLInputObjectType({
  name: "SignOutSettingsInput",
  fields: () => ({
    notifyIfNotSignedOut: {
      type: new GraphQLInputObjectType({
        name: "NotifyIfNotSignedOutInput",
        fields: () => ({
          enabled: { type: GraphQLBoolean },
          hours: { type: GraphQLString },
        }),
      }),
    },
    notifyOnSignOut: { type: GraphQLBoolean },
    autoSignOutTime: {
      type: new GraphQLInputObjectType({
        name: "AutoSignOutTimeInput",
        fields: () => ({
          enabled: { type: GraphQLBoolean },
          time: { type: GraphQLString },
        }),
      }),
    },
  }),
});

const ApprovalRecipientInput = new GraphQLInputObjectType({
  name: "ApprovalRecipientInput",
  fields: () => ({
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const SendApprovalAlertsInput = new GraphQLInputObjectType({
  name: "SendApprovalAlertsInput",
  fields: () => ({
    enabled: { type: GraphQLBoolean },
    recipients: { type: new GraphQLList(ApprovalRecipientInput) },
  }),
});

const ApprovalsInput = new GraphQLInputObjectType({
  name: "ApprovalsInput",
  fields: () => ({
    includeAllVisitorResponses: { type: GraphQLBoolean },
    allowHostsToApprove: { type: GraphQLBoolean },
    sendApprovalAlerts: { type: SendApprovalAlertsInput },
  }),
});

const SignInNotificationRecipientInput = new GraphQLInputObjectType({
  name: "SignInNotificationRecipientInput",
  fields: () => ({
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const SignInNotificationsInput = new GraphQLInputObjectType({
  name: "SignInNotificationsInput",
  fields: () => ({
    enabled: { type: GraphQLBoolean },
    includeAllVisitorResponses: { type: GraphQLBoolean },
    recipients: { type: new GraphQLList(SignInNotificationRecipientInput) },
  }),
});

const AgreementInput = new GraphQLInputObjectType({
  name: "AgreementInput",
  fields: () => ({
    agreement: { type: GraphQLString },
    signature: { type: GraphQLBoolean },
  }),
});

const GeneralDeliveryContact = new GraphQLInputObjectType({
  name: "GeneralDeliveryContact",
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
const GeneralDeliveryInput = new GraphQLInputObjectType({
  name: "GeneralDeliveryInput",
  fields: () => ({
    scanDelivery: {
      type: GraphQLBoolean,
    },
    allowDelivery: {
      type: GraphQLBoolean,
    },
    deliveryContact: {
      type: new GraphQLList(GeneralDeliveryContact),
    },
  }),
});

const DeliveryInstInput = new GraphQLInputObjectType({
  name: "DeliveryInstInput",
  fields: () => ({
    recipientDelivery: {
      type: new GraphQLInputObjectType({
        name: "RecipientDeliveryInput",
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
      }),
    },
    generalDelivery: {
      type: new GraphQLInputObjectType({
        name: "GeneralDeliveryInstInput",
        fields: () => ({
          noSignature: {
            type: GraphQLString,
          },
          signatureRquired: {
            type: GraphQLString,
          },
        }),
      }),
    },
  }),
});
const DeliveriesInput = new GraphQLInputObjectType({
  name: "DeliveriesInput",
  fields: () => ({
    general: {
      type: GeneralDeliveryInput,
    },
    deliveryInst: {
      type: DeliveryInstInput,
    },
  }),
});
const VisitorButtonInput = new GraphQLInputObjectType({
  name: "VisitorButtonInput",
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

const WelcomeScreenInput = new GraphQLInputObjectType({
  name: "WelcomeScreenInput",
  fields: () => ({
    brandText: { type: GraphQLString },
    brandFontSize: { type: GraphQLInt },
    brandTopDistance: { type: GraphQLInt },
    brandAlign: { type: GraphQLString },
    welcomeText: { type: GraphQLString },
    welcomeFontSize: { type: GraphQLInt },
    welcomeTopDistance: { type: GraphQLInt },
    welcomeAlign: { type: GraphQLString },
  }),
});

const ContactLessInput = new GraphQLInputObjectType({
  name: "ContactLessInput",
  fields: () => ({
    enabled: { type: GraphQLBoolean },
    qrCode: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});
export const BrandingTypeInput = new GraphQLInputObjectType({
  name: "BrandingTypeInput",
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
export const UpdateCompanyInput = new GraphQLInputObjectType({
  name: "UpdateCompanyInput",
  fields: () => ({
    locationId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    visitorPhoto: {
      type: GraphQLBoolean,
    },
    customHeading: { type: GraphQLString },
    selectHost: {
      type: SelectHostInput,
    },
    returningVisitors: {
      type: ReturningVisitorsInput,
    },
    signOutSettings: {
      type: SignOutSettingsInput,
    },
    approvals: {
      type: ApprovalsInput,
    },
    signInNotifications: {
      type: SignInNotificationsInput,
    },
    employees: { type: EmployeeSettingsInput },
    selectedAgreement: {
      type: AgreementInput,
    },
    deliveries: {
      type: DeliveriesInput,
    },
    visitorButton: {
      type: VisitorButtonInput,
    },
    welcomeScreen: {
      type: WelcomeScreenInput,
    },
    contactLess: {
      type: ContactLessInput,
    },
    branding: {
      type: BrandingTypeInput,
    },
  }),
});
