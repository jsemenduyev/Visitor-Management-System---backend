import SpaceResourceModel from "../../../../database/models/spacesResources";

/**
 * Sync which resources are linked to a space.
 * A resource may belong to many spaces — assigning here must not remove it from others.
 */
export async function syncSpaceResources(
  spaceId: string,
  resourceIds: string[] | null | undefined,
  location: string
): Promise<{ ok: true } | { ok: false; message: string; code: string }> {
  const ids = Array.isArray(resourceIds)
    ? resourceIds.filter(Boolean).map(String)
    : [];

  if (ids.length > 0) {
    const resources = await SpaceResourceModel.find({
      _id: { $in: ids },
      location,
    }).lean();

    if (resources.length !== ids.length) {
      return {
        ok: false as const,
        message: "One or more resources not found at this location",
        code: "NOT_FOUND",
      };
    }
  }

  // Remove this space from resources no longer selected (keep their other spaces)
  await SpaceResourceModel.updateMany(
    { location, _id: { $nin: ids }, spaces: spaceId },
    { $pull: { spaces: spaceId } }
  );
  await SpaceResourceModel.updateMany(
    { location, _id: { $nin: ids }, space: spaceId },
    { $unset: { space: "" } }
  );

  if (ids.length > 0) {
    await SpaceResourceModel.updateMany(
      { _id: { $in: ids }, location },
      { $addToSet: { spaces: spaceId } }
    );
    // Legacy single-space field: set only when empty so we don't steal primary from another space
    await SpaceResourceModel.updateMany(
      {
        _id: { $in: ids },
        location,
        $or: [{ space: null }, { space: { $exists: false } }],
      },
      { $set: { space: spaceId } }
    );
  }

  return { ok: true as const };
}

/** Mongo filter: resource linked to this space (spaces[] or legacy space). */
export function resourceLinkedToSpaceFilter(spaceId: string) {
  return {
    $or: [{ spaces: spaceId }, { space: spaceId }],
  };
}
