import mongoose from "mongoose";
import DepartmentModel from "../../../../database/models/department";
import DeviceModel from "../../../../database/models/devices";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import { MutationDeleteDepartmentArgs } from "../../../generated/graphql";

export default async (
  args: MutationDeleteDepartmentArgs,
  ctx
): Promise<string> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { departmentId } = args;
    const company = ctx?.user?.company;

    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    if (!company) {
      throw new Error("User does not belong to any company");
    }

    /** 1️⃣ FIND DEPARTMENT (scoped to caller's company) */
    const department = await DepartmentModel.findOne({
      _id: departmentId,
      company,
      createdBy: ctx.user._id,
    }).session(session);

    if (!department) {
      throw new Error("Department not found");
    }

    /** 2️⃣ REMOVE DEPARTMENT FROM DEVICES */
    await DeviceModel.updateMany(
      {
        company: department.company,
        createdBy: ctx.user._id,
      },
      { $pull: { department: departmentId } },
      { session }
    );

    /** 3️⃣ DELETE RELATED VISITORS */
    await PreRegisterVisitorModel.deleteMany(
      {
        company: department.company,
        department: departmentId,
      },
      { session }
    );

    await VisitorModel.deleteMany(
      {
        company: department.company,
        department: departmentId,
      },
      { session }
    );

    /** 4️⃣ UNSET DEPARTMENT FROM USERS (scoped by company) */
    await UserModel.updateMany(
      { department: departmentId, company: department.company },
      { $set: { department: null } },
      { session }
    );

    /** 5️⃣ DELETE DEPARTMENT */
    await DepartmentModel.findOneAndDelete(
      { _id: departmentId, company },
      { session }
    );

    /** ✅ COMMIT */
    await session.commitTransaction();
    session.endSession();

    return "Department deleted successfully";
  } catch (error) {
    /** ❌ ROLLBACK */
    await session.abortTransaction();
    session.endSession();

    console.error("Delete Department Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete department"
    );
  }
};
