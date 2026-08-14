/**
 * Dashboard list/update/delete scope: company + owning admin/manager.
 * Device/QR/contactless rows use createdBy: null and are excluded from these filters.
 */
export function dashboardOwnerFilter(user: {
  _id: unknown;
  company: unknown;
}) {
  return {
    company: user.company,
    createdBy: user._id,
  };
}

/**
 * Employee directory scope: own records + always include the logged-in user.
 */
export function dashboardEmployeeFilter(user: {
  _id: unknown;
  company: unknown;
}) {
  return {
    company: user.company,
    $or: [{ createdBy: user._id }, { _id: user._id }],
  };
}
