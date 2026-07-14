import { model, Schema } from "mongoose";
const tabImgs = [
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped1.png",
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped2.png",
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped3.png",
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped4.png",
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped5.png",
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped6.png",
  "https://swiped-bucket.nyc3.cdn.digitaloceanspaces.com/tab/Swiped7.png",
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
    customHeading: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      default: null,
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
