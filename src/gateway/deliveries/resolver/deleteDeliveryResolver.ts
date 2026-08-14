import DeliveryModel from "../../../../database/models/deliveries";
import { MutationDeleteDeliveryArgs } from "../../../generated/graphql";
import { dashboardOwnerFilter } from "../../utils/ownerScope";

export default async (args: MutationDeleteDeliveryArgs, ctx: any) => {
  try {
    const { _id } = args;
    const { user } = ctx;

    const delivery = await DeliveryModel.findOneAndDelete({
      _id,
      ...dashboardOwnerFilter(user),
    });

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
