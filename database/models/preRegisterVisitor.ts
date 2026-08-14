import mongoose, { model, Schema } from "mongoose";

const PreRegisterVisitorSchema = new Schema(
  {
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // allows string, number, date, etc.
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: { type: String, required: true },
    startTime: {
      type: String,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations"
    },
    address: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisitorCategory",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      default: null,
    },
    employees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    ],

    visitorEmail: {
      type: String,
    },
    message: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);
const PreRegisterVisitorModel = model(
  "preregistervisitor",
  PreRegisterVisitorSchema
);
export default PreRegisterVisitorModel;
