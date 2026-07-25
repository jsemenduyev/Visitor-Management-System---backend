import { CompanyModel } from "../../../../database/models/company";
import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";
import { UserModel } from "../../../../database/models/user";
import { MutationCreatedEmployeeTimelineDeviceArgs } from "../../../generated/graphql";
import { sendTeamsNotification } from "../../../services/sendMessage";

export default async (_, args: MutationCreatedEmployeeTimelineDeviceArgs) => {
  try {
    const { input } = args;
    const user = await UserModel.findById({ _id: input.employee }).lean();
    // Check user
    if (!user) {
      return {
        error: {
          message: "User Not Exist",
          code: "NOT_EXIST",
        },
      };
    }
    const { _id, company } = user;

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
      firstName: user.firstName,
      location: user.location,
    };

    if (input._id) {
      const updateTimeline = await EmployeeTimelineModel.findOneAndUpdate(
        { _id: input._id, company, employee: _id },
        newInput,
        { new: true },
      );
      if (!updateTimeline) {
        return {
          error: {
            message: "Timeline not found",
            code: "NOT_FOUND",
          },
        };
      }
      await sendTeamsNotification(
        company.toString(), // pass companyId
        `🔴 <b>${updateTimeline?.firstName}</b> has <b>signed out</b> at ${new Date().toLocaleTimeString()}`,
      );
      return {
        employee: updateTimeline,
        error: null,
      };
    } else {
      if (input.signedType == "Out") {
        await EmployeeTimelineModel.updateMany(
          {
            employee: input.employee,
            company,
            signedType: { $in: ["In", "Remote"] },
          },
          {
            signedType: "Out",
            signedOut: newInput.signedOut,
            signedOutDevice: "Mobile",
          },
        );

        const createdTimeline = await EmployeeTimelineModel.create(newInput);
        await sendTeamsNotification(
          company.toString(), // pass companyId
          `🔴 <b>${createdTimeline.firstName}</b> has <b>signed out</b> at ${new Date().toLocaleTimeString()}`,
        );

        return {
          employee: createdTimeline,
          error: null,
        };
      } else if (input.signedType == "Remote") {
        await EmployeeTimelineModel.updateMany(
          { employee: input.employee, company, signedType: "In" },
          {
            signedType: "Out",
            signedOut: newInput.signedOut,
            signedOutDevice: "Mobile",
          },
        );
        const createdTimeline = await EmployeeTimelineModel.create(newInput);
        await sendTeamsNotification(
          company.toString(),
          `🟡 <b>${createdTimeline.firstName}</b> is now working <b>remotely</b> as of ${new Date().toLocaleTimeString()}`,
        );

        return {
          employee: createdTimeline,
          error: null,
        };
      } else {
        await EmployeeTimelineModel.updateMany(
          { employee: input.employee, company },
          {
            signedType: "Out",
            signedOut: newInput.signedOut,
            signedOutDevice: "Mobile",
          },
        );
        const createdTimeline = await EmployeeTimelineModel.create(newInput);
        await sendTeamsNotification(
          company.toString(),
          `🟢 <b>${createdTimeline.firstName}</b> has <b>signed in</b> at ${new Date().toLocaleTimeString()}`,
        );

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
