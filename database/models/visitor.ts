import mongoose, { model, Schema } from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitorCategory",
      // required: true,
    },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // allows string, number, date, etc.
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
    },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations",
      required: true,
    },
    signedType: {
      type: String,
      enum: ["In", "Out", "Pending", "Rejected"],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    remembered: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
    },
    signedIn: {
      type: String,
    },
    signedInDevice: {
      type: String,
      enum: ["Web", "Mobile", "QR"],
      default: "Web",
    },
    deviceId: {
      type: String,
    },
    deviceName: {
      type: String,
    },
    signedOut: {
      type: String,
    },
    signedOutDevice: {
      type: String,
      enum: ["Web", "Mobile", "QR"],
      default: "Web",
    },
    note: {
      type: String,
    },
    selectedAgreement: {
      type: {
        agreement: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "agreement",
        },
        signatureImg: {
          type: String,
        },
      },
      default: null, // ✅ allows selectedAgreement to be null
    },
    anonymize: {
      type: Boolean,
      default: false,
    },
    isReturning: {
      type: Boolean,
      default: false,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);
const VisitorModel = model("Visitor", VisitorSchema);
export default VisitorModel;
