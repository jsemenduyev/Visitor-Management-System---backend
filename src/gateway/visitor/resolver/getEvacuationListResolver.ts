import EmployeeTimelineModel from "../../../../database/models/employeeTimeline";
import VisitorModel from "../../../../database/models/visitor";

const getDataObject = (data: any): Record<string, any> => {
  if (!data) return {};
  if (data instanceof Map) return Object.fromEntries(data.entries());
  if (typeof data === "object") return data;
  return {};
};

const getDataField = (data: any, ...keys: string[]) => {
  const obj = getDataObject(data);
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
};

const getVisitorFullName = (visitor: any) =>
  getDataField(visitor?.data, "fullName", "FullName", "name");

const getVisitorContactDetails = (visitor: any) => {
  const lines: string[] = [];

  if (visitor?.employees && visitor.employees.length > 0) {
    const host = visitor.employees[0];
    const hostName = `${host?.firstName || ""} ${host?.lastName || ""}`.trim();
    if (hostName) lines.push(`Visiting ${hostName}`);
    if (host?.phone) lines.push(`Host: ${host.phone}`);
  } else if (visitor?.department?.name) {
    lines.push(`Visiting ${visitor.department.name}`);
  }

  const data = visitor?.data;
  const address = getDataField(
    data,
    "address",
    "Address",
    "street",
    "Street",
    "streetAddress",
  );
  const phone = getDataField(
    data,
    "phoneNumber",
    "phone",
    "Phone",
    "mobile",
    "Mobile",
  );
  const email = getDataField(
    data,
    "emailAddress",
    "email",
    "Email",
  );

  if (address) lines.push(address);
  if (phone) lines.push(phone);
  if (email) lines.push(email);

  if (lines.length > 0) return lines.join("\n");

  const company = getDataField(data, "company", "companyName", "Company");
  return company || "-";
};

const formatRoleLabel = (role?: string | null) => {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "admin") return "Admin";
  if (normalized === "manager") return "Manager";
  if (normalized === "employee") return "Employee";
  return "Visitor";
};

const getEmployeeContactDetails = (employee: any) => {
  const lines: string[] = [];
  if (employee?.phone) lines.push(employee.phone);
  if (employee?.email) lines.push(employee.email);
  return lines.length > 0 ? lines.join("\n") : "-";
};

const parseSignedInDate = (value?: string | null) => {
  if (!value) return null;
  const asNumber = Number(value);
  const date =
    Number.isFinite(asNumber) && !Number.isNaN(asNumber)
      ? new Date(asNumber)
      : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default async (args, ctx) => {
  try {
    const { location, search, signedType, limit = 1000, offset = 0 } = args;
    const { user } = ctx;

    if (!user?.company) {
      throw new Error("Access Denied. Please login to continue");
    }

    const companyId = user.company;

    const visitorFilter: Record<string, any> = { company: companyId };
    const employeeFilter: Record<string, any> = { company: companyId };

    if (location) {
      visitorFilter.location = location;
      employeeFilter.location = location;
    }

    if (signedType && signedType !== "All") {
      visitorFilter.signedType = signedType;
      employeeFilter.signedType = signedType;
    }

    if (search && search.trim() !== "") {
      visitorFilter["data.fullName"] = { $regex: search.trim(), $options: "i" };
    }

    const visitors = await VisitorModel.find(visitorFilter)
      .populate("category")
      .populate("department")
      .populate("employees")
      .lean();

    let employees = await EmployeeTimelineModel.find(employeeFilter)
      .populate("employee")
      .lean();

    if (search && search.trim() !== "") {
      const term = search.trim().toLowerCase();
      employees = employees.filter((entry: any) => {
        const firstName = entry?.employee?.firstName?.toLowerCase() || "";
        const lastName = entry?.employee?.lastName?.toLowerCase() || "";
        return `${firstName} ${lastName}`.includes(term);
      });
    }

    const mappedVisitors = visitors.map((v: any) => ({
      _id: v._id,
      name: v?.anonymize
        ? "Anonymized Visitor"
        : getVisitorFullName(v) || "-",
      contact: v?.anonymize ? "-" : getVisitorContactDetails(v),
      type: "Visitor",
      img: v?.img || "",
      signedType: v?.signedType,
      signedIn: parseSignedInDate(v?.signedIn),
      anonymize: v?.anonymize,
    }));

    const mappedEmployees = employees.map((e: any) => ({
      _id: e._id,
      name:
        `${e?.employee?.firstName || ""} ${e?.employee?.lastName || ""}`.trim() ||
        "-",
      contact: getEmployeeContactDetails(e?.employee),
      type: formatRoleLabel(e?.employee?.role),
      img: e?.employee?.img || "",
      signedType: e?.signedType,
      signedIn: parseSignedInDate(e?.signedIn),
      anonymize: false,
    }));

    const combined = [...mappedVisitors, ...mappedEmployees].sort((a, b) => {
      const dateA = a.signedIn ? new Date(a.signedIn).getTime() : 0;
      const dateB = b.signedIn ? new Date(b.signedIn).getTime() : 0;
      return dateB - dateA;
    });

    const count = combined.length;
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
