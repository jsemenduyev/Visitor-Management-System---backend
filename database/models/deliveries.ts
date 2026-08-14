import { model, Schema } from "mongoose";

const DeliverySchema = new Schema(
  {
    reciepient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ["general", "recipient"],
    },
    delivered: {
      type: String,
    },
    signature: {
      type: Boolean,
      default: false,
    },
    collected: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: Number,
    },
    note: {
      type: String,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations",
    },
  },
  { timestamps: true },
);
const DeliveryModel = model("deliveries", DeliverySchema);
export default DeliveryModel;
