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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
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

// Device names belong to their creator's namespace. Device login codes remain
// globally generated because deviceLogin only receives a deviceId.
DeviceSchema.index(
  { createdBy: 1, deviceName: 1 },
  { unique: true, name: "createdBy_1_deviceName_1" },
);
DeviceSchema.index({ deviceId: 1, department: 1 }, { unique: true });

const DeviceModel = model("devices", DeviceSchema);
export default DeviceModel;
