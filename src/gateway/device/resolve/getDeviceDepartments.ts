import DeviceModel from "../../../../database/models/devices";
import DepartmentModel from "../../../../database/models/department";

export default async (_: any, args: { sessionKey: string; search: string }) => {
    try {
        const { sessionKey, search } = args;

        if (!sessionKey) {
            return {
                error: {
                    message: "Unauthorized: No session key provided",
                    code: "UNAUTHORIZED",
                },
            };
        }
        const device = await DeviceModel.findOne({ sessionKey }).lean();

        if (!device) {
            return {
                error: {
                    message: "Unauthorized: Invalid session",
                    code: "UNAUTHORIZED",
                },
            };
        }

        let query: any = {
            company: device.company,
            location: device.location,
            _id: { $in: device.department ?? [] },
        };

        if (!device.department?.length) {
            return { department: [], count: 0 };
        }

        if (search && search.trim() !== "") {
            query.name = { $regex: search, $options: "i" };
        }

        const departments = await DepartmentModel.find(query)
            .populate("user")
            .populate("location")
            .lean();

        const count = await DepartmentModel.countDocuments(query);

        return {
            department: departments,
            count,
        };
    } catch (error) {
        return {
            error: {
                message: error.message || "Something went wrong",
                code: "SERVER_ERROR",
            },
        };
    }
};
