import moment from "moment";
import DeliveryModel from "../../../../database/models/deliveries";
import { MutationUpdateDeliveryArgs } from "../../../generated/graphql";
import { sendDeliveryEmail } from "../../../../utils/deliveryEmail";
import { UserModel } from "../../../../database/models/user";
import { dashboardOwnerFilter } from "../../utils/ownerScope";

export default async (args: MutationUpdateDeliveryArgs, ctx: any) => {
  try {
    const { input } = args;
    const { user } = ctx;

    // 🔥 Validate ID properly
    if (!input._id) {
      return {
        error: {
          message: "Id is required",
          code: "INVALID_ID",
        },
      };
    }

    // Remove _id from update payload
    const { _id, ...updateData } = input;

    const delivery = await DeliveryModel.findOneAndUpdate(
      {
        _id,
        ...dashboardOwnerFilter(user),
      },
      { $set: updateData },
      {
        new: true, // return updated doc
        runValidators: true, // ensure schema validation
      },
    );

    if (!delivery) {
      return {
        error: {
          message: "Delivery not found",
          code: "NOT_FOUND",
        },
      };
    }
    if (input.notify) {
      const recipient = await UserModel.findById({ _id: delivery.reciepient });
      await sendDeliveryEmail(
        input.signature ? "signature" : "recipient",
        moment(delivery.createdAt).format("MMM D, h:mm a"),
        recipient.email,
        input.packages,
      );
    }
    return {
      delivery,
      error: null,
    };
  } catch (error: any) {
    console.error("Update delivery error:", error);

    return {
      error: {
        message: error.message || "Internal server error",
        code: "SERVER_ERROR",
      },
    };
  }
};
