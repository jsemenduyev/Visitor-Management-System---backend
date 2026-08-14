import { CompanyModel } from "../../../../database/models/company";
import OfficeLocationModel from "../../../../database/models/officelocations";
import DeviceModel from "../../../../database/models/devices";
import SpaceModel from "../../../../database/models/spaces";
import SpaceCategoryModel from "../../../../database/models/spaceCategory";
import SpaceResourceModel from "../../../../database/models/spacesResources";
import BookingSpaceModel from "../../../../database/models/bookingSpace";
import VisitorCategoryModel from "../../../../database/models/visitorCategory";
import DepartmentModel from "../../../../database/models/department";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import DeliveryModel from "../../../../database/models/deliveries";
import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";

export default async (args: { locationId: string }, ctx: any) => {
  try {
    const { user } = ctx;
    const company = user.company;

    const location = await OfficeLocationModel.findOneAndDelete({
      _id: args.locationId,
      company,
      createdBy: user._id,
    });

    if (!location) {
      return {
        error: {
          message: "Location not found",
          code: "LOCATION_NOT_FOUND",
        },
      };
    }

    await Promise.all([
      DeviceModel.deleteMany({ location: location._id }),
      SpaceModel.deleteMany({ location: location._id }),
      SpaceCategoryModel.deleteMany({ location: location._id }),
      SpaceResourceModel.deleteMany({ location: location._id }),
      BookingSpaceModel.deleteMany({ location: location._id }),
      VisitorCategoryModel.deleteMany({ location: location._id }),
      DepartmentModel.deleteMany({ location: location._id }),
      PreRegisterVisitorModel.deleteMany({ location: location._id }),
      UserModel.updateMany({ location: location._id }, { $set: { location: null } }),
      VisitorModel.updateMany({ location: location._id }, { $set: { location: null } }),
      DeliveryModel.updateMany({ location: location._id }, { $set: { location: null } }),
      EmployeeTimelineModel.updateMany({ location: location._id }, { $set: { location: null } }),
      CompanyModel.findByIdAndUpdate(company, { $pull: { location: location._id } }),
    ]);

    return { location };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Failed to delete location",
        code: "SERVER_ERROR",
      },
    };
  }
};
