import DeliveryModel from "../../../../database/models/deliveries";
import { MutationDeleteDeliveryArgs } from "../../../generated/graphql";

export default async (args: MutationDeleteDeliveryArgs) => {
  try {
    const { _id } = args;

    const delivery = await DeliveryModel.findByIdAndDelete(_id);

    if (!delivery) {
      return {
        error: {
          message: "Delivery not found",
          code: "DELIVERY_NOT_FOUND",
        },
      };
    }

    return "Deleted";
  } catch (error) {
    return {
      error: {
        message: error.message,
        code: "SERVER_ERROR",
      },
    };
  }
};
