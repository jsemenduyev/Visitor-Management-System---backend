import { model, Schema } from "mongoose";

const EmployeeTimelineSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations"
    },
    firstName: {
      type: String,
    },
    signedIn: {
      type: String,
    }, 
    signedInDevice: {
      type: String, enum: ["Web", "Mobile"],
      default: "Web"

    }, signedOutDevice: {
      type: String, enum: ["Web", "Mobile"],
      default: "Web"

    },
    signedOut: {
      type: String,
    },
    signInQue: [
      {
        label: {
          type: String,
        },
        answer: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
    statusMessage: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    signedType: {
      type: String,
      enum: ["In", "Out", "Remote"],
    },
    returnTime: {
      type: String,
    },
    verifyImg: {
      type: String,
    },
  },
  { timestamps: true }
);
const EmployeeTimelineModel = model("employeetimeline", EmployeeTimelineSchema);
export default EmployeeTimelineModel;
