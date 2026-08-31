import mongoose, { Document, Schema, Types } from "mongoose";

interface IFieldOption {
  label?: string;
  value?: string;
}

interface IField {
  name: string;
  label?: string;
  type: "text" | "number" | "email" | "date";
  required?: boolean;
  enabled?: boolean;
  priority?: number;
  clearResponseAfterEachVisit?: boolean;
  options?: IFieldOption[];
}

interface IVisitorCategory extends Document {
  name: string;
  enabled: boolean;
  approval: boolean;
  host: boolean;
  allowBadgePrint: boolean;
  company: any;
  location: any;
  fields: Types.DocumentArray<IField & Document>;
  priority: number;
}

const FieldSchema = new mongoose.Schema<IField>({
  name: { type: String },
  label: { type: String },
  type: {
    type: String,
    enum: [
      "text",
      "phone",
      "email",
      "date",
      "checkbox",
      "radio",
      "multi_choice",
      "file",
    ],
    default: "text",
  },
  required: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  clearResponseAfterEachVisit: { type: Boolean, default: false },
  options: {
    type: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    default: undefined,
  },
});

const VisitorCategorySchema = new mongoose.Schema<IVisitorCategory>(
  {
    name: { type: String, required: true },
    enabled: {
      type: Boolean,
      default: true,
    },
    approval: {
      type: Boolean,
      default: false,
    },
    host: {
      type: Boolean,
      default: true,
    },
    allowBadgePrint: {
      type: Boolean,
      default: false,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations",
      required: true,
    },
    fields: {
      type: [FieldSchema],
      default: [
        {
          label: "Full Name",
          name: "fullName",
          type: "text",
          required: true,
          enabled: true,
          priority: 0,
        },
      ],
    },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IVisitorCategory>(
  "VisitorCategory",
  VisitorCategorySchema,
);
