import OfficeLocationModel from "../../../../database/models/officelocations";
import { ensureLegacyLocationOwners } from "../../utils/locationOwnerScope";

/**
 * Returns the location if it belongs to the given company (and owner, when provided).
 */
export async function assertLocationBelongsToCompany(
  locationId: string | { toString(): string } | null | undefined,
  companyId: string | { toString(): string } | null | undefined,
  ownerId?: string | { toString(): string } | null,
) {
  if (!locationId || !companyId) return null;

  await ensureLegacyLocationOwners(companyId);

  const query: Record<string, unknown> = {
    _id: locationId,
    company: companyId,
  };
  if (ownerId) {
    query.createdBy = ownerId;
  }

  const loc = await OfficeLocationModel.findOne(query).lean();

  return loc ?? null;
}
