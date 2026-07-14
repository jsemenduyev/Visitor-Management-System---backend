import { model, Schema } from "mongoose";

const welcomeSchema = new Schema({
  title: {
    type: String,
    default: "Welcome",
  },
  btn1: {
    title: {
      type: String,
      default: "Visitor In",
    },
    bgColor: {
      type: String,
      default: "#464D93",
    },
    color: {
      type: String,
      default: "#fffff",
    },
  },
  btn2: {
    title: {
      type: String,
      default: "Visitor In",
    },
    bgColor: {
      type: String,
      default: "#464D93",
    },
    color: {
      type: String,
      default: "#fffff",
    },
  },
});
const welcomeModel = model("welcome", welcomeSchema);
export default welcomeModel;
