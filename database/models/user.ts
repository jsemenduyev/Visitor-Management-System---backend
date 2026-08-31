import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations",
      default: null,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: {
      type: String,
    },
    phoneCountryCode: {
      type: String,
      default: "us",
      lowercase: true,
      trim: true,
    },
    email2: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    phone2: {
      type: String,
      default: "",
    },
    phoneCountryCode2: {
      type: String,
      default: "us",
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6, // enforce minimum password length
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    status: {
      type: Boolean,
      default: false, // inactive until verified
    },
    otp: { type: String },
    otpExpiry: { type: Number },
    department: {
      type: Schema.Types.ObjectId,
      ref: "departments",
      index: true,
      default: null, // optional field
    },

    notificationPreference: {
      type: [String],
      enum: ["Email", "SMS"],
      default: ["Email"],
    },
    appLogin: {
      type: Boolean,
      default: false,
    },
    messgae: {
      type: String,
    },
    workingRemote: {
      type: String,
      default: "allowed",
      enum: ["allowed", "never"],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    needPasswordReset: {
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
  { timestamps: true }
);

UserSchema.index({ createdBy: 1, email: 1 }, { unique: true, name: "createdBy_1_email_1" });

export const UserModel = mongoose.model("User", UserSchema);
