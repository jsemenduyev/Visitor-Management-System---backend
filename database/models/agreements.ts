import { Schema, model, models } from "mongoose";

const AgreementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company", // Make sure your model name matches exactly
      required: true,
    },
    content: {
      type: String, // store Quill HTML or Delta JSON
      required: true,
    },
    requireSignature: {
      type: Boolean,
      default: false,
    },
    signatureType: {
      type: String,
      enum: ["SIGNATURE", "CHECKBOX"],
      default: "SIGNATURE",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const AgreementModel =  model("agreement", AgreementSchema);
