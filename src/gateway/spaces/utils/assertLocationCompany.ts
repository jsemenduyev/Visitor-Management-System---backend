import OfficeLocationModel from "../../../../database/models/officelocations";

/**
 * Returns the location if it belongs to the given company, otherwise null.
 */
export async function assertLocationBelongsToCompany(
  locationId: string | { toString(): string } | null | undefined,
  companyId: string | { toString(): string } | null | undefined
) {
  if (!locationId || !companyId) return null;

  const loc = await OfficeLocationModel.findOne({
    _id: locationId,
    company: companyId,
  }).lean();

  return loc ?? null;
}
