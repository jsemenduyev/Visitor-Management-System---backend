import { model, Schema } from "mongoose";

export const SpaceCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "officelocations",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
});

const SpaceCategoryModel = model("spacecategory", SpaceCategorySchema);
export default SpaceCategoryModel;
