import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserModel } from "../database/models/user";
import { CompanyModel } from "../database/models/company";
import OfficeLocationModel from "../database/models/officelocations";

dotenv.config();

const seedAdmin = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("DB_URL is missing from environment variables (.env)");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);
    console.log("Connected to DB successfully.");

    // Find or create Company
    let company = await CompanyModel.findOne();
    if (!company) {
      console.log("No company found, creating default company...");
      company = await CompanyModel.create({
        name: "Maximal Security Services",
      });
    }
    console.log(`Using Company ID: ${company._id}`);

    // Find or create Office Location
    let location = await OfficeLocationModel.findOne();
    if (!location) {
      console.log("No office location found, creating default location...");
      location = await OfficeLocationModel.create({
        name: "Main Office",
        company: company._id,
      });
    }
    console.log(`Using Location ID: ${location._id}`);

    const targetEmail = "ujjwal@yopmail.com";
    const plainPassword = "Pass@123";

    console.log(`Hashing password for ${targetEmail}...`);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: targetEmail },
      {
        $set: {
          firstName: "Ujjwal",
          lastName: "Admin",
          email: targetEmail,
          password: hashedPassword,
          role: "admin",
          company: company._id,
          location: location._id,
          status: true,
          notificationPreference: ["Email"],
          appLogin: false,
          workingRemote: "allowed",
          isArchived: false,
          archivedAt: null,
          needPasswordReset: false,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("\n==========================================");
    console.log("✅ Admin user seeded/updated successfully!");
    console.log("==========================================");
    console.log(`ID:        ${updatedUser._id}`);
    console.log(`Email:     ${updatedUser.email}`);
    console.log(`Role:      ${updatedUser.role}`);
    console.log(`Status:    ${updatedUser.status}`);
    console.log(`Company:   ${updatedUser.company}`);
    console.log(`Location:  ${updatedUser.location}`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
