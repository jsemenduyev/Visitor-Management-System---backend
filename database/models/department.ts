import { model, Schema } from "mongoose";

const DepartmentSchema = new Schema(
  {
    name: { type: String, unique: true },
    location: {
      type: Schema.Types.ObjectId,
      ref: "officelocations",
      default:null
    }, 
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
    ],
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const DepartmentModel = model("departments", DepartmentSchema);
export default DepartmentModel;
