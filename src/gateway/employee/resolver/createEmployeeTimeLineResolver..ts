import { CompanyModel } from "../../../../database/models/company";
import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";
import { UserModel } from "../../../../database/models/user";
import { MutationCreateEmployeeTimelineArgs } from "../../../generated/graphql";

export default async (args: MutationCreateEmployeeTimelineArgs, ctx) => {
  try {
    const { input } = args;
    const { user } = ctx; // Auth user from context
    const { _id, company } = user;

    // Check user
    const userExist = await UserModel.findById(_id).lean();
    if (!userExist) {
      return {
        error: {
          message: "User Not Exist",
          code: "NOT_EXIST",
        },
      };
    }

    // Check company
    const companyExist = await CompanyModel.findById(company).lean();
    if (!companyExist) {
      return {
        error: {
          message: "Company Not Exist",
          code: "NOT_EXIST",
        },
      };
    }

    // Create timeline entry
    const newInput = {
      ...input,
      employee: _id,
      company,
      firstName: userExist.firstName,
      location: userExist.location,
    };

    if (input._id) {
      const updateTimeline = await EmployeeTimelineModel.findByIdAndUpdate(
        { _id: input._id },
        newInput
      );

      return {
        employee: updateTimeline,
        error: null,
      };
    } else {
      if (input.signedType === "Out") {
        await EmployeeTimelineModel.updateMany(
          { employee: _id, signedType: { $in: ["In", "Remote"] } },
          { signedType: "Out", signedOut: newInput.signedOut, signedOutDevice: newInput.signedOutDevice }
        );
        const createdTimeline = await EmployeeTimelineModel.create(newInput);

        return {
          employee: createdTimeline,
          error: null,
        };
      } else {
        const createdTimeline = await EmployeeTimelineModel.create(newInput);

        return {
          employee: createdTimeline,
          error: null,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
