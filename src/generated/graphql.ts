import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AddressInputType = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  pincode?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type AddressType = {
  __typename?: 'AddressType';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  pincode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type AgreementInput = {
  agreement?: InputMaybe<Scalars['String']['input']>;
  signature?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AgreementType = {
  __typename?: 'AgreementType';
  _id?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  requireSignature?: Maybe<Scalars['Boolean']['output']>;
  signatureType?: Maybe<SignatureTypeEnum>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ApprovalRecipient = {
  __typename?: 'ApprovalRecipient';
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type ApprovalRecipientInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type ApprovalsInput = {
  allowHostsToApprove?: InputMaybe<Scalars['Boolean']['input']>;
  includeAllVisitorResponses?: InputMaybe<Scalars['Boolean']['input']>;
  sendApprovalAlerts?: InputMaybe<SendApprovalAlertsInput>;
};

export type ApprovalsType = {
  __typename?: 'ApprovalsType';
  allowHostsToApprove?: Maybe<Scalars['Boolean']['output']>;
  includeAllVisitorResponses?: Maybe<Scalars['Boolean']['output']>;
  sendApprovalAlerts?: Maybe<SendApprovalAlertsType>;
};

export type AutoSignOutTimeInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  time?: InputMaybe<Scalars['String']['input']>;
};

export type AutoSignOutTimeType = {
  __typename?: 'AutoSignOutTimeType';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  time?: Maybe<Scalars['String']['output']>;
};

export type BookingSpaceInput = {
  category?: InputMaybe<Scalars['ID']['input']>;
  employee?: InputMaybe<Scalars['ID']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  people?: InputMaybe<Scalars['Int']['input']>;
  resource?: InputMaybe<Scalars['ID']['input']>;
  space?: InputMaybe<Scalars['ID']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};

export type BookingSpacePayload = {
  __typename?: 'BookingSpacePayload';
  booking?: Maybe<BookingSpaceType>;
  error?: Maybe<ErrorType>;
};

export type BookingSpaceType = {
  __typename?: 'BookingSpaceType';
  _id?: Maybe<Scalars['ID']['output']>;
  category?: Maybe<SpacesCategoryType>;
  employee?: Maybe<User>;
  end?: Maybe<Scalars['DateTime']['output']>;
  location?: Maybe<OfficeLocation>;
  people?: Maybe<Scalars['Int']['output']>;
  resource?: Maybe<SpacesResourceType>;
  space?: Maybe<SpacesType>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export type BrandingType = {
  __typename?: 'BrandingType';
  accentColor?: Maybe<Scalars['String']['output']>;
  allowScanning?: Maybe<Scalars['Boolean']['output']>;
  badgeType?: Maybe<Scalars['String']['output']>;
  displaysOn?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  logo?: Maybe<Scalars['String']['output']>;
};

export type BrandingTypeInput = {
  accentColor?: InputMaybe<Scalars['String']['input']>;
  allowScanning?: InputMaybe<Scalars['Boolean']['input']>;
  badgeType?: InputMaybe<Scalars['String']['input']>;
  displaysOn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  logo?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryInput = {
  allowBadgePrint?: InputMaybe<Scalars['Boolean']['input']>;
  approval?: InputMaybe<Scalars['Boolean']['input']>;
  company?: InputMaybe<Scalars['ID']['input']>;
  fields?: InputMaybe<Array<InputMaybe<FieldInput>>>;
  host?: InputMaybe<Scalars['Boolean']['input']>;
  location: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryType = {
  __typename?: 'CategoryType';
  category?: Maybe<VisitorCategory>;
  error?: Maybe<ErrorType>;
};

export type Company = {
  __typename?: 'Company';
  address?: Maybe<AddressType>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<Array<Maybe<OfficeLocation>>>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ContactLess = {
  __typename?: 'ContactLess';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  qrCode?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type ContactLessInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  qrCode?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type DeliveriesInput = {
  deliveryInst?: InputMaybe<DeliveryInstInput>;
  general?: InputMaybe<GeneralDeliveryInput>;
};

export type DeliveriesType = {
  __typename?: 'DeliveriesType';
  deliveryInst?: Maybe<DeliveryInstType>;
  general?: Maybe<GeneralDeliveryType>;
};

export enum DeliveryEnum {
  General = 'general',
  Recipient = 'recipient'
}

export type DeliveryInput = {
  collected?: InputMaybe<Scalars['Boolean']['input']>;
  deliveryType?: InputMaybe<DeliveryEnum>;
  location: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  packages?: InputMaybe<Scalars['Int']['input']>;
  reciepient?: InputMaybe<Scalars['ID']['input']>;
  signature?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeliveryInstInput = {
  generalDelivery?: InputMaybe<GeneralDeliveryInstInput>;
  recipientDelivery?: InputMaybe<RecipientDeliveryInput>;
};

export type DeliveryInstType = {
  __typename?: 'DeliveryInstType';
  generalDelivery?: Maybe<GeneralDeliveryInstType>;
  recipientDelivery?: Maybe<RecipientDeliveryType>;
};

export type DeliveryList = {
  __typename?: 'DeliveryList';
  count?: Maybe<Scalars['Int']['output']>;
  delivery?: Maybe<Array<Maybe<DeliveryType>>>;
};

export type DeliveryPayload = {
  __typename?: 'DeliveryPayload';
  delivery?: Maybe<DeliveryType>;
  error?: Maybe<ErrorType>;
};

export type DeliveryType = {
  __typename?: 'DeliveryType';
  collected?: Maybe<Scalars['Boolean']['output']>;
  collectedAt?: Maybe<Scalars['DateTime']['output']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  delivered?: Maybe<Scalars['DateTime']['output']>;
  deliveryType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<OfficeLocation>;
  note?: Maybe<Scalars['String']['output']>;
  reciepient?: Maybe<User>;
  signature?: Maybe<Scalars['Boolean']['output']>;
};

export type Department = {
  __typename?: 'Department';
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<OfficeLocation>;
  name?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Array<Maybe<User>>>;
};

export type DepartmentInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['ID']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type DepartmentList = {
  __typename?: 'DepartmentList';
  count?: Maybe<Scalars['Int']['output']>;
  department?: Maybe<Array<Maybe<Department>>>;
};

export type DepartmentPayload = {
  __typename?: 'DepartmentPayload';
  department?: Maybe<Department>;
  error?: Maybe<ErrorType>;
};

export type Device = {
  __typename?: 'Device';
  categoryType?: Maybe<Array<Maybe<VisitorCategory>>>;
  company?: Maybe<Company>;
  department?: Maybe<Array<Maybe<Department>>>;
  deviceId?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  deviceTypes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<OfficeLocation>;
  sessionKey?: Maybe<Scalars['String']['output']>;
  visitorNotifications?: Maybe<VisitorNotifications>;
};

export type DeviceDeliveryInput = {
  collected?: InputMaybe<Scalars['Boolean']['input']>;
  deliveryType?: InputMaybe<DeliveryEnum>;
  location: Scalars['ID']['input'];
  packages?: InputMaybe<Scalars['Int']['input']>;
  reciepient?: InputMaybe<Scalars['ID']['input']>;
  sessionKey?: InputMaybe<Scalars['String']['input']>;
  signature?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeviceInput = {
  categoryType?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  company?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  department: Array<InputMaybe<Scalars['ID']['input']>>;
  deviceName: Scalars['String']['input'];
  deviceTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location?: InputMaybe<Scalars['ID']['input']>;
  visitorNotifications?: InputMaybe<VisitorNotificationsInput>;
};

export type DevicePayload = {
  __typename?: 'DevicePayload';
  device?: Maybe<Device>;
  error?: Maybe<ErrorType>;
  token?: Maybe<Scalars['String']['output']>;
};

export enum DeviceType {
  Mobile = 'Mobile',
  Web = 'Web'
}

export type EmployeePaylaod = {
  __typename?: 'EmployeePaylaod';
  employee?: Maybe<EmployeeTimeline>;
  error?: Maybe<ErrorType>;
};

export type EmployeePocket = {
  __typename?: 'EmployeePocket';
  preRegister?: Maybe<Scalars['Boolean']['output']>;
  signIn?: Maybe<Scalars['Boolean']['output']>;
  verifyEmployee?: Maybe<Scalars['String']['output']>;
};

export type EmployeePocketInput = {
  preRegister?: InputMaybe<Scalars['Boolean']['input']>;
  signIn?: InputMaybe<Scalars['Boolean']['input']>;
  verifyEmployee?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeSettings = {
  __typename?: 'EmployeeSettings';
  generalSetting?: Maybe<GeneralEmployeeSetting>;
  pocket?: Maybe<EmployeePocket>;
  signInQue?: Maybe<Array<Maybe<SignInQueueItem>>>;
  signOutMsg?: Maybe<SignOutMessage>;
};

export type EmployeeSettingsInput = {
  generalSetting?: InputMaybe<GeneralEmployeeSettingInput>;
  pocket?: InputMaybe<EmployeePocketInput>;
  signInQue?: InputMaybe<Array<InputMaybe<SignInQueueItemInput>>>;
  signOutMsg?: InputMaybe<SignOutMessageInput>;
};

export type EmployeeTimeline = {
  __typename?: 'EmployeeTimeline';
  company?: Maybe<Company>;
  employee?: Maybe<User>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<OfficeLocation>;
  returnTime?: Maybe<Scalars['String']['output']>;
  signInQue?: Maybe<Array<Maybe<SignInQue>>>;
  signedIn?: Maybe<Scalars['String']['output']>;
  signedInDevice?: Maybe<Scalars['String']['output']>;
  signedOut?: Maybe<Scalars['String']['output']>;
  signedOutDevice?: Maybe<Scalars['String']['output']>;
  signedType?: Maybe<Scalars['String']['output']>;
  statusMessage?: Maybe<Scalars['String']['output']>;
};

export type EmployeeTimelineDeviceInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  employee?: InputMaybe<Scalars['ID']['input']>;
  returnTime?: InputMaybe<Scalars['String']['input']>;
  signInQue?: InputMaybe<Array<InputMaybe<SignInQueInput>>>;
  signedIn?: InputMaybe<Scalars['String']['input']>;
  signedInDevice?: InputMaybe<DeviceType>;
  signedOut?: InputMaybe<Scalars['String']['input']>;
  signedOutDevice?: InputMaybe<DeviceType>;
  signedType?: InputMaybe<Scalars['String']['input']>;
  statusMessage?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeTimelineInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  returnTime?: InputMaybe<Scalars['String']['input']>;
  signInQue?: InputMaybe<Array<InputMaybe<SignInQueInput>>>;
  signedIn?: InputMaybe<Scalars['String']['input']>;
  signedInDevice?: InputMaybe<DeviceType>;
  signedOut?: InputMaybe<Scalars['String']['input']>;
  signedOutDevice?: InputMaybe<DeviceType>;
  signedType?: InputMaybe<Scalars['String']['input']>;
  statusMessage?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeTimelineList = {
  __typename?: 'EmployeeTimelineList';
  count?: Maybe<Scalars['Int']['output']>;
  employee?: Maybe<Array<Maybe<EmployeeTimeline>>>;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type EvacuationList = {
  __typename?: 'EvacuationList';
  count?: Maybe<Scalars['Int']['output']>;
  list?: Maybe<Array<Maybe<EvacuationPerson>>>;
};

export type EvacuationPerson = {
  __typename?: 'EvacuationPerson';
  anonymize?: Maybe<Scalars['Boolean']['output']>;
  contact?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  img?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  signedIn?: Maybe<Scalars['DateTime']['output']>;
  signedType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Field = {
  __typename?: 'Field';
  clearResponseAfterEachVisit?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Maybe<FieldOption>>>;
  priority?: Maybe<Scalars['Int']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type FieldInput = {
  clearResponseAfterEachVisit?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<InputMaybe<FieldOptionInput>>>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type FieldOption = {
  __typename?: 'FieldOption';
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type FieldOptionInput = {
  label?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type GeneralDeliveryContact = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type GeneralDeliveryContactType = {
  __typename?: 'GeneralDeliveryContactType';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type GeneralDeliveryInput = {
  allowDelivery?: InputMaybe<Scalars['Boolean']['input']>;
  deliveryContact?: InputMaybe<Array<InputMaybe<GeneralDeliveryContact>>>;
  scanDelivery?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GeneralDeliveryInstInput = {
  noSignature?: InputMaybe<Scalars['String']['input']>;
  signatureRquired?: InputMaybe<Scalars['String']['input']>;
};

export type GeneralDeliveryInstType = {
  __typename?: 'GeneralDeliveryInstType';
  noSignature?: Maybe<Scalars['String']['output']>;
  signatureRquired?: Maybe<Scalars['String']['output']>;
};

export type GeneralDeliveryType = {
  __typename?: 'GeneralDeliveryType';
  allowDelivery?: Maybe<Scalars['Boolean']['output']>;
  deliveryContact?: Maybe<Array<Maybe<GeneralDeliveryContactType>>>;
  scanDelivery?: Maybe<Scalars['Boolean']['output']>;
};

export type GeneralEmployeeSetting = {
  __typename?: 'GeneralEmployeeSetting';
  signOutTime?: Maybe<Scalars['String']['output']>;
  updatePicture?: Maybe<Scalars['Boolean']['output']>;
  verifyPhoto?: Maybe<Scalars['Boolean']['output']>;
  workRemotely?: Maybe<Scalars['Boolean']['output']>;
};

export type GeneralEmployeeSettingInput = {
  signOutTime?: InputMaybe<Scalars['String']['input']>;
  updatePicture?: InputMaybe<Scalars['Boolean']['input']>;
  verifyPhoto?: InputMaybe<Scalars['Boolean']['input']>;
  workRemotely?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GoogleChatType = {
  __typename?: 'GoogleChatType';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  webhooks?: Maybe<Array<Maybe<HookType>>>;
};

export type HookType = {
  __typename?: 'HookType';
  name?: Maybe<Scalars['String']['output']>;
  webhookUrl?: Maybe<Scalars['String']['output']>;
};

export type IntegrationType = {
  __typename?: 'IntegrationType';
  googleChat?: Maybe<GoogleChatType>;
  msTeams?: Maybe<MsTeamsType>;
};

export type LocationPaylaod = {
  __typename?: 'LocationPaylaod';
  error?: Maybe<ErrorType>;
  location?: Maybe<OfficeLocation>;
};

export type MsTeamsChannelInput = {
  channelId: Scalars['String']['input'];
  channelName: Scalars['String']['input'];
};

export type MsTeamsChannelType = {
  __typename?: 'MsTeamsChannelType';
  channelId?: Maybe<Scalars['String']['output']>;
  channelName?: Maybe<Scalars['String']['output']>;
};

export type MsTeamsType = {
  __typename?: 'MsTeamsType';
  channels?: Maybe<Array<Maybe<MsTeamsChannelType>>>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  teamId?: Maybe<Scalars['String']['output']>;
  tenantId?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookingSpace?: Maybe<BookingSpacePayload>;
  addLocation?: Maybe<LocationPaylaod>;
  addResources?: Maybe<SpacesResourcePayload>;
  addSpaceCategory?: Maybe<SpacesCategoryPayload>;
  addSpaces?: Maybe<SpacesPaylaod>;
  addTabImg?: Maybe<Scalars['String']['output']>;
  authLogin?: Maybe<UserPaylaod>;
  createAgreement?: Maybe<AgreementType>;
  createBulkUsers?: Maybe<UserList>;
  createCategory?: Maybe<CategoryType>;
  createDelivery?: Maybe<DeliveryPayload>;
  createDepartment?: Maybe<DepartmentPayload>;
  createDevice?: Maybe<DevicePayload>;
  createDeviceDelivery?: Maybe<DeliveryPayload>;
  createEmployeeTimeline?: Maybe<EmployeePaylaod>;
  createPreRegister?: Maybe<PreRegisterPayload>;
  createUser?: Maybe<UserPaylaod>;
  createVisitor?: Maybe<VisitorPaylaod>;
  createdEmployeeTimelineDevice?: Maybe<EmployeePaylaod>;
  deleteAgreement?: Maybe<Scalars['String']['output']>;
  deleteBookingSpace?: Maybe<BookingSpacePayload>;
  deleteCategory?: Maybe<Scalars['String']['output']>;
  deleteDelivery?: Maybe<Scalars['String']['output']>;
  deleteDepartment?: Maybe<Scalars['String']['output']>;
  deleteDevice?: Maybe<DevicePayload>;
  deleteEmployee?: Maybe<UserPaylaod>;
  deleteField?: Maybe<Scalars['String']['output']>;
  deleteLocation?: Maybe<LocationPaylaod>;
  deletePreRegister?: Maybe<PreRegisterPayload>;
  deviceLogin?: Maybe<DevicePayload>;
  employeeLogin?: Maybe<UserPaylaod>;
  generateResetOtp?: Maybe<UserPaylaod>;
  removeIntegration?: Maybe<IntegrationType>;
  removeMsTeamsIntegration?: Maybe<IntegrationType>;
  reorderCategories?: Maybe<Scalars['String']['output']>;
  reorderFields?: Maybe<Scalars['String']['output']>;
  resetPassword?: Maybe<UserPaylaod>;
  restoreEmployee?: Maybe<UserPaylaod>;
  saveMsTeamsChannel?: Maybe<IntegrationType>;
  signup?: Maybe<UserPaylaod>;
  updateBookingSpace?: Maybe<BookingSpacePayload>;
  updateCategory?: Maybe<CategoryType>;
  updateCompany?: Maybe<Scalars['String']['output']>;
  updateCompanyImgs?: Maybe<Scalars['String']['output']>;
  updateDelivery?: Maybe<DeliveryPayload>;
  updateDevice?: Maybe<DevicePayload>;
  updateField?: Maybe<Scalars['String']['output']>;
  updateResource?: Maybe<SpacesResourcePayload>;
  updateSpace?: Maybe<SpacesPaylaod>;
  updateSpaceCategory?: Maybe<SpacesCategoryPayload>;
  updateUser?: Maybe<UserPaylaod>;
  updateVisitor?: Maybe<VisitorPaylaod>;
  updateVisitorStatus?: Maybe<VisitorPaylaod>;
  verifyEmployee?: Maybe<UserPaylaod>;
  verifyOtp?: Maybe<UserPaylaod>;
};


export type MutationAddBookingSpaceArgs = {
  input?: InputMaybe<BookingSpaceInput>;
};


export type MutationAddLocationArgs = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  copyFromLocationId?: InputMaybe<Scalars['ID']['input']>;
  customHeading?: InputMaybe<Scalars['String']['input']>;
  lat?: InputMaybe<Scalars['String']['input']>;
  lng?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAddResourcesArgs = {
  input?: InputMaybe<SpacesResourceInput>;
};


export type MutationAddSpaceCategoryArgs = {
  input?: InputMaybe<SpacesCategoryInputType>;
};


export type MutationAddSpacesArgs = {
  input?: InputMaybe<SpacesInputType>;
};


export type MutationAddTabImgArgs = {
  locationId: Scalars['ID']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAuthLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateAgreementArgs = {
  content: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  requireSignature?: InputMaybe<Scalars['Boolean']['input']>;
  signatureType?: InputMaybe<SignatureTypeEnum>;
  title: Scalars['String']['input'];
};


export type MutationCreateBulkUsersArgs = {
  input?: InputMaybe<Array<InputMaybe<UserInput>>>;
};


export type MutationCreateCategoryArgs = {
  input?: InputMaybe<CategoryInput>;
};


export type MutationCreateDeliveryArgs = {
  input?: InputMaybe<DeliveryInput>;
};


export type MutationCreateDepartmentArgs = {
  input?: InputMaybe<DepartmentInput>;
};


export type MutationCreateDeviceArgs = {
  input?: InputMaybe<DeviceInput>;
};


export type MutationCreateDeviceDeliveryArgs = {
  input?: InputMaybe<DeviceDeliveryInput>;
};


export type MutationCreateEmployeeTimelineArgs = {
  input?: InputMaybe<EmployeeTimelineInput>;
};


export type MutationCreatePreRegisterArgs = {
  input?: InputMaybe<PreRegisterInput>;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<UserInput>;
};


export type MutationCreateVisitorArgs = {
  input?: InputMaybe<VisitorInput>;
};


export type MutationCreatedEmployeeTimelineDeviceArgs = {
  input?: InputMaybe<EmployeeTimelineDeviceInput>;
};


export type MutationDeleteAgreementArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteBookingSpaceArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteCategoryArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteDeliveryArgs = {
  _id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteDepartmentArgs = {
  departmentId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteDeviceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEmployeeArgs = {
  employeeId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteFieldArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  fieldId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteLocationArgs = {
  locationId: Scalars['ID']['input'];
};


export type MutationDeletePreRegisterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeviceLoginArgs = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEmployeeLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGenerateResetOtpArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRemoveIntegrationArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  webhookId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationReorderCategoriesArgs = {
  items: Array<InputMaybe<ReorderItemInput>>;
};


export type MutationReorderFieldsArgs = {
  categoryId: Scalars['ID']['input'];
  items: Array<InputMaybe<ReorderItemInput>>;
};


export type MutationResetPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  otp?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRestoreEmployeeArgs = {
  employeeId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSaveMsTeamsChannelArgs = {
  channels: Array<InputMaybe<MsTeamsChannelInput>>;
  teamId: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  input?: InputMaybe<SignUpInputType>;
};


export type MutationUpdateBookingSpaceArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<BookingSpaceInput>;
};


export type MutationUpdateCategoryArgs = {
  input?: InputMaybe<UpdateCategoryInput>;
};


export type MutationUpdateCompanyArgs = {
  input?: InputMaybe<UpdateCompanyInput>;
};


export type MutationUpdateCompanyImgsArgs = {
  imgs?: InputMaybe<Array<InputMaybe<TabImgInput>>>;
  locationId: Scalars['ID']['input'];
};


export type MutationUpdateDeliveryArgs = {
  input?: InputMaybe<UpdateDeliveryInput>;
};


export type MutationUpdateDeviceArgs = {
  input?: InputMaybe<UpdateDeviceInput>;
};


export type MutationUpdateFieldArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  clearResponseAfterEachVisit?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  fieldId?: InputMaybe<Scalars['ID']['input']>;
  options?: InputMaybe<Array<InputMaybe<FieldOptionInput>>>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateResourceArgs = {
  _id: Scalars['ID']['input'];
  input?: InputMaybe<SpacesResourceInput>;
};


export type MutationUpdateSpaceArgs = {
  _id: Scalars['ID']['input'];
  input?: InputMaybe<SpacesInputType>;
};


export type MutationUpdateSpaceCategoryArgs = {
  _id: Scalars['ID']['input'];
  input?: InputMaybe<SpacesCategoryInputType>;
};


export type MutationUpdateUserArgs = {
  input?: InputMaybe<UpdateUserInput>;
};


export type MutationUpdateVisitorArgs = {
  input?: InputMaybe<UpdateVisitorInput>;
};


export type MutationUpdateVisitorStatusArgs = {
  visitorId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationVerifyEmployeeArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  otp?: InputMaybe<Scalars['String']['input']>;
};


export type MutationVerifyOtpArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  otp?: InputMaybe<Scalars['String']['input']>;
};

export type NotifyIfNotSignedOutInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  hours?: InputMaybe<Scalars['String']['input']>;
};

export type NotifyIfNotSignedOutType = {
  __typename?: 'NotifyIfNotSignedOutType';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  hours?: Maybe<Scalars['String']['output']>;
};

export type OfficeLocation = {
  __typename?: 'OfficeLocation';
  address?: Maybe<Scalars['String']['output']>;
  agreements?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  approvals?: Maybe<ApprovalsType>;
  branding?: Maybe<BrandingType>;
  company?: Maybe<Company>;
  contactLess?: Maybe<ContactLess>;
  customHeading?: Maybe<Scalars['String']['output']>;
  deliveries?: Maybe<DeliveriesType>;
  devices?: Maybe<Array<Maybe<Device>>>;
  employees?: Maybe<EmployeeSettings>;
  id?: Maybe<Scalars['ID']['output']>;
  lat?: Maybe<Scalars['String']['output']>;
  lng?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  returningVisitors?: Maybe<ReturningVisitorsType>;
  savedImgs?: Maybe<Array<Maybe<SavedImgsType>>>;
  selectHost?: Maybe<SelectHostType>;
  selectedAgreement?: Maybe<SelectedAgreement>;
  signInNotifications?: Maybe<SignInNotificationsType>;
  signOutSettings?: Maybe<SignOutSettingsType>;
  visitorButton?: Maybe<VisitorButton>;
  visitorPhoto?: Maybe<Scalars['Boolean']['output']>;
  welcomeScreen?: Maybe<WelcomeScreen>;
};

export type PreRegisterInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['ID']['input'];
  data?: InputMaybe<Scalars['JSON']['input']>;
  department?: InputMaybe<Scalars['ID']['input']>;
  employee?: InputMaybe<Scalars['ID']['input']>;
  endDate: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
  startTime?: InputMaybe<Scalars['String']['input']>;
  visitorEmail?: InputMaybe<Scalars['String']['input']>;
};

export type PreRegisterList = {
  __typename?: 'PreRegisterList';
  count?: Maybe<Scalars['Int']['output']>;
  visitors?: Maybe<Array<Maybe<PreRegisterType>>>;
};

export type PreRegisterPayload = {
  __typename?: 'PreRegisterPayload';
  error?: Maybe<ErrorType>;
  visitor?: Maybe<PreRegisterType>;
};

export type PreRegisterType = {
  __typename?: 'PreRegisterType';
  address?: Maybe<Scalars['String']['output']>;
  category?: Maybe<VisitorCategory>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['JSON']['output']>;
  department?: Maybe<Department>;
  employees?: Maybe<Array<Maybe<User>>>;
  endDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  visitorEmail?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  deviceMe?: Maybe<DevicePayload>;
  getAgreement?: Maybe<AgreementType>;
  getAgreements?: Maybe<Array<Maybe<AgreementType>>>;
  getArchivedEmployees?: Maybe<UserList>;
  getAvailableResources?: Maybe<Array<Maybe<ResourceSchedule>>>;
  getAvailableSpaces?: Maybe<Array<Maybe<SpaceSchedule>>>;
  getBookingSpaces?: Maybe<Array<Maybe<BookingSpaceType>>>;
  getCategories?: Maybe<Array<Maybe<VisitorCategory>>>;
  getCompanyDetails?: Maybe<Company>;
  getDeliveries?: Maybe<DeliveryList>;
  getDepartments?: Maybe<DepartmentList>;
  getDeviceDeliveries?: Maybe<Array<Maybe<DeliveryType>>>;
  getDeviceDepartments?: Maybe<DepartmentList>;
  getDeviceUsers?: Maybe<UserList>;
  getDeviceVisiotr?: Maybe<VisitorList>;
  getDevices?: Maybe<Array<Maybe<Device>>>;
  getEmployeeTimeline?: Maybe<EmployeeTimelineList>;
  getEmployeesTimeline?: Maybe<EmployeeTimelineList>;
  getEvacuationList?: Maybe<EvacuationList>;
  getField?: Maybe<Array<Maybe<Field>>>;
  getIntegrations?: Maybe<IntegrationType>;
  getOfficeLocation?: Maybe<OfficeLocation>;
  getOfficeLocations?: Maybe<Array<Maybe<OfficeLocation>>>;
  getPreVisitors?: Maybe<PreRegisterList>;
  getResourceSchedule?: Maybe<Array<Maybe<ResourceSchedule>>>;
  getSpaceCategories?: Maybe<Array<Maybe<SpacesCategoryType>>>;
  getSpaceResource?: Maybe<Array<Maybe<SpacesResourceType>>>;
  getSpaceSchedule?: Maybe<Array<Maybe<SpaceSchedule>>>;
  getSpaces?: Maybe<Array<Maybe<SpacesType>>>;
  getUsers?: Maybe<UserList>;
  getVistors?: Maybe<VisitorList>;
  me?: Maybe<User>;
};


export type QueryDeviceMeArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAgreementArgs = {
  agreementId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAgreementsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetArchivedEmployeesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAvailableResourcesArgs = {
  end: Scalars['String']['input'];
  location: Scalars['ID']['input'];
  resourceCategory?: InputMaybe<Scalars['ID']['input']>;
  start: Scalars['String']['input'];
};


export type QueryGetAvailableSpacesArgs = {
  end: Scalars['String']['input'];
  location: Scalars['ID']['input'];
  resource?: InputMaybe<Scalars['ID']['input']>;
  start: Scalars['String']['input'];
};


export type QueryGetBookingSpacesArgs = {
  employee?: InputMaybe<Scalars['ID']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  resource?: InputMaybe<Scalars['ID']['input']>;
  space?: InputMaybe<Scalars['ID']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCategoriesArgs = {
  location: Scalars['ID']['input'];
};


export type QueryGetDeliveriesArgs = {
  collected?: InputMaybe<Scalars['Boolean']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sorted?: InputMaybe<SortedInput>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDepartmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDeviceDeliveriesArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDeviceDepartmentsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDeviceUsersArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDeviceVisiotrArgs = {
  company?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  remembered?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  signedType?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDevicesArgs = {
  location: Scalars['ID']['input'];
};


export type QueryGetEmployeeTimelineArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEmployeesTimelineArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  signedType?: InputMaybe<Scalars['String']['input']>;
  sorted?: InputMaybe<SortedInput>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEvacuationListArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  signedType?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetFieldArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOfficeLocationArgs = {
  locationId: Scalars['ID']['input'];
};


export type QueryGetPreVisitorsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  company: Scalars['ID']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sorted?: InputMaybe<SortedInput>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetResourceScheduleArgs = {
  endDate: Scalars['String']['input'];
  location: Scalars['ID']['input'];
  resourceCategory?: InputMaybe<Scalars['ID']['input']>;
  space?: InputMaybe<Scalars['ID']['input']>;
  startDate: Scalars['String']['input'];
};


export type QueryGetSpaceCategoriesArgs = {
  location: Scalars['ID']['input'];
};


export type QueryGetSpaceResourceArgs = {
  features?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location: Scalars['ID']['input'];
  resourceCategory?: InputMaybe<Scalars['ID']['input']>;
  space?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetSpaceScheduleArgs = {
  endDate: Scalars['String']['input'];
  location: Scalars['ID']['input'];
  minCapacity?: InputMaybe<Scalars['Int']['input']>;
  resourceIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  space?: InputMaybe<Scalars['ID']['input']>;
  startDate: Scalars['String']['input'];
};


export type QueryGetSpacesArgs = {
  location: Scalars['ID']['input'];
  resourceCategory?: InputMaybe<Scalars['ID']['input']>;
  space?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<RoleEnum>;
  search?: InputMaybe<Scalars['String']['input']>;
  sorted?: InputMaybe<SortedInput>;
};


export type QueryGetVistorsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  remembered?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  signedType?: InputMaybe<Scalars['String']['input']>;
  sorted?: InputMaybe<SortedInput>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type RecipientDeliveryInput = {
  noSignature?: InputMaybe<Scalars['String']['input']>;
  recipientOut?: InputMaybe<Scalars['String']['input']>;
  signatureRquired?: InputMaybe<Scalars['String']['input']>;
};

export type RecipientDeliveryType = {
  __typename?: 'RecipientDeliveryType';
  noSignature?: Maybe<Scalars['String']['output']>;
  recipientOut?: Maybe<Scalars['String']['output']>;
  signatureRquired?: Maybe<Scalars['String']['output']>;
};

export type ReorderItemInput = {
  id: Scalars['ID']['input'];
  priority: Scalars['Int']['input'];
};

export type ResourceSchedule = {
  __typename?: 'ResourceSchedule';
  _id?: Maybe<Scalars['ID']['output']>;
  available?: Maybe<Scalars['Int']['output']>;
  booked?: Maybe<Scalars['Int']['output']>;
  bookings?: Maybe<Array<Maybe<SimpleBookingTime>>>;
  capacity?: Maybe<Scalars['Int']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  resourceName?: Maybe<Scalars['String']['output']>;
  space?: Maybe<SpacesType>;
};

export type ReturningVisitorsInput = {
  displayNameMatches?: InputMaybe<Scalars['Boolean']['input']>;
  saveDetails?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReturningVisitorsType = {
  __typename?: 'ReturningVisitorsType';
  displayNameMatches?: Maybe<Scalars['Boolean']['output']>;
  saveDetails?: Maybe<Scalars['Boolean']['output']>;
};

export enum RoleEnum {
  Admin = 'Admin',
  Employee = 'Employee',
  Manager = 'Manager'
}

export type SavedImgsType = {
  __typename?: 'SavedImgsType';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type SelectHostInput = {
  allowOnStaticQR?: InputMaybe<Scalars['Boolean']['input']>;
  displayHostStatus?: InputMaybe<Scalars['Boolean']['input']>;
  requireVisitors?: InputMaybe<Scalars['Boolean']['input']>;
  showList?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SelectHostType = {
  __typename?: 'SelectHostType';
  allowOnStaticQR?: Maybe<Scalars['Boolean']['output']>;
  displayHostStatus?: Maybe<Scalars['Boolean']['output']>;
  requireVisitors?: Maybe<Scalars['Boolean']['output']>;
  showList?: Maybe<Scalars['Boolean']['output']>;
};

export type SelectedAgreement = {
  __typename?: 'SelectedAgreement';
  agreement?: Maybe<Scalars['String']['output']>;
  signature?: Maybe<Scalars['Boolean']['output']>;
};

export type SendApprovalAlertsInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  recipients?: InputMaybe<Array<InputMaybe<ApprovalRecipientInput>>>;
};

export type SendApprovalAlertsType = {
  __typename?: 'SendApprovalAlertsType';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  recipients?: Maybe<Array<Maybe<ApprovalRecipient>>>;
};

export type SignInNotificationRecipient = {
  __typename?: 'SignInNotificationRecipient';
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type SignInNotificationRecipientInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type SignInNotificationsInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  includeAllVisitorResponses?: InputMaybe<Scalars['Boolean']['input']>;
  recipients?: InputMaybe<Array<InputMaybe<SignInNotificationRecipientInput>>>;
};

export type SignInNotificationsType = {
  __typename?: 'SignInNotificationsType';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  includeAllVisitorResponses?: Maybe<Scalars['Boolean']['output']>;
  recipients?: Maybe<Array<Maybe<SignInNotificationRecipient>>>;
};

export type SignInQue = {
  __typename?: 'SignInQue';
  answer?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SignInQueueItem = {
  __typename?: 'SignInQueueItem';
  _id?: Maybe<Scalars['String']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SignInQueueItemInput = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SignOutMessage = {
  __typename?: 'SignOutMessage';
  msgs?: Maybe<Array<Maybe<MsgType>>>;
  required?: Maybe<Scalars['Boolean']['output']>;
};

export type SignOutMessageInput = {
  msgs?: InputMaybe<Array<InputMaybe<MsgTypeInput>>>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SignOutSettingsInput = {
  autoSignOutTime?: InputMaybe<AutoSignOutTimeInput>;
  notifyIfNotSignedOut?: InputMaybe<NotifyIfNotSignedOutInput>;
  notifyOnSignOut?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SignOutSettingsType = {
  __typename?: 'SignOutSettingsType';
  autoSignOutTime?: Maybe<AutoSignOutTimeType>;
  notifyIfNotSignedOut?: Maybe<NotifyIfNotSignedOutType>;
  notifyOnSignOut?: Maybe<Scalars['Boolean']['output']>;
};

export type SignUpInputType = {
  address?: InputMaybe<AddressInputType>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneCountryCode?: InputMaybe<Scalars['String']['input']>;
  phoneNo: Scalars['String']['input'];
};

export enum SignatureTypeEnum {
  Checkbox = 'CHECKBOX',
  Signature = 'SIGNATURE'
}

export type SimpleBookingTime = {
  __typename?: 'SimpleBookingTime';
  _id?: Maybe<Scalars['ID']['output']>;
  employeeId?: Maybe<Scalars['ID']['output']>;
  employeeName?: Maybe<Scalars['String']['output']>;
  end?: Maybe<Scalars['DateTime']['output']>;
  people?: Maybe<Scalars['Int']['output']>;
  spaceId?: Maybe<Scalars['ID']['output']>;
  spaceName?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export type SortedInput = {
  columnId?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
};

export type SpaceSchedule = {
  __typename?: 'SpaceSchedule';
  _id?: Maybe<Scalars['ID']['output']>;
  availablePeople?: Maybe<Scalars['Int']['output']>;
  bookedPeople?: Maybe<Scalars['Int']['output']>;
  bookings?: Maybe<Array<Maybe<SimpleBookingTime>>>;
  capacity?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  resources?: Maybe<Array<Maybe<SpacesResourceType>>>;
};

export type SpacesCategoryInputType = {
  icon?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SpacesCategoryPayload = {
  __typename?: 'SpacesCategoryPayload';
  category?: Maybe<SpacesCategoryType>;
  error?: Maybe<ErrorType>;
};

export type SpacesCategoryType = {
  __typename?: 'SpacesCategoryType';
  _id?: Maybe<Scalars['ID']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  location?: Maybe<OfficeLocation>;
  name?: Maybe<Scalars['String']['output']>;
  resources?: Maybe<Array<Maybe<SpacesResourceType>>>;
};

export type SpacesInputType = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  resource?: InputMaybe<Scalars['String']['input']>;
  resources?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type SpacesPaylaod = {
  __typename?: 'SpacesPaylaod';
  error?: Maybe<ErrorType>;
  spaces?: Maybe<SpacesType>;
};

export type SpacesResourceInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  employees?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  features?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  icon?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  resourceCategory?: InputMaybe<Scalars['ID']['input']>;
  space?: InputMaybe<Scalars['ID']['input']>;
};

export type SpacesResourcePayload = {
  __typename?: 'SpacesResourcePayload';
  error?: Maybe<ErrorType>;
  resource?: Maybe<SpacesResourceType>;
};

export type SpacesResourceType = {
  __typename?: 'SpacesResourceType';
  _id?: Maybe<Scalars['ID']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  employees?: Maybe<Array<Maybe<User>>>;
  features?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  icon?: Maybe<Scalars['String']['output']>;
  location?: Maybe<OfficeLocation>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  resourceCategory?: Maybe<SpacesCategoryType>;
  space?: Maybe<SpacesType>;
  spaces?: Maybe<Array<Maybe<SpacesType>>>;
};

export type SpacesType = {
  __typename?: 'SpacesType';
  _id?: Maybe<Scalars['ID']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  location?: Maybe<OfficeLocation>;
  name?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Array<Maybe<SpacesResourceType>>>;
};

export type TabImgInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  allowBadgePrint?: InputMaybe<Scalars['Boolean']['input']>;
  approval?: InputMaybe<Scalars['Boolean']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  fields?: InputMaybe<Array<InputMaybe<UpdateFieldInput>>>;
  host?: InputMaybe<Scalars['Boolean']['input']>;
  location: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCompanyInput = {
  approvals?: InputMaybe<ApprovalsInput>;
  branding?: InputMaybe<BrandingTypeInput>;
  contactLess?: InputMaybe<ContactLessInput>;
  customHeading?: InputMaybe<Scalars['String']['input']>;
  deliveries?: InputMaybe<DeliveriesInput>;
  employees?: InputMaybe<EmployeeSettingsInput>;
  locationId: Scalars['ID']['input'];
  returningVisitors?: InputMaybe<ReturningVisitorsInput>;
  selectHost?: InputMaybe<SelectHostInput>;
  selectedAgreement?: InputMaybe<AgreementInput>;
  signInNotifications?: InputMaybe<SignInNotificationsInput>;
  signOutSettings?: InputMaybe<SignOutSettingsInput>;
  visitorButton?: InputMaybe<VisitorButtonInput>;
  visitorPhoto?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeScreen?: InputMaybe<WelcomeScreenInput>;
};

export type UpdateDeliveryInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  collected?: InputMaybe<Scalars['Boolean']['input']>;
  deliveryType?: InputMaybe<DeliveryEnum>;
  location: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  notify?: InputMaybe<Scalars['Boolean']['input']>;
  packages?: InputMaybe<Scalars['Int']['input']>;
  reciepient?: InputMaybe<Scalars['ID']['input']>;
  signature?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateDeviceInput = {
  _id: Scalars['ID']['input'];
  categoryType?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  department?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  deviceName?: InputMaybe<Scalars['String']['input']>;
  deviceTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location?: InputMaybe<Scalars['ID']['input']>;
  visitorNotifications?: InputMaybe<VisitorNotificationsInput>;
};

export type UpdateFieldInput = {
  clearResponseAfterEachVisit?: InputMaybe<Scalars['Boolean']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<InputMaybe<FieldOptionInput>>>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  company?: InputMaybe<Scalars['ID']['input']>;
  department?: InputMaybe<Scalars['ID']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email2?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  img?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  notificationPreference?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  phone?: InputMaybe<Scalars['String']['input']>;
  phone2?: InputMaybe<Scalars['String']['input']>;
  phoneCountryCode?: InputMaybe<Scalars['String']['input']>;
  phoneCountryCode2?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<UpdateUserStatusInput>;
  workingRemote?: InputMaybe<Scalars['String']['input']>;
};

export enum UpdateUserStatusInput {
  In = 'IN',
  Out = 'OUT'
}

export type UpdateVisitorInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  anonymize?: InputMaybe<Scalars['Boolean']['input']>;
  category?: InputMaybe<Scalars['ID']['input']>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  department?: InputMaybe<Scalars['ID']['input']>;
  img?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  preRegistered?: InputMaybe<Scalars['Boolean']['input']>;
  remembered?: InputMaybe<Scalars['Boolean']['input']>;
  signedInDevice?: InputMaybe<Scalars['String']['input']>;
  signedOutDevice?: InputMaybe<Scalars['String']['input']>;
  signedType?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  archivedAt?: Maybe<Scalars['Date']['output']>;
  company?: Maybe<Company>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  department?: Maybe<Department>;
  email?: Maybe<Scalars['String']['output']>;
  email2?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  img?: Maybe<Scalars['String']['output']>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  location?: Maybe<OfficeLocation>;
  needPasswordReset?: Maybe<Scalars['Boolean']['output']>;
  notificationPreference?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  phone?: Maybe<Scalars['String']['output']>;
  phone2?: Maybe<Scalars['String']['output']>;
  phoneCountryCode?: Maybe<Scalars['String']['output']>;
  phoneCountryCode2?: Maybe<Scalars['String']['output']>;
  role?: Maybe<RoleEnum>;
  timeline?: Maybe<EmployeeTimeline>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  workingRemote?: Maybe<Scalars['String']['output']>;
};

export type UserInput = {
  company?: InputMaybe<Scalars['ID']['input']>;
  department?: InputMaybe<Scalars['ID']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email2?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  img?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['ID']['input']>;
  notificationPreference?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  phone2?: InputMaybe<Scalars['String']['input']>;
  phoneCountryCode?: InputMaybe<Scalars['String']['input']>;
  phoneCountryCode2?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<UserStatusInput>;
  workingRemote?: InputMaybe<Scalars['String']['input']>;
};

export type UserList = {
  __typename?: 'UserList';
  count?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<Array<Maybe<User>>>;
};

export type UserPaylaod = {
  __typename?: 'UserPaylaod';
  error?: Maybe<ErrorType>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export enum UserStatusInput {
  In = 'IN',
  Out = 'OUT'
}

export type Visitor = {
  __typename?: 'Visitor';
  anonymize?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<VisitorCategory>;
  data?: Maybe<Scalars['JSON']['output']>;
  department?: Maybe<Department>;
  deviceId?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  employees?: Maybe<Array<Maybe<User>>>;
  id?: Maybe<Scalars['ID']['output']>;
  img?: Maybe<Scalars['String']['output']>;
  isReturning?: Maybe<Scalars['Boolean']['output']>;
  location?: Maybe<OfficeLocation>;
  remembered?: Maybe<Scalars['Boolean']['output']>;
  selectedAgreement?: Maybe<VisitorAgreement>;
  signedIn?: Maybe<Scalars['DateTime']['output']>;
  signedInDevice?: Maybe<Scalars['String']['output']>;
  signedOut?: Maybe<Scalars['DateTime']['output']>;
  signedOutDevice?: Maybe<Scalars['String']['output']>;
  signedType?: Maybe<Scalars['String']['output']>;
};

export type VisitorAgreement = {
  __typename?: 'VisitorAgreement';
  agreement?: Maybe<Scalars['String']['output']>;
  signatureImg?: Maybe<Scalars['String']['output']>;
};

export type VisitorButton = {
  __typename?: 'VisitorButton';
  buttonBg?: Maybe<Scalars['String']['output']>;
  buttonColor?: Maybe<Scalars['String']['output']>;
  buttonRadius?: Maybe<Scalars['String']['output']>;
};

export type VisitorButtonInput = {
  buttonBg?: InputMaybe<Scalars['String']['input']>;
  buttonColor?: InputMaybe<Scalars['String']['input']>;
  buttonRadius?: InputMaybe<Scalars['String']['input']>;
};

export type WelcomeScreen = {
  __typename?: 'WelcomeScreen';
  brandAlign?: Maybe<Scalars['String']['output']>;
  brandEnabled?: Maybe<Scalars['Boolean']['output']>;
  brandFontSize?: Maybe<Scalars['Int']['output']>;
  brandText?: Maybe<Scalars['String']['output']>;
  brandTopDistance?: Maybe<Scalars['Int']['output']>;
  welcomeAlign?: Maybe<Scalars['String']['output']>;
  welcomeEnabled?: Maybe<Scalars['Boolean']['output']>;
  welcomeFontSize?: Maybe<Scalars['Int']['output']>;
  welcomeText?: Maybe<Scalars['String']['output']>;
  welcomeTopDistance?: Maybe<Scalars['Int']['output']>;
};

export type WelcomeScreenInput = {
  brandAlign?: InputMaybe<Scalars['String']['input']>;
  brandEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  brandFontSize?: InputMaybe<Scalars['Int']['input']>;
  brandText?: InputMaybe<Scalars['String']['input']>;
  brandTopDistance?: InputMaybe<Scalars['Int']['input']>;
  welcomeAlign?: InputMaybe<Scalars['String']['input']>;
  welcomeEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeFontSize?: InputMaybe<Scalars['Int']['input']>;
  welcomeText?: InputMaybe<Scalars['String']['input']>;
  welcomeTopDistance?: InputMaybe<Scalars['Int']['input']>;
};

export type VisitorCategory = {
  __typename?: 'VisitorCategory';
  allowBadgePrint?: Maybe<Scalars['Boolean']['output']>;
  approval?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  fields?: Maybe<Array<Maybe<Field>>>;
  host?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
};

export type VisitorInput = {
  category?: InputMaybe<Scalars['ID']['input']>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  department?: InputMaybe<Scalars['ID']['input']>;
  deviceId?: InputMaybe<Scalars['String']['input']>;
  deviceName?: InputMaybe<Scalars['String']['input']>;
  employee?: InputMaybe<Scalars['ID']['input']>;
  img?: InputMaybe<Scalars['String']['input']>;
  isReturning?: InputMaybe<Scalars['Boolean']['input']>;
  location: Scalars['ID']['input'];
  remembered?: InputMaybe<Scalars['Boolean']['input']>;
  selectedAgreement?: InputMaybe<VisitorInputAgreement>;
  signedIn: Scalars['String']['input'];
  signedInDevice?: InputMaybe<DeviceType>;
  signedOutDevice?: InputMaybe<DeviceType>;
  signedType?: InputMaybe<Scalars['String']['input']>;
};

export type VisitorInputAgreement = {
  agreement?: InputMaybe<Scalars['String']['input']>;
  signatureImg?: InputMaybe<Scalars['String']['input']>;
};

export type VisitorList = {
  __typename?: 'VisitorList';
  count?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<ErrorType>;
  visitor?: Maybe<Array<Maybe<Visitor>>>;
};

export type VisitorNotifications = {
  __typename?: 'VisitorNotifications';
  checkIn?: Maybe<Scalars['String']['output']>;
  checkInPending?: Maybe<Scalars['String']['output']>;
  checkOut?: Maybe<Scalars['String']['output']>;
};

export type VisitorNotificationsInput = {
  checkIn?: InputMaybe<Scalars['String']['input']>;
  checkInPending?: InputMaybe<Scalars['String']['input']>;
  checkOut?: InputMaybe<Scalars['String']['input']>;
};

export type VisitorPaylaod = {
  __typename?: 'VisitorPaylaod';
  count?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<ErrorType>;
  visitor?: Maybe<Visitor>;
};

export type MsgType = {
  __typename?: 'msgType';
  _id?: Maybe<Scalars['String']['output']>;
  msg?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
};

export type MsgTypeInput = {
  msg?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SignInQueInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddressInputType: AddressInputType;
  AddressType: ResolverTypeWrapper<AddressType>;
  AgreementInput: AgreementInput;
  AgreementType: ResolverTypeWrapper<AgreementType>;
  ApprovalRecipient: ResolverTypeWrapper<ApprovalRecipient>;
  ApprovalRecipientInput: ApprovalRecipientInput;
  ApprovalsInput: ApprovalsInput;
  ApprovalsType: ResolverTypeWrapper<ApprovalsType>;
  AutoSignOutTimeInput: AutoSignOutTimeInput;
  AutoSignOutTimeType: ResolverTypeWrapper<AutoSignOutTimeType>;
  BookingSpaceInput: BookingSpaceInput;
  BookingSpacePayload: ResolverTypeWrapper<BookingSpacePayload>;
  BookingSpaceType: ResolverTypeWrapper<BookingSpaceType>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BrandingType: ResolverTypeWrapper<BrandingType>;
  BrandingTypeInput: BrandingTypeInput;
  CategoryInput: CategoryInput;
  CategoryType: ResolverTypeWrapper<CategoryType>;
  Company: ResolverTypeWrapper<Company>;
  ContactLess: ResolverTypeWrapper<ContactLess>;
  ContactLessInput: ContactLessInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeliveriesInput: DeliveriesInput;
  DeliveriesType: ResolverTypeWrapper<DeliveriesType>;
  DeliveryEnum: DeliveryEnum;
  DeliveryInput: DeliveryInput;
  DeliveryInstInput: DeliveryInstInput;
  DeliveryInstType: ResolverTypeWrapper<DeliveryInstType>;
  DeliveryList: ResolverTypeWrapper<DeliveryList>;
  DeliveryPayload: ResolverTypeWrapper<DeliveryPayload>;
  DeliveryType: ResolverTypeWrapper<DeliveryType>;
  Department: ResolverTypeWrapper<Department>;
  DepartmentInput: DepartmentInput;
  DepartmentList: ResolverTypeWrapper<DepartmentList>;
  DepartmentPayload: ResolverTypeWrapper<DepartmentPayload>;
  Device: ResolverTypeWrapper<Device>;
  DeviceDeliveryInput: DeviceDeliveryInput;
  DeviceInput: DeviceInput;
  DevicePayload: ResolverTypeWrapper<DevicePayload>;
  DeviceType: DeviceType;
  EmployeePaylaod: ResolverTypeWrapper<EmployeePaylaod>;
  EmployeePocket: ResolverTypeWrapper<EmployeePocket>;
  EmployeePocketInput: EmployeePocketInput;
  EmployeeSettings: ResolverTypeWrapper<EmployeeSettings>;
  EmployeeSettingsInput: EmployeeSettingsInput;
  EmployeeTimeline: ResolverTypeWrapper<EmployeeTimeline>;
  EmployeeTimelineDeviceInput: EmployeeTimelineDeviceInput;
  EmployeeTimelineInput: EmployeeTimelineInput;
  EmployeeTimelineList: ResolverTypeWrapper<EmployeeTimelineList>;
  ErrorType: ResolverTypeWrapper<ErrorType>;
  EvacuationList: ResolverTypeWrapper<EvacuationList>;
  EvacuationPerson: ResolverTypeWrapper<EvacuationPerson>;
  Field: ResolverTypeWrapper<Field>;
  FieldInput: FieldInput;
  FieldOption: ResolverTypeWrapper<FieldOption>;
  FieldOptionInput: FieldOptionInput;
  GeneralDeliveryContact: GeneralDeliveryContact;
  GeneralDeliveryContactType: ResolverTypeWrapper<GeneralDeliveryContactType>;
  GeneralDeliveryInput: GeneralDeliveryInput;
  GeneralDeliveryInstInput: GeneralDeliveryInstInput;
  GeneralDeliveryInstType: ResolverTypeWrapper<GeneralDeliveryInstType>;
  GeneralDeliveryType: ResolverTypeWrapper<GeneralDeliveryType>;
  GeneralEmployeeSetting: ResolverTypeWrapper<GeneralEmployeeSetting>;
  GeneralEmployeeSettingInput: GeneralEmployeeSettingInput;
  GoogleChatType: ResolverTypeWrapper<GoogleChatType>;
  HookType: ResolverTypeWrapper<HookType>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntegrationType: ResolverTypeWrapper<IntegrationType>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LocationPaylaod: ResolverTypeWrapper<LocationPaylaod>;
  MsTeamsChannelInput: MsTeamsChannelInput;
  MsTeamsChannelType: ResolverTypeWrapper<MsTeamsChannelType>;
  MsTeamsType: ResolverTypeWrapper<MsTeamsType>;
  Mutation: ResolverTypeWrapper<{}>;
  NotifyIfNotSignedOutInput: NotifyIfNotSignedOutInput;
  NotifyIfNotSignedOutType: ResolverTypeWrapper<NotifyIfNotSignedOutType>;
  OfficeLocation: ResolverTypeWrapper<OfficeLocation>;
  PreRegisterInput: PreRegisterInput;
  PreRegisterList: ResolverTypeWrapper<PreRegisterList>;
  PreRegisterPayload: ResolverTypeWrapper<PreRegisterPayload>;
  PreRegisterType: ResolverTypeWrapper<PreRegisterType>;
  Query: ResolverTypeWrapper<{}>;
  RecipientDeliveryInput: RecipientDeliveryInput;
  RecipientDeliveryType: ResolverTypeWrapper<RecipientDeliveryType>;
  ReorderItemInput: ReorderItemInput;
  ResourceSchedule: ResolverTypeWrapper<ResourceSchedule>;
  ReturningVisitorsInput: ReturningVisitorsInput;
  ReturningVisitorsType: ResolverTypeWrapper<ReturningVisitorsType>;
  RoleEnum: RoleEnum;
  SavedImgsType: ResolverTypeWrapper<SavedImgsType>;
  SelectHostInput: SelectHostInput;
  SelectHostType: ResolverTypeWrapper<SelectHostType>;
  SelectedAgreement: ResolverTypeWrapper<SelectedAgreement>;
  SendApprovalAlertsInput: SendApprovalAlertsInput;
  SendApprovalAlertsType: ResolverTypeWrapper<SendApprovalAlertsType>;
  SignInNotificationRecipient: ResolverTypeWrapper<SignInNotificationRecipient>;
  SignInNotificationRecipientInput: SignInNotificationRecipientInput;
  SignInNotificationsInput: SignInNotificationsInput;
  SignInNotificationsType: ResolverTypeWrapper<SignInNotificationsType>;
  SignInQue: ResolverTypeWrapper<SignInQue>;
  SignInQueueItem: ResolverTypeWrapper<SignInQueueItem>;
  SignInQueueItemInput: SignInQueueItemInput;
  SignOutMessage: ResolverTypeWrapper<SignOutMessage>;
  SignOutMessageInput: SignOutMessageInput;
  SignOutSettingsInput: SignOutSettingsInput;
  SignOutSettingsType: ResolverTypeWrapper<SignOutSettingsType>;
  SignUpInputType: SignUpInputType;
  SignatureTypeEnum: SignatureTypeEnum;
  SimpleBookingTime: ResolverTypeWrapper<SimpleBookingTime>;
  SortedInput: SortedInput;
  SpaceSchedule: ResolverTypeWrapper<SpaceSchedule>;
  SpacesCategoryInputType: SpacesCategoryInputType;
  SpacesCategoryPayload: ResolverTypeWrapper<SpacesCategoryPayload>;
  SpacesCategoryType: ResolverTypeWrapper<SpacesCategoryType>;
  SpacesInputType: SpacesInputType;
  SpacesPaylaod: ResolverTypeWrapper<SpacesPaylaod>;
  SpacesResourceInput: SpacesResourceInput;
  SpacesResourcePayload: ResolverTypeWrapper<SpacesResourcePayload>;
  SpacesResourceType: ResolverTypeWrapper<SpacesResourceType>;
  SpacesType: ResolverTypeWrapper<SpacesType>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TabImgInput: TabImgInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateDeliveryInput: UpdateDeliveryInput;
  UpdateDeviceInput: UpdateDeviceInput;
  UpdateFieldInput: UpdateFieldInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserStatusInput: UpdateUserStatusInput;
  UpdateVisitorInput: UpdateVisitorInput;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserList: ResolverTypeWrapper<UserList>;
  UserPaylaod: ResolverTypeWrapper<UserPaylaod>;
  UserStatusInput: UserStatusInput;
  Visitor: ResolverTypeWrapper<Visitor>;
  VisitorAgreement: ResolverTypeWrapper<VisitorAgreement>;
  VisitorButton: ResolverTypeWrapper<VisitorButton>;
  VisitorButtonInput: VisitorButtonInput;
  VisitorCategory: ResolverTypeWrapper<VisitorCategory>;
  VisitorInput: VisitorInput;
  VisitorInputAgreement: VisitorInputAgreement;
  VisitorList: ResolverTypeWrapper<VisitorList>;
  VisitorNotifications: ResolverTypeWrapper<VisitorNotifications>;
  VisitorNotificationsInput: VisitorNotificationsInput;
  VisitorPaylaod: ResolverTypeWrapper<VisitorPaylaod>;
  msgType: ResolverTypeWrapper<MsgType>;
  msgTypeInput: MsgTypeInput;
  signInQueInput: SignInQueInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddressInputType: AddressInputType;
  AddressType: AddressType;
  AgreementInput: AgreementInput;
  AgreementType: AgreementType;
  ApprovalRecipient: ApprovalRecipient;
  ApprovalRecipientInput: ApprovalRecipientInput;
  ApprovalsInput: ApprovalsInput;
  ApprovalsType: ApprovalsType;
  AutoSignOutTimeInput: AutoSignOutTimeInput;
  AutoSignOutTimeType: AutoSignOutTimeType;
  BookingSpaceInput: BookingSpaceInput;
  BookingSpacePayload: BookingSpacePayload;
  BookingSpaceType: BookingSpaceType;
  Boolean: Scalars['Boolean']['output'];
  BrandingType: BrandingType;
  BrandingTypeInput: BrandingTypeInput;
  CategoryInput: CategoryInput;
  CategoryType: CategoryType;
  Company: Company;
  ContactLess: ContactLess;
  ContactLessInput: ContactLessInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  DeliveriesInput: DeliveriesInput;
  DeliveriesType: DeliveriesType;
  DeliveryInput: DeliveryInput;
  DeliveryInstInput: DeliveryInstInput;
  DeliveryInstType: DeliveryInstType;
  DeliveryList: DeliveryList;
  DeliveryPayload: DeliveryPayload;
  DeliveryType: DeliveryType;
  Department: Department;
  DepartmentInput: DepartmentInput;
  DepartmentList: DepartmentList;
  DepartmentPayload: DepartmentPayload;
  Device: Device;
  DeviceDeliveryInput: DeviceDeliveryInput;
  DeviceInput: DeviceInput;
  DevicePayload: DevicePayload;
  EmployeePaylaod: EmployeePaylaod;
  EmployeePocket: EmployeePocket;
  EmployeePocketInput: EmployeePocketInput;
  EmployeeSettings: EmployeeSettings;
  EmployeeSettingsInput: EmployeeSettingsInput;
  EmployeeTimeline: EmployeeTimeline;
  EmployeeTimelineDeviceInput: EmployeeTimelineDeviceInput;
  EmployeeTimelineInput: EmployeeTimelineInput;
  EmployeeTimelineList: EmployeeTimelineList;
  ErrorType: ErrorType;
  EvacuationList: EvacuationList;
  EvacuationPerson: EvacuationPerson;
  Field: Field;
  FieldInput: FieldInput;
  FieldOption: FieldOption;
  FieldOptionInput: FieldOptionInput;
  GeneralDeliveryContact: GeneralDeliveryContact;
  GeneralDeliveryContactType: GeneralDeliveryContactType;
  GeneralDeliveryInput: GeneralDeliveryInput;
  GeneralDeliveryInstInput: GeneralDeliveryInstInput;
  GeneralDeliveryInstType: GeneralDeliveryInstType;
  GeneralDeliveryType: GeneralDeliveryType;
  GeneralEmployeeSetting: GeneralEmployeeSetting;
  GeneralEmployeeSettingInput: GeneralEmployeeSettingInput;
  GoogleChatType: GoogleChatType;
  HookType: HookType;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  IntegrationType: IntegrationType;
  JSON: Scalars['JSON']['output'];
  LocationPaylaod: LocationPaylaod;
  MsTeamsChannelInput: MsTeamsChannelInput;
  MsTeamsChannelType: MsTeamsChannelType;
  MsTeamsType: MsTeamsType;
  Mutation: {};
  NotifyIfNotSignedOutInput: NotifyIfNotSignedOutInput;
  NotifyIfNotSignedOutType: NotifyIfNotSignedOutType;
  OfficeLocation: OfficeLocation;
  PreRegisterInput: PreRegisterInput;
  PreRegisterList: PreRegisterList;
  PreRegisterPayload: PreRegisterPayload;
  PreRegisterType: PreRegisterType;
  Query: {};
  RecipientDeliveryInput: RecipientDeliveryInput;
  RecipientDeliveryType: RecipientDeliveryType;
  ReorderItemInput: ReorderItemInput;
  ResourceSchedule: ResourceSchedule;
  ReturningVisitorsInput: ReturningVisitorsInput;
  ReturningVisitorsType: ReturningVisitorsType;
  SavedImgsType: SavedImgsType;
  SelectHostInput: SelectHostInput;
  SelectHostType: SelectHostType;
  SelectedAgreement: SelectedAgreement;
  SendApprovalAlertsInput: SendApprovalAlertsInput;
  SendApprovalAlertsType: SendApprovalAlertsType;
  SignInNotificationRecipient: SignInNotificationRecipient;
  SignInNotificationRecipientInput: SignInNotificationRecipientInput;
  SignInNotificationsInput: SignInNotificationsInput;
  SignInNotificationsType: SignInNotificationsType;
  SignInQue: SignInQue;
  SignInQueueItem: SignInQueueItem;
  SignInQueueItemInput: SignInQueueItemInput;
  SignOutMessage: SignOutMessage;
  SignOutMessageInput: SignOutMessageInput;
  SignOutSettingsInput: SignOutSettingsInput;
  SignOutSettingsType: SignOutSettingsType;
  SignUpInputType: SignUpInputType;
  SimpleBookingTime: SimpleBookingTime;
  SortedInput: SortedInput;
  SpaceSchedule: SpaceSchedule;
  SpacesCategoryInputType: SpacesCategoryInputType;
  SpacesCategoryPayload: SpacesCategoryPayload;
  SpacesCategoryType: SpacesCategoryType;
  SpacesInputType: SpacesInputType;
  SpacesPaylaod: SpacesPaylaod;
  SpacesResourceInput: SpacesResourceInput;
  SpacesResourcePayload: SpacesResourcePayload;
  SpacesResourceType: SpacesResourceType;
  SpacesType: SpacesType;
  String: Scalars['String']['output'];
  TabImgInput: TabImgInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCompanyInput: UpdateCompanyInput;
  UpdateDeliveryInput: UpdateDeliveryInput;
  UpdateDeviceInput: UpdateDeviceInput;
  UpdateFieldInput: UpdateFieldInput;
  UpdateUserInput: UpdateUserInput;
  UpdateVisitorInput: UpdateVisitorInput;
  User: User;
  UserInput: UserInput;
  UserList: UserList;
  UserPaylaod: UserPaylaod;
  Visitor: Visitor;
  VisitorAgreement: VisitorAgreement;
  VisitorButton: VisitorButton;
  VisitorButtonInput: VisitorButtonInput;
  VisitorCategory: VisitorCategory;
  VisitorInput: VisitorInput;
  VisitorInputAgreement: VisitorInputAgreement;
  VisitorList: VisitorList;
  VisitorNotifications: VisitorNotifications;
  VisitorNotificationsInput: VisitorNotificationsInput;
  VisitorPaylaod: VisitorPaylaod;
  msgType: MsgType;
  msgTypeInput: MsgTypeInput;
  signInQueInput: SignInQueInput;
};

export type AddressTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddressType'] = ResolversParentTypes['AddressType']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pincode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AgreementTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AgreementType'] = ResolversParentTypes['AgreementType']> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requireSignature?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signatureType?: Resolver<Maybe<ResolversTypes['SignatureTypeEnum']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApprovalRecipientResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApprovalRecipient'] = ResolversParentTypes['ApprovalRecipient']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApprovalsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApprovalsType'] = ResolversParentTypes['ApprovalsType']> = {
  allowHostsToApprove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  includeAllVisitorResponses?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sendApprovalAlerts?: Resolver<Maybe<ResolversTypes['SendApprovalAlertsType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AutoSignOutTimeTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AutoSignOutTimeType'] = ResolversParentTypes['AutoSignOutTimeType']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  time?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingSpacePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingSpacePayload'] = ResolversParentTypes['BookingSpacePayload']> = {
  booking?: Resolver<Maybe<ResolversTypes['BookingSpaceType']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingSpaceTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingSpaceType'] = ResolversParentTypes['BookingSpaceType']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['SpacesCategoryType']>, ParentType, ContextType>;
  employee?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  people?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<ResolversTypes['SpacesResourceType']>, ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['SpacesType']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BrandingTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BrandingType'] = ResolversParentTypes['BrandingType']> = {
  accentColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  allowScanning?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  badgeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displaysOn?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryType'] = ResolversParentTypes['CategoryType']> = {
  category?: Resolver<Maybe<ResolversTypes['VisitorCategory']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  address?: Resolver<Maybe<ResolversTypes['AddressType']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  location?: Resolver<Maybe<Array<Maybe<ResolversTypes['OfficeLocation']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactLessResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactLess'] = ResolversParentTypes['ContactLess']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  qrCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeliveriesTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveriesType'] = ResolversParentTypes['DeliveriesType']> = {
  deliveryInst?: Resolver<Maybe<ResolversTypes['DeliveryInstType']>, ParentType, ContextType>;
  general?: Resolver<Maybe<ResolversTypes['GeneralDeliveryType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryInstTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryInstType'] = ResolversParentTypes['DeliveryInstType']> = {
  generalDelivery?: Resolver<Maybe<ResolversTypes['GeneralDeliveryInstType']>, ParentType, ContextType>;
  recipientDelivery?: Resolver<Maybe<ResolversTypes['RecipientDeliveryType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryListResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryList'] = ResolversParentTypes['DeliveryList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  delivery?: Resolver<Maybe<Array<Maybe<ResolversTypes['DeliveryType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryPayload'] = ResolversParentTypes['DeliveryPayload']> = {
  delivery?: Resolver<Maybe<ResolversTypes['DeliveryType']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryType'] = ResolversParentTypes['DeliveryType']> = {
  collected?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  collectedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  delivered?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  deliveryType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reciepient?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  signature?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DepartmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Department'] = ResolversParentTypes['Department']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DepartmentListResolvers<ContextType = any, ParentType extends ResolversParentTypes['DepartmentList'] = ResolversParentTypes['DepartmentList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  department?: Resolver<Maybe<Array<Maybe<ResolversTypes['Department']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DepartmentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DepartmentPayload'] = ResolversParentTypes['DepartmentPayload']> = {
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeviceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Device'] = ResolversParentTypes['Device']> = {
  categoryType?: Resolver<Maybe<Array<Maybe<ResolversTypes['VisitorCategory']>>>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  department?: Resolver<Maybe<Array<Maybe<ResolversTypes['Department']>>>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deviceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deviceTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  sessionKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  visitorNotifications?: Resolver<Maybe<ResolversTypes['VisitorNotifications']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DevicePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DevicePayload'] = ResolversParentTypes['DevicePayload']> = {
  device?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeePaylaodResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmployeePaylaod'] = ResolversParentTypes['EmployeePaylaod']> = {
  employee?: Resolver<Maybe<ResolversTypes['EmployeeTimeline']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeePocketResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmployeePocket'] = ResolversParentTypes['EmployeePocket']> = {
  preRegister?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signIn?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  verifyEmployee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeeSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmployeeSettings'] = ResolversParentTypes['EmployeeSettings']> = {
  generalSetting?: Resolver<Maybe<ResolversTypes['GeneralEmployeeSetting']>, ParentType, ContextType>;
  pocket?: Resolver<Maybe<ResolversTypes['EmployeePocket']>, ParentType, ContextType>;
  signInQue?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignInQueueItem']>>>, ParentType, ContextType>;
  signOutMsg?: Resolver<Maybe<ResolversTypes['SignOutMessage']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeeTimelineResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmployeeTimeline'] = ResolversParentTypes['EmployeeTimeline']> = {
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  employee?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  returnTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signInQue?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignInQue']>>>, ParentType, ContextType>;
  signedIn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedInDevice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedOut?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedOutDevice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  statusMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmployeeTimelineListResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmployeeTimelineList'] = ResolversParentTypes['EmployeeTimelineList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  employee?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmployeeTimeline']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorType'] = ResolversParentTypes['ErrorType']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EvacuationListResolvers<ContextType = any, ParentType extends ResolversParentTypes['EvacuationList'] = ResolversParentTypes['EvacuationList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  list?: Resolver<Maybe<Array<Maybe<ResolversTypes['EvacuationPerson']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EvacuationPersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['EvacuationPerson'] = ResolversParentTypes['EvacuationPerson']> = {
  anonymize?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  contact?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  img?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedIn?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  signedType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = {
  clearResponseAfterEachVisit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['FieldOption']>>>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FieldOption'] = ResolversParentTypes['FieldOption']> = {
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeneralDeliveryContactTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeneralDeliveryContactType'] = ResolversParentTypes['GeneralDeliveryContactType']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeneralDeliveryInstTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeneralDeliveryInstType'] = ResolversParentTypes['GeneralDeliveryInstType']> = {
  noSignature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signatureRquired?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeneralDeliveryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeneralDeliveryType'] = ResolversParentTypes['GeneralDeliveryType']> = {
  allowDelivery?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deliveryContact?: Resolver<Maybe<Array<Maybe<ResolversTypes['GeneralDeliveryContactType']>>>, ParentType, ContextType>;
  scanDelivery?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GeneralEmployeeSettingResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeneralEmployeeSetting'] = ResolversParentTypes['GeneralEmployeeSetting']> = {
  signOutTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatePicture?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  verifyPhoto?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  workRemotely?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GoogleChatTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GoogleChatType'] = ResolversParentTypes['GoogleChatType']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  webhooks?: Resolver<Maybe<Array<Maybe<ResolversTypes['HookType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HookTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['HookType'] = ResolversParentTypes['HookType']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  webhookUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntegrationTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntegrationType'] = ResolversParentTypes['IntegrationType']> = {
  googleChat?: Resolver<Maybe<ResolversTypes['GoogleChatType']>, ParentType, ContextType>;
  msTeams?: Resolver<Maybe<ResolversTypes['MsTeamsType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LocationPaylaodResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocationPaylaod'] = ResolversParentTypes['LocationPaylaod']> = {
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MsTeamsChannelTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MsTeamsChannelType'] = ResolversParentTypes['MsTeamsChannelType']> = {
  channelId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  channelName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MsTeamsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MsTeamsType'] = ResolversParentTypes['MsTeamsType']> = {
  channels?: Resolver<Maybe<Array<Maybe<ResolversTypes['MsTeamsChannelType']>>>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tenantId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addBookingSpace?: Resolver<Maybe<ResolversTypes['BookingSpacePayload']>, ParentType, ContextType, Partial<MutationAddBookingSpaceArgs>>;
  addLocation?: Resolver<Maybe<ResolversTypes['LocationPaylaod']>, ParentType, ContextType, Partial<MutationAddLocationArgs>>;
  addResources?: Resolver<Maybe<ResolversTypes['SpacesResourcePayload']>, ParentType, ContextType, Partial<MutationAddResourcesArgs>>;
  addSpaceCategory?: Resolver<Maybe<ResolversTypes['SpacesCategoryPayload']>, ParentType, ContextType, Partial<MutationAddSpaceCategoryArgs>>;
  addSpaces?: Resolver<Maybe<ResolversTypes['SpacesPaylaod']>, ParentType, ContextType, Partial<MutationAddSpacesArgs>>;
  addTabImg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationAddTabImgArgs, 'locationId'>>;
  authLogin?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationAuthLoginArgs>>;
  createAgreement?: Resolver<Maybe<ResolversTypes['AgreementType']>, ParentType, ContextType, RequireFields<MutationCreateAgreementArgs, 'content' | 'title'>>;
  createBulkUsers?: Resolver<Maybe<ResolversTypes['UserList']>, ParentType, ContextType, Partial<MutationCreateBulkUsersArgs>>;
  createCategory?: Resolver<Maybe<ResolversTypes['CategoryType']>, ParentType, ContextType, Partial<MutationCreateCategoryArgs>>;
  createDelivery?: Resolver<Maybe<ResolversTypes['DeliveryPayload']>, ParentType, ContextType, Partial<MutationCreateDeliveryArgs>>;
  createDepartment?: Resolver<Maybe<ResolversTypes['DepartmentPayload']>, ParentType, ContextType, Partial<MutationCreateDepartmentArgs>>;
  createDevice?: Resolver<Maybe<ResolversTypes['DevicePayload']>, ParentType, ContextType, Partial<MutationCreateDeviceArgs>>;
  createDeviceDelivery?: Resolver<Maybe<ResolversTypes['DeliveryPayload']>, ParentType, ContextType, Partial<MutationCreateDeviceDeliveryArgs>>;
  createEmployeeTimeline?: Resolver<Maybe<ResolversTypes['EmployeePaylaod']>, ParentType, ContextType, Partial<MutationCreateEmployeeTimelineArgs>>;
  createPreRegister?: Resolver<Maybe<ResolversTypes['PreRegisterPayload']>, ParentType, ContextType, Partial<MutationCreatePreRegisterArgs>>;
  createUser?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  createVisitor?: Resolver<Maybe<ResolversTypes['VisitorPaylaod']>, ParentType, ContextType, Partial<MutationCreateVisitorArgs>>;
  createdEmployeeTimelineDevice?: Resolver<Maybe<ResolversTypes['EmployeePaylaod']>, ParentType, ContextType, Partial<MutationCreatedEmployeeTimelineDeviceArgs>>;
  deleteAgreement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationDeleteAgreementArgs, 'id'>>;
  deleteBookingSpace?: Resolver<Maybe<ResolversTypes['BookingSpacePayload']>, ParentType, ContextType, Partial<MutationDeleteBookingSpaceArgs>>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationDeleteCategoryArgs>>;
  deleteDelivery?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationDeleteDeliveryArgs>>;
  deleteDepartment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationDeleteDepartmentArgs>>;
  deleteDevice?: Resolver<Maybe<ResolversTypes['DevicePayload']>, ParentType, ContextType, RequireFields<MutationDeleteDeviceArgs, 'id'>>;
  deleteEmployee?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationDeleteEmployeeArgs>>;
  deleteField?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationDeleteFieldArgs>>;
  deleteLocation?: Resolver<Maybe<ResolversTypes['LocationPaylaod']>, ParentType, ContextType, RequireFields<MutationDeleteLocationArgs, 'locationId'>>;
  deletePreRegister?: Resolver<Maybe<ResolversTypes['PreRegisterPayload']>, ParentType, ContextType, RequireFields<MutationDeletePreRegisterArgs, 'id'>>;
  deviceLogin?: Resolver<Maybe<ResolversTypes['DevicePayload']>, ParentType, ContextType, Partial<MutationDeviceLoginArgs>>;
  employeeLogin?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationEmployeeLoginArgs>>;
  generateResetOtp?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationGenerateResetOtpArgs>>;
  removeIntegration?: Resolver<Maybe<ResolversTypes['IntegrationType']>, ParentType, ContextType, Partial<MutationRemoveIntegrationArgs>>;
  removeMsTeamsIntegration?: Resolver<Maybe<ResolversTypes['IntegrationType']>, ParentType, ContextType>;
  reorderCategories?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationReorderCategoriesArgs, 'items'>>;
  reorderFields?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationReorderFieldsArgs, 'categoryId' | 'items'>>;
  resetPassword?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationResetPasswordArgs>>;
  restoreEmployee?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationRestoreEmployeeArgs>>;
  saveMsTeamsChannel?: Resolver<Maybe<ResolversTypes['IntegrationType']>, ParentType, ContextType, RequireFields<MutationSaveMsTeamsChannelArgs, 'channels' | 'teamId'>>;
  signup?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationSignupArgs>>;
  updateBookingSpace?: Resolver<Maybe<ResolversTypes['BookingSpacePayload']>, ParentType, ContextType, Partial<MutationUpdateBookingSpaceArgs>>;
  updateCategory?: Resolver<Maybe<ResolversTypes['CategoryType']>, ParentType, ContextType, Partial<MutationUpdateCategoryArgs>>;
  updateCompany?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationUpdateCompanyArgs>>;
  updateCompanyImgs?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationUpdateCompanyImgsArgs, 'locationId'>>;
  updateDelivery?: Resolver<Maybe<ResolversTypes['DeliveryPayload']>, ParentType, ContextType, Partial<MutationUpdateDeliveryArgs>>;
  updateDevice?: Resolver<Maybe<ResolversTypes['DevicePayload']>, ParentType, ContextType, Partial<MutationUpdateDeviceArgs>>;
  updateField?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationUpdateFieldArgs>>;
  updateResource?: Resolver<Maybe<ResolversTypes['SpacesResourcePayload']>, ParentType, ContextType, RequireFields<MutationUpdateResourceArgs, '_id'>>;
  updateSpace?: Resolver<Maybe<ResolversTypes['SpacesPaylaod']>, ParentType, ContextType, RequireFields<MutationUpdateSpaceArgs, '_id'>>;
  updateSpaceCategory?: Resolver<Maybe<ResolversTypes['SpacesCategoryPayload']>, ParentType, ContextType, RequireFields<MutationUpdateSpaceCategoryArgs, '_id'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
  updateVisitor?: Resolver<Maybe<ResolversTypes['VisitorPaylaod']>, ParentType, ContextType, Partial<MutationUpdateVisitorArgs>>;
  updateVisitorStatus?: Resolver<Maybe<ResolversTypes['VisitorPaylaod']>, ParentType, ContextType, Partial<MutationUpdateVisitorStatusArgs>>;
  verifyEmployee?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationVerifyEmployeeArgs>>;
  verifyOtp?: Resolver<Maybe<ResolversTypes['UserPaylaod']>, ParentType, ContextType, Partial<MutationVerifyOtpArgs>>;
};

export type NotifyIfNotSignedOutTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotifyIfNotSignedOutType'] = ResolversParentTypes['NotifyIfNotSignedOutType']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hours?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OfficeLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['OfficeLocation'] = ResolversParentTypes['OfficeLocation']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  agreements?: Resolver<Maybe<Array<Maybe<ResolversTypes['ID']>>>, ParentType, ContextType>;
  approvals?: Resolver<Maybe<ResolversTypes['ApprovalsType']>, ParentType, ContextType>;
  branding?: Resolver<Maybe<ResolversTypes['BrandingType']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  contactLess?: Resolver<Maybe<ResolversTypes['ContactLess']>, ParentType, ContextType>;
  customHeading?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveries?: Resolver<Maybe<ResolversTypes['DeliveriesType']>, ParentType, ContextType>;
  devices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Device']>>>, ParentType, ContextType>;
  employees?: Resolver<Maybe<ResolversTypes['EmployeeSettings']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  returningVisitors?: Resolver<Maybe<ResolversTypes['ReturningVisitorsType']>, ParentType, ContextType>;
  savedImgs?: Resolver<Maybe<Array<Maybe<ResolversTypes['SavedImgsType']>>>, ParentType, ContextType>;
  selectHost?: Resolver<Maybe<ResolversTypes['SelectHostType']>, ParentType, ContextType>;
  selectedAgreement?: Resolver<Maybe<ResolversTypes['SelectedAgreement']>, ParentType, ContextType>;
  signInNotifications?: Resolver<Maybe<ResolversTypes['SignInNotificationsType']>, ParentType, ContextType>;
  signOutSettings?: Resolver<Maybe<ResolversTypes['SignOutSettingsType']>, ParentType, ContextType>;
  visitorButton?: Resolver<Maybe<ResolversTypes['VisitorButton']>, ParentType, ContextType>;
  visitorPhoto?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PreRegisterListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PreRegisterList'] = ResolversParentTypes['PreRegisterList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  visitors?: Resolver<Maybe<Array<Maybe<ResolversTypes['PreRegisterType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PreRegisterPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['PreRegisterPayload'] = ResolversParentTypes['PreRegisterPayload']> = {
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  visitor?: Resolver<Maybe<ResolversTypes['PreRegisterType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PreRegisterTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PreRegisterType'] = ResolversParentTypes['PreRegisterType']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['VisitorCategory']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  employees?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  visitorEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  deviceMe?: Resolver<Maybe<ResolversTypes['DevicePayload']>, ParentType, ContextType, Partial<QueryDeviceMeArgs>>;
  getAgreement?: Resolver<Maybe<ResolversTypes['AgreementType']>, ParentType, ContextType, Partial<QueryGetAgreementArgs>>;
  getAgreements?: Resolver<Maybe<Array<Maybe<ResolversTypes['AgreementType']>>>, ParentType, ContextType, Partial<QueryGetAgreementsArgs>>;
  getArchivedEmployees?: Resolver<Maybe<ResolversTypes['UserList']>, ParentType, ContextType, Partial<QueryGetArchivedEmployeesArgs>>;
  getAvailableResources?: Resolver<Maybe<Array<Maybe<ResolversTypes['ResourceSchedule']>>>, ParentType, ContextType, RequireFields<QueryGetAvailableResourcesArgs, 'end' | 'location' | 'start'>>;
  getAvailableSpaces?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpaceSchedule']>>>, ParentType, ContextType, RequireFields<QueryGetAvailableSpacesArgs, 'end' | 'location' | 'start'>>;
  getBookingSpaces?: Resolver<Maybe<Array<Maybe<ResolversTypes['BookingSpaceType']>>>, ParentType, ContextType, Partial<QueryGetBookingSpacesArgs>>;
  getCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['VisitorCategory']>>>, ParentType, ContextType, RequireFields<QueryGetCategoriesArgs, 'location'>>;
  getCompanyDetails?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  getDeliveries?: Resolver<Maybe<ResolversTypes['DeliveryList']>, ParentType, ContextType, Partial<QueryGetDeliveriesArgs>>;
  getDepartments?: Resolver<Maybe<ResolversTypes['DepartmentList']>, ParentType, ContextType, Partial<QueryGetDepartmentsArgs>>;
  getDeviceDeliveries?: Resolver<Maybe<Array<Maybe<ResolversTypes['DeliveryType']>>>, ParentType, ContextType, Partial<QueryGetDeviceDeliveriesArgs>>;
  getDeviceDepartments?: Resolver<Maybe<ResolversTypes['DepartmentList']>, ParentType, ContextType, Partial<QueryGetDeviceDepartmentsArgs>>;
  getDeviceUsers?: Resolver<Maybe<ResolversTypes['UserList']>, ParentType, ContextType, Partial<QueryGetDeviceUsersArgs>>;
  getDeviceVisiotr?: Resolver<Maybe<ResolversTypes['VisitorList']>, ParentType, ContextType, Partial<QueryGetDeviceVisiotrArgs>>;
  getDevices?: Resolver<Maybe<Array<Maybe<ResolversTypes['Device']>>>, ParentType, ContextType, RequireFields<QueryGetDevicesArgs, 'location'>>;
  getEmployeeTimeline?: Resolver<Maybe<ResolversTypes['EmployeeTimelineList']>, ParentType, ContextType, Partial<QueryGetEmployeeTimelineArgs>>;
  getEmployeesTimeline?: Resolver<Maybe<ResolversTypes['EmployeeTimelineList']>, ParentType, ContextType, Partial<QueryGetEmployeesTimelineArgs>>;
  getEvacuationList?: Resolver<Maybe<ResolversTypes['EvacuationList']>, ParentType, ContextType, Partial<QueryGetEvacuationListArgs>>;
  getField?: Resolver<Maybe<Array<Maybe<ResolversTypes['Field']>>>, ParentType, ContextType, Partial<QueryGetFieldArgs>>;
  getIntegrations?: Resolver<Maybe<ResolversTypes['IntegrationType']>, ParentType, ContextType>;
  getOfficeLocation?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType, RequireFields<QueryGetOfficeLocationArgs, 'locationId'>>;
  getOfficeLocations?: Resolver<Maybe<Array<Maybe<ResolversTypes['OfficeLocation']>>>, ParentType, ContextType>;
  getPreVisitors?: Resolver<Maybe<ResolversTypes['PreRegisterList']>, ParentType, ContextType, RequireFields<QueryGetPreVisitorsArgs, 'company'>>;
  getResourceSchedule?: Resolver<Maybe<Array<Maybe<ResolversTypes['ResourceSchedule']>>>, ParentType, ContextType, RequireFields<QueryGetResourceScheduleArgs, 'endDate' | 'location' | 'startDate'>>;
  getSpaceCategories?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesCategoryType']>>>, ParentType, ContextType, RequireFields<QueryGetSpaceCategoriesArgs, 'location'>>;
  getSpaceResource?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesResourceType']>>>, ParentType, ContextType, RequireFields<QueryGetSpaceResourceArgs, 'location'>>;
  getSpaceSchedule?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpaceSchedule']>>>, ParentType, ContextType, RequireFields<QueryGetSpaceScheduleArgs, 'endDate' | 'location' | 'startDate'>>;
  getSpaces?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesType']>>>, ParentType, ContextType, RequireFields<QueryGetSpacesArgs, 'location'>>;
  getUsers?: Resolver<Maybe<ResolversTypes['UserList']>, ParentType, ContextType, Partial<QueryGetUsersArgs>>;
  getVistors?: Resolver<Maybe<ResolversTypes['VisitorList']>, ParentType, ContextType, Partial<QueryGetVistorsArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RecipientDeliveryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipientDeliveryType'] = ResolversParentTypes['RecipientDeliveryType']> = {
  noSignature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recipientOut?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signatureRquired?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResourceScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResourceSchedule'] = ResolversParentTypes['ResourceSchedule']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  available?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  booked?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bookings?: Resolver<Maybe<Array<Maybe<ResolversTypes['SimpleBookingTime']>>>, ParentType, ContextType>;
  capacity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  categoryName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resourceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['SpacesType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReturningVisitorsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReturningVisitorsType'] = ResolversParentTypes['ReturningVisitorsType']> = {
  displayNameMatches?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  saveDetails?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SavedImgsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SavedImgsType'] = ResolversParentTypes['SavedImgsType']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SelectHostTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SelectHostType'] = ResolversParentTypes['SelectHostType']> = {
  allowOnStaticQR?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  displayHostStatus?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requireVisitors?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showList?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SelectedAgreementResolvers<ContextType = any, ParentType extends ResolversParentTypes['SelectedAgreement'] = ResolversParentTypes['SelectedAgreement']> = {
  agreement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signature?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendApprovalAlertsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendApprovalAlertsType'] = ResolversParentTypes['SendApprovalAlertsType']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  recipients?: Resolver<Maybe<Array<Maybe<ResolversTypes['ApprovalRecipient']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignInNotificationRecipientResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignInNotificationRecipient'] = ResolversParentTypes['SignInNotificationRecipient']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignInNotificationsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignInNotificationsType'] = ResolversParentTypes['SignInNotificationsType']> = {
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  includeAllVisitorResponses?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  recipients?: Resolver<Maybe<Array<Maybe<ResolversTypes['SignInNotificationRecipient']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignInQueResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignInQue'] = ResolversParentTypes['SignInQue']> = {
  answer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignInQueueItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignInQueueItem'] = ResolversParentTypes['SignInQueueItem']> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  disabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignOutMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignOutMessage'] = ResolversParentTypes['SignOutMessage']> = {
  msgs?: Resolver<Maybe<Array<Maybe<ResolversTypes['msgType']>>>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SignOutSettingsTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SignOutSettingsType'] = ResolversParentTypes['SignOutSettingsType']> = {
  autoSignOutTime?: Resolver<Maybe<ResolversTypes['AutoSignOutTimeType']>, ParentType, ContextType>;
  notifyIfNotSignedOut?: Resolver<Maybe<ResolversTypes['NotifyIfNotSignedOutType']>, ParentType, ContextType>;
  notifyOnSignOut?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SimpleBookingTimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SimpleBookingTime'] = ResolversParentTypes['SimpleBookingTime']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  employeeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  employeeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  people?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  spaceId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  spaceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpaceScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpaceSchedule'] = ResolversParentTypes['SpaceSchedule']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  availablePeople?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bookedPeople?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bookings?: Resolver<Maybe<Array<Maybe<ResolversTypes['SimpleBookingTime']>>>, ParentType, ContextType>;
  capacity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resources?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesResourceType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacesCategoryPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpacesCategoryPayload'] = ResolversParentTypes['SpacesCategoryPayload']> = {
  category?: Resolver<Maybe<ResolversTypes['SpacesCategoryType']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacesCategoryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpacesCategoryType'] = ResolversParentTypes['SpacesCategoryType']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resources?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesResourceType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacesPaylaodResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpacesPaylaod'] = ResolversParentTypes['SpacesPaylaod']> = {
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  spaces?: Resolver<Maybe<ResolversTypes['SpacesType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacesResourcePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpacesResourcePayload'] = ResolversParentTypes['SpacesResourcePayload']> = {
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<ResolversTypes['SpacesResourceType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacesResourceTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpacesResourceType'] = ResolversParentTypes['SpacesResourceType']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  capacity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  employees?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  features?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resourceCategory?: Resolver<Maybe<ResolversTypes['SpacesCategoryType']>, ParentType, ContextType>;
  space?: Resolver<Maybe<ResolversTypes['SpacesType']>, ParentType, ContextType>;
  spaces?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SpacesTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['SpacesType'] = ResolversParentTypes['SpacesType']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  capacity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resource?: Resolver<Maybe<Array<Maybe<ResolversTypes['SpacesResourceType']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  archivedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  img?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isArchived?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  needPasswordReset?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notificationPreference?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneCountryCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneCountryCode2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['RoleEnum']>, ParentType, ContextType>;
  timeline?: Resolver<Maybe<ResolversTypes['EmployeeTimeline']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  workingRemote?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserListResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserList'] = ResolversParentTypes['UserList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  user?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPaylaodResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPaylaod'] = ResolversParentTypes['UserPaylaod']> = {
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Visitor'] = ResolversParentTypes['Visitor']> = {
  anonymize?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['VisitorCategory']>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deviceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  employees?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  img?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isReturning?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['OfficeLocation']>, ParentType, ContextType>;
  remembered?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  selectedAgreement?: Resolver<Maybe<ResolversTypes['VisitorAgreement']>, ParentType, ContextType>;
  signedIn?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  signedInDevice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedOut?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  signedOutDevice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signedType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorAgreementResolvers<ContextType = any, ParentType extends ResolversParentTypes['VisitorAgreement'] = ResolversParentTypes['VisitorAgreement']> = {
  agreement?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  signatureImg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorButtonResolvers<ContextType = any, ParentType extends ResolversParentTypes['VisitorButton'] = ResolversParentTypes['VisitorButton']> = {
  buttonBg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  buttonColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  buttonRadius?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['VisitorCategory'] = ResolversParentTypes['VisitorCategory']> = {
  allowBadgePrint?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  approval?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  enabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  fields?: Resolver<Maybe<Array<Maybe<ResolversTypes['Field']>>>, ParentType, ContextType>;
  host?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorListResolvers<ContextType = any, ParentType extends ResolversParentTypes['VisitorList'] = ResolversParentTypes['VisitorList']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  visitor?: Resolver<Maybe<Array<Maybe<ResolversTypes['Visitor']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorNotificationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['VisitorNotifications'] = ResolversParentTypes['VisitorNotifications']> = {
  checkIn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  checkInPending?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  checkOut?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VisitorPaylaodResolvers<ContextType = any, ParentType extends ResolversParentTypes['VisitorPaylaod'] = ResolversParentTypes['VisitorPaylaod']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['ErrorType']>, ParentType, ContextType>;
  visitor?: Resolver<Maybe<ResolversTypes['Visitor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MsgTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['msgType'] = ResolversParentTypes['msgType']> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  msg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AddressType?: AddressTypeResolvers<ContextType>;
  AgreementType?: AgreementTypeResolvers<ContextType>;
  ApprovalRecipient?: ApprovalRecipientResolvers<ContextType>;
  ApprovalsType?: ApprovalsTypeResolvers<ContextType>;
  AutoSignOutTimeType?: AutoSignOutTimeTypeResolvers<ContextType>;
  BookingSpacePayload?: BookingSpacePayloadResolvers<ContextType>;
  BookingSpaceType?: BookingSpaceTypeResolvers<ContextType>;
  BrandingType?: BrandingTypeResolvers<ContextType>;
  CategoryType?: CategoryTypeResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  ContactLess?: ContactLessResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DeliveriesType?: DeliveriesTypeResolvers<ContextType>;
  DeliveryInstType?: DeliveryInstTypeResolvers<ContextType>;
  DeliveryList?: DeliveryListResolvers<ContextType>;
  DeliveryPayload?: DeliveryPayloadResolvers<ContextType>;
  DeliveryType?: DeliveryTypeResolvers<ContextType>;
  Department?: DepartmentResolvers<ContextType>;
  DepartmentList?: DepartmentListResolvers<ContextType>;
  DepartmentPayload?: DepartmentPayloadResolvers<ContextType>;
  Device?: DeviceResolvers<ContextType>;
  DevicePayload?: DevicePayloadResolvers<ContextType>;
  EmployeePaylaod?: EmployeePaylaodResolvers<ContextType>;
  EmployeePocket?: EmployeePocketResolvers<ContextType>;
  EmployeeSettings?: EmployeeSettingsResolvers<ContextType>;
  EmployeeTimeline?: EmployeeTimelineResolvers<ContextType>;
  EmployeeTimelineList?: EmployeeTimelineListResolvers<ContextType>;
  ErrorType?: ErrorTypeResolvers<ContextType>;
  EvacuationList?: EvacuationListResolvers<ContextType>;
  EvacuationPerson?: EvacuationPersonResolvers<ContextType>;
  Field?: FieldResolvers<ContextType>;
  FieldOption?: FieldOptionResolvers<ContextType>;
  GeneralDeliveryContactType?: GeneralDeliveryContactTypeResolvers<ContextType>;
  GeneralDeliveryInstType?: GeneralDeliveryInstTypeResolvers<ContextType>;
  GeneralDeliveryType?: GeneralDeliveryTypeResolvers<ContextType>;
  GeneralEmployeeSetting?: GeneralEmployeeSettingResolvers<ContextType>;
  GoogleChatType?: GoogleChatTypeResolvers<ContextType>;
  HookType?: HookTypeResolvers<ContextType>;
  IntegrationType?: IntegrationTypeResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LocationPaylaod?: LocationPaylaodResolvers<ContextType>;
  MsTeamsChannelType?: MsTeamsChannelTypeResolvers<ContextType>;
  MsTeamsType?: MsTeamsTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NotifyIfNotSignedOutType?: NotifyIfNotSignedOutTypeResolvers<ContextType>;
  OfficeLocation?: OfficeLocationResolvers<ContextType>;
  PreRegisterList?: PreRegisterListResolvers<ContextType>;
  PreRegisterPayload?: PreRegisterPayloadResolvers<ContextType>;
  PreRegisterType?: PreRegisterTypeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RecipientDeliveryType?: RecipientDeliveryTypeResolvers<ContextType>;
  ResourceSchedule?: ResourceScheduleResolvers<ContextType>;
  ReturningVisitorsType?: ReturningVisitorsTypeResolvers<ContextType>;
  SavedImgsType?: SavedImgsTypeResolvers<ContextType>;
  SelectHostType?: SelectHostTypeResolvers<ContextType>;
  SelectedAgreement?: SelectedAgreementResolvers<ContextType>;
  SendApprovalAlertsType?: SendApprovalAlertsTypeResolvers<ContextType>;
  SignInNotificationRecipient?: SignInNotificationRecipientResolvers<ContextType>;
  SignInNotificationsType?: SignInNotificationsTypeResolvers<ContextType>;
  SignInQue?: SignInQueResolvers<ContextType>;
  SignInQueueItem?: SignInQueueItemResolvers<ContextType>;
  SignOutMessage?: SignOutMessageResolvers<ContextType>;
  SignOutSettingsType?: SignOutSettingsTypeResolvers<ContextType>;
  SimpleBookingTime?: SimpleBookingTimeResolvers<ContextType>;
  SpaceSchedule?: SpaceScheduleResolvers<ContextType>;
  SpacesCategoryPayload?: SpacesCategoryPayloadResolvers<ContextType>;
  SpacesCategoryType?: SpacesCategoryTypeResolvers<ContextType>;
  SpacesPaylaod?: SpacesPaylaodResolvers<ContextType>;
  SpacesResourcePayload?: SpacesResourcePayloadResolvers<ContextType>;
  SpacesResourceType?: SpacesResourceTypeResolvers<ContextType>;
  SpacesType?: SpacesTypeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserList?: UserListResolvers<ContextType>;
  UserPaylaod?: UserPaylaodResolvers<ContextType>;
  Visitor?: VisitorResolvers<ContextType>;
  VisitorAgreement?: VisitorAgreementResolvers<ContextType>;
  VisitorButton?: VisitorButtonResolvers<ContextType>;
  VisitorCategory?: VisitorCategoryResolvers<ContextType>;
  VisitorList?: VisitorListResolvers<ContextType>;
  VisitorNotifications?: VisitorNotificationsResolvers<ContextType>;
  VisitorPaylaod?: VisitorPaylaodResolvers<ContextType>;
  msgType?: MsgTypeResolvers<ContextType>;
};

