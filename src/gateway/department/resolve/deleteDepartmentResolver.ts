import mongoose from "mongoose";
import DepartmentModel from "../../../../database/models/department";
import DeviceModel from "../../../../database/models/devices";
import PreRegisterVisitorModel from "../../../../database/models/preRegisterVisitor";
import { UserModel } from "../../../../database/models/user";
import VisitorModel from "../../../../database/models/visitor";
import { MutationDeleteDepartmentArgs } from "../../../generated/graphql";

export default async (
  args: MutationDeleteDepartmentArgs
): Promise<string> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { departmentId } = args;

    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    /** 1️⃣ FIND DEPARTMENT */
    const department = await DepartmentModel.findById(departmentId).session(
      session
    );

    if (!department) {
      throw new Error("Department not found");
    }

    /** 2️⃣ REMOVE DEPARTMENT FROM DEVICES */
    await DeviceModel.updateMany(
      { company: department.company },
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

    /** 4️⃣ UNSET DEPARTMENT FROM USERS (if User has department field) */
    await UserModel.updateMany(
      { department: departmentId },
      { $set: { department: null } },
      { session }
    );

    /** 5️⃣ DELETE DEPARTMENT */
    await DepartmentModel.findByIdAndDelete(departmentId, { session });

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
