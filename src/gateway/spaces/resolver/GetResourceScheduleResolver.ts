import SpaceResourceModel from "../../../../database/models/spacesResources";
import BookingSpaceModel from "../../../../database/models/bookingSpace";

export default async (args: any, ctx: any) => {
  const { location, startDate, endDate, space, resourceCategory } = args;

  const query: any = {};
  if (location) query.location = location;
  if (space) query.space = space;
  if (resourceCategory) query.resourceCategory = resourceCategory;

  const resources = await SpaceResourceModel.find(query)
    .populate("resourceCategory", "name")
    .select("_id name resourceCategory")
    .lean();

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  
  const bookings = await BookingSpaceModel.find({
    location,
    start: { $lte: end },
    end: { $gte: start },
  })
    .select("resource start end")
    .lean();

  const resourceSchedules = resources.map((resource: any) => {
    return {
      _id: resource._id,
      resourceName: resource.name,
      categoryName: resource.resourceCategory ? resource.resourceCategory.name : null,
      bookings: bookings
        .filter((b: any) => {
          if (!b.resource) return false;
          const bookingResourceId = b.resource._id ? b.resource._id.toString() : b.resource.toString();
          const currentResourceId = resource._id.toString();
          return bookingResourceId === currentResourceId;
        })
        .map((b: any) => ({
          start: b.start,
          end: b.end,
        })),
    };
  });

  return resourceSchedules;
};
