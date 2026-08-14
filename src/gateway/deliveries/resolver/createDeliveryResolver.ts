import moment from "moment";
import { CompanyModel } from "../../../../database/models/company";
import DeliveryModel from "../../../../database/models/deliveries";
import { UserModel } from "../../../../database/models/user";
import { sendDeliveryEmail } from "../../../../utils/deliveryEmail";
import { MutationCreateDeliveryArgs } from "../../../generated/graphql";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
import OfficeLocationModel from "../../../../database/models/officelocations";

export default async (args: MutationCreateDeliveryArgs, ctx) => {
  try {
    const { input } = args;
    const { user } = ctx;
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
      company: user.company,
      createdBy: user._id,
    };
    const delivery = await DeliveryModel.create(newInput);
    const company = await OfficeLocationModel.findOne({ company: user.company }).lean();

    if (input.deliveryType === "general") {
      const nominee = company.deliveries.general.deliveryContact;

      if (nominee?.length) {
        nominee.forEach(async (item) => {
          await sendDeliveryEmail(
            input.signature ? "signature" : "general",
            moment(delivery.createdAt).format("MMM D, h:mm a"),
            item.email,
            input.packages,
          );
        });
      }
    }

    if (input.deliveryType === "recipient") {
      await sendDeliveryEmail(
        input.signature ? "signature" : "recipient",
        moment(delivery.createdAt).format("MMM D, h:mm a"),
        userExist.email,
        input.packages,
      );
    }

    return { delivery };
  } catch (error) {
    return {
      error: {
        message: error.message,
        code: "SERVER_ERROR",
      },
    };
  }
};
