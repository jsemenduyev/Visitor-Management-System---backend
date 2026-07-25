import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";
import VisitorModel from "../../../../database/models/visitor";

export default async (_, args, ctx) => {
  try {
    const { location, search, signedType = "In", limit = 1000, offset = 0 } = args;
    const { user } = ctx;

    const companyId = user.company;

    // Build common filter
    const visitorFilter: any = { company: companyId };
    const employeeFilter: any = { company: companyId };

    if (location) {
      visitorFilter.location = location;
      employeeFilter.location = location;
    }

    if (signedType && signedType !== "All") {
      visitorFilter.signedType = signedType;
      employeeFilter.signedType = signedType;
    }

    if (search && search.trim() !== "") {
      visitorFilter["data.fullName"] = { $regex: search, $options: "i" };
      employeeFilter["$or"] = [{ "employee.firstName": { $regex: search, $options: "i" } }];
    }

    // Fetch visitors
    const visitors = await VisitorModel.find(visitorFilter)
      .populate("category")
      .populate("department")
      .populate("employees")
      .lean();

    // Fetch employees
    const employees = await EmployeeTimelineModel.find(employeeFilter)
      .populate("employee")
      .lean();

    // Map visitors
    const mappedVisitors = visitors.map((v: any) => {
      let contactStr = "-";
      if (v?.employees && v.employees.length > 0) {
        const emp = v.employees[0];
        contactStr = `Visiting ${emp?.firstName || ""} ${emp?.lastName || ""}`.trim();
      } else if (v?.department?.name) {
        contactStr = `Visiting ${v.department.name}`;
      } else if (v?.data?.company) {
        contactStr = `Visiting ${v.data.company}`;
      }

      return {
        _id: v._id,
        name: v?.anonymize ? "Anonymized Visitor" : v?.data?.fullName || v?.firstName || "-",
        contact: contactStr,
        type: v?.category?.name || "Visitor",
        img: v?.img || "",
        signedType: v?.signedType,
        signedIn: v?.signedIn,
        anonymize: v?.anonymize,
      };
    });

    // Map employees
    const mappedEmployees = employees.map((e: any) => {
      return {
        _id: e._id,
        name: `${e?.employee?.firstName || ""} ${e?.employee?.lastName || ""}`.trim() || "-",
        contact: "Employee", // or department if populated
        type: "Employee",
        img: e?.employee?.img || "",
        signedType: e?.signedType,
        signedIn: e?.signedIn,
        anonymize: false,
      };
    });

    // Combine and sort
    let combined = [...mappedVisitors, ...mappedEmployees];
    combined.sort((a, b) => {
      const dateA = a.signedIn ? new Date(a.signedIn).getTime() : 0;
      const dateB = b.signedIn ? new Date(b.signedIn).getTime() : 0;
      return dateB - dateA; // descending
    });

    const count = combined.length;

    // Apply pagination
    const paginated = combined.slice(offset, offset + limit);

    return {
      list: paginated,
      count,
    };
  } catch (error) {
    console.error("Error fetching evacuation list:", error);
    throw new Error("Failed to fetch evacuation list");
  }
};
