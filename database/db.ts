import mongoose from "mongoose";

const initiateMongoServer = async (): Promise<void> => {
  const MONGO_URL: string = process.env.DB_URL as string;
  try {
    await mongoose.connect(MONGO_URL);
    console.info("Connected to DB");

    try {
      await mongoose.connection.collection("users").dropIndex("email_1");
      console.info("Dropped legacy unique index email_1");
    } catch (indexErr: any) {
      if (indexErr?.code !== 27 && indexErr?.codeName !== "IndexNotFound") {
        console.warn("Could not drop users.email_1:", indexErr?.message || indexErr);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};
export default initiateMongoServer;
