import mongoose from "mongoose";

const initiateMongoServer = async (): Promise<void> => {
  const MONGO_URL: string = process.env.DB_URL as string;
  try {
    await mongoose.connect(MONGO_URL);
    console.info("Connected to DB");
  } catch (err) {
    throw new Error(err);
  }
};
export default initiateMongoServer;
