import { model, Schema } from "mongoose";

const BookingSpaceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resource: {
      type: Schema.Types.ObjectId,
      ref: "spaceresource",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "spacecategory",
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations",
      required: true,
    },
    space: {
      type: Schema.Types.ObjectId,
      ref: "spaces",
    },
  },
  { timestamps: true }
);

const BookingSpaceModel = model("bookingspace", BookingSpaceSchema);
export default BookingSpaceModel;
