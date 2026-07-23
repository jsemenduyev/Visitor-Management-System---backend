import { model, Schema } from "mongoose";

const DeviceSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  department: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "departments",
    },
  ],
  location: {
    type: Schema.Types.ObjectId,
    ref: "officelocations",
  },
  deviceTypes: [
    {
      type: String,
      enum: ["visitor", "employee", "deliveries", "checkIn"],
      required: true,
      default: "visitor",
    },
  ],
  categoryType: [
    { type: Schema.Types.ObjectId, required: true, ref: "VisitorCategory" },
  ],
  sessionKey: {
    type: String,
    unique: true,
    sparse: true,
  },
  visitorNotifications: {
    checkIn: {
      type: String,
      default: "Visitor Signed In Successfully",
    },
    checkOut: {
      type: String,
      default: "Visitor Signed Out Successfully",
    },
    checkInPending: {
      type: String,
      default: "Your Signed In Request is being reviewed",
    },
  },
});

// deviceId + department uniqueness
DeviceSchema.index({ deviceId: 1, department: 1 }, { unique: true });

const DeviceModel = model("devices", DeviceSchema);
export default DeviceModel;
