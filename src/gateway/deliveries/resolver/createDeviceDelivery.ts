import moment from "moment";
import { CompanyModel } from "../../../../database/models/company";
import DeliveryModel from "../../../../database/models/deliveries";
import DeviceModel from "../../../../database/models/devices";
import { UserModel } from "../../../../database/models/user";
import { sendDeliveryEmail } from "../../../../utils/deliveryEmail";
import { MutationCreateDeviceDeliveryArgs } from "../../../generated/graphql";
import OfficeLocationModel from "../../../../database/models/officelocations";

export default async (_, args: MutationCreateDeviceDeliveryArgs) => {
  try {
    const { input } = args;

    const device = await DeviceModel.findOne({
      sessionKey: input.sessionKey,
    }).lean();

    if (input.deliveryType === "general") {
      const newInput = {
        ...input,
        company: device.company,
        location: device.location
      };
      const delivery = await DeliveryModel.create(newInput);
      const company = await OfficeLocationModel.findOne({
        company: device.company,
      }).lean();

      const nominee = company.deliveries.general.deliveryContact;

      if (nominee?.length) {
        nominee.forEach((item) => {
          sendDeliveryEmail(
            input.signature ? "signature" : "general",
            moment(delivery.createdAt).format("MMM D, h:mm a"),
            item.email,
            input.packages,
          );
        });
      }

      return {
        delivery,
      };
    } else {
      const userExist = await UserModel.findById(input.reciepient);
      if (!userExist) {
        return {
          error: {
            message: "User not found",
            code: "USER_NOT_FOUND",
          },
        };
      }
      const newInput = {
        ...input,
        company: device.company,
        location: device.location
      };
      const delivery = await DeliveryModel.create(newInput);

      await sendDeliveryEmail(
        input.signature ? "signature" : "recipient",
        moment(delivery.createdAt).format("MMM D, h:mm a"),
        userExist.email,
        input.packages,
      );
      return { delivery };
    }
  } catch (error) {
    return {
      error: {
        message: error.message,
        code: "SERVER_ERROR",
      },
    };
  }
};
