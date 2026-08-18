/**
 * One-off backfill: assign null createdBy rows to each company's oldest admin.
 *
 * Usage:
 *   npx ts-node --transpile-only scripts/backfillCreatedBy.ts
 *
 * Requires DB_URL in .env (same as the API).
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import DeliveryModel from "../database/models/deliveries";
import PreRegisterVisitorModel from "../database/models/preRegisterVisitor";
import { UserModel } from "../database/models/user";
import VisitorModel from "../database/models/visitor";
import VisitorCategoryModel from "../database/models/visitorCategory";
import DeviceModel from "../database/models/devices";
import { AgreementModel } from "../database/models/agreements";
import OfficeLocationModel from "../database/models/officelocations";
import SpaceModel from "../database/models/spaces";
import SpaceResourceModel from "../database/models/spacesResources";
import SpaceCategoryModel from "../database/models/spaceCategory";
import DepartmentModel from "../database/models/department";

async function backfillCollection(
  label: string,
  model: mongoose.Model<any>,
  companyId: mongoose.Types.ObjectId,
  adminId: mongoose.Types.ObjectId,
  extraFilter: Record<string, any> = {},
) {
  const result = await model.updateMany(
    {
      company: companyId,
      $or: [{ createdBy: null }, { createdBy: { $exists: false } }],
      ...extraFilter,
    },
    { $set: { createdBy: adminId } },
  );
  console.log(
    `  ${label}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
  );
}

async function backfillLocationScopedCollection(
  label: string,
  model: mongoose.Model<any>,
  companyId: mongoose.Types.ObjectId,
  adminId: mongoose.Types.ObjectId,
) {
  const locations = await OfficeLocationModel.find({ company: companyId })
    .select("_id")
    .lean();
  const result = await model.updateMany(
    {
      location: { $in: locations.map((location) => location._id) },
      $or: [{ createdBy: null }, { createdBy: { $exists: false } }],
    },
    { $set: { createdBy: adminId } },
  );
  console.log(
    `  ${label}: matched=${result.matchedCount} modified=${result.modifiedCount}`,
  );
}

async function replaceLegacyDepartmentNameIndex() {
  const indexes = await DepartmentModel.collection.indexes();
  const legacyIndex = indexes.find(
    (index) =>
      index.name === "name_1" &&
      index.unique === true &&
      JSON.stringify(index.key) === JSON.stringify({ name: 1 }),
  );

  if (legacyIndex) {
    await DepartmentModel.collection.dropIndex(legacyIndex.name);
    console.log("Removed legacy global department-name uniqueness index");
  }

  await DepartmentModel.collection.createIndex(
    { company: 1, createdBy: 1, name: 1 },
    { unique: true, name: "company_1_createdBy_1_name_1" },
  );
}

async function replaceLegacyDeviceNameIndex() {
  const indexes = await DeviceModel.collection.indexes();
  const legacyIndex = indexes.find(
    (index) =>
      index.unique === true &&
      JSON.stringify(index.key) === JSON.stringify({ deviceName: 1 }),
  );

  if (legacyIndex) {
    await DeviceModel.collection.dropIndex(legacyIndex.name);
    console.log("Removed legacy global device-name uniqueness index");
  }

  await DeviceModel.collection.createIndex(
    { createdBy: 1, deviceName: 1 },
    { unique: true, name: "createdBy_1_deviceName_1" },
  );
}

async function main() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    throw new Error("DB_URL is required");
  }

  await mongoose.connect(dbUrl);
  console.log("Connected. Finding companies with admins...");

  await replaceLegacyDepartmentNameIndex();

  const admins = await UserModel.find({ role: "admin" })
    .sort({ createdAt: 1 })
    .select("_id company createdAt")
    .lean();

  const oldestAdminByCompany = new Map<string, mongoose.Types.ObjectId>();
  for (const admin of admins) {
    if (!admin.company) continue;
    const key = admin.company.toString();
    if (!oldestAdminByCompany.has(key)) {
      oldestAdminByCompany.set(key, admin._id);
    }
  }

  console.log(`Companies with admins: ${oldestAdminByCompany.size}`);

  for (const [companyId, adminId] of oldestAdminByCompany) {
    console.log(`Company ${companyId} → admin ${adminId}`);
    const companyObjectId = new mongoose.Types.ObjectId(companyId);
    await backfillCollection(
      "visitors",
      VisitorModel,
      companyObjectId,
      adminId,
    );
    await backfillCollection(
      "preregisters",
      PreRegisterVisitorModel,
      companyObjectId,
      adminId,
    );
    await backfillCollection(
      "deliveries",
      DeliveryModel,
      companyObjectId,
      adminId,
    );
    await backfillCollection(
      "users",
      UserModel,
      companyObjectId,
      adminId,
      { role: { $ne: "admin" } },
    );
    await backfillCollection(
      "visitor categories",
      VisitorCategoryModel,
      companyObjectId,
      adminId,
    );
    await backfillCollection(
      "devices",
      DeviceModel,
      companyObjectId,
      adminId,
    );
    await backfillCollection(
      "agreements",
      AgreementModel,
      companyObjectId,
      adminId,
    );
    await backfillCollection(
      "departments",
      DepartmentModel,
      companyObjectId,
      adminId,
    );
    await backfillLocationScopedCollection(
      "spaces",
      SpaceModel,
      companyObjectId,
      adminId,
    );
    await backfillLocationScopedCollection(
      "space resources",
      SpaceResourceModel,
      companyObjectId,
      adminId,
    );
    await backfillLocationScopedCollection(
      "space categories",
      SpaceCategoryModel,
      companyObjectId,
      adminId,
    );
  }

  // Build this only after devices have owners so legacy null ownership does
  // not collapse unrelated device names into one uniqueness scope.
  await replaceLegacyDeviceNameIndex();

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
