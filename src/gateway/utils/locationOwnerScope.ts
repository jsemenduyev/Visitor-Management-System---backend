import OfficeLocationModel from "../../../database/models/officelocations";
import BookingSpaceModel from "../../../database/models/bookingSpace";
import { CompanyModel } from "../../../database/models/company";
import { UserModel } from "../../../database/models/user";

export function dashboardLocationFilter(user: {
  _id: unknown;
  company: unknown;
}) {
  return {
    company: user.company,
    createdBy: user._id,
  };
}

/** Assign unscoped company locations (and their bookings) to the oldest admin. */
export async function ensureLegacyLocationOwners(companyId: unknown) {
  if (!companyId) return;

  const oldestAdmin = await UserModel.findOne({
    company: companyId,
    role: "admin",
  })
    .sort({ createdAt: 1 })
    .select("_id")
    .lean();

  if (!oldestAdmin) return;

  await OfficeLocationModel.updateMany(
    {
      company: companyId,
      $or: [{ createdBy: null }, { createdBy: { $exists: false } }],
    },
    { $set: { createdBy: oldestAdmin._id } },
  );

  const locations = await OfficeLocationModel.find({ company: companyId })
    .select("_id createdBy")
    .lean();

  await Promise.all(
    locations.map((location) =>
      location.createdBy
        ? BookingSpaceModel.updateMany(
            {
              location: location._id,
              $or: [{ createdBy: null }, { createdBy: { $exists: false } }],
            },
            { $set: { createdBy: location.createdBy } },
          )
        : Promise.resolve(),
    ),
  );
}

/** Same default location signup creates, for admins created or promoted later. */
export async function createHeadOfficeForAdmin(params: {
  userId: unknown;
  companyId: unknown;
}) {
  const { userId, companyId } = params;
  if (!userId || !companyId) return null;

  const existing = await OfficeLocationModel.findOne({
    company: companyId,
    createdBy: userId,
  })
    .select("_id")
    .lean();
  if (existing) {
    return existing;
  }

  const location = await OfficeLocationModel.create({
    name: "Head Office",
    company: companyId,
    createdBy: userId,
  });

  await CompanyModel.findByIdAndUpdate(companyId, {
    $addToSet: { location: location._id },
  });

  return location;
}
