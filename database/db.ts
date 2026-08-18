import mongoose from "mongoose";

const dropLegacyIndex = async (collectionName: string, indexName: string) => {
  try {
    await mongoose.connection.collection(collectionName).dropIndex(indexName);
    console.info(`Dropped legacy unique index ${collectionName}.${indexName}`);
  } catch (indexErr: any) {
    if (indexErr?.code !== 27 && indexErr?.codeName !== "IndexNotFound") {
      console.warn(
        `Could not drop ${collectionName}.${indexName}:`,
        indexErr?.message || indexErr,
      );
    }
  }
};

const initiateMongoServer = async (): Promise<void> => {
  const MONGO_URL: string = process.env.DB_URL as string;
  try {
    await mongoose.connect(MONGO_URL);
    console.info("Connected to DB");

    await dropLegacyIndex("users", "email_1");
    await dropLegacyIndex("departments", "name_1");
  } catch (err) {
    throw new Error(err);
  }
};
export default initiateMongoServer;
