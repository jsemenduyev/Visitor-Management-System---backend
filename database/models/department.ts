import { model, Schema } from "mongoose";

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true },
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

DepartmentSchema.index({ company: 1, createdBy: 1, name: 1 }, { unique: true });

const DepartmentModel = model("departments", DepartmentSchema);
export default DepartmentModel;
