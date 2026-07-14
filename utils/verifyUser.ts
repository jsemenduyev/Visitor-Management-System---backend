// routes/verifyUser.ts
import express from "express";
import { UserModel } from "../database/models/user";

const verifyUserRoute = express.Router();

verifyUserRoute.get("/verify-user/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.status = true;
    await user.save();

    return res.send("✅ User has been successfully verified.");
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});

export default verifyUserRoute;
