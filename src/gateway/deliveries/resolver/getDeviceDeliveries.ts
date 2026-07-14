import DeliveryModel from "../../../../database/models/deliveries";
import DeviceModel from "../../../../database/models/devices";

export default async (_, args, ctx) => {
  try {
    const { sessionKey } = args;

    const device = await DeviceModel.findOne({
      sessionKey,
    }).lean();
    // 📦 Fetch deliveries
    const delivery = await DeliveryModel.find({
      company: device.company,
      collected: false,
    })
      .populate("company")
      .populate("reciepient")
      .sort({ createdAt: -1 })

      .lean();

    return delivery;
  } catch (error) {
    return {
      delivery: [],
      count: 0,
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
