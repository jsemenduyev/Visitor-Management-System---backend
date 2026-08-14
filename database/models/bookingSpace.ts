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
    /** Headcount for this booking (used against space.capacity) */
    people: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

const BookingSpaceModel = model("bookingspace", BookingSpaceSchema);
export default BookingSpaceModel;
