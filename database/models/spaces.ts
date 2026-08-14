import { model, Schema } from "mongoose";

const SpaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  /** Max people who can occupy this space at once */
  capacity: {
    type: Number,
    required: true,
  },
  resource: {
    type: Schema.Types.ObjectId,
    ref: "spaceresource",
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "officelocations",
  },
});
const SpaceModel = model("spaces", SpaceSchema);
export default SpaceModel;
