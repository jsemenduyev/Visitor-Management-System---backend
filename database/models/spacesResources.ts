import { model, Schema } from "mongoose";

export const SpaceResourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  resourceCategory: {
    type: Schema.Types.ObjectId,
    ref: "spacecategory",
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "officelocations",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  space: {
    type: Schema.Types.ObjectId,
    ref: "spaces",
  },
  /** Total bookable units of this resource */
  capacity: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
  },
  photo: {
    type: String,
  },
  notes: {
    type: String,
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const SpaceResourceModel = model("spaceresource", SpaceResourceSchema);
export default SpaceResourceModel;
