import { UserModel } from "../../../../database/models/user";
import { QueryGetUsersArgs } from "../../../generated/graphql";
import { dashboardEmployeeFilter } from "../../utils/ownerScope";

export default async (args: QueryGetUsersArgs, ctx) => {
  try {
    const { search, limit = 10, offset = 0, sorted, location, role } = args; // default values
    const { user } = ctx;

    let companyId = user?.company;
    if (!companyId && user?._id) {
      const dbUser = await UserModel.findById(user._id).select("company").lean();
      companyId = dbUser?.company;
    }

    const employeeScope = dashboardEmployeeFilter(user);

    // Build search query — keep ownership $or separate from search $or via $and
    const query: any = {
      company: employeeScope.company,
      isArchived: { $ne: true },
      $and: [{ $or: employeeScope.$or }],
    };

    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5f6d2e'},body:JSON.stringify({sessionId:'5f6d2e',runId:'post-fix',location:'getUsersResolver.ts:query',message:'getUsers query built',data:{requestorId:String(user?._id||''),requestorRole:user?.role,companyId:String(companyId||''),hasCreatedByFilter:true,usesEmployeeScope:true},timestamp:Date.now(),hypothesisId:'H1-fix'})}).catch(()=>{});
    // #endregion

    let sort = {};
    if (search && search.trim() !== "") {
      query.$and.push({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });
    }
    if (location) {
      query.location = location;
    }

    if (role) {
      query.role = role;
    }
    if (sorted) {
      if (sorted?.columnId === "employee") {
        sort["firstName"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "email") {
        sort["email"] = sorted.direction === "asc" ? 1 : -1;
      }
      if (sorted?.columnId === "signedOut") {
        sort["signedOut"] = sorted.direction === "asc" ? 1 : -1;
      }
    }
    const hosts = await UserModel.find(query)
      .populate("company")
      .populate("department")
      .populate("location")
      .skip(offset)
      .limit(limit)
      .sort(sorted?.columnId ? sort : { createdAt: -1 })
      .lean();
    const count = await UserModel.countDocuments(query);

    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5f6d2e'},body:JSON.stringify({sessionId:'5f6d2e',runId:'post-fix',location:'getUsersResolver.ts:result',message:'getUsers result',data:{requestorId:String(user?._id||''),count,returnedIds:hosts.slice(0,10).map((h:any)=>String(h._id)),returnedEmails:hosts.slice(0,10).map((h:any)=>h.email)},timestamp:Date.now(),hypothesisId:'H1-fix'})}).catch(()=>{});
    // #endregion

    return {
      user: hosts,
      count,
    };
  } catch (error: any) {
    console.error("Error fetching hosts:", error);
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
      hosts: null,
    };
  }
};
