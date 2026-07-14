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
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: {
      type: String,
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
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
