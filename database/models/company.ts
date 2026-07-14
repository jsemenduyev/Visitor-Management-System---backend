import mongoose, { Schema } from "mongoose";


const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
  },

  location: [{ type: Schema.Types.ObjectId, ref: "officelocations" }],
 
  msteams: {
    accessToken: {
      type: String,
      select: false, // 🔐 security
    },
    refreshToken: {
      type: String,
      select: false,
    },
    teamId: {
      type: String, // selected team
    },
    channels: [
      {
        channelId: { type: String },
        channelName: { type: String },
      },
    ],
    tenantId: {
      type: String, // useful for multi-tenant Microsoft
    },
    expiresAt: {
      type: Date, // token expiry
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },

  googleChat: {
    webhooks: [
      {
        name: String, // "Visitors", "HR"
        webhookUrl: String,
      },
    ],
    enabled: Boolean,
  },
});

export const CompanyModel = mongoose.model("company", CompanySchema);
