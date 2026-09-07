import { model, Schema } from "mongoose";
import dotenv from "dotenv";

// This model can load before index.ts configures dotenv.
dotenv.config();

const tabImageBaseUrl = (
  process.env.ASSET_PUBLIC_BASE_URL ||
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com"
).replace(/\/$/, "");

const tabImgs = [
  `${tabImageBaseUrl}/tab/Swiped1.png`,
  `${tabImageBaseUrl}/tab/Swiped2.png`,
  `${tabImageBaseUrl}/tab/Swiped3.png`,
  `${tabImageBaseUrl}/tab/Swiped4.png`,
  `${tabImageBaseUrl}/tab/Swiped5.png`,
  `${tabImageBaseUrl}/tab/Swiped6.png`,
  `${tabImageBaseUrl}/tab/Swiped7.png`,
];

const OfficeLocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
    customHeading: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    // Per-admin configuration. The top-level location fields are retained as
    // defaults for existing locations and unauthenticated device flows.
    settingsByAdmin: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
      select: false,
    },
    selectedAgreement: {
      agreement: {
        type: Schema.Types.ObjectId,
        ref: "agreement",
      },
      signature: {
        type: Boolean,
        default: true,
      },
    },
    agreements: [
      {
        type: Schema.Types.ObjectId,
        ref: "agreement",
        required: true,
      },
    ],

    visitorPhoto: {
      type: Boolean,
      default: true,
    },

    selectHost: {
      requireVisitors: {
        type: Boolean,
        default: true,
      },
      showList: {
        type: Boolean,
        default: true,
      },
      displayHostStatus: {
        type: Boolean,
        default: false,
      },
      allowOnStaticQR: {
        type: Boolean,
        default: false,
      },
    },

    returningVisitors: {
      saveDetails: {
        type: Boolean,
        default: true,
      },
      displayNameMatches: {
        type: Boolean,
        default: false,
      },
    },
    signOutSettings: {
      notifyIfNotSignedOut: {
        enabled: { type: Boolean, default: false },
        hours: { type: Number, default: 12 },
      },
      notifyOnSignOut: {
        type: Boolean,
        default: false,
      },
      autoSignOutTime: {
        enabled: { type: Boolean, default: false },
        time: { type: String, default: "12:00 AM" },
      },
    },
    approvals: {
      includeAllVisitorResponses: {
        type: Boolean,
        default: false,
      },
      allowHostsToApprove: {
        type: Boolean,
        default: false,
      },
      sendApprovalAlerts: {
        enabled: {
          type: Boolean,
          default: false,
        },
        recipients: [
          {
            phone: { type: String },
            email: { type: String },
          },
        ],
      },
    },
    signInNotifications: {
      enabled: {
        type: Boolean,
        default: false,
      },
      includeAllVisitorResponses: {
        type: Boolean,
        default: false,
      },
      recipients: [
        {
          email: { type: String },
          phone: { type: String },
        },
      ],
    },
    employees: {
      generalSetting: {
        workRemotely: {
          type: Boolean,
          default: false,
        },
        signOutTime: {
          type: String,
        },
        updatePicture: {
          type: Boolean,
          default: false,
        },
        verifyPhoto: {
          type: Boolean,
          default: false,
        },
      },
      pocket: {
        signIn: {
          type: Boolean,
          default: true,
        },
        verifyEmployee: {
          type: String,
          default: "no required",
          enum: ["signing in", "signing out", "both", "no required"],
        },
        preRegister: {
          type: Boolean,
          default: false,
        },
      },
      signInQue: {
        type: [
          {
            label: {
              type: String,
            },
            type: {
              type: String,
            },
            required: {
              type: Boolean,
              default: false,
            },
            disabled: {
              type: Boolean,
              default: false,
            },
            priority: { type: Number, default: 0 },
          },
        ],
      },
      signOutMsg: {
        required: {
          type: Boolean,
          default: false,
        },
        msgs: [
          {
            msg: {
              type: String,
            },
            required: {
              type: Boolean,
              default: true,
            },
          },
        ],
      },
    },
    deliveries: {
      general: {
        scanDelivery: {
          type: Boolean,
          default: false,
        },
        allowDelivery: {
          type: Boolean,
          default: false,
        },
        deliveryContact: [
          {
            name: {
              type: String,
            },
            email: {
              type: String,
            },
            phone: {
              type: String,
            },
          },
        ],
      },
      deliveryInst: {
        recipientDelivery: {
          noSignature: {
            type: String,
            default: "The recipient has been notified",
          },
          signatureRquired: {
            type: String,
            default:
              "Please wait – the recipient will collect the delivery from you shortly",
          },
          recipientOut: {
            type: String,
            default:
              "Please wait – a member of our team will collect the delivery from you shortly",
          },
        },
        generalDelivery: {
          noSignature: {
            type: String,
            default: "Our team has been notified",
          },
          signatureRquired: {
            type: String,
            default:
              "Please wait – a member of our team will collect the delivery from you shortly",
          },
        },
      },
    },
    savedImgs: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          enabled: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: () =>
        tabImgs.map((url) => ({
          url,
          enabled: true,
        })),
    },

    visitorButton: {
      buttonRadius: {
        type: String,
      },
      buttonColor: {
        type: String,
      },
      buttonBg: {
        type: String,
      },
    },
    welcomeScreen: {
      brandText: {
        type: String,
      },
      brandFontSize: {
        type: Number,
      },
      brandTopDistance: {
        type: Number,
      },
      brandAlign: {
        type: String,
        enum: ["left", "center", "right"],
      },
      welcomeText: {
        type: String,
      },
      welcomeFontSize: {
        type: Number,
      },
      welcomeTopDistance: {
        type: Number,
      },
      welcomeAlign: {
        type: String,
        enum: ["left", "center", "right"],
      },
    },
    contactLess: {
      token: {
        type: String,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
      qrCode: {
        type: String,
      },
    },
    branding: {
      logo: {
        type: String,
      },
      displaysOn: {
        type: [String],
      },
      badgeType: {
        type: String,
        enum: ["standard", "photo", "simple"],
        default: "standard",
      },
      allowScanning: {
        type: Boolean,
        dedfault: false,
      },
      accentColor: {
        type: String,
        default: "#099ed1",
      },
    },
  },
  { timestamps: true },
);

const OfficeLocationModel = model("officelocations", OfficeLocationSchema);
export default OfficeLocationModel;
