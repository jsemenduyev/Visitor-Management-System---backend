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
  space: {
    type: Schema.Types.ObjectId,
    ref: "spaces",
  },
  capacity: {
    type: Number,
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
